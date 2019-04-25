cc.Class({
    extends: cc.Component,

    properties: {
        _btnYXOpen:null,
        _btnYXClose:null,
        _btnYYOpen:null,
        _btnYYClose:null
    },

    onLoad: function () {
        if(cc.module == null){
            return;
        }
        var frame = this.node.getChildByName("frame");
        if(frame) {
            this._btnYXOpen = frame.getChildByName("yinxiao").getChildByName("btn_yx_open");
            this._btnYXClose = frame.getChildByName("yinxiao").getChildByName("btn_yx_close");
            this._btnYYOpen = frame.getChildByName("yinyue").getChildByName("btn_yy_open");
            this._btnYYClose = frame.getChildByName("yinyue").getChildByName("btn_yy_close");
            this.initButtonHandler(this._btnYXOpen);
            this.initButtonHandler(this._btnYXClose);
            this.initButtonHandler(this._btnYYOpen);
            this.initButtonHandler(this._btnYYClose);
            var slider = frame.getChildByName("yinxiao").getChildByName("progress");
            this._yxProgressWidth = slider.width;
            cc.module.utils.addSlideEvent(slider,this.node,"Settings","onSlided");

            slider = frame.getChildByName("yinyue").getChildByName("progress");
            this._yyProgressWidth = slider.width;
            cc.module.utils.addSlideEvent(slider,this.node,"Settings","onSlided");
            
            var btnSwitchAccount = frame.getChildByName("btn_switch_account")
            if(btnSwitchAccount) {
                this.initButtonHandler(btnSwitchAccount);
            }
        }
        this.refreshVolume();
    },
    
    onSlided:function(slider){
        if(slider.node.parent.name === "yinxiao"){
            cc.module.audioMgr.setSFXVolume(slider.progress);
        }
        else if(slider.node.parent.name === "yinyue"){
            cc.module.audioMgr.setBGMVolume(slider.progress);
        }
        this.refreshVolume();
    },
    
    initButtonHandler:function(btn){
        cc.module.utils.addClickEvent(btn,this.node,"Settings","onBtnClicked");
    },
    
    refreshVolume:function(){
        this._btnYXClose.active = cc.module.audioMgr.sfxVolume > 0;
        this._btnYXOpen.active = !this._btnYXClose.active;
        var yx = this.node.getChildByName("frame").getChildByName("yinxiao");
        var width = this._yxProgressWidth * cc.module.audioMgr.sfxVolume;
        var progress = yx.getChildByName("progress");
        progress.getComponent(cc.Slider).progress = cc.module.audioMgr.sfxVolume;
        progress.getChildByName("progress").width = width;

        this._btnYYClose.active = cc.module.audioMgr.bgmVolume > 0;
        this._btnYYOpen.active = !this._btnYYClose.active;
        var yy = this.node.getChildByName("frame").getChildByName("yinyue");
        var width = this._yyProgressWidth * cc.module.audioMgr.bgmVolume;
        var progress = yy.getChildByName("progress");
        progress.getComponent(cc.Slider).progress = cc.module.audioMgr.bgmVolume;
        progress.getChildByName("progress").width = width;
    },
    
    onBtnClicked:function(event){
        if(event.target.name === "btn_switch_account"){
            cc.sys.localStorage.removeItem("wx_account");
            cc.sys.localStorage.removeItem("wx_sign");
            cc.director.loadScene("login");
        }
        else if(event.target.name === "btn_yx_open"){
            cc.module.audioMgr.setSFXVolume(1.0);
            this.refreshVolume(); 
        }
        else if(event.target.name === "btn_yx_close"){
            cc.module.audioMgr.setSFXVolume(0);
            this.refreshVolume();
        }
        else if(event.target.name === "btn_yy_open"){
            cc.module.audioMgr.setBGMVolume(1);
            this.refreshVolume();
        }
        else if(event.target.name === "btn_yy_close"){
            cc.module.audioMgr.setBGMVolume(0);
            this.refreshVolume();
        }
    }
});
