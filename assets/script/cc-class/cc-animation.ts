const { ccclass, property } = cc._decorator;

@ccclass
export default class CCAnim extends cc.Component {

    @property({
        type: [cc.String],
        readonly: true,
        multiline: true,
        displayName: '播放'
    })
    playDescArr: string[] = [
        '对一个进行播放的时候会判断这个动画之前的播放状态来进行下一步操作',
        '如果动画处于停止状态, 则会直接重新播放这个动画',
        '如果动画处于暂停状态, 则会恢复动画的动画, 并从当前时间继续播放下去',
        '如果动画处于播放状态, 则会先停止这个动画, 再重新播放动画'
    ];

    @property({
        type: [cc.String],
        readonly: true,
        multiline: true,
        displayName: '注册动画回调'
    })
    animCallbackDescArr: string[] = [
        'cc.Animation.on/off',
        '在播放一个动画时, cc.Animation 对相应的 cc.AnimationState 注册这个回调',
        '在停止一个动画时, cc.Animation 对相应的 cc.AnimationState 取消注册这个回调',
        'cc.AnimationState 是动画回调的发送发, 可以通过 cc.AnimationState 单独进行注册',
        'play: 开始播放时',
        'stop: 停止播放时',
        'pause: 暂停播放时',
        'resume: 恢复播放时',
        'lastframe: 假如动画循环次数大于 1, 当动画播放到最后一帧时',
        'finished: 动画播放完成时'
    ];


}