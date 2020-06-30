const { ccclass, property } = cc._decorator;

@ccclass
export default class CCWidget extends cc.Component {

    @property({
        type: [cc.String],
        displayName: '对齐目标',
        readonly: true,
        multiline: true
    })
    targetDescArr: string[] = [
        '指定对齐参照的节点, 默认为当前父节点'
    ];

    @property({
        type: [cc.String],
        displayName: '对齐模式',
        readonly: true,
        multiline: true
    })
    alignModeDescArr: string[] = [
        'ON_WINDOW_RESIZE: 在初始化和每当窗口大小改变时对齐',
        'ONCE: 在组件初始化时进行一次对齐, 引擎就会自动将 Widget 组件的 enabled 属性设为 false 来关闭之后的每帧自动更新, 避免重复定位',
        'ALWAYS: 每帧对当前 Widget 组件执行对齐逻辑'
    ];


    @property({
        type: [cc.String],
        displayName: '限制',
        readonly: true,
        multiline: true
    })
    limitDescArr: string[] = [
        '通过 Widget 对齐是在每帧的最后阶段进行处理的',
        '因此对 Widget 组件中已经设置了对齐的相关属性(位置和尺寸)进行设置, 最后都会被 Widget 组件本身的更新所重置'
    ]

    @property({
        type: [cc.String],
        displayName: '注意',
        readonly: true,
        multiline: true
    })
    noticeDescArr: string[] = [
        'Widget 组件会自动调整当前节点的坐标和宽高',
        '调整后的结果要到下一帧才能在脚本里获取到, 可通过手动调用 updateAlignment 获取调整后的结果'
    ];
}