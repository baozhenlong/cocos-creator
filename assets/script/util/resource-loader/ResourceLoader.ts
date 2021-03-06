/**
 * # 用途
 * 管理 cc.loader 资源加载与释放，并通过引用计数避免资源释放时释放到场景上所依赖的资源(指通过编辑器放在场景上的资源)
 *
 * # 用法
 *
*/

function callNextTick(callback: Function, delay: number = 0.1) {
    setTimeout(() => {
        callback();
    }, delay * 1000);
}

type UrlParam = string | string[] | { url: string, type: string } | { url: string, type: string }[];

type CCLoaderName = 'load' | 'loadResDir' | 'loadResArray';

interface CCLoaderParams {
    success: Function;
    failure: Function;
    progress: Function;
    ccLoaderName: CCLoaderName;
}

interface LoaderParams {
    success: Function;
    failure: Function;
    progress: Function;
    ccLoaderName: CCLoaderName;
    type: cc.Asset;
    description: string;
    urlParam: UrlParam;
    maximalRetryTimes: number;
    retryInterval: number;
}

/**
 * 单个资源加载类
 *
 * @class LoaderItem
 */
class LoaderItem {
    id: number;
    private _type: cc.Asset; // 资源的类型
    private _urlParam: UrlParam; // 加载项
    isReleased: boolean; // 是否已被释放
    private _isLoaded: boolean; // 是否已被加载
    private _currentRetryTimes: number; // 当前重试次数
    private _maximalRetryTimes: number; // 最大重试次数
    private _retryInterval: number; // 重试间隔
    private _description: string;
    assetsTable: {};
    private _loader: ResourceLoader;
    constructor({
        id = -1,
        type = null,
        description = '',
        urlParam,
        loader,
        maximalRetryTimes = 3,
        retryInterval = 300
    }: {
        id: number,
        type: cc.Asset,
        description: string,
        urlParam: UrlParam,
        loader: ResourceLoader,
        maximalRetryTimes: number,
        retryInterval: number
    }) {
        this.id = id;
        this._type = type;
        this._urlParam = urlParam;
        this.isReleased = false;
        this._isLoaded = false;
        this._maximalRetryTimes = maximalRetryTimes;
        this._retryInterval = retryInterval;
        this._description = `LoaderItem<${description}>`;
        this.assetsTable = {};
        this._loader = loader;
    }

    load(loaderParams: CCLoaderParams): void {
        let {
            success,
            failure,
            progress,
            ccLoaderName
        } = loaderParams;
        if (ccLoaderName === 'load') {
            this._checkCCLoadParam();
        }
        let params: any[] = [this._urlParam];
        if (this._type) {
            params.push(this._type);
        }
        if (progress) {
            params.push(progress);
        }
        let complete: Function = (err, resArr) => {
            if (!err) {
                this._isLoaded = true;
                if (!(resArr instanceof Array)) {
                    resArr = [resArr];
                }
                resArr.forEach((asset) => {
                    this._checkUuid(asset);
                    this._cacheAsset(asset);
                });
                if (success instanceof Function) {
                    success(...resArr);
                }
            } else if (this._currentRetryTimes >= this._maximalRetryTimes) {
                this._isLoaded = true;
                if (failure instanceof Function) {
                    failure(err);
                }
            } else {
                this._currentRetryTimes++;
                callNextTick(() => {
                    this.load(loaderParams);
                }, this._retryInterval);
            }
        };
        params.push(complete);
        cc.loader[ccLoaderName as string](...params);
    }

    release(): void {
        this.isReleased = true;
        this._loader = null;
    }

    /**
     * 检查 cc.loader.load 的参数
     *
     * @private
     * @memberof LoaderItem
     */
    private _checkCCLoadParam(): void {
        if (typeof this._urlParam === 'object' && this._type) {
            throw new Error('cc.loader 参数错误，应为 {url:string, type: string}');
        }
    }

    /**
     * 检查 uuid，远程资源需要手动补充 _uuid
     *
     * @private
     * @param {cc.Asset} asset
     * @memberof LoaderItem
     */
    private _checkUuid(asset: cc.Asset): void {
        if (asset instanceof cc.Asset && !asset._uuid) {
            // 加载远端 mp3，png 资源时，会存储远端资源到本地，再次加载时 asset.url 会被修改为本地路径
            // 但在 cc.Lodaer._cache 里存储时，是以远端 url 为 key，因此对 uuid 设置原始 url
            if (typeof this._urlParam === 'string') {
                asset._uuid = this._urlParam;
            } else if (asset.url) {
                asset._uuid = asset.url;
            }
        }
    }

