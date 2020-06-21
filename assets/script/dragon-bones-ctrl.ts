const { ccclass, menu, executeInEditMode, playOnFocus, property } = cc._decorator;

@ccclass
@menu('工具/动画/dragon-bones')
@executeInEditMode
@playOnFocus
export default class DragonBonesCtrl extends cc.Component {

    @property({
        displayName: '开启自定义龙骨所在节点'
    })
    private customDragonBonesNodeEnabled: boolean = false;

    @property({
        type: cc.Node,
        displayName: '自定义龙骨所在节点',
        visible() {
            return this.customDragonBonesNodeEnabled;
        }
    })
    private customDragonBonesNode: cc.Node = null;

    @property({
        displayName: '打印动画名字'
    })
    set printName(value: boolean) {
        this._printName();
    }
    get printName(): boolean {
        return false;
    }

    private _preview: boolean = false;
    @property({
        displayName: '预览',
        tooltip: '在编辑器模式预览动画, 启用后, 自动播放动画'
    })
    set preview(value: boolean) {
        this._preview = value;
        if (value) {
            this.show();
            this._startFrameTimer();
        } else {
            this._stopFrameTimer();
            this.currentPercent = 0;
        }
    }
    get preview(): boolean {
        return this._preview;
    }

    private _timer: any = null;

    private _currentPercent: number = 0;
    @property({
        range: [0, 100, 0.1],
        displayName: '指定动画到某个时间点',
        tooltip: '按百分比展示',
        slide: true,
        visible() {
            return !this.preview;
        }
    })
    set currentPercent(value: number) {
        this.show();
        this._currentPercent = value;
        this._updateFrameByPercent(this.currentPercent / 100);
    }
    get currentPercent(): number {
        return this._currentPercent;
    }

    @property({
        displayName: '当前帧数 / 总帧数',
        editorOnly: true,
        readonly: true,
        visible() {
            return !this.preview;
        }
    })
    private frameDesc: string = '';

    /**
     * 龙骨组件
     *
     * @private
     * @type {dragonBones.ArmatureDisplay}
     * @memberof DragonBonesCtrl
     */
    private _dragonBonesComp: dragonBones.ArmatureDisplay = null;

    /**
     * 当前动画状态
     *
     * @private
     * @type {dragonBones.AnimationState}
     * @memberof DragonBonesCtrl
     */
    private _currentAnimState: dragonBones.AnimationState = null;

    /**
     * 动画循环播放完成一次回调函数
     *
     * @private
     * @type {Function}
     * @memberof DragonBonesCtrl
     */
    private _loopCallback: Function = null;

    /**
     * 动画播放完成回调函数数组
     *
     * @private
     * @type {Function[]}
     * @memberof DragonBonesCtrl
     */
    private _onceCallbackArr: Function[] = [];

    onLoad() {
        if (!CC_EDITOR) {
            this._testCallback();
        }
    }

    _testCallback(): void {
        this.play({
            armatureName: 'mecha_1502b',
            animName: 'walk',
            playTimes: 1,
            onceCallback: () => {
                cc.log('once1');
                this.play({
                    armatureName: 'mecha_1502b',
                    animName: 'walk',
                    playTimes: 2,
                    onceCallback: () => {
                        cc.log('once2');
                        this.play({
                            armatureName: 'mecha_1502b',
                            animName: 'walk',
                            playTimes: 0,
                            onceCallback: () => {
                                cc.log('once3');
                            },
                            loopCallback: () => {
                                cc.log('loop3');
                            }
                        });
                    },
                    loopCallback: () => {
                        cc.log('loop2');
                    }
                });
            }
        });
        // once1 1 次
        // loop2 2 次
        // once2 一次
        // loop3 循环
    }

    onEnable() {
        if (!CC_EDITOR) {
            let dragonBonesComp: dragonBones.ArmatureDisplay = this._getDragonBonesComp();
            dragonBonesComp.on(dragonBones.EventObject.COMPLETE, this._onComplete, this);
            dragonBonesComp.on(dragonBones.EventObject.LOOP_COMPLETE, this._onLoopComplete, this);
        }
    }

