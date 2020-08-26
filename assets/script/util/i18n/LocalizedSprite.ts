import LinkedSprite from "../linked/LinkedSprite";
import LanguageMgr, { LanguageEnum } from "./LanguageMgr";

const { ccclass, property, menu, executeInEditMode } = cc._decorator;

const REPLACE_MODE: string = '##XDGKZY##';

@ccclass
@executeInEditMode
@menu('多语言/图片')
export default class LocalizedSprite extends LinkedSprite {

    @property
    private _language: LanguageEnum = LanguageEnum.简体中文;

    @property({
        displayName: '当前语言',
        type: cc.Enum(LanguageEnum),
    })
    protected set language(value: LanguageEnum) {
        this._language = value;
        this.refresh();
    }
    protected get language(): LanguageEnum {
        return this._language;
    }

    protected checkResURL(): string {
        if (CC_EDITOR) {
            LanguageMgr.currentLanguage = this.language;
        }
        let url: string = this.resURL.replace(REPLACE_MODE, `/${LanguageMgr.getLanguageKey(LanguageMgr.currentLanguage)}/`);
        return url;
    }

    protected updateResURL(url: string): void {
        let languageKey: string;
        for (let i = 0; i < LanguageMgr.languageKeyArr.length; i++) {
            let key: string = LanguageMgr.languageKeyArr[i];
            if (url.includes(`${key}`)) {
                languageKey = key;
                this._language = i;
                break;
            }
        }
        url = url.replace(`/${languageKey}/`, REPLACE_MODE);
        this.resURL = url;
    }
}