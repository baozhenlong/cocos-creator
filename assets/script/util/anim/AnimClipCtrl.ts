const { ccclass, menu, requireComponent, executeInEditMode, playOnFocus, property } = cc._decorator;

@ccclass
@menu('工具/动画/animation-clip')
@requireComponent(cc.Animation)
@executeInEditMode
@playOnFocus
export default class AnimClipCtrl extends cc.Component {

    private _anim: cc.Animation = null;
    private _defaultClip: cc.AnimationClip = null;

    onLoad() {
        if (!CC_EDITOR) {
            this._anim = this.getComponent(cc.Animation);
            this._defaultClip = this._anim.defaultClip;
            // this.doFrameEventTest();
        }
    }

    onDestroy() {
        if (!CC_EDITOR) {

        }
    }

    onFocusInEditor() {
        if (!this.getComponent(cc.Animation).defaultClip) {
            cc.warn('请设置 default clip');
        }
    }

    /**
     * 播放动画
     *
     * @param {{
     *         name?: string, 动画名
     *         callback?: Function, 播放完成回调函数
     *         repeatCount?: number 播放次数
     *     }} [{
     *         name,
     *         callback,
     *         repeatCount
     *     }={}]
     * @memberof AnimClipCtrl
     */
    play({
        name,
        callback,
        repeatCount
    }: {
        name?: string,
        callback?: Function,
        repeatCount?: number
    } = {}): void {
        if (name === undefined) {
            name = this._defaultClip.name;
        }
        let animState: cc.AnimationState = this._anim.play(name);
        if (repeatCount !== undefined) {
            // Memo repeatCount 和 wrapMode 会相互影响
            // 当设置 wrapMode 设为 循环时,  repeatCount 失效
            // 当设置 repeatCount 时, wrapMode 循环会失效
            animState.repeatCount = repeatCount;
        }
        if (callback instanceof Function) {
            if (animState.repeatCount === Infinity) {
                // 动画播放到最后一帧时触发, 当 repeatCount 为 Infinity 或 <= 1 时, 不触发
                this._anim.once(cc.Animation.EventType.LASTFRAME, () => {
                    callback(name);
                });
            } else {
                // 动画播放完成时触发
                this._anim.once(cc.Animation.EventType.FINISHED, () => {
                    callback(name);
                });
            }
        }
    }

    /**
     * 主动停止, 不会触发完成事件
     *
     * @memberof AnimClipCtrl
     */
    stop(): void {
        this._anim.stop();
    }

    /**
     * 获取指定动画
     *
     * @param {string} name
     * @returns {cc.AnimationClip}
     * @memberof AnimClipCtrl
     */
    getClipByName(name: string): cc.AnimationClip {
        let clips: cc.AnimationClip[] = this._anim.getClips();
        let clip: cc.AnimationClip = clips.find(clip => clip.name === name);
        if (!clip) {
            cc.warn(`can not find clip name:${name}`);
            clip = null;
        }
        return clip;
    }

    /**
     * 获取当前播放的动画名字
     *
     * @returns {string}
     * @memberof AnimClipCtrl
     */
    getCurrentClipName(): string {
        let clip: cc.AnimationClip = this._anim.currentClip;
        let name: string;
        if (clip) {
            name = clip.name;
        } else {
            name = '';
        }
        return name;
    }

    /**
     * 当前是否正在播放动画
     *
     * @readonly
     * @type {boolean}
     * @memberof AnimClipCtrl
     */
    get isPlaying(): boolean {
        let isPlaying: boolean;
        let name: string = this.getCurrentClipName();
        if (name === '') {
            isPlaying = false;
        } else {
            isPlaying = this._anim.getAnimationState(name).isPlaying;
        }
        return isPlaying;
    }

    /**
     * 重置到第一帧
     *
     * @param {string} [name]
     * @memberof AnimClipCtrl
     */
    gotoBegin(name?: string): void {
        if (name === undefined) {
            name = this._defaultClip.name;
        }
        this._anim.play(name);
        this._anim.setCurrentTime(0, name);
        this._anim.stop();
    }

    /**
     * 跳转到最后一帧
     *
     * @param {string} [name]
     * @memberof AnimClipCtrl
     */
    gotoEnd(name?: string): void {
        if (name === undefined) {
            name = this._defaultClip.name;
        }
        let animState: cc.AnimationState = this._anim.play(name);
        this._anim.setCurrentTime(animState.duration, name);
        this._anim.stop();
    }

    /**
     * 设置动画帧事件
     *
     * @param {Function} callback 触发回调
     * @param {string} frameEventFuncName 触发函数名
     * @memberof AnimClipCtrl
     */
    setFrameEventCallback(callback: Function, frameEventFuncName: string): void {
        if (!(this[frameEventFuncName] instanceof Function)) {
            this[frameEventFuncName] = callback.bind(this);
        }
    }

    doFrameEventTest(): void {
        this.setFrameEventCallback(() => {
            cc.log('run')
        }, 'run');
        this._anim.play('sheep-run');
    }

}