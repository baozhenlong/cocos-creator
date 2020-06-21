const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CClifecycle extends cc.Component {

    @property({
        type: [cc.String],
        displayName: '概要',
        readonly: true
    })
    summaryDescArr: string[] = [
        'onLoad -> onEnable -> start -> update -> lateUpdate -> onDisable -> onDestroy'
    ];

    @property({
        type: [cc.String],
        displayName: 'onLoad 描述',
        readonly: true
    })
    onLoadDescArr: string[] = [
        'onLoad 会在节点首次激活(activeInHierarchy = true)时触发(组件 enabled true 或 false 都会触发)',
        'onLoad 总是会在任何 start 方法调用前执行',
        '最多只会被调用一次'
    ];

    onLoad() {
        cc.log('onLoad');
        this.enabled = false;
    }

    @property({
        type: [cc.String],
        displayName: 'onDestroy 描述',
        readonly: true
    })
    onDestroyDescArr: string[] = [
        '当组件或者所在节点调用 destroy(), 则会调用 onDestroy 回调, 并在当前帧结束后统一回收组件'
    ];

    onDestroy() {

    }

    @property({
        type: [cc.String],
        displayName: 'start 描述',
        readonly: true
    })
    startDescArr: string[] = [
        'start 会在节点首次激活(activeInHierarchy 为 true 且组件 enabled 为 true)时触发',
        '当 activeInHierarchy 从 false 变为 true, 且 enabled 为 true, start 未被调用过时触发',
        '当 enabled 从 false 变为 true, 且 activeInHierarchy 为 true, start 未被调用过时触发',
        '最多只会被调用一次'
    ];

    @property({
        type: [cc.String],
        displayName: 'onEnable 描述',
        readonly: true
    })
    onEnableDescArr: string[] = [
        '当 activeInHierarchy 从 false 变为 true, 且组件的 enabled 属性为 true 时调用',
        '当组件的 enabled 属性从 false 变为 true, 且 activeInHierarchy 为 true 时调用',
        '当所在节点的 active 属性从 false 变为 true, 且 activeInHierarchy, enabled 都为 true 时调用',
    ];

    onEnable() {
        cc.log('onEnable');
    }

    @property({
        type: [cc.String],
        displayName: 'onDisable 描述',
        readonly: true
    })
    onDisableDescArr: string[] = [
        '当 activeInHierarchy 从 true 变为 false, 且组件的 enabled 属性为 true 时调用',
        '当组件的 enabled 属性从 true 变为 false, 且 activeInHierarchy 为 true 时调用',
        '当所在节点的 active 属性从 true 变为 false, 且 activeInHierarchy, enabled 都为 true 时调用',
    ];

    onDisable() {
        cc.log('onDisable');
    }

    start() {
        cc.log('start');
    }

    @property({
        type: [cc.String],
        displayName: 'update 描述',
        readonly: true
    })
    updateDescArr: string[] = [
        '每一帧渲染前调用'
    ];

    update() {

    }

    @property({
        type: [cc.String],
        displayName: 'lastUpdate 描述',
        readonly: true
    })
    lastUpdateDescArr: string[] = [
        '所有组件的 update 都执行完之后才调用'
    ];

    lastUpdate() {

    }


}