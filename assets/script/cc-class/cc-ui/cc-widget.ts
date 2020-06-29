const { ccclass, property } = cc._decorator;

@ccclass
export default class CCWidget extends cc.Component {

    @property({
        type: [cc.String],
        displayName: '对齐模式',
        readonly: true,
        multiline: true
    })
    widgetDescArr: string[] = [
        'ON_WINDOW_RESIZE: 在组件初始化时执行一次对齐定位后, 引擎就会自动将 Widget 组件的 enabled 属性设为 false 来关闭之后的每帧自动更新, 避免重复定位',
        'ONCE: 在组件初始化时执行一次对齐定位后, 引擎就会自动将 Widget 组件的 enabled 属性设为 false 来关闭之后的每帧自动更新, 避免重复定位',
        'ALWAYS: 在运行时实时定位'
    ];

}