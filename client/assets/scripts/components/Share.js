cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {

    },

    shareToSession:function() {
        // var sharePanel = this.node.getChildByName("share_panel");
        // var pop = sharePanel.getComponent("Pop");
        // pop.unpop();
        cc.module.anysdkMgr.shareToSession("逗基十三水","激情十三水！逗基十三水震撼来袭,约上三五好友斗起来吧！");
    },

    shareToTimeLine:function() {
        // var sharePanel = this.node.getChildByName("share_panel");
        // var pop = sharePanel.getComponent("Pop");
        // pop.unpop();
        cc.module.anysdkMgr.shareToTimeLine("逗基十三水","激情十三水！逗基十三水震撼来袭,约上三五好友斗起来吧！");
    },
    
    onClickShare:function(){
        cc.module.audioMgr.playUIClick();
        cc.module.anysdkMgr.shareResult();
    },

    followGZH:function(){
        var url = "http://hh.2018yy.cn/gzh.jpg";
        cc.sys.openURL(url);
    }
});
