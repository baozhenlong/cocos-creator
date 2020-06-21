const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CCLoad extends cc.Component {

    onLoad() {
        this.node.children.forEach((node) => {
            node.destroy();
        });
    }

    @property({
        displayName: '加载 Prefab'
    })
    set loadPrefab(value: boolean) {
        cc.loader.loadRes('test/prefab/template', (err, prefab: cc.Prefab) => {
            if (err) {
                cc.log('加载 Prefab error', err);
            } else {
                cc.instantiate(prefab).parent = this.node;
            }
        });
    }
    get loadPrefab(): boolean {
        return false;
    }

    private get _sp(): cc.Sprite {
        let spNode: cc.Node = this.node.getChildByName('sp');
        if (!spNode) {
            spNode = new cc.Node('sp');
            spNode.parent = this.node;
            let sp: cc.Sprite = spNode.addComponent(cc.Sprite);
            sp.type = cc.Sprite.Type.SIMPLE;
            sp.sizeMode = cc.Sprite.SizeMode.RAW;
            sp.trim = false;
        }
        return spNode.getComponent(cc.Sprite);
    }

    @property({
        displayName: '加载 SpriteFrame'
    })
    set loadSF(value: boolean) {
        cc.loader.loadRes('test/texture/star', cc.SpriteFrame, (err, sf: cc.SpriteFrame) => {
            if (err) {
                cc.log('加载 SpriteFrame error', err);
            } else {
                this._sp.spriteFrame = sf;
            }
        });
    }
    get loadSF(): boolean {
        return false;
    }

    @property({
        displayName: '加载图集'
    })
    set loadAtlas(value: boolean) {
        cc.loader.loadRes('test/atlas/sheep', cc.SpriteAtlas, (err, atlas: cc.SpriteAtlas) => {
            if (err) {
                cc.log('加载图集 error', err);
            } else {
                let sfArr: cc.SpriteFrame[] = atlas.getSpriteFrames();
                this._sp.spriteFrame = sfArr[Math.floor(Math.random() * sfArr.length)];
            }
        });
    }
    get loadAtlas(): boolean {
        return false;
    }

    @property({
        displayName: '批量加载'
    })
    set loadDir(value: boolean) {
        if (Math.random() > 0.5) {
            cc.loader.loadResDir('test', (err, assets: cc.Asset[]) => {
                if (err) {
                    cc.log('批量加载 error', err);
                } else {
                    assets.forEach((asset) => {
                        cc.log('asset', asset);
                    });
                }
            });
        } else {
            cc.loader.loadResDir('test', cc.Prefab, (err, assets: cc.Asset[]) => {
                if (err) {
                    cc.log('批量加载 error', err);
                } else {
                    assets.forEach((asset) => {
                        cc.log('asset', asset);
                    });
                }
            });
        }

    }
    get loadDir(): boolean {
        return false;
    }
}