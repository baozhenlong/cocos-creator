const { ccclass, menu, requireComponent, executeInEditMode, playOnFocus, property } = cc._decorator;

@ccclass
// 将当前组件添加到组件菜单中，方便用户查找
@menu('cc/cc-class 参考')
// 添加依赖的其它组件
@requireComponent(cc.Widget)
// 允许继承自 Component 的 CCClass 在编辑器里执行
@executeInEditMode
// 可以在选中当前组件所在的节点时，提高编辑器的场景刷新频率到 60 FPS
@playOnFocus

export default class CCClass extends cc.Component {

    // 该脚本所在的节点获得焦点时运行
    onFocusInEditor() {
        cc.log('onFocusInEditor');
    }

    // 该脚本所在的节点失去焦点时运行
    onLostFocusInEditor() {
        cc.log('onLostFocusInEditor');
    }
}