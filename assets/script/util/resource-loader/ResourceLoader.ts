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

/**
 * 单个资源加载类
 *
 * @class LoaderItem
 */
class LoaderItem {
    id: number;
    type: cc.Asset;
    urlParam: string | string[] | { url: string, type: string } | { url: string, type: string }[]; // 加载项
    isReleased: boolean; // 是否已被释放
    isLoaded: boolean; // 是否已被加载
    currentRetryTimes: number; // 当前重试次数
    maximalRetryTimes: number; // 最大重试次数
    retryDelayTime: number;
    description: string;
    assetTable: {};
}

class ResourceLoader {
    private _description: string;
    private _isReleased: boolean;
    private _parentLoader: ResourceLoader;
    private _subLoaderArr: ResourceLoader[];
    private _itemTable: {}; // 存放每次呼叫 load 时产生的 LoaderItem
    private _itemCount: number;
    private _sceneDependAssetTable: {}; // 场景上用到的资源，不会被释放
    private _assetsReferenceCountTable: {}; // 引用计数以 LoaderItem 为单位，即使 LoaderItem 里面用到了 3 次资源 xx.png，xx.png 的引用次数也只算 1 次
    private _isExecuteDelayLoad: boolean; // 是否已经执行过延迟加载，场景切换会重置此状态
    private _delayLoadArr: { loaderName: string, loader: ResourceLoader, loaderItem: LoaderItem, callbackArr: Function[] }[]; // 延迟加载列表
    constructor(description: string = '') {
        this._description = description;
        this._parentLoader = null;
        this._subLoaderArr = [];
        this._isReleased = false;
        this._itemCount = 0;
        this._itemTable = {};
        this._sceneDependAssetTable = {};
        this._delayLoadArr = [];
        this._isExecuteDelayLoad = false;
        // if(this === this.)
    }
}