    /**
     * 缓存资源
     *
     * @private
     * @param {*} asset
     * @memberof LoaderItem
     */
    private _cacheAsset(asset: any): void {
        let dependArr: any[] = [];
        if (asset instanceof cc.Asset || typeof asset === 'string') {
            dependArr = cc.loader.getDependsRecursively(asset);
        } else if (asset instanceof cc.Texture2D) {
            dependArr = cc.loader.getDependsRecursively(asset.url);
        } else {
            cc.error('[ResourceLoader] unknown resource type', asset);
        }
        dependArr.forEach((key) => {
            if (key) {
                if (!this.assetsTable[key]) {
                    this.assetsTable[key] = true;
                }
            } else {
                throw new Error('依赖资源为空');
            }
        });
    }
}

class ResourceLoader {
    private _description: string;
    private _isReleased: boolean;
    private _parentLoader: ResourceLoader;
    private _subLoaderArr: ResourceLoader[];
    private _itemTable: { [propName: string]: LoaderItem }; // 存放每次呼叫 load 时产生的 LoaderItem
    private _itemCount: number;
    private _sceneDependAssetsTable: {}; // 场景上用到的资源，不会被释放
    private _assetsReferenceCountTable: {}; // 引用计数以 LoaderItem 为单位，即使 LoaderItem 里面用到了 3 次资源 xx.png，xx.png 的引用次数也只算 1 次
    private _isExecutedDelayLoad: boolean; // 是否已经执行过延迟加载，场景切换会重置此状态
    private _delayLoadArr: { loaderName: string, loader: ResourceLoader, loaderItem: LoaderItem, callbackArr: Function[] }[]; // 延迟加载列表
    constructor(description: string = '') {
        this._description = description;
        this._parentLoader = null;
        this._subLoaderArr = [];
        this._isReleased = false;
        this._itemCount = 0;
        this._itemTable = {};
        this._sceneDependAssetsTable = {};
        this._delayLoadArr = [];
        this._isExecutedDelayLoad = false;
        if (this === this._rootLoader) {
            cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING, () => {
                this._isExecutedDelayLoad = false;
            }, this);
        }
    }

    private get _rootLoader(): ResourceLoader {
        let root: ResourceLoader = this;
        while (root._parentLoader) {
            root = root._parentLoader;
        }
        return root;
    }

    /**
     * 暂存场景上的静态资源，ResourceLoader 释放时会跳过这些资源
     *
     * @private
     * @memberof ResourceLoader
     */
    private _cacheSceneDependAssets(): void {
        const { dependAssets } = cc.director.getScene() as any;
        dependAssets.forEach((assetId) => {
            if (!this._rootLoader._sceneDependAssetsTable[assetId]) {
                this._rootLoader._sceneDependAssetsTable[assetId] = true;
            }
        });
    }

    private _uncacheSceneDependAssets(): void {
        this._rootLoader._sceneDependAssetsTable = {};
    }

    /**
     * 排除场景上的静态资源
     *
     * @private
     * @param {any[]} assetIDArr
     * @memberof ResourceLoader
     */
    private _excludeSceneDependAssets(assetIDArr: any[]): void {
        assetIDArr = assetIDArr.filter(assetID => !this._rootLoader._sceneDependAssetsTable[assetID]);
    }

    createSubLoader(description?: string): ResourceLoader {
        if (this._isReleased) {
            throw new Error('loader is released');
        }
        const loader: ResourceLoader = new ResourceLoader(description);
        loader._parentLoader = this;
        this._subLoaderArr.push(loader);
        return loader;
    }

    private _removeSubLoader(loader: ResourceLoader): void {
        const index: number = this._subLoaderArr.indexOf(loader);
        if (index !== -1) {
            this._subLoaderArr.splice(index, 1);
        }
    }

    release(idOrIDArr?: number | number[]): void {
        if (this._isReleased) {
            return;
        }
        if (idOrIDArr === undefined) {
            this._release();
        } else {
            this._releaseLoaderItem(idOrIDArr);
        }
    }

    private _release(): void {
        this._isReleased = true;
        if (this._parentLoader) {
            this._parentLoader._removeSubLoader(this);
        }
        for (let key in this._itemTable) {
            let id: number = parseInt(key);
            this._releaseLoaderItem(id);
        }
        this._subLoaderArr.forEach((subLoader) => {
            subLoader.release();
        });
        this._itemCount = 0;
        if (this === this._rootLoader) {
            console.log('rootLoader has been release');
        }
    }

    private _releaseLoaderItem(idOrIDArr: number | number[]): void {
        let idArr: number[];
        if (idOrIDArr instanceof Array) {
            idArr = idOrIDArr.concat();
        } else {
            idArr = [idOrIDArr];
        }
        idArr.forEach((id) => {
            if (this._itemTable[id]) {
                this._removeLoaderItemReference(this._itemTable[id]);
                this._itemTable[id].release();
                delete this._itemTable[id];
                this._itemCount--;
            } else {
                console.log('ResourceLoader loaderItem', id, 'not found');
            }
        });
        this._checkReferenceAssetsTable();
    }

    private _addLoaderItemReference(loaderItem: LoaderItem): void {
        const assetsReferenceCountTable = this._rootLoader._assetsReferenceCountTable;
        for (let assetID in loaderItem.assetsTable) {
            if (typeof assetsReferenceCountTable[assetID] === 'number') {
                assetsReferenceCountTable[assetID]++;
            } else {
                assetsReferenceCountTable[assetID] = 1;
            }
        }
    }

    private _removeLoaderItemReference(loaderItem: LoaderItem): void {
        const assetsReferenceCountTable = this._rootLoader._assetsReferenceCountTable;
        for (let assetID in loaderItem.assetsTable) {
            if (assetsReferenceCountTable[assetID] === 'number') {
                assetsReferenceCountTable[assetID]--;
                if (assetsReferenceCountTable[assetID] < 0) {
                    console.log('_removeLoaderItemReference assetID', assetID, 'current count < 0');
                }
            } else {
                console.log('_removeLoaderItemReference assetID', assetID, 'not found');
            }
        }
    }

    private _checkReferenceAssetsTable(): void {
        const assetsReferenceCountTable = this._rootLoader._assetsReferenceCountTable;
        const sceneDependAssetsTable = this._rootLoader._sceneDependAssetsTable;
        let willReleaseAssetIDArr: string[] = [];
        for (let assetID in assetsReferenceCountTable) {
            if (assetsReferenceCountTable[assetID] === 0) {
                if (!sceneDependAssetsTable[assetID] && cc.loader.isAutoRelease(assetID)) {
                    willReleaseAssetIDArr.push(assetID);
                }
                delete assetsReferenceCountTable[assetID];
            }
        }
        if (willReleaseAssetIDArr.length > 0) {
            cc.loader.release(willReleaseAssetIDArr);
        }
    }

    private _load(params: LoaderParams): number {
        if (this._isReleased) {
            throw new Error('loader is released');
        }
        this._itemCount++;
        let {
            type,
            description,
            urlParam,
            maximalRetryTimes,
            retryInterval,
            ccLoaderName,
            success,
            failure
        } = params;
        if (ccLoaderName === 'loadResArray' && typeof urlParam === 'string') {
            urlParam = [urlParam];
        }
        const id: number = this._itemCount;
        const loaderItem: LoaderItem = new LoaderItem({
            id,
            type,
            description,
            urlParam,
            loader: this,
            maximalRetryTimes,
            retryInterval
        });
        loaderItem.load({
            success: (...resArr: any[]) => {
                this._addLoaderItemReference(loaderItem);
                if (this._isReleased || loaderItem.isReleased) {
                    // 下一个 tick 再做释放，以防释放到正在载入的资源
                    callNextTick(() => {
                        this._removeLoaderItemReference(loaderItem);
                        this._checkReferenceAssetsTable();
                    });
                } else if (success instanceof Function) {
                    success(...resArr);
                }
            },
            failure: (err) => {

            },
            progress: () => {

            },
            ccLoaderName
        });
        this._itemTable[id] = loaderItem;
        return id;
    }
}