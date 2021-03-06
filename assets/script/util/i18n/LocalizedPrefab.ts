import LinkedPrefab from "../linked/LinkedPrefab";
import LanguageMgr, { LanguageEnum } from "./LanguageMgr";

const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu('多语言/预制体')
export default class LocalizedPrefab extends LinkedPrefab {

    @property
    private _language: LanguageEnum = LanguageEnum.简体中文;

    @property({
        displayName: '当前语言',
        type: cc.Enum(LanguageEnum),
    })
    protected set language(value: LanguageEnum) {
        this._language = value;
        this.preview();
    }
    protected get language(): LanguageEnum {
        return this._language;
    }

    protected checkResURL(): string {
        if (CC_EDITOR) {
            LanguageMgr.currentLanguage = this.language;
        }
        return LanguageMgr.checkResURL(this.resURL);
    }

    protected updateResURL(url: string): void {
        let {
            languageIndex,
            resURL
        } = LanguageMgr.getLanguageDataByURL(url);
        this._language = languageIndex;
        this.resURL = resURL;
    }
}