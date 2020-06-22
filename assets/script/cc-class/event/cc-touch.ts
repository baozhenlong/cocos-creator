const { ccclass, property } = cc._decorator;

@ccclass
export default class CCSystemEvent extends cc.Component {

    @property({
        type: [cc.String],
        displayName: '触摸事件',
        readonly: true
    })
    touchDescArr: string[] = [
        'touchstart: 当手指触点落在目标节点区域内',
        'touchmove: 当手指在屏幕上移动时',
        'touchend: 当手指在目标节点区域内离开屏幕时',
        'touchcancel: 当手指在目标节点区域外离开屏幕时',
        'notice: 触摸事件支持多点触摸, 每个触点都会发送一次事件给事件监听器'
    ];

    @property({
        displayName: '设置多点触摸',
        visible: false
    })
    set multiTouch(value: boolean) {
        cc.macro['ENABLE_MULTI_TOUCH'] = value;
    }
    get multiTouch(): boolean {
        return cc.macro['ENABLE_MULTI_TOUCH'];
    }

    @property({
        type: cc.Node,
        displayName: '触摸节点 a'
    })
    atouchNode: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: '触摸节点 b'
    })
    btouchNode: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: '触摸节点 c'
    })
    ctouchNode: cc.Node = null;

    @property({
        type: [cc.String],
        displayName: '触摸节点描述',
        readonly: true
    })
    touchNodeDescArr: string[] = [
        'abc 节点都监听了触摸事件',
        '当鼠标或手指在 bc 节点重叠区域内按下时, 触点归属于 c 节点, 同时将事件传递给父节点 a',
        '同级节点间，触点归属于顶层的节点(zIndex 最高的节点)',
        'emphasis: 在触摸事件冒泡的过程中不会有触摸检测',
        '这意味着即使触点不在 ac 节点区域内, ac 节点也会通过触摸事件冒泡的机制接收到这个事件'
    ];

    @property({
        type: [cc.String],
        displayName: '将触摸注册在捕获阶段'
    })
    captureDescArr: string[] = [
        'node.on(type, callback, target, useCapture), useCapture 为 true',
        '当节点触发事件时',
        '会先将事件发给所有注册在捕获阶段地父节点监听器',
        '然后派发给节点自身的监听器',
        '最后才到了事件冒泡阶段'
    ];

    @property({
        type: cc.Node,
        displayName: '注册捕获的节点 d'
    })
    dCaptureNode: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: '注册捕获的节点 e'
    })
    eCaptureNode: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: '注册捕获节点的参考节点 f'
    })
    fCapturereFerenceNode: cc.Node = null;

    private _originalParent: cc.Node = null;

    private _originalPos: cc.Vec2 = cc.v2();

    @property({
        type: cc.Node,
        displayName: '触摸节点'
    })
    dragNode: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: '拖拽到的目标节点'
    })
    targetNode: cc.Node = null;

    onLoad() {
        this._originalParent = this.dragNode.parent;
        this.dragNode.getPosition(this._originalPos);
    }

    onEnable() {
        this.dragNode.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.dragNode.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.dragNode.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);

        this.atouchNode.on(cc.Node.EventType.TOUCH_START, this._onATouchStart, this);
        this.atouchNode.on(cc.Node.EventType.TOUCH_MOVE, this._onATouchMove, this);
        this.atouchNode.on(cc.Node.EventType.TOUCH_END, this._onATouchEnd, this);
        this.atouchNode.on(cc.Node.EventType.TOUCH_CANCEL, this._onATouchCancel, this);

        this.btouchNode.on(cc.Node.EventType.TOUCH_START, this._onBTouchStart, this);
        this.btouchNode.on(cc.Node.EventType.TOUCH_MOVE, this._onBTouchMove, this);
        this.btouchNode.on(cc.Node.EventType.TOUCH_END, this._onBTouchEnd, this);
        this.btouchNode.on(cc.Node.EventType.TOUCH_CANCEL, this._onBTouchCancel, this);

        this.ctouchNode.on(cc.Node.EventType.TOUCH_START, this._onCTouchStart, this);
        this.ctouchNode.on(cc.Node.EventType.TOUCH_MOVE, this._onCTouchMove, this);
        this.ctouchNode.on(cc.Node.EventType.TOUCH_END, this._onCTouchEnd, this);
        this.ctouchNode.on(cc.Node.EventType.TOUCH_CANCEL, this._onCTouchCancel, this);

        this.dCaptureNode.on(cc.Node.EventType.TOUCH_START, this._onDTouchStart, this, true);
        this.eCaptureNode.on(cc.Node.EventType.TOUCH_START, this._onETouchStart, this, true);
        this.fCapturereFerenceNode.on(cc.Node.EventType.TOUCH_START, this._onFTouchStart, this);
    }

    onDisable() {
        this.dragNode.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.dragNode.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.dragNode.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);

        this.atouchNode.off(cc.Node.EventType.TOUCH_START, this._onATouchStart, this);
        this.atouchNode.off(cc.Node.EventType.TOUCH_MOVE, this._onATouchMove, this);
        this.atouchNode.off(cc.Node.EventType.TOUCH_END, this._onATouchEnd, this);
        this.atouchNode.off(cc.Node.EventType.TOUCH_CANCEL, this._onATouchCancel, this);

        this.btouchNode.off(cc.Node.EventType.TOUCH_START, this._onBTouchStart, this);
        this.btouchNode.off(cc.Node.EventType.TOUCH_MOVE, this._onBTouchMove, this);
        this.btouchNode.off(cc.Node.EventType.TOUCH_END, this._onBTouchEnd, this);
        this.btouchNode.off(cc.Node.EventType.TOUCH_CANCEL, this._onBTouchCancel, this);

        this.ctouchNode.off(cc.Node.EventType.TOUCH_START, this._onCTouchStart, this);
        this.ctouchNode.off(cc.Node.EventType.TOUCH_MOVE, this._onCTouchMove, this);
        this.ctouchNode.off(cc.Node.EventType.TOUCH_END, this._onCTouchEnd, this);
        this.ctouchNode.off(cc.Node.EventType.TOUCH_CANCEL, this._onCTouchCancel, this);


        this.dCaptureNode.off(cc.Node.EventType.TOUCH_START, this._onDTouchStart, this, true);
        this.eCaptureNode.off(cc.Node.EventType.TOUCH_START, this._onETouchStart, this, true);
        this.fCapturereFerenceNode.off(cc.Node.EventType.TOUCH_START, this._onFTouchStart, this);
    }

    private _onATouchStart(): void {
        cc.log('触摸开始 a');
    }

    private _onATouchMove(): void {
        cc.log('触摸移动 a');
    }

    private _onATouchEnd(): void {
        cc.log('触摸结束 a');
    }

    private _onATouchCancel(): void {
        cc.log('触摸取消 a');
    }

    private _onBTouchStart(): void {
        cc.log('触摸开始 b');
    }

    private _onBTouchMove(): void {
        cc.log('触摸移动 b');
    }

    private _onBTouchEnd(): void {
        cc.log('触摸结束 b');
    }

    private _onBTouchCancel(): void {
        cc.log('触摸取消 b');
    }

    private _onCTouchStart(): void {
        cc.log('触摸开始 c');
    }

    private _onCTouchMove(): void {
        cc.log('触摸移动 c');
    }

    private _onCTouchEnd(): void {
        cc.log('触摸结束 c');
    }

    private _onCTouchCancel(): void {
        cc.log('触摸取消 c');
    }

    private _onDTouchStart(): void {
        cc.log('触摸开始 d');
    }

    private _onETouchStart(): void {
        cc.log('触摸开始 e');
    }

    private _onFTouchStart(): void {
        cc.log('触摸开始 f');
    }

    private _onTouchStart(eventTouch: cc.Event.EventTouch): void {
        cc.log('获得触点位置对象', eventTouch.getLocation());
        if (this.dragNode.parent === this.targetNode) {
            this.dragNode.setPosition(this._originalPos);
            this.dragNode.parent = this._originalParent;
        }
    }

    private _onTouchMove(eventTouch: cc.Event.EventTouch): void {
        let location: cc.Vec2 = eventTouch.getLocation();
        cc.log('获得触点位置对象', eventTouch.getLocation());
        this.dragNode.setPosition(this.dragNode.parent.convertToNodeSpaceAR(location));
    }

    private _onTouchEnd(eventTouch: cc.Event.EventTouch): void {
        if (!this.targetNode) {
            return;
        }
        let rect: cc.Rect = this.targetNode.getBoundingBox();
        let location: cc.Vec2 = eventTouch.getLocation();
        let point: cc.Vec2 = this.targetNode.parent.convertToNodeSpaceAR(location);
        if (rect.contains(point)) {
            this.dragNode.parent = this.targetNode;
            this.dragNode.setPosition(this.targetNode.convertToNodeSpaceAR(location));
        } else {
            this.dragNode.setPosition(this._originalPos);
        }
    }
}