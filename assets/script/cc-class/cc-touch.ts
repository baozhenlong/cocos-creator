const { ccclass, property } = cc._decorator;

@ccclass
export default class CCTouch extends cc.Component {

    private _originalParent: cc.Node = null;

    private _originalPos: cc.Vec2 = cc.v2();

    @property({
        type: cc.Node,
        displayName: '拖拽到的目标节点'
    })
    targetNode: cc.Node = null;

    onLoad() {
        this._originalParent = this.node.parent;
        this.node.getPosition(this._originalPos);
    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    private _onTouchStart(): void {
        if (this.node.parent === this.targetNode) {
            this.node.setPosition(this._originalPos);
            this.node.parent = this._originalParent;
        }
    }

    private _onTouchMove(eventTouch: cc.Event.EventTouch): void {
        let location: cc.Vec2 = eventTouch.getLocation();
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(location));
    }

    private _onTouchEnd(eventTouch: cc.Event.EventTouch): void {
        if (!this.targetNode) {
            return;
        }
        let rect: cc.Rect = this.targetNode.getBoundingBox();
        let location: cc.Vec2 = eventTouch.getLocation();
        let point: cc.Vec2 = this.targetNode.parent.convertToNodeSpaceAR(location);
        if (rect.contains(point)) {
            this.node.parent = this.targetNode;
            this.node.setPosition(this.targetNode.convertToNodeSpaceAR(location));
        } else {
            this.node.setPosition(this._originalPos);
        }
    }
}