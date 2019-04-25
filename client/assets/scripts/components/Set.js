cc.Class({
    extends: cc.Component,

    properties: {
       
    },
    onLoad:function () {
        this.refreshVolume();
    },
    refreshVolume:function () {
        var bgmVolume = cc.module.audioMgr.bgmVolume;
        var sfxVolume = cc.module.audioMgr.sfxVolume;
        var soundOn = cc.find("panel/vioce/btn/on",this.node);
        var soundOff = cc.find("panel/vioce/btn/off",this.node);
        soundOn.active = (sfxVolume == 1);
        soundOff.active = !(sfxVolume == 1);
        cc.module.audioMgr.setBGMVolume(bgmVolume);
        cc.module.audioMgr.setSFXVolume(sfxVolume);
    },

    onclickMusic:function (e,data){
        var musicOn = this.node.getChildByName("panel").getChildByName("music").getChildByName("on");
        var musicOff = this.node.getChildByName("panel").getChildByName("music").getChildByName("off");
        musicOn.active = (data == 1);
        musicOff.active = !(data == 1);
        cc.module.audioMgr.setBGMVolume(data);
    },
    
    onclickSound:function(e,data){
        var soundOn = cc.find("panel/vioce/btn/on",this.node);
        var soundOff = cc.find("panel/vioce/btn/off",this.node);
        soundOn.active = !soundOn.active;
        soundOff.active = !soundOff.active;
        cc.module.audioMgr.setSFXVolume(soundOn.active ? 1:0);
    },
    onClickClearCache (){
        setTimeout(function(){
            cc.module.wc.show("清理成功！",!0);
        },1000);
    },
    onClickSwitchAccount:function (e) {
        cc.sys.localStorage.removeItem("wx_account");
        cc.sys.localStorage.removeItem("wx_sign");
        cc.director.loadScene("login");
        cc.module.wc.show("正在注销...");
    }
});
