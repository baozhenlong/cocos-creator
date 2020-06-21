const { ccclass, property, executeInEditMode } = cc._decorator;

enum EventEnum {
    SayHello = 'say-hello'
}

@ccclass
@executeInEditMode
export default class CCEvent extends cc.Component {

    @property({
        type: [cc.Node],
        displayName: '监听事件的节点'
    })
    nodeArr: cc.Node[] = [];

    @property({
        displayName: 'emit 发射 say-hello 事件'
    })
    set emitSayHello(value: boolean) {
        if (this.nodeArr.length > 0) {
            this.nodeArr[this.nodeArr.length - 1].emit(EventEnum.SayHello, 1, 2, 3, 4, 5);
        }
    }
    get emitSayHello(): boolean {
        return false;
    }

    @property({
        type: [cc.String],
        displayName: 'dispatch 描述',
        readonly: true
    })
    dispatchDescArr: string[] = [
        '通过 dispatch 发射的事件, 会进入事件派送阶段(采用冒泡派送的方式)',
        '冒泡派送会将事件从事件发起节点, 不断地向上传递给它的父节点, 直到到达根节点或者在某个节点的响应函数中做了中断处理 event.stopPropagation()'
    ];

    @property({
        displayName: 'dispatch 发射 say-hello 事件'
    })
    set dispatchSayHello(value: boolean) {
        if (this.nodeArr.length > 0) {
            let eventCustom: cc.Event.EventCustom = new cc.Event.EventCustom(EventEnum.SayHello, true);
            eventCustom.detail = {
                name: 'ccc',
                age: 18
            };
            this.nodeArr[this.nodeArr.length - 1].dispatchEvent(eventCustom);
        }
    }
    get dispatchSayHello(): boolean {
        return false;
    }

    // 监听事件
    onEnable() {
        this.nodeArr.forEach((node) => {
            node.on(EventEnum.SayHello, this._sayHello, this);
        });
    }

    // 关闭监听
    onDisable() {
        this.nodeArr.forEach((node) => {
            node.off(EventEnum.SayHello, this._sayHello, this);
        });
    }

    private _sayHello(event: cc.Event.EventCustom): void {
        cc.log('hello', ...arguments);
        if (event instanceof cc.Event.EventCustom) {
            cc.log('事件名', event.type);
            cc.log('接收到事件的原始对象', event.target);
            cc.log('接收到事件的当前对象', event.currentTarget);
            cc.log('自定义事件的信息', event.detail);
            if (event.currentTarget.name === 'b') {
                cc.log('停止冒泡阶段, 事件将不会继续向父节点传递, 当前节点的剩余监听器仍然会接收事件');
                event.stopPropagation();
            }
            if (event.currentTarget.name === 'b') {
                cc.log('立即停止事件的传递, 事件将不会传递给父节点以及当前节点的剩余监听器');
                event.stopPropagationImmediate();
                cc.log('结束');
            }
        }
    }
}