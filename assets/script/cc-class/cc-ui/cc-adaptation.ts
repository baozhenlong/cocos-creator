const { ccclass, property } = cc._decorator;

@ccclass
export default class CCAdaptation extends cc.Component {

    @property({
        type: [cc.String],
        multiline: true,
        readonly: true,
        displayName: '适配方案'
    })
    descArr: string[] = [
        'Canvas: 画布, 组件随时获得设备屏幕的实际分辨率, 并对场景中所有渲染元素进行适当的缩放',
        'Widget: 对齐挂件, 放置在渲染元素上, 能够根据需要将元素对齐父节点的不同参考位置',
        'Label: 文字, 组件内置了各种动态文字排版模式的功能, 当文字的约束框由于 Widget 对齐要求发生变化时, 文字会根据需要呈现完美的排版效果',
        'Sliced Sprite: 九宫格精灵图, 提供了可任意指定尺寸的图像, 同样可以满足各式各样的对齐要求, 在任何屏幕分辨率上都显示高精度的图像'
    ];

    @property({
        type: [cc.String],
        displayName: '设计分辨率',
        readonly: true,
        multiline: true
    })
    designResolutionDescArr: string[] = [
        '制作场景时使用的分辨率',
        'android: 800x640, 1280x720',
        'ios: 1136x640, 960x640'
    ];

    @property({
        type: [cc.String],
        displayName: '屏幕分辨率',
        readonly: true,
        multiline: true
    })
    screenResolutionDescArr: string[] = [
        '游戏在设备上运行时的实际屏幕显示分辨率'
    ];
}