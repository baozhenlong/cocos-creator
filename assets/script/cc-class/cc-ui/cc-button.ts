const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CCButton extends cc.Component {

    @property({
        type: cc.Button,
        displayName: '按钮'
    })
    btn: cc.Button = null;

    onLoad() {
        if (this.btn) {
            this.btn.clickEvents.length = 0
            let eventHandler: cc.Component.EventHandler = new cc.Component.EventHandler();
            // 事件响应函数所在节点
            eventHandler.target = this.node;
            // 事件响应函数所在组件名(脚本名)
            eventHandler.component = 'cc-button';
            // 响应事件函数名
            eventHandler.handler = 'callback';
            // 自定义事件数据
            eventHandler.customEventData = '自定义事件数据';
            this.btn.clickEvents.push(eventHandler);
        }
    }

    callback(): void {
        cc.log('callback');
    }

}