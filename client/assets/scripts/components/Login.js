String.prototype.format = function(args) { 
    if (arguments.length>0) { 
        var result = this; 
        if (arguments.length == 1 && typeof (args) == "object") { 
            for (var key in args) { 
                var reg=new RegExp ("({"+key+"})","g"); 
                result = result.replace(reg, args[key]); 
            } 
        } 
        else { 
            for (var i = 0; i < arguments.length; i++) { 
                if(arguments[i]==undefined) { 
                    return ""; 
                } 
                else { 
                    var reg=new RegExp ("({["+i+"]})","g"); 
                    result = result.replace(reg, arguments[i]); 
                } 
            } 
        } 
        return result; 
    } 
    else { 
        return this; 
    } 

};
var webAppId = "wxcd032c74230d8953";
var webUrl = "hh.2018yy.cn"
var REDIRECT_URI = "http%3A%2F%2F" + webUrl + "%2Findex.php";
var HREF = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+webAppId+"&redirect_uri="+REDIRECT_URI+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";

cc.Class({
    extends: cc.Component,
    properties: {
        // isTest:true,
        phone:cc.EditBox,
        password:cc.EditBox,
        _mima:null,
        _mimaIndex:0,
        _isClickWeiChat:false
    },

    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile && !cc.sys.isBrowser){
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
        var bgmName = cc.module.audioMgr.getLocalBGMName();
        if(cc.isValid(bgmName)) {
            cc.module.audioMgr.playBGM(bgmName);
        }
        else {
            cc.module.audioMgr.playBGM("bgm_1.mp3");
        }
        cc.game.on(cc.game.EVENT_SHOW,this.onShowAgain,this);
        if(cc.sys.isBrowser /*&& this.isTest*/) {
            cc.sys.localStorage.setItem("wx_account1","15913131313");
            cc.sys.localStorage.setItem("wx_sign1","123456");
            cc.sys.localStorage.setItem("wx_account2","15859996888");
            cc.sys.localStorage.setItem("wx_sign2","123456");
            cc.sys.localStorage.setItem("wx_account3","15705991583");
            cc.sys.localStorage.setItem("wx_sign3","123456");
            cc.sys.localStorage.setItem("wx_account4","15695999888");
            cc.sys.localStorage.setItem("wx_sign4","123456");
            cc.sys.localStorage.setItem("wx_account5","15359155193");
            cc.sys.localStorage.setItem("wx_sign5","123456");
            cc.sys.localStorage.setItem("wx_account6","18659997576");
            cc.sys.localStorage.setItem("wx_sign6","123456");
            cc.sys.localStorage.setItem("wx_account7","18650662969");
            cc.sys.localStorage.setItem("wx_sign7","123456");
        }
        // if(cc.sys.isBrowser /*&& this.isTest*/) {
        //     cc.sys.localStorage.setItem("wx_account","wx_o02LGwvPUAB_vDJSEt7mi2zsg1Vw");
        //     cc.sys.localStorage.setItem("wx_sign","4c7956ba2bc7defd533e779044cbc8ee");
        //     cc.sys.localStorage.setItem("wx_account2","wx_o02LGwpYeIfociC0KooBzhvPN-bY");
        //     cc.sys.localStorage.setItem("wx_sign2","65c1019c1e112fb25df0706e721654d5");
        //     cc.sys.localStorage.setItem("wx_account3","wx_o02LGwtLAwoAD26iJ3uUivJYXFoY");
        //     cc.sys.localStorage.setItem("wx_sign3","9dd3f05030feb6c19c6b616e76d2523e");
        //     cc.sys.localStorage.setItem("wx_account4","wx_o02LGwjlZ-g6lXanK22aCQjBuczk");
        //     cc.sys.localStorage.setItem("wx_sign4","45cc833485d5b07bca6a31842cdd88d7");
        //     cc.sys.localStorage.setItem("wx_account5","wx_o02LGwmAnjfgGDPZWnvEdOdO_3UM");
        //     cc.sys.localStorage.setItem("wx_sign5","defa3d7b31459fe62c90ce9bf7ad261e");
        //     cc.sys.localStorage.setItem("wx_account6","wx_o02LGwnLzc2G_jZU1FxLcShUA8oo");
        //     cc.sys.localStorage.setItem("wx_sign6","359eb16773cc286267d9f84bd5a5b006");
        //     cc.sys.localStorage.setItem("wx_account7","wx_o02LGwr40Do168TFHXqtTcvzDTc0");
        //     cc.sys.localStorage.setItem("wx_sign7","60115e8ed8a280a9b1ab132ebca5c4f3");
        // }
        this.addSocketEvents();
    },
    
    start:function(){
        var account =  cc.sys.localStorage.getItem("wx_account");
        var sign = cc.sys.localStorage.getItem("wx_sign");

        if(cc.sys.isBrowser && !account && !sign){
            var code = this.getQueryString("code");
            if(code){
                cc.module.wc.show("正在获取微信授权");
                var data = {
                    code:code,
                    type:"web"
                };
                var agentId = this.getQueryString("agentId"); 
                agentId ? data.agentId = agentId :null;
                cc.module.socket.send(SEvents.SEND_AUTH,data);
            }
        }
        
        if(cc.sys.isBrowser /*&& this.isTest*/) {
            if(window.location.search == "?1") {
                account =  cc.sys.localStorage.getItem("wx_account1");
                sign = cc.sys.localStorage.getItem("wx_sign1");
            }
            else if(window.location.search == "?2") {
                account =  cc.sys.localStorage.getItem("wx_account2");
                sign = cc.sys.localStorage.getItem("wx_sign2");
            }
            else if(window.location.search == "?3") {
                account =  cc.sys.localStorage.getItem("wx_account3");
                sign = cc.sys.localStorage.getItem("wx_sign3");
            }
            else if(window.location.search == "?4") {
                account =  cc.sys.localStorage.getItem("wx_account4");
                sign = cc.sys.localStorage.getItem("wx_sign4");
            }
            else if(window.location.search == "?5") {
                account =  cc.sys.localStorage.getItem("wx_account5");
                sign = cc.sys.localStorage.getItem("wx_sign5");
            }
            else if(window.location.search == "?6") {
                account =  cc.sys.localStorage.getItem("wx_account6");
                sign = cc.sys.localStorage.getItem("wx_sign6");
            }
            else if(window.location.search == "?7") {
                account =  cc.sys.localStorage.getItem("wx_account7");
                sign = cc.sys.localStorage.getItem("wx_sign7");
            }
            else {
                account =  cc.sys.localStorage.getItem("wx_account");
                sign = cc.sys.localStorage.getItem("wx_sign");
            }
        }
        
        // if(account && sign){
        //     this.login(account,sign);
        // }

        if(account && sign){
            this.phoneLogin(account,sign);
        }
    },

    close:function(){
        var account =  cc.sys.localStorage.getItem("wx_account");
        var sign = cc.sys.localStorage.getItem("wx_sign");
        if(cc.sys.isBrowser && !account && !sign){
            var code = this.getQueryString("code");
            if(code){
                cc.module.wc.show("正在获取微信授权");
                var data = {
                    code:code,
                    type:"web"
                }
                var agentId = this.getQueryString("agentId"); 
                agentId ? data.agentId = agentId :null;
                cc.module.socket.send(SEvents.SEND_AUTH,data);
            }
        }
        if(account && sign){
            this.login(account,sign);
        }
    },
    
    getQueryString: function(name){
        if(cc.sys.isBrowser){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
    },

    getRedirectUri:function(){ 
        var agentId = this.getQueryString("agentId"); 
        agentId ? REDIRECT_URI+="%3fagentId="+agentId:null;

        var roomId = this.getQueryString("roomId"); 
        roomId ? (REDIRECT_URI += agentId? ("%26roomId="+roomId):("%3froomId="+roomId)):null;
        // roomId ? REDIRECT_URI +=  "%3froomId="+roomId:null;

        var recordUuid = this.getQueryString("recordUuid");
        recordUuid ? (REDIRECT_URI += (roomId || agentId)?("%26recordUuid="+recordUuid):("%3frecordUuid="+recordUuid)):null;

        HREF = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+webAppId+"&redirect_uri="+REDIRECT_URI+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"; //
    },

    login:function (account,sign) {
        var data = {
            "account":account,
            "sign":sign
        };
        var agentId = this.getQueryString("agentId"); 
        agentId ? data.agentId = agentId :null;
        //显示正在登录
        // console.log(data);
        cc.module.socket.send(SEvents.SEND_LOGIN,data);
    },

    phoneLogin:function (phoneNum,password) {
        var data = {
            "phoneNum":phoneNum,
            "password":password
        };
        var agentId = null;
        if(cc.sys.isBrowser ){
            agentId = this.getQueryString("agentId"); 
            agentId ? data.agentId = agentId :null;
        }
        cc.module.socket.send(SEvents.SEND_PHONE_LOGIN,data);
    },

    addSocketEvents:function () {
        cc.module.socket.on(SEvents.RECEIVE_LOGIN_RESULT,this.onReceiveLoginResult.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_ONCERECORD,this.onReceiveOnceRecord.bind(this));
        cc.module.socket.on(SEvents.LOGIN_ENTERROOM,this.onReceiveLoginEnter.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_CHECKED_RESULT,this.onReceiveCheckedResult.bind(this));
    },

    onReceiveCheckedResult:function(data){//接收注册结果
        cc.module.wc.show(data.msg,true);
        // if(data.errcode){
        //     cc.module.wc.show(data.msg,true);
        // }
        // else{
        //     cc.module.wc.show(data.msg,true);
        // }
    },

    onReceiveLoginEnterResult:function(data){
        if(data.errcode) {
            cc.module.wc.show(data.errmsg,true);
            return;
        }
        // if(type === "cb"){
        //     cc.director.loadScene("cb_game");
        // }
        if(data.type === "ssz") {
            cc.director.loadScene("ssz_game");
        }
        else if(data.type === "nn") {
            cc.director.loadScene("game");
        }
    },

    onReceiveLoginEnter:function(data){  // 点击分享进入房间
        var room = data.room;
        var type = data.type;
        if(!room){  
            // 如果房间不存在 则看是否有战绩
            var recordUuid = this.getQueryString("recordUuid");
            if(cc.sys.isBrowser && recordUuid){
                // 如果有战绩则发送请求战绩 并预加载场景
                cc.module.socket.send(SEvents.SEND_GET_ONCERECORD,{uuid:recordUuid});
                cc.director.preloadScene("hall",function(){});
                return;
            };
            // 否则 加载大厅场景
            cc.module.wc.show("正在进入大厅...");
            cc.director.loadScene("hall");
        }else{
            cc.module.wc.show("正在进入房间...");

            if(type === "cb"){
                cc.director.loadScene("cb_game");
            }
            if(type == "ssz"){
                cc.director.loadScene("ssz_game");
            }else{
                cc.director.loadScene("game");
            }
        }
    },

    onReceiveLoginResult:function (data) {
        console.log(data);
        if(data.errcode) {
            cc.module.wc.show(data.errmsg,true);
            cc.sys.localStorage.removeItem("wx_account");
            cc.sys.localStorage.removeItem("wx_sign");
        }
        else {
            var agentId = this.getQueryString("agentId");
            if(data.account&&data.sign){
                cc.sys.localStorage.setItem("wx_account",data.account);
                cc.sys.localStorage.setItem("wx_sign",data.sign);
            }
            if(data.phone&&data.password){
                cc.sys.localStorage.setItem("wx_account",data.phone);
                cc.sys.localStorage.setItem("wx_sign",data.password);
            }
            cc.module.self.setInfo(data);
            cc.module.socket.setUserId(data.userId);
            cc.module.agentId = agentId?agentId:false;
            agentId && cc.sys.localStorage.setItem("agentId",agentId);
            if(cc.isValid(data.room)) {
                cc.module.wc.show("正在进入房间...");
                // if(data.room === "cb"){
                //      cc.director.loadScene("cb_game");
                // }
                if(data.room === "nn") {
                    cc.director.loadScene("game");
                }
                else if(data.room === "ssz") {
                    cc.director.loadScene("ssz_game");
                }
            }
            else {
                if(cc.sys.isBrowser){
                    var roomId = this.getQueryString("roomId");
                    if(roomId){
                        cc.module.socket.send(SEvents.LOGIN_ENTERROOM,{"roomId":roomId,"userId":data.userId,"isLoginEnter":!0});
                        return;
                    }else{
                        var recordUuid = this.getQueryString("recordUuid");
                        if(recordUuid){
                            cc.module.socket.send(SEvents.SEND_GET_ONCERECORD,{uuid:recordUuid});
                            return
                        }
                    }
                }
                cc.module.wc.show("正在登录...");
                cc.director.loadScene("hall");
            }
        }
    },

    //当点击微信登录按钮时
    onBtnWeiChatClick:function(){
        // 网页
        if( cc.sys.isBrowser ){
            this.getRedirectUri();
            cc.sys.openURL(HREF);
            cc.module.wc.show("正在跳转...");
        }else{
            cc.module.audioMgr.playUIClick();
            if(this._isClickWeiChat) {
                return;
            }
            this._isClickWeiChat = true;
            cc.module.wc.show("正在获取微信授权");
            cc.module.anysdkMgr.login();
        }
    },

    //点击手机登录按钮
    onBtnPhoneClick:function(){
        var phoneNum = this.phone.string;
        var password = this.password.string;
        var patrn = /1[3|5|7|8|]\d{9}/;
        if(patrn.test(phoneNum) && password){
            var data = {
                "phoneNum":phoneNum,
                "password":password
            };
            var agentId = null;
            if(cc.sys.isBrowser ){
                agentId = this.getQueryString("agentId"); 
                agentId ? data.agentId = agentId :null;
            }
            cc.module.socket.send(SEvents.SEND_PHONE_LOGIN,data);
            this.phone.string = '';
            this.password.string = '';
        }
        else if(!patrn.test(phoneNum)){
            cc.module.wc.show("请输入正确的手机号码",true);
        }
        else if(!password){
            cc.module.wc.show("请输入密码",true);
        }
    },

    onReceiveOnceRecord:function(data){
        // console.log(data);
        if(!data.endings.length){
            cc.module.wc.show("正在进入大厅...");
            cc.director.loadScene("hall");
            return;
        }
        var ending = JSON.parse(data.endings[0].ending);
        var Buffer = cc.module.Buffer;
        var recordItem = this.node.getChildByName("recordItem");
        var pop = recordItem.getComponent("Pop");
        pop.pop();
        var top = recordItem.getChildByName("frame").getChildByName("top");
        top.getChildByName("roomId").getComponent(cc.Label).string = "房间："+ending.roomId;
        top.getChildByName("creator").getComponent(cc.Label).string = "房主："+ new Buffer(ending.creatorName ,'base64').toString()//(new Buffer(getCreatorName(),'base64').toString());
        top.getChildByName("time").getComponent(cc.Label).string = "时间："+ending.time;
        top.getChildByName("jushu").getComponent(cc.Label).string = "局数："+ending.jushu+"局";
        
        var endings = recordItem.getChildByName("frame").getChildByName("endings");
        var list = endings.getChildByName("list");
        var recordNode = list.getChildByName("record_player");
        var btnClose = recordItem.getChildByName("frame").getChildByName("btn_close");
        var btnKaifang = recordItem.getChildByName("frame").getChildByName("kaifang");
        var btnCz = recordItem.getChildByName("frame").getChildByName("wx_cz");
        cc.module.utils.addClickEvent(btnClose,this.node,"Login","recordClose");
        cc.module.utils.addClickEvent(btnKaifang,this.node,"Login","onclickKaiFang");
        cc.module.utils.addClickEvent(btnCz,this.node,"Login","onclickChongZhi");

        list.removeAllChildren();
        if( ending ){
            ending.players.sort(function(a,b){return b.score - a.score})
            ending.players.forEach(function(player){
                var record_player = cc.instantiate(recordNode);
                record_player.getChildByName("score").getComponent(cc.Label).string = player.score;
                record_player.getChildByName("userId").getComponent(cc.Label).string = player.userId;

                record_player.getChildByName("name").getComponent(cc.Label).string = new Buffer(player.name,'base64').toString();
                var headimg = record_player.getChildByName("mask").getChildByName("headImg");
                var headimgCpt = headimg.getComponent(cc.Sprite);
                cc.module.imageCache.getImage(player.userId,function (spriteFrame) {
                    if(this.node) {
                        headimgCpt.spriteFrame = spriteFrame ? spriteFrame : this.defaultHeadImg;
                    }
                }.bind(this));
                list.addChild(record_player);
            }.bind(this)) 
        }

        function getCreatorName(){
            for(var i=0;i<ending.players.length;i++){
                var player = ending.players[i];
                if(player.isCreator || player.isHomeowner){
                    return player.name;
                }
            }
            return (new Buffer(ending.creatorName).toString("base64"));
        }
    },
    
    recordClose:function(){
        cc.module.wc.show("正在进入大厅...");
        cc.director.loadScene("hall");
    },

    onclickKaiFang:function(){
        cc.module.wc.show("正在加载...");
        cc.again = true;
        cc.director.loadScene("hall");
    },

    onclickChongZhi:function(){
        cc.module.wc.show("正在加载...");
        cc.recharge = true;
        cc.director.loadScene("hall");
    },

    onCheckBoxClick:function(event) {
        var btnWeiChatLoginCpt = cc.find("Canvas/login/btn_weichat_login").getComponent(cc.Button);
        var right = event.target.getChildByName("right");
        right.active = !right.active;
        btnWeiChatLoginCpt.interactable = right.active;
    },

    onShowAgain:function () {
        this._isClickWeiChat = false;
        var state = cc.module.anysdkMgr.getLoginState();
        if(state) {
            cc.module.wc.show("正在登录...");
        }
    },

    onDestroy:function () {
        cc.game.off(cc.game.EVENT_SHOW, this.onShowAgain, this);
        cc.module.socket.off(SEvents.RECEIVE_LOGIN_RESULT);
    }
});
