const playerSeat = {
    0:"player_bottom",
    1:"player_leftBottom",
    2:"player_leftTop",
    3:"player_top",
    4:"player_rightTop",
    5:"player_rightBottom",

    'bottom':"player_bottom",
    "left_bottom":"player_leftBottom",
    "left_top":"player_leftTop",
    "top":"player_top",
    "right_top":"player_rightTop",
    "right_bottom":"player_rightBottom",

    'player_bottom':"bottom",
    "player_leftBottom":"left_bottom",
    "player_leftTop":"left_top",
    "player_top":"top",
    "player_rightTop":"right_top",
    "player_rightBottom":"right_bottom",
};
const position = {
    0:"bottom",
    1:"left_bottom",
    2:"left_top",
    3:"top",
    4:"right_top",
    5:"right_bottom",

    "bottom":0,
    "left_bottom":1,
    "left_top":2,
    "top":3,
    "right_top":4,
    "right_bottom":5,
};
var seatToPlayer = {
    "bottom":null,
    "left_bottom":null,
    "left_top":null,
    "top":null,
    "right_top":null,
    "right_bottom":null,
}
var seatsPosition = {};
var SEAT = {};


var GAME_MODE = {
    "NNSZ":0,
    "GDZJ":1,
    "TBNN":2,
    "MPQZ":3,
    "JHNN":4,
    "GXNN":5
};
var BASE_SCORE = {
    0:[1,2],
    1:[2,4],
    2:[4,8]
};
var GRAB_BANKER = {
    0:1,
    1:2,
    2:3,
    3:4,
    4:5
};
var ROOM_STATUS = {
    "WAIT_BEGIN":"waitBegin",
    "WAIT_READY":"waitReady",
    "WAIT_PLAY_CARDS":"waitPlayCards",
    "WAIT_TWIST":"waitTwist",
    "WAIT_BETTING":"waitBetting",
    "WAIT_GRAB_BANKER":"waitGrabBanker"
};
var BASE_SCORE = {
    0:1,
    1:3,
    2:5
};
var MAX_GAME_NUM = {
    0:10,
    1:20,
    2:30
};
var GAME_MODE_STR = {
    0:"无牛下庄",
    1:"固定庄家",
    2:"通比牛牛",
    3:"明牌抢庄",
    4:"江华牛牛",
    5:"广西牛牛"
};
cc.Class({
    extends: cc.Component,

    properties: {
        pokerBackPrefab:cc.Prefab,
        bettingBtnPrefab:cc.Prefab,
        minPokerAtals:cc.SpriteAtlas,
        pokerBackSF:cc.SpriteFrame,
        nnTypeAndMultipleAtals:cc.SpriteAtlas,
        goldIconPrefab:cc.Prefab,
        defaultHeadimg:cc.SpriteFrame,
        timeOut:cc.Label,

        _roomId:null,
        _players:null,
        _playerCpts:[],
        _selfCpt:null,
        _voices:[],
        _voiceTime:null,
        _pokerNode:null,
        _gameNode:null,
        _twistNode:null,
        _config:null,
        _nowIndex:null,
        _maxGameNum:null,
        _creator:null,
        _btnTwist:null,
        _btnTurn:null,
        _btnHint:null,
        _btnShow:null,
        _btnGameReady:null,
        _btnInviate:null,
        _selfCards:[],//牌
        _selfNNType:null,//牛牛的类型
        _selfNNMultiple:null,//倍数,

        _btnLeave:null,
        _btnDissolve:null,
        _globalAnimNode:null,
        _notify:null,
        _dissolve:null,
        _alert:null,
        _bettingNode:null,
        _grabBankerNode:null,
        _banker:null,
        _ending:null,
        _isCompareIng:false,
        _endingNode:null
    },

    onLoad: function () {
        cc.loginInOther = this.node.getChildByName("loginInOther");
        this._gameNode = this.node.getChildByName("game");
        this._pokerNode = this._gameNode.getChildByName("poker");
        // this._globalAnimNode = this._gameNode.getChildByName("global_anim");
        this._players = this.node.getChildByName("players");
        this._playerCpts = this._players.getComponentsInChildren("Player");
       
        this.initView();
        this.initSeat();
        cc.inGame = false;
        cc.module.pokerMgr.setPokerAtlas(this.pokerAtals);
        cc.module.pokerMgr.setPokerBackSF(this.pokerBackSF);
        cc.module.pokerMgr.setNNTypeAndMultipleAtals(this.nnTypeAndMultipleAtals);
        cc.module.pokerMgr.setMinPokerAtlas(this.minPokerAtals);
        cc.module.pokerMgr.setPokerBackPrefab(this.pokerBackPrefab);
        cc.module.socket.setOnReConnectListen(this.onSocketReconnect.bind(this));
        cc.module.socket.send(SEvents.SEND_GET_GAME_INFO,{game:"nn"},true);
        cc.module.socket.on(SEvents.RECEIVE_GAME_INFO,this.onReceiveGameInfo.bind(this));
    },

    onSocketReconnect:function () {
        console.log('167');
        cc.director.loadScene("temp");
    },

    initView:function () {
        for(var seatName in seatToPlayer){
            seatToPlayer[seatName] = null;
        }
        var iconBtns = this.node.getChildByName("icon_btns");
        var panel = iconBtns.getChildByName("panel");
        this._endingNode = this.node.getChildByName("ending");
        this._btnLeave = panel.getChildByName("btn_leave");
        this._btnDissolve = panel.getChildByName("btn_dissolve");
        this._notify = this.node.getChildByName("notify");
        this._dissolve = this.node.getChildByName("dissolve_panel");
        this._alert = this.node.getChildByName("alert");
        this._btnTurn = this._gameNode.getChildByName("btn_turn");
        this._btnTwist = this._gameNode.getChildByName("btn_twist");
        this._btnShow = this._gameNode.getChildByName("btn_show");
        this._btnHint = this._gameNode.getChildByName("btn_hint");
        this._btnGameReady = this._gameNode.getChildByName("btn_ready");
        this._btnInviate = this._gameNode.getChildByName("btn_inviate");
        this._twistNode = this._gameNode.getChildByName("twist_panel");
        this._bettingNode = this._gameNode.getChildByName("betting_panel");
        this._grabBankerNode = this._gameNode.getChildByName("grab_banker_panel");
        this._grabBankerNode1 = this._gameNode.getChildByName("grab_banker_panel1");
        this._btnTurn.active = false;
        this._btnTwist.active = false;
        this._btnShow.active = false;
        this._btnHint.active = false;

        cc.module.utils.addClickEvent(this._btnTurn,this.node,"Game","turn");
        cc.module.utils.addClickEvent(this._btnTwist,this.node,"Game","twist");
        cc.module.utils.addClickEvent(this._btnShow,this.node,"Game","show");
        cc.module.utils.addClickEvent(this._btnHint,this.node,"Game","hint");
        cc.module.utils.addClickEvent(this._btnGameReady,this.node,"Game","ready");
        cc.module.utils.addClickEvent(this._btnDissolve,this.node,"Game","dissolve");
        this.alertHide();
    },
    
    initSeat:function(){
        this._players.children.forEach(function(panelNode,index){
            seatsPosition[ playerSeat[panelNode.name] ] = {"x":panelNode.x,"y":panelNode.y};
            seatsPosition[index] = {"x":panelNode.x,"y":panelNode.y}
            panelNode._seatName = playerSeat[panelNode.name];
            SEAT[panelNode.name] = {};
            var userInfo = panelNode.getChildByName("userInfo");
            var seat_down = panelNode.getChildByName("seat_down");
            seat_down._seatName = playerSeat[panelNode.name];
            seat_down._defaultName = playerSeat[panelNode.name];
            cc.module.utils.addClickEvent(seat_down,this.node,"Game","clickSeat");

            userInfo.children.forEach(function(child){
                SEAT[panelNode.name][child.name] = {"x":child.x,"y":child.y,"anchorX":child.anchorX};
            
            });
        }.bind(this));
    },

    startTimer:function(time,timerNode,callFun){
        var timer = cc.isValid(timerNode)?timerNode:this.node.getChildByName("timer");
        this.stopTimer(timer);
        timer.active = true;
        if(time){
            timer.getComponent(cc.Label).string = time;
            var reflash = timer.getChildByName("reflash");
            var action = cc.repeat(cc.rotateBy(2,360),time);
            reflash.runAction(action);
        }
        timer.callback = function(){
            time--;
            var labTime = timer.getComponent(cc.Label);
            labTime ? labTime.string = Math.floor(time):null ;
            if(time<0){
                if( callFun ){
                    callFun();
                }
                this.stopTimer(timer);
            }
        };
        this.schedule(timer.callback,1);
    },
    stopTimer:function(timerNode){
        var timer = cc.isValid(timerNode) ? timerNode:this.node.getChildByName("timer");
        var reflash = timer.getChildByName("reflash");
        timer.active = false;
        reflash.rotation = 0;
        reflash.stopAllActions();
        this.unschedule(timer.callback);
    },


    
// -------------------------------------------------            -------------------------------------------------
// -------------------------------------------------  set Event -------------------------------------------------
// -------------------------------------------------            -------------------------------------------------
    setWebShareMsg:function(config){
        if(cc.sys.isBrowser){
            var agentId = cc.module.agentId;
            var roomId = this._game.roomId;
            var gameMode = GAME_MODE_STR[config.mode]
            var baseScore = BASE_SCORE[config.baseScore];
            var numOfGame = MAX_GAME_NUM[config.maxGameNum];
            var shareTitle ="牛牛"+gameMode+" 底分"+baseScore;
            var uuid = this._game.uuid;
            var shareDes = " 房间号"+roomId+"，"+cc.module.self.nickname.slice(0,6)+(cc.module.agentId?(",代理号"+cc.module.agentId):"")+"在逗基十三水中创建了"+numOfGame+"局"+gameMode;

            cc.sys.localStorage.setItem("roomId",roomId);
            cc.sys.localStorage.setItem("shareTitle",shareTitle);
            cc.sys.localStorage.setItem("recordUuid",uuid);

            cc.sys.localStorage.setItem("shareTitle",shareTitle);
            cc.sys.localStorage.setItem("shareDes",shareDes);
            // agentId && cc.sys.localStorage.setItem("agentId",agentId);
            (window.shareToTimeLine && window.shareToTimeLine());
            (window.shareToSession && window.shareToSession());
        }
    },

    onClickInviate:function(){
        cc.module.audioMgr.playUIClick();
        var agentId = this._game.agentId;
        var roomId = this._game.roomId;
        var gameMode = GAME_MODE_STR[this._config.mode]
        var baseScore = BASE_SCORE[this._config.baseScore];
        var numOfGame = MAX_GAME_NUM[this._config.maxGameNum];
        var shareTitle ="牛牛"+gameMode+" 底分"+baseScore;
        var uuid = this._game.uuid;
        var shareDes = " 房间号"+roomId+"，"+cc.module.self.nickname.slice(0,6)+(cc.module.agentId?(",代理号"+cc.module.agentId):"")+"在逗基十三水中创建了"+numOfGame+"局"+gameMode;
        cc.module.anysdkMgr.shareToSession(shareTitle,shareDes,roomId,agentId);
    },

    setTopPlayer:function(data,sandUp){
        if(!cc.isValid(this._topPlayers)){
            this._topPlayers = this.node.getChildByName("top_player");
        }
        if(!this._topPlayersY){
            this._topPlayersY = this._topPlayers.y;
        }
        if(sandUp){  // 站起来
            var topPlayerChildren = this._topPlayers.getChildByName("players").children;
            for(var i=0;i<topPlayerChildren.length;i++){
                if(topPlayerChildren[i]._userId == data.userId){
                    return
                }
            }
            var prefabMgr = this.getComponent("PrefabMgr");
            var topPlayer = prefabMgr.ctorNodeByName("ssz_player");
            topPlayer._userId = data.userId;
            var name = topPlayer.getChildByName("mask").getChildByName("name");
            var headimg = topPlayer.getChildByName("player_mask").getChildByName("headimg");
            var headImgCpt = headimg.getComponent(cc.Sprite);
            name.getComponent(cc.Label).string = data.name;
            cc.module.imageCache.getImage(data.userId,function (spriteFrame) {
                if(!cc.isValid(this.node)) {
                    return;
                }
                cc.isValid(spriteFrame) ? (headImgCpt.spriteFrame = spriteFrame) : null;
            }.bind(this));
            this._topPlayers.getChildByName("players").addChild(topPlayer);
            if( this._topIsHidden ){ // 如果是隐藏的情况 则显示
                var Y = this._topPlayersY;
                this._topIsHidden = false;
                var action = cc.moveTo(0.5,cc.v2(70,Y));
                this._topPlayers.runAction(action);
            }
        }else{ // 坐下
            var topPlayers = this._topPlayers.children[0].children;
            topPlayers.forEach(function(topPlayer){
                if(topPlayer._userId == data.userId){
                    topPlayer.removeFromParent(true);
                }
            });
            if(topPlayers.length<=0 ){
                this._topIsHidden = true
                var Y = this._topPlayersY+this._topPlayers.height;
                var action = cc.moveTo(0.5,cc.v2(70,Y));
                this._topPlayers.runAction(action);
            }
        }
    },

    setplayerSeat:function(seatName,player){
        this._players.children.forEach(function(playerPanel){
            if(playerPanel.name == playerSeat[seatName]){
                var playerCpt = playerPanel.getComponent("Player");
                if( (playerCpt && playerCpt._userId ) || this._isCompareIng){
                    playerCpt.showInfo(player,function(){
                        this.setInfo(player);
                    });
                }else{
                    playerCpt && playerCpt.setInfo(player/*,isOnRight*/);
                }
                var isSelf = this.isSelf(playerCpt._userId);
                // isSelf ? this._selfCpt = playerCpt:null;
            }
        }.bind(this))
    },

    setRoomTimeOut:function(time){
        clearInterval(this._timeOut);
        var H = Math.floor(time/60);
        var S = time- Math.floor(time/60)*60;
        S = S<10?"0"+S:S;
        this.timeOut.string = (H+":"+S);

        this._timeOut = setInterval(function(){
            time--;
            H = Math.floor(time/60);
            S = time- Math.floor(time/60)*60;
            S = S<10?"0"+S:S;
            this.timeOut.string = (H+":"+S);
            if(time<=0){
                clearInterval(this._timeOut);
                this.timeOut.string = "";
            }
        }.bind(this),1000);
    },

    seatAnim:function(seatName,data){
        var runTime = 0.2;
        if(seatName != "bottom"){               // 点击的位置不是在最底下的
            var seatIndex = position[seatName]; // 假设当前玩家选择的桌位/3
            this._players.children.forEach(function(panel){
                var action,seatNum,SP;
                seatNum = position[panel._seatName];

                var finished =  cc.callFunc(function(){ 
                    var userInfo = panel.getChildByName("userInfo");
                    var playerCpt = panel.getComponent("Player");
                    // playerCpt && playerCpt.setIsRight(panel._seatName == "right");
                }.bind(this));

                var setPlayer = cc.callFunc(function(){
                    panel._seatName = position[SP];  // 给点击的位置名称重新命名
                    var userInfo = panel.getChildByName("userInfo");
                    var seat_down = panel.getChildByName("seat_down");
                    seat_down._seatName = position[SP];

                    if(panel._seatName == "right_top" || panel._seatName == "right_bottom"){
                        userInfo.getChildByName("bg").setScale(cc.v2(-1, 1));
                        userInfo.getChildByName("bg").setPosition(cc.v2(-80, 0));
                        userInfo.getChildByName("lblScore").setPosition(cc.v2(-138, -17));
                        userInfo.getChildByName("nickname").setPosition(cc.v2(-67, 21));
                        userInfo.getChildByName("nickname").anchorX = 1;
                        userInfo.getChildByName("nickname").getComponent(cc.Label).horizontalAlign = 2;
                        userInfo.getChildByName("deal").anchorX = 1;
                        userInfo.getChildByName("voice").setScale(cc.v2(1, 1));
                    }else{
                        userInfo.getChildByName("bg").setScale(cc.v2(1, 1));
                        userInfo.getChildByName("bg").setPosition(cc.v2(80, 0));
                        userInfo.getChildByName("lblScore").setPosition(cc.v2(70, -17));
                        userInfo.getChildByName("nickname").setPosition(cc.v2(67, 21));
                        userInfo.getChildByName("nickname").anchorX = 0;
                        userInfo.getChildByName("nickname").getComponent(cc.Label).horizontalAlign = 0;
                        userInfo.getChildByName("deal").anchorX = 0;
                        userInfo.getChildByName("voice").setScale(cc.v2(-1, 1));
                    };

                    var dealNode = userInfo.getChildByName("deal");
                    var showNode = userInfo.getChildByName("show");
                    
                    if(panel._seatName == "bottom"){
                        dealNode.getComponent(cc.Layout).spacingX = -50;
                        dealNode.children.forEach(function(card){
                            card.width = 123 ;
                            card.height = 153;
                        });
                        showNode.getComponent(cc.Layout).spacingX = -40;
                        var group1 = showNode.getChildByName("group1");
                        group1.getComponent(cc.Layout).spacingX = -70;
                        group1.children.forEach(function(card){
                            card.width = 123 ;
                            card.height = 153;
                        });
                        var group2 = showNode.getChildByName("group2");
                        group2.getComponent(cc.Layout).spacingX = -70;
                        group2.children.forEach(function(card){
                            card.width = 123 ;
                            card.height = 153;
                        });
                        

                    }else{
                        dealNode.getComponent(cc.Layout).spacingX = -40;
                        dealNode.children.forEach(function(card){
                            card.width = 86 ;
                            card.height = 107;
                        }); 
                        showNode.getComponent(cc.Layout).spacingX = -30;
                        var group1 = showNode.getChildByName("group1");
                        group1.getComponent(cc.Layout).spacingX = -50;
                        group1.children.forEach(function(card){
                            card.width = 86 ;
                            card.height = 107;
                        });
                        var group2 = showNode.getChildByName("group2");
                        group2.getComponent(cc.Layout).spacingX = -50;
                        group2.children.forEach(function(card){
                            card.width = 86 ;
                            card.height = 107;
                        });
                    }

                    userInfo.children.forEach(function(child){
                        child.x = SEAT[ playerSeat[panel._seatName] ][child.name].x;
                        child.y = SEAT[ playerSeat[panel._seatName] ][child.name].y;
                        child.anchorX = SEAT[ playerSeat[panel._seatName] ][child.name].anchorX;
                    }.bind(this))

                }.bind(this));
                var deleteNum = 3- Math.abs(seatIndex-3);
                if(seatIndex>3){
                    SP = (seatNum+deleteNum < 6)?seatNum+deleteNum:seatNum+deleteNum-6;
                    action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                }else if(seatIndex<3){
                    SP = (seatNum-deleteNum < 0 )?seatNum-deleteNum+6:seatNum-deleteNum;
                    action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                }else if( seatIndex ==3 ){  // seatIndex ==2  
                    if(seatNum<3){
                        SP = seatNum+3;
                        action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                    }else{
                        SP = seatNum-3;
                        action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer); 
                    }
                }
                panel.runAction(cc.sequence(action,finished));
               
            }.bind(this));
        }
    },

    setPlayer:function (data) {
        if(!cc.isValid(this._topPlayers)){
            this._topPlayers = this.node.getChildByName("top_player");
        }
        var selfInfo = this.getself();
        data.players.forEach(function (player) {
            cc.module.imageCache.setImage(player.userId,player.headimg);   
            if(!player.seat || seatToPlayer[player.seat]){
                var prefabMgr = this.getComponent("PrefabMgr");
                var topPlayer = prefabMgr.ctorNodeByName("ssz_player");
                var name = topPlayer.getChildByName("mask").getChildByName("name");
                var headimg = topPlayer.getChildByName("player_mask").getChildByName("headimg");
                var headImgCpt = headimg.getComponent(cc.Sprite);
                name.getComponent(cc.Label).string = player.name;
                topPlayer._userId = player.userId;
                cc.loader.load({url:player.headimg,type:"jpg"},function (err,tex) {
                    if(err) {
                        this.getImage(player.userId,function(tex){
                            headImgCpt.spriteFrame = tex;
                        });
                        return;
                    }
                    headImgCpt.spriteFrame = new cc.SpriteFrame(tex);
                }.bind(this));

                this._topPlayers.getChildByName("players").addChild(topPlayer);
                return;
            }

            seatToPlayer[player.seat] = player.userId;
            this.setplayerSeat(player.seat,player);
            if(this.isSelf(player.userId)){
                cc.module.self.seat = player.seat;
            }
        }.bind(this));

        if(selfInfo && selfInfo.seat){
            setTimeout(function(){
                this.seatAnim(selfInfo.seat,selfInfo);
            }.bind(this),1000)
        }

        var topPlayers = this._topPlayers.getChildByName("players");
        if(topPlayers.children.length<=0){
            if(!this._topPlayersY){
                this._topPlayersY = this._topPlayers.y;
            }
            var Y = this._topPlayersY+this._topPlayers.height;
            var action = cc.moveTo(0.5,cc.v2(70,Y));
            this._topPlayers.runAction(action);
            this._topIsHidden = true;
        }
    },

    getImage:function(userId,callback){
         cc.module.imageCache.getImage(userId,function (spriteFrame) {
            if(!this.node) {
                return;
            }
            spriteFrame && callback(spriteFrame);
        }.bind(this));
    },
    setGameInfo:function (data) {
        this._roomId = data.roomId;
        this._config = data.config;
        this._nowIndex = data.nowIndex;
        this._creator = data.creator;
        this._maxGameNum = data.maxGameNum;
    },

    setGameRule:function (data) {
        var gameRule = this.getComponent("GameRule");
        gameRule.setAll(data);
    },

    setPrepare:function (data) {
        var readyCount = 0;
        var self = 0;
        data.players.forEach(function (player) {
            if(player.readyStatus) {
                readyCount ++;
            }
            if(player.userId != cc.module.self.userId) {
                return;
            }
            self = player;
        }.bind(this));
    },

// ------------------------------------------------- onclick Event -------------------------------------------------
    clickSeat:function(e,data){
        if(cc.module.self.seat){
            return;
        }
        var seat = e.target._defaultName;
        var seatName = e.target._seatName;
        var data = {"seat":seat,"seatName":seatName};
        this._clickSeat = data;
        cc.module.socket.send(SEvents.Nn.PLAYER_SEAT_EVENT,data,true);
    },

    onclickIconBtns:function(e,num){
        var iconBtns = this.node.getChildByName("icon_btns");
        iconBtns.active = num == 1;
    },

    onclickSandUp:function(e,data){
        var iconBtns = this.node.getChildByName("icon_btns");
        iconBtns.active = false;
        var info = {
            code:(data?data:0),
            userId:cc.module.self.userId
        }
        cc.module.socket.send(SEvents.Nn.PLAYER_STANDUP_EVENT,info,true); 
    },

    dissolve:function (e) {
        var iconBtns = this.node.getChildByName("icon_btns");
        iconBtns.active = false;
        if(!cc.module.self.seat){
            var notifyCpt = this._notify.getComponent("Notify");
            notifyCpt.setNotify("旁观不能解散房间");
            var pop = this._notify.getComponent("Pop");
            pop.pop();
            return;
        }
        if(!cc.isValid(this._askLeavePanel)) {
            var prefabMgr = this.getComponent("PrefabMgr");
            this._askLeavePanel = prefabMgr.ctorNodeByName("ssz_ask_leave_panel");
            if(cc.isValid(this._askLeavePanel)) {
                this.node.addChild(this._askLeavePanel);
                var panel = this._askLeavePanel.getChildByName("panel");
                var btnAsk = panel.getChildByName("btn_ask");
                cc.module.utils.addClickEvent(btnAsk,this.node,"Game","onClickAskLeaveConfirm","1");
            }
        }
        if(this._askLeavePanel) {
            var hint = this._askLeavePanel.getChildByName("panel").getChildByName("hint");
            var msg = "是否解散房间";
            hint.getComponent(cc.Label).string = msg;
            var pop = this._askLeavePanel.getComponent("Pop");
            pop.pop();
        }
    },

    onClickBetting:function (e) {
        var target = e.target;
        var betting = target._score;
        if(betting != null) {
            cc.module.socket.send(SEvents.Nn.SEND_BETTING,{betting:betting},true);
            target.parent.children.forEach(function (btn) {
                btn.getComponent(cc.Button).interactable = false;
            });
            this.alert("正在确定下注底分");
        }
    },

    onClickGrab1:function (e,data) {
      if(parseInt(data)==0){
          cc.module.socket.send(SEvents.Nn.SEND_GRAB,{grab:0},true);
          //this.alert("等待其他玩家选择抢庄");
      }else{
          cc.module.socket.send(SEvents.Nn.SEND_GRAB,{grab:1},true);
      }
        this._grabBankerNode1.active = false;
        //this.grabBanker1();
    },

    onClickGrab:function (e) {
        //var target = e.target;
        //var grab = target._grab;
        //if(grab != null) {
        //    //cc.module.socket.send(SEvents.Nn.SEND_GRAB,{grab:grab},true);
        //    cc.module.socket.send(SEvents.Nn.SEND_BETTING,{betting:grab},true);
        //    target.parent.children.forEach(function (btn) {
        //        btn.getComponent(cc.Button).interactable = false;
        //    });
        //    this.alert("等待其他玩家选择抢庄");
        //}
    },

    onclickAgreeResult:function(e,result){
        var userId = cc.module.self.userId;
        var isAgree = result != "0";
        var btnRefuse = this._agreeLeave.getChildByName("panel").getChildByName("btn_refuse");
        var btnAgree = this._agreeLeave.getChildByName("panel").getChildByName("btn_agree");
        btnRefuse.active = false;
        btnAgree.active = false;
        cc.module.socket.send(SEvents.Nn.IS_AGREE_LEAVE_EVENT,{"userId":userId,"isAgree":isAgree});
    },

    onClickAskLeaveConfirm:function (e,data) {
        cc.module.socket.send(SEvents.Nn.SEND_LEAVE,{"userId":cc.module.self.userId,"destroy":data==1},true);
        var pop = this._askLeavePanel.getComponent("Pop");
        pop.unpop();
    },

    //邀请好友
    inviteFriend:function () {
        var title = "牛牛 房号【" + this._roomId + "】 一起来玩吧！";
        var gameRule = this.getComponent("GameRule");
        var content = gameRule.getRule();
        cc.module.anysdkMgr.shareToSession(title,content);
    },

    ready:function () {
        this._btnGameReady.active = false;
        this._btnInviate.active = false;
        cc.module.socket.send(SEvents.Nn.SEND_READY,null,true);
    },

    leave:function () {
        var iconBtns = this.node.getChildByName("icon_btns");
        iconBtns.active = false;
        cc.module.socket.send(SEvents.Nn.SEND_LEAVE,{"userId":cc.module.self.userId,"destroy":false},true);
    },

    gameBegin:function () {
        cc.module.socket.send(SEvents.Nn.SEND_GAME_BEGIN,null,true);
    },

    onclickAgreeGem:function(e,data){
        var isAgree = (data != 0);
        var data = this._clickSeat;
        data.isAgree = isAgree;
        cc.module.socket.send(SEvents.Nn.IS_AGREEGEM_EVENT,data,true);
    },


// ------------------------------------------------- onReceive event -------------------------------------------------

    addSocketEventHandlers:function() {
        cc.module.socket.on(SEvents.RECEIVE_QUICK_CHAT,this.onReceiveQuickChat.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_VOICE_MSG,this.onReceiveVoice.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_EMOJI_MSG,this.onReceiveEmoji.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_READY,this.onReceiveReady.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_PLAYER_ENTER,this.onReceivePlayerEnter.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_PLAYER_LEAVE,this.onReceivePlayerLeave.bind(this));

        cc.module.socket.on(SEvents.Nn.RECEIVE_DISSOLVE_NOTIFY,this.onReceiveDissolveNotify.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_DISSOLVE_REQUEST,this.onReceiveDissolveRequest.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_DISSOLVE_AGREE,this.onReceiveDissolveAgree.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_DISSOLVE_REFUSE,this.onReceiveDissolveRefuse.bind(this));

        cc.module.socket.on(SEvents.RECEIVE_PLAYER_ONLINE_STATUS_CHANGE,this.onReceiveOnlineChange.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_GAME_BEGIN,this.onReceiveGameBegin.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_RANDOM_BANKER_CONFIRM,this.onReceiveRandomBankerConfirm.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_BETTING,this.onReceiveBetting.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_DEAL,this.onReceiveDeal.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_ALL_PLAYER_BETTING,this.onReceiveAllPlayerBetting.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_PLAY_CARDS,this.onReceivePlayCards.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_COMPARE_FINISH,this.onReceiveCompareFinish.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_PLEASE_BETTING,this.onReceivePleaseBetting.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_GAME_INDEX_CHANGE,this.onReceiveGameIndexChange.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_GRAB_BANKER,this.onReceiveGrabBanker.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_SEE_ALL_CARDS,this.onReceiveSeeAllCards.bind(this));
        cc.module.socket.on(SEvents.Nn.RECEIVE_GAME_ENDING,this.onReceiveGameEnding.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_PROMPT,this.onReceivePrompt.bind(this));

        cc.module.socket.on(SEvents.Nn.PLAYER_SEAT_EVENT,this.onReceivePlayerSeat.bind(this));
        cc.module.socket.on(SEvents.Nn.PLAYER_STANDUP_EVENT,this.onReceivePlayerSandUp.bind(this));
        cc.module.socket.on(SEvents.Nn.ASK_LEAVE_EVENT,this.onReceiveAskLeave.bind(this));
        cc.module.socket.on(SEvents.Nn.IS_AGREEGEM_EVENT,this.onReceiveIsAgreeGem.bind(this));
        cc.module.socket.on(SEvents.Nn.DESTROY_EVENT,this.onReceiveDissolve.bind(this));
        cc.module.socket.on(SEvents.Nn.IS_AGREE_LEAVE_EVENT,this.onReceiveIsAgreeLeave.bind(this));
        cc.module.socket.on(SEvents.Nn.PLAYER_IN_SEAT_EVENT,this.onReceivePlayerInSeat.bind(this));
        cc.module.socket.setOnReConnectListen(this.onReConnection.bind(this));

    },
    onReConnection:function(){
        clearInterval(this._timeOut);
        cc.director.loadScene("login");
    },

    onReceiveDissolve:function(data){
    },
    onReceiveIsAgreeGem:function(data){
        if(!this._gemTs){
            var prefabMgr = this.getComponent("PrefabMgr");
            this._gemTs = prefabMgr.ctorNodeByName("gemTs");
            var panel = this._gemTs.getChildByName("panel");
            var btnClose = panel.getChildByName("close");
            var btnRefuse = panel.getChildByName("refuse");
            var btnAgree = panel.getChildByName("btn");
            cc.module.utils.addClickEvent(btnRefuse,this.node,"Game","onclickAgreeGem","0");
            cc.module.utils.addClickEvent(btnClose,this.node,"Game","onclickAgreeGem","0");
            cc.module.utils.addClickEvent(btnAgree,this.node,"Game","onclickAgreeGem","1");
            this.node.addChild(this._gemTs);
        }
        var pop = this._gemTs.getComponent("Pop");
        pop.pop();
        var panel = this._gemTs.getChildByName("panel");
        var description = panel.getChildByName("description");
        var gem = panel.getChildByName("gem");
        gem.getComponent(cc.Label).string = data.rate ?"支付钻石："+data.rate:"砖石不足，不能坐下";
       
    },

    onReceivePlayerInSeat:function(data){
        this.notify(data+"已经在该位置坐下了");
    },

    onReceiveIsAgreeLeave:function(data){
        if(!cc.isValid(this._agreeLeave)){
            var prefabMgr = this.getComponent("PrefabMgr");
            this._agreeLeave = prefabMgr.ctorNodeByName("ssz_agree_leave");
            this.node.addChild(this._agreeLeave);
        }
        var panel = this._agreeLeave.getChildByName("panel");
        var playersPanel = panel.getChildByName("players");
        playersPanel.children.forEach(function(playerPanel){
            if(playerPanel.userId == data.userId){
                var lbl_agree = playerPanel.getChildByName("lbl_agree");
                lbl_agree.getComponent(cc.Label).string = data.isAgree?"同意":"拒绝";
            };
        });
        if(!data.isAgree){
            if(this._agreeLeave){
                var panel = this._agreeLeave.getChildByName("panel");
                var timer = panel.getChildByName("timer");
                this.stopTimer(timer);
                this._agreeLeave.destroy();  
            }
            this._agreeLeave = null;
            this.notify(data.name+"不同意退出");
        }
    },  

    onReceiveAskLeave:function(data){
        var userId = data.userId;
        var time = data.dissolveTime-1;
        if(!this._agreeLeave){
            var prefabMgr = this.getComponent("PrefabMgr");
            this._agreeLeave = prefabMgr.ctorNodeByName("ssz_agree_leave");
            this.node.addChild(this._agreeLeave);
        }
        var panel = this._agreeLeave.getChildByName("panel");
        var title = panel.getChildByName("title");
        var btnRefuse = panel.getChildByName("btn_refuse");
        var btnAgree = panel.getChildByName("btn_agree");
        var playersPanel = panel.getChildByName("players").children;
        var timer = panel.getChildByName("timer");
        var description = panel.getChildByName("description");
        this.startTimer(time,timer,function(){ });

        var isInDestory = false;  //参与解散房间
        var applyDestortName = "";
        data.players.forEach(function(player,index){
            var lbl_name = playersPanel[index].getChildByName("lbl_name");
            var lbl_agree = playersPanel[index].getChildByName("lbl_agree");
            var headimg = playersPanel[index].getChildByName("headimg");
            lbl_name.getComponent(cc.Label).string = player.name;
            lbl_agree.getComponent(cc.Label).string = player.isAgree?"同意":"请等待...";
            var headImgCpt = headimg.getComponent(cc.Sprite);
            cc.module.imageCache.getImage(player.userId,function (spriteFrame) {
                if(!cc.isValid(this.node)) {
                    return;
                }
                cc.isValid(spriteFrame) ? (headImgCpt.spriteFrame = spriteFrame) : null;
            }.bind(this));

            playersPanel[index].active = true;
            playersPanel[index].userId = player.userId;
            if(player.userId === cc.module.self.userId){
                isInDestory = true;
            }
            if(userId === player.userId){
                applyDestortName = player.name;
            }
        }.bind(this));

        description.active = false;
        if(userId === cc.module.self.userId ){
            btnRefuse.active = false;
            btnAgree.active = false;
        }else{
            btnRefuse.active = true;
            btnAgree.active = true;
            cc.module.utils.addClickEvent(btnRefuse,this.node,"Game","onclickAgreeResult","0");
            cc.module.utils.addClickEvent(btnAgree,this.node,"Game","onclickAgreeResult","1");
        }
       
        if(!isInDestory){
            btnRefuse.active = false;
            btnAgree.active = false;
            description.active = true;
            description.getComponent(cc.Label).string = "【"+applyDestortName+"】申请解散房间\n旁观者不参与解散房间\n请等待！";
        }
        if(this._agreeLeave){
            var pop = this._agreeLeave.getComponent("Pop");
            pop.pop();
        } 
    },

    onReceivePlayerSeat:function(data){
        var seat = data.seat;           // 玩家选择的座位
        var seatName = data.seatName;   // 点击的座位
        var isSelf = this.isSelf(data.userId);
        var players = this._game.players;
        for (var i=0;i<players.length;i++){
            if(players[i].userId == data.userId ){
                players[i].seat = seat;
            }
        }
        this.setTopPlayer(data,false);
        this.setplayerSeat(seat,data);
        isSelf && seatName != "bottom" && this.seatAnim(seatName,data);
        isSelf && (cc.module.self.seat = seat,this.showGameReadyOfBtn() );
        isSelf && this._game.nowIndex>0?this._btnInviate.active=false:this._btnInviate.active=true;
        isSelf && (this._selfCpt = this.getPlayerCptByName(playerSeat[seat]))
    },

    onReceivePlayerSandUp:function(data){
        var userId = data.userId;
        var isSelf = this.isSelf(data.userId);
        var players = this._game.players;
        for (var i=0;i<players.length;i++){
            if(players[i].userId == data.userId ){
                players[i].seat = false;
            }
        }
        var playerCpt = this.getPlayerCptByName(playerSeat[data.seat]);
        if(cc.isValid(playerCpt)){
            if(playerCpt._isCompareIng){  //  如果是正在比牌
                //  则隐藏头像
                playerCpt.hideInfo(function(){
                    this.reset();
                });
            }else{
                playerCpt.reset();
            }
           
        }
        for(var prop in seatToPlayer){
            if(userId == seatToPlayer[prop] ){
                seatToPlayer[prop] =  null;
            }
        }
        isSelf?(this._selfCpt = null, cc.module.self.seat = false,this._btnGameReady.active = false):null;
        isSelf?this._btnInviate.active=false:null;
        this.setTopPlayer(data,true);
    },

    onReceivePrompt:function (data) {
        var prompt = data.prompt;
        this.alert(prompt);
    },

    onReceiveGameEnding:function (data) {
        clearInterval(this._timeOut);
        this._ending = data;
        if(!this._isCompareIng) {
            this.ending(data);
        }
    },

    onReceiveSeeAllCards:function (data) {
        if(this._selfNNType != null) {
           this._selfCpt && this._selfCpt.setType(this._selfNNType);
        }
        this._selfCpt && this._selfCpt.setMultiple(this._selfNNMultiple);
        this._playerCpts.forEach(function (playerCpt) {
            if(playerCpt.getAble() && data[playerCpt._userId]) {
                playerCpt.setReady(false);
                playerCpt.setTwist( data[playerCpt.getUserId()] ? true:false );
            }
        });
        if(this._config.mode == GAME_MODE.MPQZ)this.startTimer(this._countdown||5);
        if(!cc.module.self.seat){
            return;
        }
        data[cc.module.self.userId] && this.showTwistAndTurnOfBtn();
    },

    onReceiveGrabBanker:function (data) {
        var userId = data.userId;
        if(!userId) {
            return;
        }
        var grabPlayerCpt = this.getPlayerCpt(userId);
        grabPlayerCpt && grabPlayerCpt.setType(data.grab>0?"grab_banker":"no_grab_banker");
        grabPlayerCpt && grabPlayerCpt.setMultiple(null);
        grabPlayerCpt && grabPlayerCpt.showTypeAndMultiple();
        if(userId == cc.module.self.userId) {
            this._grabBankerNode1.active = false;
            this._grabBankerNode.active = false;
            this._bettingNode.active = false;
        }
    },

    onReceiveGameIndexChange:function (data) {
        this._nowIndex = data.nowIndex;
        this._game.nowIndex = data.nowIndex;
        this._game.nowIndex>0?this._btnInviate.active=false:this._btnInviate.active=true;
        var gameRule = this.getComponent("GameRule");
        gameRule.setNowIndex(data.nowIndex);
    },

    onReceivePleaseBetting:function (data) {
        if(data.banker) {
            this._banker = data.banker;
        }
        this._grabBankerNode1.active = false;
        this._grabBankerNode.active = false;
        this._bettingNode.active = false;
        this.stopTimer();
        //如果有庄家，播放庄家改变的动画，然后显示下注按钮
        if(data.banker && data.lastBanker && data.banker!=data.lastBanker) {
            //播放庄家图标移动动画
            var lastBankerCpt = this.getPlayerCpt(data.lastBanker);
            var bankerCpt = this.getPlayerCpt(data.banker);
            var lastBankerIcon = lastBankerCpt.getBankerIcon();
            var bankerIcon = bankerCpt.getBankerIcon();
            var lastBankerIconWorldAR = lastBankerIcon.convertToWorldSpaceAR(cc.v2(0,0));
            var detail = bankerIcon.convertToNodeSpaceAR(lastBankerIconWorldAR);
            var toX = bankerIcon.x;
            var toY = bankerIcon.y;
            bankerIcon.x += detail.x;
            bankerIcon.y += detail.y;
            lastBankerIcon.active = false;
            bankerIcon.active = true;
            var moveAction = cc.moveTo(0.5,toX,toY);
            var callfun = cc.callFunc(function () {
            }.bind(this));
            bankerIcon.runAction(cc.sequence([moveAction,callfun]));
        }
        else {
            if(this._config.mode==GAME_MODE.GDZJ || this._config.mode==GAME_MODE.JHNN || this._config.mode==GAME_MODE.GXNN) {
                var bankerCpt = this.getPlayerCpt(data.banker);
                if(bankerCpt) {
                    bankerCpt.setBanker(true);
                }
            }
            else if(this._config.mode == GAME_MODE.MPQZ) {
                this._playerCpts.forEach(function (playerCpt) {
                    if(playerCpt.getAble()) {
                        playerCpt.setBanker(playerCpt.getUserId() == data.banker);
                        playerCpt.hideTypeAndMultiple();
                    }
                });
                this.betting();
            }
            cc.module.audioMgr.playSFX("ding_ding.mp3");
        }
    },

    onReceiveCompareFinish:function (data) {
        this.stopTimer();
        this.alertHide();
        this._isCompareIng = true;
        var waitTime = 0;
        var gold = this._gameNode.getChildByName("gold");
        gold.removeAllChildren();
        if(this._config.mode == GAME_MODE.JHNN) {
            cc.module.audioMgr.playSFX("ding_ding.mp3");
            this._playerCpts.forEach(function (playerCpt) {
                if(playerCpt.getUserId() && data.detail && data.detail[playerCpt.getUserId()]) {
                    playerCpt.showObain(data.detail[playerCpt.getUserId()]);
                }
            }.bind(this));
            waitTime += 2;
        }
        else {
            data.winAndLose.forEach(function (group) {
                if(group.length > 0 ) {
                    var audilDealy = cc.delayTime(waitTime);
                    var audioCallfun = cc.callFunc(function () {
                        cc.module.audioMgr.playSFX("gold2.mp3");
                    });
                    var audioSeq = cc.sequence([audilDealy,audioCallfun]);
                    this.node.runAction(audioSeq);
                }
                group.forEach(function (item) {
                    var winnerCpt = this.getPlayerCpt(item.winner);
                    var loserCpt = this.getPlayerCpt(item.loser);
                    var winnerHeadimg = winnerCpt.getHeadimg().node;
                    var loserHeadimg = loserCpt.getHeadimg().node;
                    var loserHeadimgWorldAR = loserHeadimg.convertToWorldSpaceAR(cc.v2(0,0));
                    var winnerHeadimgWorldAR = winnerHeadimg.convertToWorldSpaceAR(cc.v2(0,0));
                    for(var i=0; i<10 ; i++) {
                        var goldIcon = cc.instantiate(this.goldIconPrefab);
                        goldIcon.opacity = 0;
                        gold.addChild(goldIcon);
                        var detail = goldIcon.convertToNodeSpaceAR(loserHeadimgWorldAR);
                        goldIcon.x += detail.x+Math.floor(Math.random()*30*(Math.random()>0.5?-1:1));
                        goldIcon.y += detail.y+Math.floor(Math.random()*30*(Math.random()>0.5?-1:1));
                        var moveDetail = goldIcon.convertToNodeSpaceAR(winnerHeadimgWorldAR);
                        moveDetail.x += Math.floor(Math.random()*30*(Math.random()>0.5?-1:1));
                        moveDetail.y += Math.floor(Math.random()*30*(Math.random()>0.5?-1:1));
                        var delayAction = cc.delayTime(waitTime+i*0.05);
                        var callfun = cc.callFunc(function () {
                            this.opacity = 255;
                        }.bind(goldIcon));
                        var moveAction = cc.moveBy(0.4,moveDetail.x,moveDetail.y);
                        var fadeOut = cc.fadeTo(0.2,0);
                        var sequenceAction = cc.sequence([delayAction,callfun,moveAction,fadeOut]);
                        goldIcon.runAction(sequenceAction);
                    }
                }.bind(this));
                waitTime += (group.length===0?0:1.7);
            }.bind(this));
        }
        setTimeout(function () {
            this._isCompareIng = false;
            gold && gold.removeAllChildren();
            for(var i in data.totals) {
                var playerCpt = this.getPlayerCpt(parseInt(i));
                playerCpt && playerCpt.setScore(data.totals[i]);
                
            }
            for(var i=0;i<this._playerCpts.length;i++){
                var playerCpt = this._playerCpts[i];
                playerCpt._isCompareIng = false;
                if(playerCpt._callFun){
                    playerCpt._callFun();
                    playerCpt._callFun = false;
                }
            }
            if(this._ending) {
                this.ending(this._ending);
            }
            else {
                //显示准备按钮
                if( (data.totals[cc.module.self.userId]==0 || data.totals[cc.module.self.userId]) && !this._selfCpt){
                    this._selfCpt = this.getPlayerCpt(cc.module.self.userId);
                }
                if(this._selfCpt && !this._selfCpt.getReadyStatus()) {
                    this.showGameReadyOfBtn();
                }
            }
        }.bind(this),waitTime*1000);
    },

    onReceiveAllPlayerBetting:function () {
        if(this._banker == cc.module.self.userId) {
            this.alertHide();
        }
    },

    onReceivePlayCards:function (data) {
        //data.userId === cc.module.self.userId ? this._btnTurn.active = false:null;;
        if(data.userId === cc.module.self.userId){
            this._btnShow.active = false;
            this._grabBankerNode1.active = false;
            this._grabBankerNode.active = false;
            this._bettingNode.active = false;
        }
        var group = data.group;
        var playerCpt = this.getPlayerCpt(data.userId);
        if(playerCpt) {
            playerCpt.setReady(false);
            playerCpt.setTwist(false);
            if(data.userId == cc.module.self.userId) {
                //是自己出牌，隐藏发牌
                playerCpt.hidePoker();
                this.hideHintAndShowOfBtn();
            }
            if(group) {
                playerCpt.setType(data.type);
                playerCpt.setMultiple(data.multiple);
                playerCpt.play(group);
                playerCpt.hidePoker();
                if(cc.module.pokerMgr.isNN(data.type)) {
                    this.playNNAnim();
                }
            }
            else {
                playerCpt.setType("finish");
                playerCpt.setMultiple(0);
                playerCpt.showTypeAndMultiple();
            }
        }
    },

    onReceiveOnlineChange:function (data) {
        var userId = data.userId;
        this._playerCpts.forEach(function(playerCpt) {
            if(playerCpt.getUserId() == userId) {
                playerCpt.setOnlineStatus(data.status);
            }
        }.bind(this));
    },

    onReceiveRandomBankerConfirm:function (data) {
        if(this._config.mode == GAME_MODE.MPQZ) {
            this.alertHide();
            this._playerCpts.forEach(function (playerCpt) {
                if(playerCpt.getAble()) {
                    playerCpt.hideTypeAndMultiple();
                }
            });
        }
        this._banker = data.banker;
        this.randomBankerConfirm(data.banker,data.nameList,data.idList);
    },

    onReceiveGameBegin:function (data) {
        clearInterval(this._timeOut), this.timeOut.string = "";
        var gameRule = this.getComponent("GameRule");
        gameRule.setNowIndex(data.nowIndex);
        this._nowIndex = data.nowIndex;
        if(this._creator != cc.module.self.userId) {
            this.alertHide();
        }
    },

    onReceivePlayerEnter:function (data) {
        cc.module.imageCache.setImage(data.userId,data.headimg);   
        this.setTopPlayer(data,true);
        this._game.players.push(data);

    },

    onReceiveDissolveNotify:function (data) {
        var notifyCpt = this._notify.getComponent("Notify");
        notifyCpt.setNotify(data.msg);
        var pop = this._notify.getComponent("Pop");
        pop.setConfirmCallback(function () {
            cc.director.loadScene("hall");
        });
        pop.pop();
        if(this._dissolve.active) {
            var dissolvePop = this._dissolve.getComponent("Pop");
            dissolvePop.unpop();
        }
    },

    onReceiveDissolveRequest:function (data) {
        var pop = this._dissolve.getComponent("Pop");
        var dissolve = this._dissolve.getComponent("Dissolve");
        dissolve.set(data);
        pop.pop();
    },

    onReceiveDissolveAgree:function (data) {
        var dissolve = this._dissolve.getComponent("Dissolve");
        dissolve.set(data);
    },

    onReceiveDissolveRefuse:function (data) {
        var notifyCpt = this._notify.getComponent("Notify");
        notifyCpt.setNotify(data.msg);
        var pop = this._notify.getComponent("Pop");
        pop.pop();
        if(this._dissolve.active) {
            var dissolvePop = this._dissolve.getComponent("Pop");
            dissolvePop.unpop();
        }
    },

    onReceivePlayerLeave:function (data) {
        var userId = data.userId;
        if(data.errcode) {
            //表示是自己离开房间错误,只有自己才会收得到这个消息
            cc.module.toast.show(data.errmsg);
            return;
        }
        if(data.userId == cc.module.self.userId) {
            clearInterval(this._timeOut);
            cc.director.loadScene("hall");
        }
        else {
            this._playerCpts.forEach(function (playerCpt) {
                if(playerCpt.getUserId() == data.userId) {
                    playerCpt.reset();
                }
            }.bind(this));
            for(var prop in seatToPlayer){
                if(userId == seatToPlayer[prop] ){
                    seatToPlayer[prop] =  null;
                }
            }
            for(var i=0;i<this._game.players.length;i++){
                var player = this._game.players[i];
                if(player.userId == userId){
                    this._game.players.splice(i,1);
                }
            }
            this.setTopPlayer(data,false);
        }
    },

    onReceiveEmoji:function (data) {
        this._playerCpts.forEach(function (playerCpt) {
            if(playerCpt.getUserId() == data.userId) {
                playerCpt.emoji(data.emoji);
            }
        }.bind(this));
    },

    onReceiveGameInfo:function (data) {
        if(cc.isValid(data.errcode)) {
            clearInterval(this._timeOut);
            cc.director.loadScene("hall");
            return;
        }
        this._game = data;
        this.addSocketEventHandlers();
        this.setGameInfo(data);
        this.setGameRule(data);
        this.setPlayer(data);
        this.setPrepare(data);
        this.setWebShareMsg(data.config)
        data.nowIndex == 0 ? this.setRoomTimeOut(data._intervalTime):this.timeOut.string = "";
        if(data.dr) {
            this.onReceiveDissolveRequest(data.dr);
        }
        if(this._nowIndex <=0 ) {
            return;
        }
        var waitReadyFn = function () {
            data.players.forEach(function (player) {
                if(player.userId == cc.module.self.userId) {
                    if(!player.readyStatus && player.seat) {
                        this.showGameReadyOfBtn();
                    }
                }
            }.bind(this));
        }.bind(this);
        var waitBettingFn = function () {
            var banker = null;
            data.players.forEach(function (player) {
                if(player.isBanker) {
                    banker = player.userId;
                }
            });
            var isBetting = false;
            var isBegin = false;
            console.log(data.players);
            data.players.forEach(function (player) {
                if(player.cardData){
                    var playerCpt = this.getPlayerCpt(player.userId);
                    playerCpt && playerCpt.showAllPokerBack();
                }
                isBegin = player.isBegin;
                if(player.betting != null) {
                    this.onReceiveBetting({userId:player.userId,betting:player.betting});
                    if(player.userId == cc.module.self.userId) {
                        isBetting = true;
                    }
                }

            }.bind(this));
            if(!isBetting && isBegin) {
                // data.players.forEach(function (player) {
                //     var playerCpt = this.getPlayerCpt(player.userId);
                //     playerCpt && playerCpt.showAllPokerBack();
                // }.bind(this))
                this.onReceivePleaseBetting({banker:banker,lastBanker:data.lastBanker});
            }
            else if(!isBegin){
                this.showGameReadyOfBtn();
            }
            else{
                data.players.forEach(function (player) {
                    if(player.isSee) {
                        this._selfCpt && this._selfCpt.showPoker(player.cardData.cards);
                        this.showHintAndShowOfBtn();
                    }
                    else {
                        this._selfCpt && this._selfCpt.showAllPokerBack();
                        this.showTwistAndTurnOfBtn();
                        if(this._config.mode == GAME_MODE.MPQZ) {
                            //显示4张扑克牌
                            this._selfCpt && this._selfCpt.showPoker(player.cardData.cards.slice(0,4));
                        }
                    }
                }.bind(this));
            }
        }.bind(this);
        var waitGrabBankerFn = function () {
            data.players.forEach(function (player) {
                var playerCpt = this.getPlayerCpt(player.userId);
                playerCpt && playerCpt.showAllPokerBack();
                if(player.userId == cc.module.self.userId) {
                    if(!player.isBegin) {
                        this.showGameReadyOfBtn();
                        return;
                    }
                    this._selfCards = player.cardData.cards;
                    this._selfNNType = player.cardData.type;
                    this._selfNNMultiple = player.cardData.multiple;
                    if(!this._selfCpt && player.seat){
                        this._selfCpt = this.getPlayerCptByName(playerSeat[player.seat]); 
                        this._selfCpt.setType(player.cardData.type);
                        this._selfCpt.setMultiple(player.cardData.multiple);
                    }
                    if(player.grab != null) {
                        if(player.isSee) {
                            this._selfCpt && this._selfCpt.showPoker(player.cardData.cards);
                            this.showHintAndShowOfBtn();
                        }
                        else {
                            this.onReceiveGrabBanker({userId:player.userId,grab:player.grab});
                            this._selfCpt && this._selfCpt.showAllPokerBack();
                            this._selfCpt && this._selfCpt.showPoker(player.cardData.cards.slice(0,4));
                        }
                    }
                    else {
                        this.grabBanker();
                        this._selfCpt && this._selfCpt.showAllPokerBack();
                        this._selfCpt && this._selfCpt.showPoker(player.cardData.cards.slice(0,4));
                    }
                }
                else {
                    if(player.grab != null) {
                        this.onReceiveGrabBanker({grab:player.grab,userId:player.userId});
                    }
                }
            }.bind(this));
        }.bind(this);
        var waitPlayCardsFn = function () {
            var startNum = 0;
            data.players.forEach(function (player) {
                if(player.userId == cc.module.self.userId) {
                    if(player.isPlayCards) {
                        startNum ++;
                        //模拟onReceivePlayCards
                        var ctor = {
                            userId:player.userId,
                            type:player.cardData.type,
                            group:player.cardData.group,
                            multiple:player.cardData.multiple
                        };
                        this.onReceivePlayCards(ctor);
                    }
                    else {
                        //如果玩家没有牌，说明玩家还没有开始游戏
                        if(!player.cardData) {
                            if(!player.readyStatus) {
                                cc.module.self.seat && this.showGameReadyOfBtn();
                            }
                            return;
                        }
                        startNum ++;
                        this._selfCards = player.cardData.cards;
                        this._selfNNType = player.cardData.type;
                        this._selfNNMultiple = player.cardData.multiple;
                        if(!this._selfCpt && player.seat){
                            this._selfCpt = this.getPlayerCptByName(playerSeat[player.seat]); 
                            this._selfCpt.setType(player.cardData.type);
                            this._selfCpt.setMultiple(player.cardData.multiple);
                         }
                        //还没有出牌，判断是否查看过牌
                        if(player.isSee) {
                            this._selfCpt && this._selfCpt.showPoker(player.cardData.cards);
                            this.showHintAndShowOfBtn();
                        }
                        else {
                            this._selfCpt && this._selfCpt.showAllPokerBack();
                            this.showTwistAndTurnOfBtn();
                            if(this._config.mode == GAME_MODE.MPQZ) {
                                //显示4张扑克牌
                                this._selfCpt && this._selfCpt.showPoker(player.cardData.cards.slice(0,4));
                            }
                        }
                    }
                }
                else {
                    if(player.isPlayCards) {
                        startNum ++;
                        //显示出牌
                        if(player.isBanker) {
                            //说明还有闲家没有出牌
                            var ctor = {
                                userId:player.userId
                            };
                            this._playerCpts.forEach(function (playerCpt) {
                                if(playerCpt._userId == player.userId) {
                                    playerCpt.showAllPokerBack();
                                    this.onReceivePlayCards(ctor);
                                }
                            }.bind(this));
                        }
                        else {
                            var ctor = {
                                userId:player.userId,
                                type:player.cardData.type,
                                group:player.cardData.group,
                                multiple:player.cardData.multiple
                            };
                            this.onReceivePlayCards(ctor);
                        }
                    }
                    else if (player.cardData){
                        //判断此人是否有牌，才显示牌背面
                        this._playerCpts.forEach(function (playerCpt) {
                            if(playerCpt.getUserId() == player.userId) {
                                startNum ++;
                                playerCpt.showAllPokerBack();
                            }
                        });
                    }
                }
            }.bind(this));
            this.startTimer(data.countdown - 1 - startNum||5);
        }.bind(this);
        if(data.status === ROOM_STATUS.WAIT_READY) {
            waitReadyFn();
        }
        else if(data.status === ROOM_STATUS.WAIT_BETTING) {
            waitBettingFn();
            if(this._config.mode == GAME_MODE.MPQZ) {
                data.players.forEach(function (player) {
                    if(player.userId == cc.module.self.userId && player.cardData) {
                        if(!this._selfCpt){
                            this._selfCpt = this.getPlayerCptByName(playerSeat[player.seat]);
                        }
                        this._selfCards = player.cardData.cards;
                        this._selfNNType = player.cardData.type;
                        this._selfNNMultiple = player.cardData.multiple;
                        this._selfCpt.setType(player.cardData.type);
                        this._selfCpt.setMultiple(player.cardData.multiple);
                        this._selfCpt.showAllPokerBack();
                        this._selfCpt.showPoker(player.cardData.cards.slice(0,4));
                    }
                }.bind(this));
            }
        }
        else if(data.status === ROOM_STATUS.WAIT_GRAB_BANKER) {
            waitGrabBankerFn();
        }
        else if(data.status === ROOM_STATUS.WAIT_PLAY_CARDS) {
            waitPlayCardsFn();
        }
    },

    onReceiveQuickChat:function (data) {
        var userId = data.userId;
        var chatId = data.chatId;
        this._playerCpts.forEach(function (playerCpt) {
            if(playerCpt.getUserId() == userId) {
                playerCpt.quickChat(chatId);
                cc.module.audioMgr.playBySex(playerCpt.getSex(),"chat/"+chatId+".mp3");
            }
        }.bind(this));
    },

    onReceiveVoice:function (data) {
        this._voices.push(data);
        this.playVoice();
    },


    onReceiveDeal:function (data) {
        clearInterval(this._timeOut) , this.timeOut.string = "";
        this._pokerNode.removeAllChildren();
        for(var i=0 ; i<data.dealPlayers.length*5 ; i++) {
            var pokerBackPrefab = cc.module.pokerMgr.getNewPokerBackNode();
            pokerBackPrefab.y = i*0.5;
            this._pokerNode.addChild(pokerBackPrefab);
        }

        var seat = cc.module.self.seat;
        var playerCpt = this.getPlayerCptByName(playerSeat[seat]);

        data.dealPlayers.forEach(function (item) {
            if( playerCpt && (item.userId == playerCpt._userId)) {
                this._selfCards = item.cards;
                this._selfNNType = item.type;
                this._selfNNMultiple = item.multiple;
                playerCpt.setType(item.type);
                playerCpt.setMultiple(item.multiple);
            }
            var grabPlayerCpt = this.getPlayerCpt(item.userId);
            grabPlayerCpt.setBanker(item.isBanker);
        }.bind(this));
        this.initDealAnim(data);
    },

    onReceiveDealAgain:function (data) {
        var seat = cc.module.self.seat;
        var selfCpt = this.getPlayerCptByName(playerSeat[seat]);
        data.forEach(function (item) {
            if(item.userId == selfCpt._userId ) {
                this._selfCards = item.cards;
                this._selfNNType = item.type;
            }
        }.bind(this));
    },

    onReceiveReady:function (data) {
        var readyUser = data.userId;
        if(readyUser == cc.module.self.userId) {
            this._recentIsReady = true;
            this._btnGameReady.active = false;
            this._btnInviate.active = false;
        }
        this._playerCpts.forEach(function (playerCpt) {
            if(playerCpt._userId == readyUser) {
                playerCpt.setReady(true);
                playerCpt.hideTypeAndMultiple();
                playerCpt.hideBetting();
                playerCpt.hideObain();
            }
        });
        if(this._creator == cc.module.self.userId && this._nowIndex<=0) {
            var selfCpt = this.getPlayerCpt(cc.module.self.userId);
            if(selfCpt && !selfCpt.getReadyStatus()) {
                return;
            }
        }
    },

    onReceiveBetting:function (data) {
        var userId = data.userId;
        if(userId == cc.module.self.userId) {
            this.alertHide();
            this._bettingNode.active = false;
        }
        var player = this.getPlayerCpt(userId);
        if(player) {
            player.betting(data.betting);
            //player.setMultiple(data.betting);
            //player.setType(null);
            //player.showTypeAndMultiple();
        }
    },




// ------------------------------------------------- other Fn -------------------------------------------------
    initDealAnim:function (data) {
        var index = 0;
        var waitTime = 0;
        var startNum = 0;
        data.dealPlayers.forEach(function (item) {
            var playerCpt = this.getPlayerCpt(item.userId);
            playerCpt.hidePlayCard(); // 隐藏出牌节点
            waitTime += playerCpt.playDealAnim(this.getFivePokerBack(index),index);
            index ++;
            startNum++;
        }.bind(this));
        setTimeout(function () {
            this._pokerNode.removeAllChildren();
            data.dealPlayers.forEach(function (item) {
                var playerCpt = this.getPlayerCpt(item.userId);
                playerCpt.setReady(false);
                playerCpt.setTwist(this._config.mode != GAME_MODE.MPQZ);
                playerCpt.showAllPokerBack();
                if(this._config.mode == GAME_MODE.MPQZ) {
                    //是自己，显示4张扑克牌

                    if(item.userId==cc.module.self.userId) {
                        if(!this._selfCpt){
                            this._selfCpt = this.getPlayerCpt(item.userId);
                        }
                        this._selfCpt && this._selfCpt.showPoker(item.cards.slice(0,4));
                        this.grabBanker();
                    }
                }
                else if(this._selfCpt && item.userId == this._selfCpt.getUserId()){
                    //不显示牌，显示搓牌与翻牌按钮
                    this.showTwistAndTurnOfBtn();
                }
            }.bind(this));
            /*if(this._config.mode !== GAME_MODE.MPQZ)*/
            this._countdown=data.countdown-1-startNum;
            this.startTimer(this._countdown||5);
        }.bind(this) , waitTime*1000);
    },

    getPlayerCptByName:function(name){
        var playerPanel = this._players.getChildByName(name);
        if(playerPanel){
            var playerCpt = playerPanel.getComponent("Player");
            return playerCpt;
        }
        return null;
    },

    showTwistAndTurnOfBtn:function () {
        this._btnTwist.active = !this._config.disTwist;
        //this._btnTurn.active = true;
        this._btnShow.active = true;
        this._btnHint.active = false;
        //this._btnShow.active = false;
    },

    hideTwistAndTurnOfBtn:function () {
        this._btnTwist.active = false;
        //this._btnTurn.active = false;
        //this._btnShow.active = false;
    },

    showHintAndShowOfBtn:function () {
        this._btnTwist.active = false;
        //this._btnTurn.active = false;
        this._btnShow.active = false;
        this._btnHint.active = true;
        //this._btnShow.active = true;
    },

    hideHintAndShowOfBtn:function () {
        this._btnHint.active = false;
        this._btnShow.active = false;
    },

    showBettingOfBtn:function () {

    },

    showGameReadyOfBtn:function () {
        this._btnGameReady.active = true;
        this.hideHintAndShowOfBtn();
        this.hideTwistAndTurnOfBtn();
    },

    twist:function () {
        var cards;
        if(this._config.mode == GAME_MODE.MPQZ) {
            cards = [this._selfCards[this._selfCards.length-1]];
        }
        else {
            cards = this._selfCards;
        }
        var twistGroup = this._twistNode.getChildByName("twist");
        var twistCpt = twistGroup.getComponent("Twist");
        twistCpt.twist(cards,function (twistCards) {
            cc.module.socket.send(SEvents.Nn.SEND_SEE,null,true);
            if(twistCards.length === 1) {
                this._selfCpt.playTwistOneAnim(twistCards,function () {
                    twistCpt.hidden();
                    this._selfCpt.showPoker(this._selfCards,function () {
                        this.showHintAndShowOfBtn();
                    }.bind(this));
                }.bind(this));
            }
            else if(twistCards.length === 5) {
                twistCpt.hidden();
                this._selfCpt.showPoker(this._selfCards,function () {
                    this.showHintAndShowOfBtn();
                }.bind(this));
            }
        }.bind(this));
    },

    hint:function () {
        this._selfCpt.showTypeAndMultiple();
    },

    show:function () {
        cc.module.socket.send(SEvents.Nn.SEND_PLAY_CARDS,null,true);
    },

    turn:function () {
        var seat = cc.module.self.seat;
        var playerCpt = this.getPlayerCptByName(playerSeat[seat]);
        playerCpt && playerCpt.showPoker(this._selfCards,function () {
            this.showHintAndShowOfBtn();
        }.bind(this));
        cc.module.socket.send(SEvents.Nn.SEND_SEE,null,true);
        this.hideTwistAndTurnOfBtn();
    },

    getFivePokerBack:function (index) {
        var cards = [];
        var poker = this._pokerNode.children;
        for(var i=poker.length-index*5-1; i>=0&&i>poker.length-index*5-6 ; i--) {
            cards.push(poker[i]);
        }
        return cards;
    },

    playVoice:function () {
        if(this._voices.length) {
            var data = this._voices.shift();
            var msgInfo = JSON.parse(data.content);
            var msgfile = "voicemsg.amr";
            this._voiceTime = msgInfo.time/1000;
            this._playerCpts.forEach(function(playerCpt) {
                if(playerCpt.getUserId() == data.sender) {
                    playerCpt.voice(msgInfo.time/1000);
                }
            }.bind(this));
            if(cc.sys.isBrowser){
                window.downloadVoice && window.downloadVoice(msgInfo.msg);
            }else{
                cc.module.voiceMgr.writeVoice(msgfile,msgInfo.voice);
                cc.module.voiceMgr.play(msgfile);
            }
        }
        else {
            cc.module.audioMgr.resumeAll();
        }
    },

    getself:function(){
        var players = this._game.players;
        for (var i=0;i<players.length;i++){
            if(players[i].userId == cc.module.self.userId){
                return players[i];
            }
        }
    },

    notify:function(msg){
        var notifyCpt = this._notify.getComponent("Notify");
        notifyCpt.setNotify(msg);
        var pop = this._notify.getComponent("Pop");
        pop.pop();
    },

    dissolveAgree:function () {
        cc.module.socket.send(SEvents.Nn.SEND_DISSOLVE_AGREE,null,true);
    },

    dissolveRefuse:function () {
        cc.module.socket.send(SEvents.Nn.SEND_DISSOLVE_REFUSE,null,true);
    },

    isSelf:function(userId){
        return userId==cc.module.self.userId;
    },

    setSelf:function (info) {
        var _this = this;
        var players = info.players;
        players.forEach(function (player) {
            if(player.userId == cc.module.self.userId) {
                _this._selfCpt.setInfo(player);
            }
        });
    },

    initSelf:function () {
        var player = {
            name:cc.module.self.nickname,
            userId:cc.module.self.userId,
            score:0,
            isBanker:false,
            readyStatus:false,
            twistStatus:false,
            onlineStatus:true
        };
        this._selfCpt.setInfo(player);
    },

    getAnUnAblePlayerCpt:function () {
        for(var i=0 ; i<this._playerCpts.length ; i++) {
            if(!this._playerCpts[i].getAble() && this._playerCpts[i]!= this._selfCpt) {
                return this._playerCpts[i];
            }
        }
    },

  

    betting:function () {
        if(this._config.mode != GAME_MODE.MPQZ)return;
        if(!cc.module.self.seat){
            return;
        }
        //var grabPlayerCpt = this.getPlayerCpt(cc.module.self.userId)
        this.startTimer(this._countdown||5);
        if(this._banker == cc.module.self.userId) {
            this.alert("正在等待闲家下注");
            return;
        }
        this._bettingNode.removeAllChildren();
        //var baseScores = BASE_SCORE[this._config.baseScore];
        var baseScores = [1,2,3,4,5];
        baseScores.forEach(function (score) {
            var btn = cc.instantiate(this.bettingBtnPrefab);
            var lblBetting = btn.getChildByName("lbl_betting").getComponent(cc.Label);
            lblBetting.string = score;
            btn._score = score;
            cc.module.utils.addClickEvent(btn,this.node,"Game","onClickBetting");
            this._bettingNode.addChild(btn);
        }.bind(this));
        this._bettingNode.active = true;
        this.alert("请选择下注底分");
    },

    grabBanker:function () {
        this._grabBankerNode1.active = true;
        this.startTimer(this._countdown||5);
    },

    grabBanker1:function () {
        this._grabBankerNode1.active = false;
        this._grabBankerNode.removeAllChildren();
        var maxGrab = GRAB_BANKER[this._config.maxGrabBanker];
        for(var i=1 ; i<=maxGrab ; i++) {
            var btn = cc.instantiate(this.bettingBtnPrefab);
            var lblBetting = btn.getChildByName("lbl_betting").getComponent(cc.Label);
            lblBetting.string = i;
            btn._grab = i;
            cc.module.utils.addClickEvent(btn,this.node,"Game","onClickGrab");
            this._grabBankerNode.addChild(btn);
        }
        this._grabBankerNode.active = true;
        this.alert("正在选择抢庄");
    },


    // -------------------------------------------


    alert:function (str) {
        var lblAlertNode = this._alert.getChildByName("lbl_alert");
        var lblAlert = lblAlertNode.getComponent(cc.Label);
        lblAlert.string = str;
        this._alert.active = true;
    },

    alertHide:function () {
        this._alert.active = false;
    },

    randomBankerConfirm:function (banker,nameList,idList) {
        var randomBankerPanel = this._gameNode.getChildByName("random_banker_panel");
        var bankerIcon = randomBankerPanel.getChildByName("banker_icon");
        var lblNameNode = randomBankerPanel.getChildByName("lbl_name");
        var bg = randomBankerPanel.getChildByName("bg");
        var lblName = lblNameNode.getComponent(cc.Label);
        randomBankerPanel.active = true;
        bg.opacity = 255;
        lblNameNode.opacity = 255;
        if(bankerIcon.orgX!=null && bankerIcon.orgY!=null) {
            bankerIcon.x = bankerIcon.orgX;
            bankerIcon.y = bankerIcon.orgY;
        }
        else {
            bankerIcon.orgX = bankerIcon.x;
            bankerIcon.orgY = bankerIcon.y;
        }
        var names = [];
        var index = 0;
        this._playerCpts.forEach(function (playerCpt) {
            if(playerCpt.getAble()) {
                playerCpt.setBanker(false);
            }
        });
        if(nameList) {
            nameList.forEach(function (name) {
                names.push({"name":name});
            });
        }
        else {
            this._playerCpts.forEach(function (playerCpt) {
                if(playerCpt.getAble()) {
                    names.push({
                        userId:playerCpt.getUserId(),
                        name:playerCpt.getNickname()
                    });
                }
            });
        }
        var intervale = setInterval(function () {
            lblName.string = names[index].name;
            index ++;
            index = index%names.length;
        },38);
        setTimeout(function () {
            clearInterval(intervale);
            cc.module.audioMgr.playSFX("ding_ding.mp3");
            this._playerCpts.forEach(function (playerCpt) {
                if(playerCpt.getUserId() == banker) {
                    var tempName = playerCpt.getNickname();
                    tempName = tempName.length>10?tempName.substr(0,8)+"...":tempName;
                    lblName.string = "【"+tempName+"】定为庄家";
                    setTimeout(function () {
                        var pBankerIcon = playerCpt.getBankerIcon();
                        var pBankerIconWorldAR = pBankerIcon.convertToWorldSpaceAR(cc.v2(0,0));
                        var detail = bankerIcon.convertToNodeSpaceAR(pBankerIconWorldAR);
                        var delayAction = cc.delayTime(0.2);
                        var moveAction = cc.moveBy(0.1,detail.x,detail.y);
                        var callfun = cc.callFunc(function () {
                            playerCpt.setBanker(true);
                            randomBankerPanel.active = false;
                        });
                        bg.runAction(cc.fadeTo(0.1,0));
                        lblNameNode.runAction(cc.fadeTo(0.1,0));
                        bankerIcon.runAction(cc.sequence([delayAction,moveAction,callfun]));
                    }.bind(this),300);
                }
            });
        }.bind(this),300);
        setTimeout(function () {
            idList[cc.module.self.userId] && this.betting();
        }.bind(this),1000);
    },

    getPlayerCpt:function (userId) {
        for(var i=0 ; i<this._playerCpts.length ; i++) {
            if(this._playerCpts[i].getUserId() == userId) {
                return this._playerCpts[i];
            }
        }
    },

    ending:function (data) {
        cc.module.self.seat = false;
        if(!cc.isValid(this._endingPanel)) {
            var prefabMgr = this.getComponent("PrefabMgr");
            this._endingPanel = prefabMgr.ctorNodeByName("ssz_ending_panel");
            if(cc.isValid(this._endingPanel)) {
                this.node.addChild(this._endingPanel);
            }
        }
        if(this._endingPanel) {
            var pop = this._endingPanel.getComponent("Pop");
            pop.pop();
            var sszEndingCpt = this._endingPanel.getComponent("SszEnding");
            sszEndingCpt.ending(data,"nn");
        }
    },

    endingShare:function () {
        cc.module.anysdkMgr.shareResult();
    },

    playNNAnim:function () {
        // var animCpt = this._globalAnimNode.getComponent("AnimCpt");
        // animCpt.playOnce(function () {
        //     this._globalAnimNode.active = false;
        // }.bind(this));
        // cc.module.audioMgr.playSFX("bull_bray.wav");
    },

    update:function (dt) {
        if(this._voiceTime && this._voiceTime>0) {
            this._voiceTime -= dt;
            if(this._voiceTime<=0) {
                this._voiceTime = null;
                this.playVoice();
            }
        }
    }
});
