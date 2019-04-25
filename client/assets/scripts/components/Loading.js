var Buffer = require("buffer").Buffer;
cc.Class({
    extends: cc.Component,

    properties: {
        statusPanel:cc.Node,
        updatePanel:cc.Node,
        _isLoading:false,
        _dt:0,
        _showSplash:true
    },

    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile &&!cc.sys.isBrowser ){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if(cc.sys.isBrowser){
            var bg = this.node.getChildByName("bg");
            var windowP = cc.director.getWinSizeInPixels();
            var scaleX = windowP.width/bg.width;
            var scaleY = windowP.height/bg.height;
            var scale = Math.max(scaleX,scaleY);
            bg.scaleX = scale;
            bg.scaleY = scale;
        }
        this.initMgr();
        this.addSocketEvents();
    },
    
    start:function(){
        if(cc.sys.os !== cc.sys.OS_IOS || !cc.sys.isNative || cc.sys.isBrowser){
            this._showSplash = true;
            this.connect(false);
        }
        else{
            this._showSplash = false;
            this.connect();
        }
    },
    
    initMgr:function(){
        window.SEvents = require("SocketEvents");

        cc.module = {};
        cc.module.serverInfo = null;
        cc.module.Buffer = Buffer;

        cc.module.config = require("Config");

        cc.module.socket = require("Net").init(cc.module.config);

        var AudioMgr = require("AudioMgr");
        cc.module.audioMgr = new AudioMgr();
        cc.module.audioMgr.init();

        var AnysdkMgr = require("AnysdkMgr");
        cc.module.anysdkMgr = new AnysdkMgr().init();

        var Self = require("Self");
        cc.module.self = new Self();
        cc.module.self.addSignInvalidListener();

        var Utils = require("Utils");
        cc.module.utils = new Utils();

        var ImageCache = require("ImageCache");
        cc.module.imageCache = new ImageCache().init();

        var VoiceMgr = require("VoiceMgr");
        cc.module.voiceMgr = new VoiceMgr();
        cc.module.voiceMgr.init();

        var PokerMgr = require("PokerMgr");
        cc.module.pokerMgr = new PokerMgr();

        var http = require("HTTP");
        cc.module.http = http.init(cc.module.config);
    },
    
    checkVersion:function(){
        var localVersion = cc.module.config.VERSION;
        var remoteVersion = cc.module.serverInfo.Version;
        if(localVersion != remoteVersion && cc.sys.isNative) {
            var pop = this.updatePanel.getComponent("Pop");
            pop.pop();
        }
        else {
            cc.director.loadScene("login");
        }
    },
    
    onBtnDownloadClicked:function(){
        cc.module.audioMgr.playUIClick();
        cc.sys.openURL(cc.module.serverInfo.ShareURL);
    },

    onReceiveServerInfo:function (data) {
        cc.module.serverInfo = data;
        cc.module.anysdkMgr.setShareURL(data.ShareURL);
        this.checkVersion();
    },

    addSocketEvents:function () {
        cc.module.socket.on(SEvents.RECEIVE_SERVER_INFO,this.onReceiveServerInfo.bind(this));
    },

    connect:function(isAuto) {
        if(!isAuto) {
            this.setConnetStatus(false);
        }
        cc.module.socket.connect();
    },

    setConnetStatus:function (isFail) {
        this.statusPanel.active = true;
        var statusConnecting = this.statusPanel.getChildByName("state_connecting");
        var statusConnectFail = this.statusPanel.getChildByName("state_connect_fail");
        if(cc.isValid(statusConnectFail) && cc.isValid(statusConnecting)) {
            statusConnectFail.active = isFail;
            statusConnecting.active = !statusConnectFail.active;
        }
    },

    onDestroy:function() {
        cc.module.socket.off(SEvents.RECEIVE_SERVER_INFO);
    },

    update:function (dt) {
        if(this._showSplash) {
            return;
        }
        if(cc.module.socket.isConnect()) {
            this.statusPanel.active = false;
            return;
        }
        this._dt += dt;
        if(this._dt>4) {
            if(!cc.module.socket.isConnect()) {
                this.setConnetStatus(true);
            }
            this._dt = 0;
            this.connect(true);
        }
    }
});