    onDisable() {
        if (CC_EDITOR) {
            this._stopFrameTimer();
        } else {
            let dragonBonesComp: dragonBones.ArmatureDisplay = this._getDragonBonesComp();
            dragonBonesComp.off(dragonBones.EventObject.COMPLETE, this._onComplete, this);
            dragonBonesComp.off(dragonBones.EventObject.LOOP_COMPLETE, this._onLoopComplete, this);
        }
    }

    /**
     * 动画播放完成回调, 循环播放动画时不触发
     *
     * @private
     * @memberof DragonBonesCtrl
     */
    private _onComplete(): void {
        if (this._onceCallbackArr.length > 0) {
            this._onceCallbackArr.shift()();
        }
    }

    /**
     * 动画循环播放完成一次回调, 循环与否都触发
     *
     * @private
     * @memberof DragonBonesCtrl
     */
    private _onLoopComplete(): void {
        if (this._loopCallback instanceof Function) {
            this._loopCallback();
        }
    }

    /**
     * 输出动画 armature 名字 和 animation 名字
     *
     * @private
     * @memberof DragonBonesCtrl
     */
    private _printName(): void {
        let armatureName: string = this._getDragonBonesComp().armatureName;
        cc.log(`当前 armatureName: ${armatureName}`);
        cc.log(`当前 animName: ${this._getDragonBonesComp().getAnimationNames(armatureName).join(',')}`);
    }

    /**
     * 获取龙骨组件
     *
     * @private
     * @returns {dragonBones.ArmatureDisplay}
     * @memberof DragonBonesCtrl
     */
    private _getDragonBonesComp(): dragonBones.ArmatureDisplay {
        if (!this._dragonBonesComp) {
            if (this.customDragonBonesNode) {
                this._dragonBonesComp = this.customDragonBonesNode.getComponent(dragonBones.ArmatureDisplay);
            } else {
                this._dragonBonesComp = this.getComponent(dragonBones.ArmatureDisplay);
            }
            if (!this._dragonBonesComp) {
                cc.warn(`未找到龙骨组件 node.name:${this.node.name}`);
            }
        }
        return this._dragonBonesComp;
    }

    /**
     * 通过百分比更新动画的帧数
     *
     * @private
     * @param {number} percent
     * @memberof DragonBonesCtrl
     */
    private _updateFrameByPercent(percent: number): void {
        if (CC_EDITOR) {
            let armature: dragonBones.Armature = this._getDragonBonesComp().armature();
            // 当节点的 active 为 false 时, armature 为 undefined
            let animation: dragonBones.Animation = armature.animation;
            if (animation) {
                let animationState: dragonBones.AnimationState = animation.lastAnimationState;
                if (animationState) {
                    let animationData: dragonBones.AnimationData = animationState.animationData;
                    if (animationData) {
                        let totolFrame: number = animationData.frameCount
                        let currentFrame: number = percent * totolFrame;
                        this.frameDesc = `${Math.floor(currentFrame)} / ${totolFrame}`;
                        this.gotoAppointedFrame({
                            frame: currentFrame
                        });
                    }
                }
            }
        }
    }

    /**
     * 显示节点
     *
     * @memberof DragonBonesCtrl
     */
    show(): void {
        if (!this.node.active) {
            this.node.active = true;
        }
    }

    /**
     * 隐藏节点
     *
     * @memberof DragonBonesCtrl
     */
    hide(): void {
        if (this.node.active) {
            this.stop();
            this._loopCallback = null;
            this._onceCallbackArr = [];
            this.node.active = false;
        }
    }

    /**
     * 播放动画
     *
     * @param {{
     *         armatureName?: string,
     *         animName: string,
     *         onceCallback?: Function,
     *         loopCallback?: Function,
     *         playTimes?: number
     *     }} {
     *         armatureName,
     *         animName,
     *         onceCallback,
     *         loopCallback,
     *         playTimes
     *     }
     * @memberof DragonBonesCtrl
     */
    play({
        armatureName,
        animName,
        onceCallback,
        loopCallback,
        playTimes
    }: {
        armatureName?: string,
        animName: string,
        onceCallback?: Function,
        loopCallback?: Function,
        playTimes?: number
    }): void {
        this.show();
        let dragonBonesComp: dragonBones.ArmatureDisplay = this._getDragonBonesComp();
        if (playTimes === undefined) {
            playTimes = dragonBonesComp.playTimes;
        }
        if (armatureName !== undefined) {
            this._updateArmature(dragonBonesComp, armatureName);
        }
        if (playTimes === 0) {
            if (loopCallback instanceof Function) {
                this._loopCallback = loopCallback;
            } else {
                this._loopCallback = null;
            }
        } else {
            if (onceCallback instanceof Function) {
                this._onceCallbackArr.push(onceCallback);
            }
            if (loopCallback instanceof Function) {
                this._loopCallback = loopCallback;
            } else {
                this._loopCallback = null;
            }
        }
        this._currentAnimState = dragonBonesComp.playAnimation(animName, playTimes);
    }

