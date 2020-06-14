const { ccclass, menu, playOnFocus, executeInEditMode, property } = cc._decorator;

if (CC_EDITOR) {
    let updateCopy: Function = sp.Skeleton.prototype['update'];
    sp.Skeleton.prototype['update'] = function (dt: number) {
        let node: cc.Node = this.customSpineNode;
        if (!node) {
            node = this.node;
        }
        if (node && node.getComponent(SpineCtrl)) {
            if (node.getComponent(SpineCtrl).preview) {
                if (!this['paused'] && Editor['Selection'].curActivate('node') == this.node.uuid) {
                    dt *= this.timeScale * sp['timeScale'];
                    this._updateRealtime(dt);
                }
            }
        } else {
            updateCopy.apply(this, Array.prototype.slice.apply(arguments));
        }
    };
}


@ccclass
@menu('工具/动画/spine')
@executeInEditMode
@playOnFocus
export default class SpineCtrl extends cc.Component {
    @property({
        displayName: '开启自定义骨骼所在节点'
    })
    private customSpineNodeEnabled: boolean = false;

    @property({
        type: cc.Node,
        displayName: '自定义骨骼所在节点',
        visible() {
            return this.customSpineNodeEnabled;
        }
    })
    private customSpineNode: cc.Node = null;

    private _spineComp: sp.Skeleton = null;

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
        tooltip: '在编辑器模式预览动画，启用后，自动播放动画'
    })
    set preview(value: boolean) {
        this._preview = value;
        if (value) {
            this.show();
            this._getSpineComp().paused = false;
            this.play();
        } else {
            this.currentPercent = 0;
            this.stop();
        }
    }
    get preview(): boolean {
        return this._preview;
    }

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

    onLoad() {
        if (!CC_EDITOR) {
            this._getSpineComp().paused = false;
            this.play({
                skin: 'goblin',
                animName: 'walk',
                loop: false
            });
        }
    }

    show(): void {
        if (!this.node.active) {
            this.node.active = true;
        }
    }

    hide(): void {
        if (this.node.active) {
            this.node.active = false;
        }
    }

    private _getSpineComp(): sp.Skeleton {
        if (!this._spineComp) {
            if (this.customSpineNode) {
                this._spineComp = this.customSpineNode.getComponent(sp.Skeleton);
            } else {
                this._spineComp = this.node.getComponent(sp.Skeleton);
            }
            if (!this._spineComp) {
                cc.warn('未找到骨骼组件');
            }
        }
        return this._spineComp;
    }

    private _printName(): void {
        let skeletonCache = (this._getSpineComp().skeletonData as any)._skeletonCache;
        let skinNameArr: string[] = [];
        skeletonCache.skins.forEach(({ name }) => {
            skinNameArr.push(name);
        });
        let animNameArr: string[] = [];
        skeletonCache.animations.forEach(({ name }) => {
            animNameArr.push(name);
        });
        cc.log(`skin names: ${skinNameArr.join(',')}`);
        cc.log(`anim names: ${animNameArr.join(',')}`);
    }

    play({
        animName,
        callback,
        loop,
        trackIndex = 0,
        skin
    }: {
        animName?: string,
        callback?: Function,
        loop?: boolean,
        trackIndex?: number,
        skin?: string
    } = {}) {
        this.show();
        let spineComp: sp.Skeleton = this._getSpineComp();
        if (loop === undefined) {
            loop = spineComp.loop;
        }
        if (animName === undefined) {
            if (spineComp.animation) {
                animName = spineComp.animation;
            } else {
                animName = spineComp.defaultAnimation;
            }
        }
        spineComp.clearTracks();
        spineComp.setToSetupPose();
        if (skin !== undefined) {
            spineComp.setSkin(skin);
        }
        spineComp.setAnimation(trackIndex, animName, loop);
        // // 用来设置动画播放完后的事件监听，REALTIME 实时模式下不生效
        // spineComp.setEndListener(() => {
        //     cc.log('setEndListener');
        // });
        // // 用来设置动画播放一次循环结束后的事件监听
        // spineComp.setCompleteListener(() => {
        //     cc.log('setCompleteListener');
        // });
    }

    stop(): void {
        let spineComp: sp.Skeleton = this._getSpineComp();
        spineComp.clearTracks();
    }

    add({
        name,
        loop,
        delay = 0,
        trackIndex
    }: {
        name: string,
        loop?: boolean,
        delay?: number,
        trackIndex?: number
    }): void {
        let spineComp: sp.Skeleton = this._getSpineComp();
        if (loop === undefined) {
            loop = spineComp.loop;
        }
        spineComp.addAnimation(trackIndex, name, loop, delay);
    }

    private _updateFrameByPercent(percent: number): void {
        this.play();
        let spineComp: sp.Skeleton = this._getSpineComp();
        spineComp.paused = true;
        let totalTime: number = spineComp.findAnimation(spineComp.animation).duration;
        totalTime *= spineComp.timeScale * sp['timeScale'];
        spineComp['_updateRealtime'](totalTime * percent);
    }
}