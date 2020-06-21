const { ccclass, property } = cc._decorator;

@ccclass
export default class CCSystemEvent extends cc.Component {

    @property({
        type: [cc.String],
        displayName: '概要',
        readonly: true
    })
    summaryDescArr: string[] = [
        '节点系统事件: 鼠标和触摸事件',
    ];

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

    private _originalParent: cc.Node = null;

    private _originalPos: cc.Vec2 = cc.v2();

    @property({
        type: cc.Node,
        displayName: '触摸节点'
    })
    touchNode: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: '拖拽到的目标节点'
    })
    targetNode: cc.Node = null;

    onLoad() {
        this._originalParent = this.touchNode.parent;
        this.touchNode.getPosition(this._originalPos);
    }

    onEnable() {
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    onDisable() {
        this.touchNode.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    private _onTouchStart(eventTouch: cc.Event.EventTouch): void {
        cc.log('获得触点位置对象', eventTouch.getLocation());
        if (this.touchNode.parent === this.targetNode) {
            this.touchNode.setPosition(this._originalPos);
            this.touchNode.parent = this._originalParent;
        }
    }

    private _onTouchMove(eventTouch: cc.Event.EventTouch): void {
        let location: cc.Vec2 = eventTouch.getLocation();
        cc.log('获得触点位置对象', eventTouch.getLocation());
        this.touchNode.setPosition(this.touchNode.parent.convertToNodeSpaceAR(location));
    }

    private _onTouchEnd(eventTouch: cc.Event.EventTouch): void {
        if (!this.targetNode) {
            return;
        }
        let rect: cc.Rect = this.targetNode.getBoundingBox();
        let location: cc.Vec2 = eventTouch.getLocation();
        let point: cc.Vec2 = this.targetNode.parent.convertToNodeSpaceAR(location);
        if (rect.contains(point)) {
            this.touchNode.parent = this.targetNode;
            this.touchNode.setPosition(this.targetNode.convertToNodeSpaceAR(location));
        } else {
            this.touchNode.setPosition(this._originalPos);
        }
    }
}