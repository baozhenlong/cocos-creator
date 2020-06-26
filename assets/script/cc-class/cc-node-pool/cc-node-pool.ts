const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CCNodePool extends cc.Component {

    @property({
        type: [cc.String],
        displayName: '概要',
        readonly: true
    })
    summaryDescArr: string[] = [
        '在运行时进行节点的创建(cc.instance)和销毁(node.destory)操作是非常耗费性能的',
        '通常只有在场景初始化逻辑中才会进行节点的创建, 在切换场景时才会进行节点的销毁',
        '通过对象池可以在游戏进行过程时随时创建和销毁节点',
        '对象池是一组可回收的节点对象',
        '将节点放入和从对象池取出的操作不会带来额外的内存管理开销',
        '最好在切换场景或其他不再需要对象池的时候手动清空对象池',
        'notice: 当获取和返回节点时, cc.NodePool 内部会不断地对节点执行 removeFromParent 和 addChild 操作',
        '当大批量、频繁地操作对象池时, 在低端机器上可能仍然会引起卡顿',
        '还会导致节点默认渲染顺序发生变化, 如有必要避免, 可以调用 setSiblingIndex 修改节点的索引'
    ];

    @property({
        type: cc.Prefab,
        displayName: '模板'
    })
    tempalte: cc.Prefab = null;

    @property
    private _nodePool: cc.NodePool = null;

    onLoad() {
        this._initNodePool();
    }

    /**
     * 初始化对象池
     *
     * @private
     * @memberof CCNodePool
     */
    private _initNodePool(): void {
        this._nodePool = new cc.NodePool('cc-node-pool-template');
        // poolHandlerComp 缓冲池处理组件(cc-node-pool-template), 用于节点的回收和复用逻辑, 需挂载预制体上
        let initCount: number = 5;
        for (let i = 0; i < initCount; i++) {
            // 创建节点
            let node: cc.Node = cc.instantiate(this.tempalte);
            // 通过 put 接口放入对象池
            this._nodePool.put(node);
        }
    }

    /**
     * 从对象池请求对象
     *
     * @private
     * @returns {cc.Node}
     * @memberof CCNodePool
     */
    private _getNode(): cc.Node {
        let node: cc.Node;
        if (this._nodePool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            let params: number[] = [1, 2, 3];
            // params 参数会被原样传递给 reuse 方法
            node = this._nodePool.get(...params);
        } else {
            // 创建新节点
            node = cc.instantiate(this.tempalte);
        }
        // 将生成的节点加入节点树
        node.parent = this.node;
        let pos: cc.Vec2 = cc.v2(Math.random() * cc.winSize.width, Math.random() * cc.winSize.height);
        node.getComponent(cc.Label).string = this.node.childrenCount + '';
        node.name = this.node.childrenCount + '';
        node.setPosition(pos);
        return node;
    }

    /**
     * 将对象返回对象池
     *
     * @private
     * @memberof CCNodePool
     */
    private _putNode(node: cc.Node): void {
        // 将节点放进对象池, 这个方法会同时调用节点的 removeFromParent(false) 方法
        // 将对象从父节点中移除, 但并不会执行 cleanup 操作
        // 会调用 poolHandlerComp.unuse 方法
        this._nodePool.put(node);
    }

    /**
     * 清空对象池, 销毁其中缓存的所有的节点
     *
     * @private
     * @memberof CCNodePool
     */
    private _clear(): void {
        this._nodePool.clear();
    }

    @property({
        displayName: '清空'
    })
    set clear(value: boolean) {
        this._clear();
    }
    get clear(): boolean {
        return false;
    }

    @property({
        displayName: '创建节点'
    })
    set createNode(value: boolean) {
        this._getNode();
    }
    get createNode(): boolean {
        return false;
    }

    @property({
        displayName: '销毁节点'
    })
    set destroyNode(value: boolean) {
        if (this.node.childrenCount > 0) {
            this._putNode(this.node.children[0]);
        }
    }
    get destroyNode(): boolean {
        return false;
    }
}