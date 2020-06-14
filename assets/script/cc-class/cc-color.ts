const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CCColor extends cc.Component {

    @property({
        displayName: '颜色叠加描述',
        type: [cc.String]
    })
    overlayDescArr: string[] = [
        'color 属性设置颜色：用纹理的 rgb 与节点的 color 的 rgb 相乘（r*color.r、g*color.g、b*color.b）',
        '最好在纯白色的精灵上使用 color 属性，可以精确控制颜色',
        '在非纯色的精灵上使用 color 属性，整体色调会变暗',
        '纯红、绿、蓝的三元色精灵使用 color 属性，颜色只能在当前图片颜色范围变化，应用范围有限'
    ];

    @property({
        displayName: '透明度描述',
        type: [cc.String]
    })
    opacityDescArr: string[] = [
        '透明度也是 color 属性的一个组成部分',
        '透明度会影响到子节点，RGB 不会'
    ];

    onFocusInEditor() {
        cc.log(`${this.node.name} opacity: ${this.node.opacity}`);
        this.node.children.forEach((node: cc.Node) => {
            cc.log(`${node.name} opacity: ${node.opacity}`);
        });
    }
}