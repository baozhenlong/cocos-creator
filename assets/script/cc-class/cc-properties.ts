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
        type: [cc.String],
        displayName: '属性检查器相关参数',
        readonly: true,
        multiline: true
    })
    propertyInspectorDescArr: string[] = [
        'type: 限定属性的数据类型, 默认值为 undefined',
        'visible: 在属性检视器面板中显示或隐藏; 当属性名以下划线开头, 则默认不显示在属性检查器, 否则默认显示',
        'displayName: 在属性检视器面板中显示为另一个名字, 默认值为 undefined',
        'tooltip: 在属性检视器面板中添加属性的提示信息, 默认值为 undefined',
        'multiline: 在属性检视器面板中使用多行文本框, 默认值为 false',
        'readonly: 在属性检视器面板中只读, 默认值为 false',
        'min: 限定数值在编辑器中输入的最小值, 默认值为 undefined',
        'max: 限定数值在编辑器中输入的最大值, 默认值为 undefined',
        'step: 指定数值在编辑器中调节的步长, 默认值为 undefined',
        'range: 一次性设置 min, max, step, 默认值为 undefined, [min, max, ?step], step 值可选',
        'slide: 在属性检视器面板中显示为滑动条, 默认值为 false',
    ];

    @property({
        type: [cc.String],
        displayName: '序列化相关参数',
        readonly: true,
        multiline: true
    })
    serializableDescArr: string[] = [
        'serializable: 序列化该属性, 默认值为 true; 序列化后就会将编辑器中设置好的值保存到场景等资源文件中, 并且在加载场景时自动还原之前设置好的值',
        '序列化: 解析内存中的对象, 将它的信息编码为一个特殊的字符串, 以便保存到硬盘上或传输到其他地方',
        'formerlySerializedAs: 指定之前序列化所用的字段名, 默认值为 undefined',
        'editorOnly: 在导出项目前剔除该属性, 默认值为 false'
    ];

    @property({
        type: [cc.String],
        displayName: '其他参数',
        readonly: true,
        multiline: true
    })
    otherDescArr: string[] = [
        'override: 如果子类要覆盖父类的同名属性, 需要显式设置 override 为 true, 默认值为 false',
        'animatable: 该属性是否能被动画编辑器修改, 默认值为 undefined'
    ];

    @property({
        type: cc.Integer,
        displayName: '有范围的整数',
        min: 0,
        max: 100,
        step: 1
    })
    limitNum: number = 0;

    @property({
        type: cc.Integer,
        displayName: '滑动条',
        tooltip: '如果不定义 type, 则滑动条默认是小数, 需定义 min, max, step',
        range: [0, 100, 0.1],
        slide: true
    })
    percent: number = 10;

    @property({
        serializable: false,
        displayName: '不序列化'
    })
    donotSave: number = 1;

    @property({
        serializable: true,
        displayName: '序列化'
    })
    save: number = 2;

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
        cc.log('不序列化', this.donotSave);
        cc.log('序列化', this.save);
    }

}