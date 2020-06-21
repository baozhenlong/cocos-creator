const { ccclass, property } = cc._decorator;

@ccclass
export default class CCPos extends cc.Component {

    @property({
        displayName: '改变 x 轴'
    })
    set x(x: number) {
        this.node.x = x;
    }
    get x(): number {
        return this.node.x;
    }

    @property({
        displayName: '改变 y 轴'
    })
    set y(y: number) {
        this.node.y = y;
    }
    get y(): number {
        return this.node.y;
    }

    @property({
        displayName: '同时改变 x y 轴'
    })
    set pos(pos: cc.Vec2) {
        let random: number = Math.random();
        if (random < 0.5) {
            this.node.setPosition(pos);
        } else {
            this.node.setPosition(pos.x, pos.y);
        }
    }
    get pos(): cc.Vec2 {
        return this.node.getPosition();
    }

}