const { ccclass, property } = cc._decorator;

@ccclass
export default class CCCamera extends cc.Component {

    @property({
        type: [cc.String],
        readonly: true,
        multiline: true,
        displayName: '属性'
    })
    propertiesDescArr: string[] = [
        'backgroundColor: 使用设定的背景色来清除场景',
        'depth: 摄像机深度, 用于决定摄像机的渲染顺序, 值越大, 则摄像机越晚被渲染',
        'cullingMask: 决定这个摄像机用来渲染场景的哪些部分, 分组即对应的 mask',
        'clearFlags: 指定渲染摄像机时需要做的清除操作',
        'rect: 决定摄像机绘制在屏幕上的哪个区域',
        'zoomRatio: 指定摄像机的缩放比例, 值越大显示的图像越大',
        'alignWithScreen: 为 true 时摄像机会自动将视窗大小调整为整个屏幕的大小',
        'orthoSize: 摄像机在正交投影模式下的视窗大小, 该属性在 alignWithScreen 设置为 false 时生效'
    ];

    // 案例中有截图功能
}