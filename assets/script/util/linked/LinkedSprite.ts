import CCUtil from "../CCUtil";

const { ccclass, property, menu, executeInEditMode } = cc._decorator;

const Node = {
    sharedMaterials: [],
    srcBlendFactor: 0,
    dstBlendFactor: 0,
    type: 0,
    fillType: 0,
    fillCenter: cc.v2(0, 0),
    fillStart: 0,
    fillRange: 0,
    trim: true,
    sizeMode: 0
};

interface NodeProps {
    sharedMaterials: [cc.Material]
    srcBlendFactor: number,
    dstBlendFactor: number,
    type: cc.Sprite.Type,
    fillType: cc.Sprite.FillType,
    fillCenter: cc.Vec2,
    fillStart: number,
    fillRange: number,
    trim: Boolean,
    sizeMode: cc.Sprite.SizeMode
}

@ccclass
@executeInEditMode
@menu('Linked/图片')
export default class LinkedSprite extends cc.Sprite {

    @property({
        override: true,
        serializable: false
    })
    _spriteFrame: cc.SpriteFrame = null;

    @property({
        override: true,
    })
    _isTrimmedMode: boolean = false;

    @property({
        override: true,
    })
    _sizeMode: cc.Sprite.SizeMode = cc.Sprite.SizeMode.RAW;

    @property({
        type: cc.Node
    })
    private _previewNode: cc.Node = null;

    @property({
        visible: false
    })
    protected resURL: string = '';

    onLoad() {
        this.refresh();
    }

    onEnable() {
        super.onEnable();
        if (CC_EDITOR) {
            this.node.on('spriteframe-changed', this._spriteFameChanged, this);
        }
    }

    onDisable() {
        if (CC_EDITOR) {
            this.node.off('spriteframe-changed', this._spriteFameChanged, this);
        }
        super.onDisable();
    }

    protected refresh(): void {
        if (CC_EDITOR) {
            if (this._previewNode) {
                this._previewNode.destroy();
                this._previewNode = null;
            }
            if (this.resURL) {
                let resURL: string = this.checkResURL();
                cc.loader.loadRes(resURL, (err, res) => {
                    if (err) {
                        cc.log('can not find res', resURL);
                    } else {
                        this._previewNode = new cc.Node();
                        let sp: cc.Sprite = this._previewNode.addComponent(cc.Sprite);
                        sp.spriteFrame = new cc.SpriteFrame(res);
                        Object.keys(Node).forEach((key) => {
                            sp[key] = this[key];
                        });
                        CCUtil.setPreview(this._previewNode);
                        this.node.addChild(this._previewNode, -1);
                        if (sp.spriteFrame) {
                            let {
                                width,
                                height
                            } = sp.spriteFrame.getRect();
                            this._previewNode.width = width;
                            this._previewNode.height = height;
                            this.node.width = width;
                            this.node.height = height;
                        }
                    }
                });
            }
        } else {

        }
    }

    protected checkResURL(): string {
        return this.resURL;
    }

    private _spriteFameChanged(): void {
        if (this.spriteFrame) {
            Editor.assetdb.queryUrlByUuid(this.spriteFrame._uuid, (err, path) => {
                this.updateResURL(CCUtil.getResURL(path))
                this.refresh();
                this.spriteFrame = null;
            });
        }
    }

    protected updateResURL(url: string): void {
        this.resURL = url;
    }
}