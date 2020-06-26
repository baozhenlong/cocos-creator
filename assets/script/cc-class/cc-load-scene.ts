const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadScene extends cc.Component {

    @property({
        type: [cc.String],
        displayName: '概要',
        readonly: true,
        multiline: true
    })
    summaryDescArr: string[] = [
        'addPersistRootNode(ndoe) 声明常驻根节点，该节点必须位于层级的根节点, 否则无效',
        'removePersistRootNode(node) 并不会立即销毁指定节点, 只是将节点还原为可在场景切换时销毁的节点'
    ];

    onLoad() {
        if (cc.game.isPersistRootNode(this.node)) {
            cc.log('已经是常驻节点');
        } else {
            cc.log('不是常驻节点, 设置为常驻节点');
            cc.game.addPersistRootNode(this.node);
        }
        cc.director.preloadScene(
            'cc-load-scene-2',
            (completedCount, totalCount, item) => {
                cc.log('completedCount', completedCount);
                cc.log('totalCount', totalCount);
                cc.log('item', item);
            },
            (err, asset) => {
                if (err) {
                    cc.log('error', err);
                }
                if (asset) {
                    cc.log('asset', asset);
                }
            });
    }

    goNext(): void {
        let currentSceneName: string = cc.director.getScene().name;
        let nextSceneName: string;
        if (currentSceneName === 'cc-load-scene-1') {
            nextSceneName = 'cc-load-scene-2'
        } else if (currentSceneName = 'cc-load-scene-2') {
            nextSceneName = 'cc-load-scene-1'
        }
        cc.director.loadScene(nextSceneName, () => {
            cc.log('去到场景 name', cc.director.getScene().name);
        });
    }

}