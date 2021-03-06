const { ccclass, property } = cc._decorator;

@ccclass
export default class CCKeyboard extends cc.Component {

    @property({
        displayName: '速度'
    })
    speed: number = 100;

    private _up: boolean = false;

    private _down: boolean = false;

    private _left: boolean = false;

    private _right: boolean = false;

    onLoad() {

    }

    onEnable() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
    }

    onDisable() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
    }

    /**
     * 键盘按下事件
     *
     * @private
     * @param {cc.Event.EventKeyboard} event
     * @memberof CCKeyboard
     */
    private _onKeyDown(event: cc.Event.EventKeyboard): void {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this._up = true;
                break;
            case cc.macro.KEY.s:
            case cc.macro.KEY.down:
                this._down = true;
                break;
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this._left = true;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this._right = true;
                break;
        }
    }

    /**
     * 键盘抬起事件
     *
     * @private
     * @param {cc.Event.EventKeyboard} event
     * @memberof CCKeyboard
     */
    private _onKeyUp(event: cc.Event.EventKeyboard): void {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this._up = false;
                break;
            case cc.macro.KEY.s:
            case cc.macro.KEY.down:
                this._down = false;
                break;
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this._left = false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this._right = false;
                break;
        }
    }

    private _getNextX(delta: number): number {
        let width: number = cc.winSize.width;
        let nextX: number = this.node.x + delta;
        if (nextX < -width / 2) {
            nextX = -width / 2;
        } else if (nextX > width / 2) {
            nextX = width / 2
        }
        return nextX;
    }

    private _getNextY(delta: number): number {
        let height: number = cc.winSize.height;
        let nextY: number = this.node.y + delta;
        if (nextY < -height / 2) {
            nextY = -height / 2;
        } else if (nextY > height / 2) {
            nextY = height / 2
        }
        return nextY;
    }

    update(dt: number) {
        if (this._up) {
            this.node.y = this._getNextY(this.speed * dt);
        }
        if (this._down) {
            this.node.y = this._getNextY(-this.speed * dt);
        }
        if (this._left) {
            this.node.x = this._getNextX(-this.speed * dt);
        }
        if (this._right) {
            this.node.x = this._getNextX(this.speed * dt);
        }
    }
}