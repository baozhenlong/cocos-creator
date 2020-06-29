const { ccclass, property } = cc._decorator;

@ccclass
export default class CCSprite extends cc.Component {

    @property({
        type: [cc.String],
        displayName: '渲染模式',
        multiline: true,
        readonly: true
    })
    typeDescArr: string[] = [
        'Simple: 普通, 根据原始图片资源渲染 Sprite, 此模式下可以通过勾选 Trim 选项来去除原始图像周围的透明像素区域',
        'Sliced: 九宫格, 图像被分割成九宫格, 并按照一定规则进行缩放以适应可随意设置的尺寸',
        'Tiled: 平铺, 图像会根据 Sprite 的尺寸重复平铺显示',
        'Filled: 填充, 根据原点和填充模式的设置, 按照一定的方向和比例绘制原始图片的一部分, 经常用于进度条的动态展示',
        'Mesh: 网格',
        'FillRange: 为 + 时逆时针填充, 为 - 时顺时针填充'
    ];

    @property({
        type: [cc.String],
        displayName: '尺寸',
        multiline: true,
        readonly: true
    })
    sizeModeDescArr: string[] = [
        'Trimmed: 使用原始图片资源裁剪透明像素后的尺寸',
        'Raw: 使用原始图片资源未经裁剪的尺寸',
        'Custom: 使用自定义尺寸, 当用户手动修改过 size 属性后, sizeMode 会被自动设置为 Custom, 除非再次指定为其他尺寸'
    ];
}