//初始化数据
function tabbarinit(chain_id,title) {
  return [
    {
      "current": 0,
      "pagePath": "../../pages/chain/index?chain_id="+chain_id+'&title='+title,
        "iconPath": "../../../imgs/tabBar/elm_b.png",
        "selectedIconPath": "../../../imgs/tabBar/elm_h.png",
        "text": "饿了么"
    },
    {
      "current": 0,
      "pagePath": "../../pages/chain/mt?chain_id="+chain_id+'&title='+title,
        "iconPath": "../../../imgs/tabBar/mt1_Y.png",
        "selectedIconPath": "../../../imgs/tabBar/mt1_h.png",
        "text": "美团"
    }
  ]

}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target,chain_id,title) {
  var that = target;

  var bindData = {};
  var otabbar = tabbarinit(chain_id,title);
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']   //换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}

module.exports = {
  tabbar: tabbarmain
}