    /**
     * 停止动画
     *
     * @memberof DragonBonesCtrl
     */
    stop(): void {
        if (this.isPlaying()) {
            this._currentAnimState.stop();
        }
    }

    /**
     * 动画是否在播放
     *
     * @param {string} [animName]
     * @returns {boolean}
     * @memberof DragonBonesCtrl
     */
    isPlaying(animName?: string): boolean {
        let isPlaying: boolean;
        if (this._currentAnimState === null) {
            isPlaying = false;
        } else {
            if (animName === undefined) {
                isPlaying = this._currentAnimState.isPlaying;
            } else {
                isPlaying = this._currentAnimState.isPlaying && this._currentAnimState.name === animName;
            }
        }
        return isPlaying;
    }

    /**
     * 跳转到动画指定帧
     *
     * @param {{
     *         armatureName?: string,
     *         animName?: string,
     *         frame: number
     *     }} {
     *         armatureName,
     *         animName,
     *         frame
     *     }
     * @memberof DragonBonesCtrl
     */
    gotoAppointedFrame({
        armatureName,
        animName,
        frame
    }: {
        armatureName?: string,
        animName?: string,
        frame: number
    }): void {
        this.show();
        let dragonBonesComp: dragonBones.ArmatureDisplay = this._getDragonBonesComp();
        if (armatureName !== undefined) {
            this._updateArmature(dragonBonesComp, armatureName);
        }
        if (animName === undefined) {
            animName = dragonBonesComp.animationName;
        } else {
            this._updateAnim(dragonBonesComp, animName);
        }
        let animation: dragonBones.Animation = dragonBonesComp.armature().animation;
        animation.gotoAndStopByFrame(animName, frame);
    }

    /**
     * 更新骨架
     *
     * @private
     * @param {dragonBones.ArmatureDisplay} dragonBonesComp
     * @param {string} armatureName
     * @memberof DragonBonesCtrl
     */
    private _updateArmature(dragonBonesComp: dragonBones.ArmatureDisplay, armatureName: string): void {
        if (dragonBonesComp.armatureName !== armatureName) {
            dragonBonesComp.armatureName = armatureName;
        }
    }

    /**
     * 更新动画播放器
     *
     * @private
     * @param {dragonBones.ArmatureDisplay} dragonBonesComp
     * @param {string} animName
     * @memberof DragonBonesCtrl
     */
    private _updateAnim(dragonBonesComp: dragonBones.ArmatureDisplay, animName: string): void {
        if (dragonBonesComp.animationName !== animName) {
            dragonBonesComp.animationName = animName;
        }
    }

    private _startFrameTimer(): void {
        let armature: dragonBones.Armature = this._getDragonBonesComp().armature();
        if (armature) {
            let animation: dragonBones.Animation = armature.animation;
            if (animation) {
                let animationState: dragonBones.AnimationState = animation.lastAnimationState;
                if (animationState) {
                    let animationData: dragonBones.AnimationData = animationState.animationData;
                    let lastTimeScale: number = dragonBones['timeScale'] * animation.timeScale;
                    if (animationData) {
                        let currentFrame: number = 0;
                        this._timer = setInterval(() => {
                            let currentTimeScale: number = dragonBones['timeScale'] * animation.timeScale;
                            if (currentTimeScale === lastTimeScale) {
                                this.gotoAppointedFrame({
                                    frame: currentFrame
                                });
                                currentFrame++;
                            } else {
                                this._stopFrameTimer();
                                this._startFrameTimer();
                            }
                        }, animationData.duration / animationData.frameCount * 1000 / lastTimeScale);
                    }
                }
            }
        }
    }

    private _stopFrameTimer(): void {
        if (this._timer !== null) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    onFocusInEditor() {
        this.currentPercent = 0;
    }

    onLostFocusInEditor() {
        this._stopFrameTimer();
    }
}