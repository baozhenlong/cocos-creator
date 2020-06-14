const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CCScaleSize extends cc.Component {

    /**
     * 使用像素单位
     *
     * @memberof CCScaleSize
     */
    @property({
        displayName: '节点自身大小',
        tooltip: '不受该节点是否被缩放或者旋转的影响'
    })
    set size(value: cc.Size) {
        this.node.setContentSize(value);
        this._printData();
    }
    get size(): cc.Size {
        return this.node.getContentSize();
    }

    /**
     * 使用比例单位
     *
     * @memberof CCScaleSize
     */
    @property({
        displayName: '节点整体的缩放比例',
        tooltip: '影响所有子节点'
    })
    set scale(value: number) {
        this.node.scale = value;
        this._printData();
    }
    get scale(): number {
        return this.node.scale; // 其实返回的是 scaleX
    }

    @property({
        displayName: '节点 x 轴缩放'
    })
    set scaleX(value: number) {
        this.node.scaleX = value;
        this._printData();
    }
    get scaleX(): number {
        return this.node.scaleX;
    }

    @property({
        displayName: '节点 y 轴缩放'
    })
    set scaleY(value: number) {
        this.node.scaleY = value;
        this._printData();
    }
    get scaleY(): number {
        return this.node.scaleY;
    }

    private _printData() {
        cc.log('size =', this.node.getContentSize());
        cc.log('scale =', this.node.scale);
        cc.log('boundingBox =', this.node.getBoundingBox()); // 不考虑父节点的缩放
    }

}