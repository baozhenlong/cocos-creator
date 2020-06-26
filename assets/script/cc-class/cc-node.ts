const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CCNode extends cc.Component {

    onLoad() {
        this.findChild();
        let parent: cc.Node = this.node.getChildByName('parent');
        if (parent) {
            parent.children.forEach((node) => {
                node.destroy();
            });
        }
    }

    /**
     * 查找节点
     *
     * @memberof CCNode
     */
    findChild() {
        this.node.parent = cc.director.getScene().getChildByName('Canvas');
        cc.log('getChildByName(child)', this.node.getChildByName('child').width);
        // 默认从 Scene 查找(即 Canvas...)
        cc.log('cc.find(Canvas/node/child/child)', cc.find('Canvas/node/child/child').width);
        cc.log('cc.find(child, this.node)', cc.find('child', this.node).width);
        cc.log('cc.find(child, , this.node.getChildByName(child))', cc.find('child', this.node.getChildByName('child')).width);
        cc.log('cc.find(Canvas)', cc.find('Canvas').name);
    }

    @property({
        displayName: '节点 active 描述',
        type: [cc.String],
        readonly: true,
        multiline: true
    })
    activeDescArr: string[] = [
        '当一个节点是关闭状态时, 它的所有组件都将被禁用；同时, 它所有子节点, 以及子节点上的组件也会跟着被禁用',
        'notice: 子节点被禁用时, 并不会改变它们的 active 属性, 因此当父节点重新激活的时候它们就会回到原来的状态',
        'active 表示的是当前节点自身的激活状态, 而这个节点当前是否被激活则取决于它的父节点；并且如果它不在场景中, 也无法被激活',
        '通过节点上的只读属性 activeInHierarchy 来判断它当前是否已经激活'
    ];

    @property({
        displayName: '激活节点'
    })
    set enableActive(value: boolean) {
        this.node.active = true;
        this.logActive();
    }
    get enableActive(): boolean {
        return false;
    }

    @property({
        displayName: '激活节点描述',
        type: [cc.String],
        readonly: true,
        multiline: true
    })
    enableActiveDescArr: string[] = [
        '当节点 active 从 false 变为 true 时',
        '在场景中重新该节点和该节点下所有 active 为 true 的子节点',
        '该节点和所有子节点上的所有组件都会被启用',
        '当 activeInHierarchy 为 true 时, 它们中的 update 方法之后每帧都会执行',
        '当 activeInHierarchy 为 true 时,这些组件上如果有 onEnable 方法, 这些方法将被执行'
    ];

    @property({
        displayName: '关闭节点'
    })
    set disableActive(value: boolean) {
        this.node.active = false;
        this.logActive();
    }
    get disableActive(): boolean {
        return false;
    }

    @property({
        displayName: '关闭节点描述',
        type: [cc.String],
        readonly: true,
        multiline: true
    })
    disableActiveDescArr: string[] = [
        '当节点 active 从 true 变为 false 时',
        '在场景中隐藏该节点和该节点下的所有子节点',
        '该节点和所有子节点上的所有组件都会被禁用, 当 activeInHierarchy 为 true 时, 不会再执行这些组件中的 update 中代码',
        '当 activeInHierarchy 为 true 时, 这些组件上如果有 onDisable 方法, 这些方法将被执行'
    ];


    logActive(): void {
        let func: Function = (targetNode: cc.Node) => {
            cc.log('node.name =', targetNode.name, ', active =', targetNode.active, ', activeInHierarchy =', targetNode.activeInHierarchy);
            let nodeArr: cc.Node[] = targetNode.children;
            if (nodeArr.length > 0) {
                for (let i = 0; i < nodeArr.length; i++) {
                    func(nodeArr[i]);
                }
            }
        };
        func(this.node);
    }

    @property({
        displayName: '更改父节点'
    })
    set changeParent(value: boolean) {
        if (this.newParent === null) {
            cc.warn('请设置父节点');
        } else if (this.newParent === this.node.parent) {
            cc.warn('请设置不同的父节点');
        } else {
            this.node.parent = this.newParent;
        }
    }
    get changeParent(): boolean {
        return false;
    }

    @property({
        type: cc.Node,
        displayName: '新父节点'
    })
    newParent: cc.Node = null;

    childNode(): void {
        // 获取节点的所有子节点数组
        this.node.children;
        // 返回节点的子节点数量
        this.node.childrenCount;
    }

    private get _parent(): cc.Node {
        let parent: cc.Node = this.node.getChildByName('parent');
        if (!parent) {
            parent = (new cc.Node('parent'));
        }
        return parent;
    }

    @property({
        displayName: '创建新节点',
    })
    set createNode(value: boolean) {
        let node = new cc.Node();
        node.parent = this._parent;
    }
    get createNode(): boolean {
        return false;
    }

    @property({
        type: cc.Node,
        displayName: '需要克隆的节点'
    })
    needCloneNode: cc.Node = null;

    @property({
        displayName: '克隆已有节点'
    })
    set cloneNode(value: boolean) {
        if (this.needCloneNode) {
            cc.instantiate(this.needCloneNode).parent = this._parent;
        } else {
            cc.warn('需设置需要克隆的节点');
        }
    }
    get cloneNode(): boolean {
        return false;
    }

    @property({
        type: cc.Prefab,
        displayName: '预制体'
    })
    template: cc.Prefab = null;

    @property({
        displayName: '创建预制体'
    })
    set createTemplate(value: boolean) {
        if (this.template) {
            cc.instantiate(this.template).parent = this._parent;
        } else {
            cc.warn('需设置需要预制体');
        }
    }
    get createTemplate(): boolean {
        return false;
    }

    @property({
        type: [cc.String],
        displayName: '销毁节点描述',
        multiline: true
    })
    destroyNodeDescArr: string[] = [
        '通过 node.destroy() 可以销毁节点',
        '销毁节点并不会立刻被移除, 而是在当前帧逻辑更新结束后, 统一执行',
        '当一个节点销毁后，该节点就处于无效状态, 可以通过 cc.isValid() 判断当前节点是否已经被销毁'
    ];

    @property({
        displayName: '销毁节点'
    })
    set destroyNode(value: boolean) {
        let children: cc.Node[] = this._parent.children;
        if (children.length > 0) {
            children.forEach((node, index) => {
                node.destroy();
                if (index === 0) {
                    cc.log('cc.isValid(node)', cc.isValid(node), ', 下一帧开始就会返回 false');
                    cc.log('cc.isValid(node, true)', cc.isValid(node, true), ', 判断当前是否调用过 destroy');
                    setTimeout(() => {
                        cc.log('下一帧 cc.isValid(node)', cc.isValid(node));
                    }, 0);
                }
            });
        } else {
            cc.warn('请先创建节点');
        }
    }
    get destroyNode(): boolean {
        return false;
    }

}