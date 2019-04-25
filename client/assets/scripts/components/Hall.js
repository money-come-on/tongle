cc.Class({
    extends: cc.Component,

    properties: {
        // lblNotice:cc.Label,
        sysHint:true,
        _waitingEnterRoom:false,
        _waitingEnterRoomDelayTime:5,

        /*-----------Panel------------*/
        _sharePanel:null,
        _setPanel:null,
        _selfPanel:null,
        _inputRoomNumPanel:null,
        // _clubPanel:null,
        _controlNode:null,
        _num:0,
    },

    onLoad: function () {
        cc.loader.onProgress = function(){};
        // this._clubPanel = this.node.getChildByName("club_panel");
        cc.module.self.seat = false;
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
        // this._clubPanel.active = false;
        cc.loginInOther = this.node.getChildByName("loginInOther");
        this.getHallMsg();
        this.addSocketEventHandler();
        cc.shareCallback = function () { this.onShareResp()}.bind(this);
        if(cc.sys.os == cc.sys.OS_ANDROID){ 
            cc.eventManager.addListener({ 
                event: cc.EventListener.KEYBOARD, 
                onKeyPressed: function(keyCode, event){ 
                    if (keyCode == cc.KEY.back) { 
                        cc.director.end(); 
                    } 
                },
                onKeyReleased:function(keyCode,event){}
            }, this.node);
        }
        this._num = 0;
        console.log(cc.module.self.clubId,cc.module.self.nickname);
    },

    start:function(){
        if(cc.sys.isBrowser){
            var bg = this.node.getChildByName("bg");
            var windowP = cc.director.getWinSizeInPixels();
            var scaleX = windowP.width/bg.width;
            var scaleY = windowP.height/bg.height;
            var scale = Math.max(scaleX,scaleY);
            bg.scaleX = scale;
            bg.scaleY = scale;
            cc.sys.localStorage.removeItem('roomId');
            cc.sys.localStorage.removeItem("recordId");
            cc.sys.localStorage.removeItem("shareTitle");
            cc.sys.localStorage.removeItem("shareDes");
            cc.sys.localStorage.removeItem("recordUuid");
            cc.sys.localStorage.removeItem("headimg");

            (window.shareToTimeLine && window.shareToTimeLine());
            (window.shareToSession && window.shareToSession());
        }
        if(cc.login && cc.login.roomId){
            this.joinRoom(cc.login.roomId);
            cc.login.roomId = "";
        }
        if(cc.again){
            if(cc.againType == "ssz"){
                this.onClickCreateRoom();
            }else if(cc.againType == "nn"){
                this.onClickGameTypeOfNN()
            }
            cc.again = false;
            cc.againType = false;
        }
        if(cc.recharge){
            this.onclickGems();
            cc.recharge = false;
        }
    },

    joinRoom:function (roomId) {
        this._waitingEnterRoom = true;
        this._waitingEnterRoomDelayTime = 5;
        cc.module.socket.send(SEvents.SEND_ENTER_ROOM,{roomId:roomId},true);
        cc.module.wc.show("正在加入房间"+roomId);
    },

    addSocketEventHandler:function () {
        cc.module.socket.on(SEvents.RECEIVE_HALL_MSG,this.onReceiveHallMsg.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_CREATE_ROOM_RESULT,this.onReceiveCreateRoomResult.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_ENTER_ROOM_RESULT,this.onReceiveEnterRoomResult.bind(this));
        cc.module.socket.on(SEvents.ADD_CHIP_EVENT,this.onReceiveAddChip.bind(this));   // 这里不建议写在俱乐部里面
        // cc.module.socket.on(SEvents.RECEIVE_RECORD,this.onReceiveRecord.bind(this));
        // cc.module.socket.on(SEvents.RECEIVE_ONCERECORD,this.onReceiveOnceRecord.bind(this));
        cc.module.socket.setOnReConnectListen(this.onReConnection.bind(this));

        cc.module.socket.on(SEvents.APPLY_JOIN_EVENT,this.onReceiveApplyJoin.bind(this));//申请加入
        cc.module.socket.on(SEvents.AGREE_JOIN_EVENT,this.onReceiveAgreeJoin.bind(this));
        cc.module.socket.on(SEvents.CREATE_CLUB_ROOM_EVENT,this.onReceiveClubCreateRoom.bind(this));//创建社区房间
        cc.module.socket.on(SEvents.GET_MSG_EVENT,this.onReceiveGetMsgEvent.bind(this));
    },
    
    onReceiveGetMsgEvent(data){//接收系统消息、个人消息
        console.log(data);
        var sysMsg = data.sysMessage;
        var personMsg = data.selfMessage;
    },

    onReConnection:function(){
        cc.director.loadScene("login");    
    },

    // 上分、下分
    onReceiveAddChip:function(data){
        console.log(data);
        if(data.errcode){
            cc.module.wc.show(data.errmsg,true);
            return;
        }
        var code = data.code;
        var addId = data.addId;
        var userId = data.userId;
        var chipNum = data.chipNum;
        var weath = cc.find("Canvas/wealth_panel");
        var gold = weath.getChildByName("gold_panel");
        var label = gold.getChildByName("lbl_gold");
        if(data.userId == cc.module.self.userId){
            //  馆主给自己上分
            cc.module.wc.show(code ==1?"上分成功":"下分成功",true);
        }
        // var clubCpt = this._clubPanel.getComponent("Club");
        // clubCpt && clubCpt.updataPlayerChip(data.addId,data.chipNum,code);

        if(addId != cc.module.self.userId){
            // 馆主给玩家上分，不是给自己就不用理会
            return
        }
        if(data.userId != addId){
            // 馆主不是给自己上分
            cc.module.wc.show("馆主已为您"+(code == 1 ? "上":"下")+data.chipNum+"分",true);
        }
        if(code == 1){
            var gold = label.getComponent(cc.Label).string;
            var total = Number(gold) + Number(data.chipNum);
            label.getComponent(cc.Label).string = total.toFixed(1)

        }else{
            var gold = label.getComponent(cc.Label).string;
            var total = Number(gold) - Number(data.chipNum);
            label.getComponent(cc.Label).string = total.toFixed(1)
            // label.getComponent(cc.Label).string -= Number(data.chipNum);
        }
    },

    onReceiveHallMsg:function (data) {
 
    },

    getHallMsg:function () {
        // if(!cc.notice){
        //     cc.module.socket.send(SEvents.SEND_HALL_MSG_REQ);
        // }else{
        //     this.lblNotice.string = cc.notice;
        // }
    },

    onClickNews:function(e){
        this.changeBottonColor(e);
        this.panelActiveFalse();
        this.ctorNode("message");
        this.loadCardAnim();
        cc.module.socket.send(SEvents.GET_MSG_EVENT,null,true);
    },

    onClickPaiju:function(e){
        this.changeBottonColor(e);
        this.panelActiveFalse();
        this.ctorNode("paiju");
        this.loadCardAnim();
        cc.module.socket.send(SEvents.GET_PLAYER_INCLUB_EVENT,null,true);
        cc.module.socket.send(SEvents.GET_PERSON_OF_GAME ,null,true);
        // cc.module.socket.send(SEvents.GET_CLUB_EVENT,{nameOrId:cc.module.self.clubId,userId:cc.module.self.userId},true);
    },

    onclickRecord:function(e){
        this.changeBottonColor(e);
        this.panelActiveFalse();
        this.ctorNode("zhanji");
        this.loadCardAnim();
        cc.module.socket.send(SEvents.SEND_GET_RECORD,null,true);
        cc.module.socket.send(SEvents.GET_WIN_DETAIL,null,true);
        // cc.module.socket.send(SEvents.SEND_GET_ONCERECORD,null,true);
    },

    onClickSelf:function(e){
        this.changeBottonColor(e);
        this.panelActiveFalse();
        cc.module.audioMgr.playUIClick();
        var selfPanel = this.node.getChildByName("self");
        selfPanel.active = true;
        cc.module.utils.toTop(selfPanel);
    },

    onClickJoinCommunity:function(){
        var joinCommunityPanel = this.node.getChildByName("join_community_panel");
        joinCommunityPanel.active = true;
        cc.module.utils.toTop(joinCommunityPanel);
    },

    onClickCreatCommunity:function(){
        var creatCommunityPanel = this.node.getChildByName("create_community_panel")
        creatCommunityPanel.active = true;
        cc.module.utils.toTop(creatCommunityPanel);
    },

    onClickToHall:function(){
        this.panelActiveFalse();
        this.changeBottonColor();
    },

    panelActiveFalse:function(){
        var msgPanel = this.node.getChildByName("message");
        var pjPanel = this.node.getChildByName("paiju");
        var zjPanel = this.node.getChildByName("zhanji");
        var selfPanel = this.node.getChildByName("self");
        var settingPanel = this.node.getChildByName("setting_panel");
        msgPanel && (msgPanel.active = false);
        pjPanel && (pjPanel.active = false);
        zjPanel && (zjPanel.active = false);
        selfPanel && (selfPanel.active = false);
        settingPanel && (settingPanel.active = false);
    },

    changeBottonColor:function(e){
        var menuPanel = this.node.getChildByName("meun_panel");
        menuPanel.children.forEach( function(child, index) {
            if(child.name != "btn_hall"){
                var childIcon = child.getChildByName("icon");
                childIcon.color = new cc.Color(255,255,255,255);
                var childLbl = child.getChildByName("lbl");
                childLbl.color = new cc.Color(255,255,255,255);
            }
        });
        if(e){
            var icon = e.target.getChildByName("icon");
            var title = e.target.getChildByName("lbl");
            icon.color = new cc.Color(252,224,169,255);
            title.color = new cc.Color(252,224,169,255);
        }
    },

    changeTitleColor:function(e){
        var title = e.target.parent;
        title.children.forEach( function(child,index) {
            var childLbl = child.getChildByName("lbl_title");
            childLbl.color = new cc.Color(252,224,169,255);
        });
        e.target.children[1].color = new cc.Color(0,0,0,255);
    },

    onClickZhanjiTitle:function(e,data){
        this.changeTitleColor(e);
    },

    onClickCreateTitle:function(e,data){
        this.changeTitleColor(e);
        var createPanel = e.target.parent.parent;
        var sszPanel = createPanel.getChildByName("ssz_panel");
        var nnPanel = createPanel.getChildByName("nn_panel");
        var bscPanel = createPanel.getChildByName("bsc_panel");
        sszPanel.active = false;
        nnPanel.active = false;
        bscPanel.active = false;
        data == "ssz" ? sszPanel.active = true : ( data =="nn" ? nnPanel.active = true : bscPanel.active = true);
    },

    onclickClubPanel:function(){
        cc.module.audioMgr.playUIClick();
        // this._clubPanel.active = true;
    },

    onClubPanel:function(){
        cc.module.audioMgr.playUIClick();
        cc.module.wc.show("俱乐部功能暂未开放",true);
        // this._clubPanel.active = true;
    },

    onClickBuyGem:function(e,data){
        var userId = cc.module.self.userId;
        // var url = "http://hh.2018yy.cn/douji/pay/submit.php?price="+ data +"&userId="+userId;
        // cc.sys.openURL(url);
    },

    onclickGems:function(){
        cc.module.audioMgr.playUIClick();
        var rechargeGems = this.node.getChildByName("rechargeGems");
        var pop = rechargeGems.getComponent("Pop");
        pop.pop();
    },

    onclickAgent:function(){
        cc.module.audioMgr.playUIClick();
        var agentPanel = this.node.getChildByName("agent_panel");
        var pop  = agentPanel.getComponent("Pop");
        pop.pop();
    },

    onClickSet:function () {
        this.ctorNode("setting_panel");
    },


    onClickHeadimg:function () {
        cc.module.audioMgr.playUIClick();
        if(!cc.isValid(this._selfPanel)) {
            var prefabMgr = this.node.getComponent("PrefabMgr");
            this._selfPanel = prefabMgr.ctorNodeByName("self_panel");
            this._selfPanel && this.node.addChild(this._selfPanel);
        }
        var pop = this._selfPanel.getComponent("Pop");
        pop.pop();

    },
    
    onClickJoinRoom:function () {
        if( cc.inGame ){
            cc.module.wc.show("正在进入房间");
            cc.director.loadScene(cc.inGame);
            return;
        };
        if(!cc.isValid(this._inputRoomNumPanel)) {
            var prefabMgr = this.node.getComponent("PrefabMgr");
            this._inputRoomNumPanel = prefabMgr.ctorNodeByName("input_roomnum_panel");
            if(this._inputRoomNumPanel) {
                this.node.addChild(this._inputRoomNumPanel);
                var inputRoomNumCpt = this._inputRoomNumPanel.getComponent("InputRoomNum");
                inputRoomNumCpt.setInputFinishCallback(this.joinRoom.bind(this));
            }
        }
        var pop = this._inputRoomNumPanel.getComponent("Pop");
        pop.pop();
    },

    onClickRecharge:function () {
        cc.module.audioMgr.playUIClick();
        this.onClickMall();
    },
    
    onClickCreateRoom:function(){
        this.panelActiveFalse();
        this.ctorNode("create_room_panel");
    },

    onClickMall(){
        this.ctorNode("mall_panel");  
    },

    onClickGoldGame(){
        this.ctorNode("gold_panel");  
    },

    onClickGemsGame(){
        this.ctorNode("diamond_panel");  
    },
    
    ctorNode(name){
        cc.module.audioMgr.playUIClick();
        if(!this[ name ] ){
            if( cc.isValid( cc.find(name,this.node) )){
                console.log("name")
                var pop = cc.find(name,this.node).getComponent("Pop");
                pop && pop.pop();
                return
            }
            var prefabMgr = this.node.getComponent("PrefabMgr");
            var panel = prefabMgr.ctorNodeByName(name);
            if(panel){
                this[ name ] = panel;
                this.node.addChild(panel);
            }
            else{
                cc.module.wc.show("暂未开放",!0);
                return
            }
        }
        var pop = this[ name ].getComponent("Pop");
        pop && pop.pop();
    },

    onReceiveCreateRoomResult:function (data) {
        if(cc.isValid(data.errcode)) {
            cc.module.wc.show(data.errmsg,true);
            return;
        }
        cc.module.wc.show(data.result);
        this.onReceiveEnterRoomResult(data);
    },
    
    onReceiveApplyJoin:function(data){//接收玩家申请加入的信息
        console.log(data);
        var communityPanel = this.node.getChildByName("community_panel");
        var comCpt = communityPanel.getComponent("CommunityChatRoom");
        this._num += 1;
        comCpt && comCpt.setMessage(this._num);
    },

    onReceiveEnterRoomResult:function (data) {
        this._waitingEnterRoom = false;
        if(data.errcode) {
            cc.module.wc.show(data.errmsg,true);
            return;
        }
        cc.loader.onProgress = function (completedCount, totalCount, item) {
            var percent = 100 * completedCount / totalCount;
            cc.module.wc.showPercent(percent);
        };
        
        if(data.type === "ssz") {
            cc.director.loadScene("ssz_game");
        }
        else if(data.type === "nn") {
            cc.director.loadScene("game");
        }
        else if(data.type === "cb"){
            cc.director.loadScene("cb_game");
        }
    },

    // onReceiveRecord:function(data){
    //     console.log(data,'----------413');
    // },

    // onReceiveOnceRecord:function(data){
    //     console.log(data,'----414');
    // },

    onReceiveAgreeJoin:function(data){
        console.log(data);
        if(data.joinor == cc.module.self.userId && data.agree){// 当前玩家进入俱乐部
            cc.module.socket.send(SEvents.GET_PLAYER_INCLUB_EVENT,null,true);
            this.showTips("成功加入社区");
        }
    },

    onReceiveClubCreateRoom:function(data){
        console.log(data,'-------448');
    },

    loadCardAnim:function(){
        var node = this.node.getChildByName("loadAnima");
        var anim = node.getComponent(cc.Animation);
        anim && anim.play("load_card");
        cc.module.utils.toTop(node);
    },

    onShareResp:function () {
        cc.module.socket.send(SEvents.SEND_SHARE,null,true);
    },

    onClickClose:function(e){
        var panel = e.target.parent.parent;
        panel.active = false;
    },

    showTips:function(msg){//设置弹窗信息
        var tipsPanel = this.node.getChildByName("tips_panel");
        tipsPanel.active = true;
        var tipsStr = cc.find("panel/info",tipsPanel);
        tipsStr.getComponent(cc.Label).string = msg;
        setTimeout(function(){
            tipsPanel.active = false;
        }.bind(this),2000);
        cc.module.utils.toTop(tipsPanel);
    },

    update: function (dt) {
        
    },

    onDestroy:function () {
        delete cc.shareCallback;
        cc.loader.onProgress = function(){};
        
        cc.module.socket.off(SEvents.ADD_CHIP_EVENT);
        cc.module.socket.off(SEvents.RECEIVE_HALL_MSG);
        cc.module.socket.on(SEvents.RECEIVE_GIFT_NOTIFY);
    }
});
