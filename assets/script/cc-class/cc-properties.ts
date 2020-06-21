const { ccclass, property } = cc._decorator;

/**
 * 自定义类型
 *
 * @class Friend
 */
@ccclass('Friend')
class Friend {

    @property({
        displayName: '名字'
    })
    name: string = '';

    @property({
        displayName: '手机号码'
    })
    phone: number = 12345678901;

}

enum SexEnum {
    未知,
    男,
    女
}

@ccclass
export default class CCProperties extends cc.Component {

    @property({
        displayName: '概要',
        tooltip: '提示说明'
    })
    summary: string = '概要';

    @property({
        type: cc.Integer,
        displayName: '有范围的整数',
        min: 0, // 限定数值在编辑器中输入的最小值
        max: 100, // 限定数值在编辑器中输入的最大值
        step: 1 // 指定数值在编辑器中调节的步长
    })
    limitNum: number = 0;

    @property({
        type: cc.Integer,
        displayName: '滑动条',
        tooltip: '如果不定义 type, 则滑动条默认是小数, 需定义 min, max, step',
        range: [0, 100, 0.1], // 一次性设置 min, max, step
        slide: true // 在属性检视器面板中显示为滑动条
    })
    percent: number = 10;

    @property({
        displayName: '坐标',
        tooltip: '定义的属性为 cc.ValueType 的子类（cc.Vec2, cc.Color, cc.Rect 等）, 设置默认值为其实例即可, 不需要显示设置 type'
    })
    pos: cc.Vec2 = cc.v2();

    @property({
        type: cc.Component.EventHandler,
        displayName: '事件回调',
        tooltip: '可以在属性面板上绑定一个回调函数, 类似 Button 的点击事件绑定的回调函数'
    })
    eventHandler: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property({
        type: cc.AudioClip,
        displayName: '音频'
    })
    audioClip: cc.AudioClip = null;

    @property({
        type: cc.Enum(SexEnum),
        displayName: ' 性别(枚举)'
    })
    sex: SexEnum = SexEnum.男;

    @property({
        displayName: '年龄',
        visible() {
            return this.sex === SexEnum.男;
        }
    })
    age: number = 18;

    @property({
        type: [Friend],
        displayName: '朋友(自定义类型)'
    })
    friendArr: Friend[] = [];

    @property({
        type: cc.JsonAsset,
        displayName: 'JSON 资源'
    })
    json: cc.JsonAsset = null;

    @property({
        type: cc.JsonAsset,
        displayName: '文本资源'
    })
    text: cc.TextAsset = null;

    onLoad() {
        if (this.json) {
            cc.log('JSON 资源:', this.json.json);
        }
        if (this.json) {
            cc.log('文本资源:', this.text.text);
        }
    }

}