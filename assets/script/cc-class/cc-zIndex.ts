const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CCZIndex extends cc.Component {

    @property({
        type: cc.Integer,
        range: [cc.macro.MIN_ZINDEX, cc.macro.MAX_ZINDEX, 1],
        displayName: '节点次序'
    })
    set zIndex(value: number) {
        this.node.zIndex = value;
    }
    get zIndex(): number {
        return this.node.zIndex;
    }
}