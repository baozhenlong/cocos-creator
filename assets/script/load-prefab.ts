const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class LoadPrefab extends cc.Component {

    @property({
        type: cc.Prefab
    })
    template: cc.Prefab = null;

    @property
    set preview(value: boolean) {
        if (value) {
            this.loadTemplate();
        } else {

        }
    }
    get preview(): boolean {
        return false;
    }

    loadTemplate(): void {
        let node: cc.Node = cc.instantiate(this.template);
        node['_objFlags'] = cc.Object['Flags'].DontSave; // 该节点不会保存到场景文件.fire或预制体文件.prefab中
        node.parent = this.node;
    }

}