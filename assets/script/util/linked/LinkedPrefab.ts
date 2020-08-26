import CCUtil from "../CCUtil";

const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
@menu('Linked/预制体')
export default class LinkedPrefab extends cc.Component {

    @property({
        displayName: '预制体',
        type: cc.Prefab
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

    private _onPrefabChanged(prefab: cc.Prefab): void {
        if (prefab) {
            Editor.assetdb.queryUrlByUuid(prefab._uuid, (error, path) => {
                if (error) {
                    cc.log('can not find res', prefab.name);
                }
                else {
                    this.updateResURL(CCUtil.getResURL(path));
                }
            });
        }
    }

    protected updateResURL(url: string): void {
        this.resURL = url;
    }
}