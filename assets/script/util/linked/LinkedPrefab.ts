import CCUtil from "../CCUtil";

const { ccclass, property, menu, executeInEditMode } = cc._decorator;

const NODE_NAME: string = 'linkedPrefab';

@ccclass
@executeInEditMode
@menu('Linked/预制体')
export default class LinkedPrefab extends cc.Component {

    @property({
        displayName: '预制体',
        type: cc.Prefab,
        visible: true
    })
    private set _prefab(value: cc.Prefab) {
        this._onPrefabChanged(value)
    }
    private get _prefab(): cc.Prefab {
        return null;
    }

    @property({
        visible: false
    })
    protected resURL: string = '';

    protected _prefabNode: cc.Node = null;

    onLoad() {
        this._initPrefab();
    }

    private _initPrefab(): void {
        if (!this.resURL || this._prefabNode) {
            return;
        }
        let node: cc.Node = this.node.getChildByName(NODE_NAME);
        if (!node) {
            if (CC_EDITOR) {
                this.preview();
            } else {

            }
        }
    }

    private _onPrefabChanged(prefab: cc.Prefab): void {
        if (prefab) {
            Editor.assetdb.queryUrlByUuid(prefab._uuid, (error, path) => {
                if (error) {
                    cc.log('can not find res', prefab.name);
                }
                else {
                    this.updateResURL(CCUtil.getResURL(path));
                    this.preview();
                }
            });
        }
    }

    protected preview(): void {
        if (this._prefabNode) {
            this._prefabNode.destroy();
            this._prefabNode = null;
        }
        let resURL: string = this.checkResURL();
        cc.loader.loadRes(resURL, (err, res) => {
            if (err) {
                cc.log('can not find res', resURL);
            } else {
                this._prefabNode = cc.instantiate(res);
                CCUtil.setPreview(this._prefabNode);
                this._prefabNode.name = NODE_NAME;
                this.node.addChild(this._prefabNode, -1);
            }
        });
    }

    protected updateResURL(url: string): void {
        this.resURL = url;
    }

    protected checkResURL(): string {
        return this.resURL;
    }
}