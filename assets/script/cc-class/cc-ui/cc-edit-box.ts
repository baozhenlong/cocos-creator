const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CCEditBox extends cc.Component {

    @property({
        displayName: '属性',
        type: [cc.String],
        multiline: true,
        readonly: true
    })
    propertiesDescArr: string[] = [
        'string: 输入框的初始输入内容, 如果为空则会显示占位符的文本',
        'placeholder: 输入框占位符的文本',
        'background: 输入框背景节点上挂载的 Sprtie 组件',
        'textLabel: 输入框输入文本节点上挂载的 Label 组件',
        'placeholderLabel: 输入框占位符节点上挂载的 Label 组件',
        'KeyboardReturnType: 移动设备上面回车按钮的样式',
        'inputMode: 输入模式, ANY 表示多行输入, 其他都是单行输入',
        'maxLength: 输入框最大允许输入的字符个数',
        'editingDidBegan: 开始编辑文本输入框时触发的事件回调',
        'textChanged: 编辑文本输入框时触发的事件回调',
        'editingDidEnded: 结束编辑文本输入框时触发的事件回调',
        'editingReturn: 当用户按下回车按键时触发的事件回调'
    ];

    @property(({
        type: cc.EditBox,
        displayName: '输入框'
    }))
    editBox: cc.EditBox = null;

    onLoad() {
        if (this.editBox) {
            this.editBox.editingDidBegan.length = 0;
            let editingDidBeganEventHandler = new cc.Component.EventHandler();
            editingDidBeganEventHandler.target = this.node;
            editingDidBeganEventHandler.component = 'cc-edit-box';
            editingDidBeganEventHandler.handler = 'onEditingDidBegan';
            editingDidBeganEventHandler.customEventData = '开始编辑';
            this.editBox.editingDidBegan.push(editingDidBeganEventHandler);
            this.editBox.editingDidEnded.length = 0;
            let editingDidEndedEventHandler = new cc.Component.EventHandler();
            editingDidEndedEventHandler.target = this.node;
            editingDidEndedEventHandler.component = 'cc-edit-box';
            editingDidEndedEventHandler.handler = 'onEditingDidEnded';
            editingDidEndedEventHandler.customEventData = '结束编辑';
            this.editBox.editingDidEnded.push(editingDidEndedEventHandler);
            this.editBox.editingReturn.length = 0;
            let editingReturnEventHandler = new cc.Component.EventHandler();
            editingReturnEventHandler.target = this.node;
            editingReturnEventHandler.component = 'cc-edit-box';
            editingReturnEventHandler.handler = 'onEditingReturn';
            editingReturnEventHandler.customEventData = '按下回车';
            this.editBox.editingReturn.push(editingReturnEventHandler);
            this.editBox.textChanged.length = 0;
            let textChangedEventHandler = new cc.Component.EventHandler();
            textChangedEventHandler.target = this.node;
            textChangedEventHandler.component = 'cc-edit-box';
            textChangedEventHandler.handler = 'onTextChanged';
            textChangedEventHandler.customEventData = '编辑';
            this.editBox.textChanged.push(textChangedEventHandler);
        }
    }

    onEditingDidBegan(editBox: cc.EditBox, customEventData: string): void {
        cc.log('customEventData', customEventData);
    }

    onEditingDidEnded(editBox: cc.EditBox, customEventData: string): void {
        cc.log('customEventData', customEventData);
    }

    onEditingReturn(editBox: cc.EditBox, customEventData: string): void {
        cc.log('customEventData', customEventData);
    }

    onTextChanged(text: string, editBox: cc.EditBox, customEventData: string): void {
        cc.log('text', text, ', customEventData', customEventData);
    }
}