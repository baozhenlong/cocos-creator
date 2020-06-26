import CCZIndex from "./cc-zIndex";

const { ccclass, menu, requireComponent, executeInEditMode, playOnFocus, property, executionOrder } = cc._decorator;

@ccclass
// 将当前组件添加到组件菜单中, 方便用户查找
@menu('cc/cc-class 参考')
// 指定当前组件的依赖组件, 默认值为 null
@requireComponent(cc.Widget)
// 允许继承自 Component 的 CCClass 在编辑器里执行, 默认值 为 false, 默认情况下, 所有组件都只会在运行时执行
@executeInEditMode
// 脚本生命周期回调的执行优先级, 值越小越先执行, 默认值为 0, 该优先级只对 onLoad onEnable onDisable start update lateUpdate 有效, 对 onDisable 和 onDestroy 无效
@executionOrder(-1)
// 当设置了 executeInEditMode, 可以在选中当前组件所在的节点时, 提高编辑器的场景刷新频率到 60 FPS, 默认值为 false
@playOnFocus()

export default class CCClass extends cc.Component {

    @property({
        type: CCZIndex,
        displayName: '通过拖拽节点获取组件'
    })
    ccZIndex: CCZIndex = null;

    // 该脚本所在的节点获得焦点时运行
    onFocusInEditor() {
        cc.log('onFocusInEditor');
    }

    // 该脚本所在的节点失去焦点时运行
    onLostFocusInEditor() {
        cc.log('onLostFocusInEditor');
    }

    onLoad() {
        cc.log('获得组件', this.getSpriteComponent() === this.getSpriteComponent2());
        if (this.ccZIndex) {
            cc.log('CCZIndex name', this.ccZIndex.name);
        }
    }

    /**
     * 获得组件所在的节点
     *
     * @returns {cc.Node}
     * @memberof CCClass
     */
    getComponetNode(): cc.Node {
        return this.node;
    }

    /**
     * 获得其他组件
     *
     * @returns {cc.Sprite}
     * @memberof CCClass
     */
    getSpriteComponent(): cc.Sprite {
        return this.getComponent(cc.Sprite); // 通过类名
    }
    getSpriteComponent2(): cc.Sprite {
        return this.getComponent('Sprite'); // 通过脚本的文件名
    }

}