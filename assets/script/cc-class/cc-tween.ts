const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CCTween extends cc.Component {

    @property({
        type: [cc.String],
        displayName: '概要',
        readonly: true,
        multiline: true
    })
    summaryDescArr: string[] = [
        '链式 API: cc.tween 的每一个 API 都会在内部生成一个 action, 并将这个 action 添加到内部队列中, 在 API 调用完后再返回自身实例',
        '在调用 start 时, 会将之前生成的 action 队列重新组合生成一个 cc.sequence 队列, 依次执行每一个 API'
    ];

    @property({
        type: cc.Node,
        displayName: '星星节点'
    })
    starNode: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: '无限重复动作节点'
    })
    repeatForeverNode: cc.Node = null;

    // 链式 API
    chain(): void {
        cc.tween(this.starNode)
            .to(1, {
                scale: 2
            })
            .call(() => {
                cc.log('当前 scale', this.starNode.scale); // 2
            })
            .to(1, {
                scale: 1
            })
            .call(() => {
                cc.log('当前 scale', this.starNode.scale); // 1
            })
            .start();
    }

    @property({
        type: [cc.String],
        displayName: '缓动属性',
        readonly: true,
        multiline: true
    })
    tweenPropertiesDescArr: string[] = [
        'to: 对属性进行绝对值计算，最终的运行结果即是设置的属性值',
        'by: 对属性进行相对值计算，最终的运行结果是设置的属性值 + 开始运行时节点的属性值'
    ];

    // 设置缓动属性
    toAndBy(): void {
        cc.tween(this.starNode)
            .to(1, {
                scale: 2
            })
            .call(() => {
                cc.log('绝对值计算, 当前 scale', this.starNode.scale); // 2
            })
            .by(1, {
                scale: 1
            })
            .call(() => {
                cc.log('相对值计算, 当前 scale', this.starNode.scale); // 3
            })
            .to(1, {
                scale: 1
            })
            .start();
    }

    // 支持任意对象的任意属性
    obj(): void {
        let obj: { num: number } = { num: 2 };
        cc.tween(obj)
            .to(1, {
                num: 5
            })
            .call(() => {
                cc.log('当前 num', obj.num); // 3
            })
            .start();
    }

    // easing
    easing(): void {
        cc.tween(this.starNode)
            .to(1, {
                scale: 2,
                position: cc.v2(200, 200)
            }, {
                easing: 'sineOutIn'
            })
            .to(1, {
                scale: 1,
                position: {
                    value: cc.v2(0, 0),
                    easing: 'sineOutIn'
                }
            })
            .start();
    }

    // 重复执行
    repeat(): void {
        if (Math.random() < 0.5) {
            // 有限次数
            cc.tween(this.starNode)
                .by(1, {
                    scale: 1
                })
                .repeat(3) // 将前一个 action 作为作用对象
                .repeat(3, cc.tween().by(1, {
                    scale: -1
                })) // 将第二个参数作为作用对象
                .start()
        } else {
            // 无限次数
            cc.tween(this.repeatForeverNode)
                .by(1, {
                    scale: 1
                })
                .by(1, {
                    scale: -1
                })
                .union()
                .repeatForever()
                .start();
        }
    }

    // 延迟执行
    delay(): void {
        cc.tween(this.starNode)
            .delay(1)
            .call(() => {
                cc.log('过去 1 s 了');
            })
            .start();
    }
}