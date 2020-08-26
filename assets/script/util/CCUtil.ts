
function setPreview(node: cc.Node): void {
    // cc.Object["Flags"].DontSave          // 当前节点不会被保存到 prefab 文件里
    // cc.Object["Flags"].LockedInEditor    // 当前节点及子节点在编辑器里不会被点击到
    // cc.Object["Flags"].HideInHierarchy   // 当前节点及子节点在编辑器里不显示
    node["_objFlags"] |= (cc.Object["Flags"].DontSave | cc.Object["Flags"].LockedInEditor | cc.Object["Flags"].HideInHierarchy);
}
function getResURL(path: string): string {
    let url: string = path.replace('db://assets/resources/', '').split('.')[0];
    cc.log('url', url);
    return url;
}
export default {
    setPreview,
    getResURL
}