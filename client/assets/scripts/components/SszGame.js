var sszUtil = require("SszUtil");
const playerSeat = {
    0:"player_bottom",
    1:"player_bottom_left_bottom",
    2:"player_mid_left_bottom",
    3:"player_mid_left_top",
    4:"player_top_left_top",
    5:"player_top_right_top",
    6:"player_mid_right_top",
    7:"player_mid_right_bottom",
    8:"player_bottom_right_bottom",

    'bottom':"player_bottom",
    "bottom_left_bottom":"player_bottom_left_bottom",
    "mid_left_bottom":"player_mid_left_bottom",
    "mid_left_top":"player_mid_left_top",
    "top_left_top":"player_top_left_top",
    "top_right_top":"player_top_right_top",
    "mid_right_top":"player_mid_right_top",
    "mid_right_bottom":"player_mid_right_bottom",
    "bottom_right_bottom":"player_bottom_right_bottom",

    'player_bottom':"bottom",
    "player_bottom_left_bottom":"bottom_left_bottom",
    "player_mid_left_bottom":"mid_left_bottom",
    "player_mid_left_top":"mid_left_top",
    "player_top_left_top":"top_left_top",
    "player_top_right_top":"top_right_top",
    "player_mid_right_top":"mid_right_top",
    "player_mid_right_bottom":"mid_right_bottom",
    "player_bottom_right_bottom":"bottom_right_bottom",
};
//----9人
const position = {
    0:"bottom",
    1:"bottom_left_bottom",
    2:"mid_left_bottom",
    3:"mid_left_top",
    4:"top_left_top",
    5:"top_right_top",
    6:"mid_right_top",
    7:"mid_right_bottom",
    8:"bottom_right_bottom",

    "bottom":0,
    "bottom_left_bottom":1,
    "mid_left_bottom":2,
    "mid_left_top":3,
    "top_left_top":4,
    "top_right_top":5,
    "mid_right_top":6,
    "mid_right_bottom":7,
    "bottom_right_bottom":8,
};
var seatToPlayer = {
    "bottom":null,
    "bottom_left_bottom":null,
    "mid_left_bottom":null,
    "mid_left_top":null,
    "top_left_top":null,
    "top_right_top":null,
    "mid_right_top":null,
    "mid_right_bottom":null,
    "bottom_right_bottom":null,
};
//-------2人
const playerSeat2 = {
    0:"player_bottom",
    1:"player_mid_right_bottom",

    'bottom':"player_bottom",
    "mid_right_bottom":"player_mid_right_bottom",

    'player_bottom':"bottom",
    "player_mid_right_bottom":"mid_right_bottom",
};
const position2 = {
    0:"bottom",
    1:"mid_right_bottom",

    "bottom":0,
    "mid_right_bottom":1,
};
// //-----3人
const playerSeat3 = {
    0:"player_bottom",
    1:"player_bottom_left_bottom",
    2:"player_mid_right_bottom",

    'bottom':"player_bottom",
    "bottom_left_bottom":"player_bottom_left_bottom",
    "mid_right_bottom":"player_mid_right_bottom",

    'player_bottom':"bottom",
    "player_bottom_left_bottom":"bottom_left_bottom",
    "player_mid_right_bottom":"mid_right_bottom",
};
const position3 = {
    0:"bottom",
    1:"bottom_left_bottom",
    2:"mid_right_bottom",

    "bottom":0,
    "bottom_left_bottom":1,
    "mid_right_bottom":2,
};
// //------4人
const playerSeat4 = {
    0:"player_bottom",
    1:"player_bottom_left_bottom",
    2:"player_mid_left_bottom",
    3:"player_mid_right_bottom",

    'bottom':"player_bottom",
    "bottom_left_bottom":"player_bottom_left_bottom",
    "mid_left_bottom":"player_mid_left_bottom",
    "mid_right_bottom":"player_mid_right_bottom",

    'player_bottom':"bottom",
    "player_bottom_left_bottom":"bottom_left_bottom",
    "player_mid_left_bottom":"mid_left_bottom",
    "player_mid_right_bottom":"mid_right_bottom",
};
const position4 = {
    0:"bottom",
    1:"bottom_left_bottom",
    2:"mid_left_bottom",
    3:"mid_right_bottom",

    "bottom":0,
    "bottom_left_bottom":1,
    "mid_left_bottom":2,
    "mid_right_bottom":3,
};
// //------5人
const playerSeat5 = {
    0:"player_bottom",
    1:"player_bottom_left_bottom",
    2:"player_mid_left_bottom",
    3:"player_mid_right_bottom",
    4:"player_bottom_right_bottom",

    'bottom':"player_bottom",
    "bottom_left_bottom":"player_bottom_left_bottom",
    "mid_left_bottom":"player_mid_left_bottom",
    "mid_right_bottom":"player_mid_right_bottom",
    "bottom_right_bottom":"player_bottom_right_bottom",

    'player_bottom':"bottom",
    "player_bottom_left_bottom":"bottom_left_bottom",
    "player_mid_left_bottom":"mid_left_bottom",
    "player_mid_right_bottom":"mid_right_bottom",
    "player_bottom_right_bottom":"bottom_right_bottom",
};
const position5 = {
    0:"bottom",
    1:"bottom_left_bottom",
    2:"mid_left_bottom",
    3:"mid_right_bottom",
    4:"bottom_right_bottom",

    "bottom":0,
    "bottom_left_bottom":1,
    "mid_left_bottom":2,
    "mid_right_bottom":3,
    "bottom_right_bottom":4,
};
// ------6人
const playerSeat6 = {
    0:"player_bottom",
    1:"player_bottom_left_bottom",
    2:"player_mid_left_bottom",
    3:"player_mid_left_top",
    4:"player_mid_right_bottom",
    5:"player_bottom_right_bottom",

    'bottom':"player_bottom",
    "bottom_left_bottom":"player_bottom_left_bottom",
    "mid_left_bottom":"player_mid_left_bottom",
    "mid_left_top":"player_mid_left_top",
    "mid_right_bottom":"player_mid_right_bottom",
    "bottom_right_bottom":"player_bottom_right_bottom",

    'player_bottom':"bottom",
    "player_bottom_left_bottom":"bottom_left_bottom",
    "player_mid_left_bottom":"mid_left_bottom",
    "player_mid_left_top":"mid_left_top",
    "player_mid_right_bottom":"mid_right_bottom",
    "player_bottom_right_bottom":"bottom_right_bottom",
};
const position6 = {
    0:"bottom",
    1:"bottom_left_bottom",
    2:"mid_left_bottom",
    3:"mid_left_top",
    4:"mid_right_bottom",
    5:"bottom_right_bottom",

    "bottom":0,
    "bottom_left_bottom":1,
    "mid_left_bottom":2,
    "mid_left_top":3,
    "mid_right_bottom":4,
    "bottom_right_bottom":5,
};

//------7人
const playerSeat7 = {
    0:"player_bottom",
    1:"player_bottom_left_bottom",
    2:"player_mid_left_bottom",
    3:"player_mid_left_top",
    4:"player_mid_right_top",
    5:"player_mid_right_bottom",
    6:"player_bottom_right_bottom",

    'bottom':"player_bottom",
    "bottom_left_bottom":"player_bottom_left_bottom",
    "mid_left_bottom":"player_mid_left_bottom",
    "mid_left_top":"player_mid_left_top",
    "mid_right_top":"player_mid_right_top",
    "mid_right_bottom":"player_mid_right_bottom",
    "bottom_right_bottom":"player_bottom_right_bottom",

    'player_bottom':"bottom",
    "player_bottom_left_bottom":"bottom_left_bottom",
    "player_mid_left_bottom":"mid_left_bottom",
    "player_mid_left_top":"mid_left_top",
    "player_mid_right_top":"mid_right_top",
    "player_mid_right_bottom":"mid_right_bottom",
    "player_bottom_right_bottom":"bottom_right_bottom",
};
const position7 = {
    0:"bottom",
    1:"bottom_left_bottom",
    2:"mid_left_bottom",
    3:"mid_left_top",
    4:"mid_right_top",
    5:"mid_right_bottom",
    6:"bottom_right_bottom",

    "bottom":0,
    "bottom_left_bottom":1,
    "mid_left_bottom":2,
    "mid_left_top":3,
    "mid_right_top":4,
    "mid_right_bottom":5,
    "bottom_right_bottom":6,
};

var seatsPosition = {};
var SEAT = {};

cc.Class({
    extends: cc.Component,

    properties: {
        defaultHeadimg:cc.SpriteFrame,
        gameInfoPanel:cc.Node,
        timeOut:cc.Label,
        emoji:{
            default:[],
            type:cc.Prefab
        },

        /*************背景********************/
        bgNode:cc.Node,
        areaNode:cc.Node,
        ruleNode:cc.Node,
        green:cc.SpriteFrame,
        pink:cc.SpriteFrame,
        purple:cc.SpriteFrame,
        blue:cc.SpriteFrame,
        gray:cc.SpriteFrame,
        typeAtlas:cc.SpriteAtlas,
        emojiAtlas:cc.SpriteAtlas,
        /*--------------Panel-------------*/
        _setPanel:null,
        _chatPanel:null,
        _emojiPanel:null,
        _playersPanel:null,
        _brandTypePanel:null,
        _matePanel:null,
        _summaryPanel:null,
        _endingPanel:null,
        _askLeavePanel:null,
        _agreeLeave:null,
        _topPlayers:null,
        _gemTs:null,
        _mallPanel:null,
        _timePanel:null,
        // _sszAnimPanel:null,
        
        /*--------------Object------------*/
        _game:null,
        _voices:[],
        _voiceTime:null,
        _playerCpts:null,
        _isCompareIng:false,
        _endingData:null,
        _agreeTime:null,
        _askTime:null,
        _clickTime:null,
        _countdownTime:null,
        _seatData:null,
        _isAsk:true,
        _roomIndex:null,
        _leaveData:null
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
            cc.director.preloadScene("hall",function(){ });
        }
        cc.inGame = false;
        cc.loginInOther = this.node.getChildByName("loginInOther");
        // this._playersPanel = this.node.getChildByName("ssz_players_panel");
        // this._playerCpts = this._playersPanel.getComponentsInChildren("SszPlayer");
        // this.initSeat();
        for(var seatName in seatToPlayer){
            seatToPlayer[seatName] = null;
        }
        this._isAsk = true;
        cc.module.socket.send(SEvents.SEND_GET_GAME_INFO,null,true);
        cc.module.socket.on(SEvents.RECEIVE_GAME_INFO,this.onReceiveGameInfo.bind(this));
    },

    start:function(){
        this._isCompareIng = false;
        this._topIsHidden = false; // 默认不是隐藏的
        this._seatDownCallFun = [];
        this._sandUpCallFun = [];
        // setTimeout(function(){
        //     this.playAllHitGunAnim();
        // }.bind(this),3000);
    },

    specialAnim:function(type){
        var prefabMgr = this.getComponent("PrefabMgr");
        var animNode = prefabMgr.ctorNodeByName("specialAnim");
        var specialType = this.getPokerMgr().getSpecialSFByName(type);
        this.node.addChild(animNode);
        animNode.getComponent(cc.Sprite).spriteFrame = specialType;
        animNode.scaleX = 0;
        animNode.scaleY = 0;
        var pop = animNode.getComponent("Pop");
        pop.pop();
        var finished = cc.callFunc(function(){
            animNode.scaleX = 0;
            animNode.scaleY = 0;
            animNode.active = false;
            animNode.removeFromParent(true);
        });
        animNode.runAction( cc.sequence(cc.scaleTo( 0.4,1,1 ),cc.delayTime(1),finished) )
    },

    /*----------------Set方法---------------------------------*/
    setClickReadyCallBack:function (callback) {
        this._clickReadyCallBack = callback;
    },

    setShuffleStatus:function(active){//洗牌
        //return;
        var btnShuffle = this.node.getChildByName("menu_panel").getChildByName("btn_shuffle");
        btnShuffle.active = active;
        cc.module.utils.toTop(btnShuffle)
    },

    setWebShareMsg:function(){
        // if(cc.sys.isBrowser){
        //     var name = cc.module.self.nickname;
        //     var agentId = cc.module.agentId;
        //     var headimg = cc.module.self.headimg;
        //     var roomId = this._game.roomId;
        //     var uuid = this._game.uuid;
        //     var rateAA = this._game.form.rateAA;
        //     var baseScore = this._game.form.baseScore;
        //     var classic = this._game.form.classic;
        //     var noSpecial = this._game.form.noSpecial;
        //     var noKing = this._game.form.noKing;
        //     var isGun = this._game.form.isGun;
        //     var numOfGame = this._game.form.numOfGame;
        //     var shareTitle = (classic?(noSpecial?"打枪无特殊牌":"打枪有特殊牌")
        //                     :(noKing?"逗基十三水无王":(isGun?"逗基十三水有王打枪":"逗基十三水有王")) );
        //     shareTitle += " 底分"+baseScore;
            
        //     var shareDes = (rateAA ? "AA制房间号":"房主制房间号") +roomId+"，"+name.slice(0,6)+(agentId?(",代理号"+agentId):"")+"在逗基十三水中创建了"+numOfGame+"局" +(classic ? "经典模式":"通比模式");

        //     cc.sys.localStorage.setItem("roomId",roomId);
        //     cc.sys.localStorage.setItem("shareTitle",shareTitle);
        //     cc.sys.localStorage.setItem("shareDes",shareDes);
        //     cc.sys.localStorage.setItem("headimg",headimg);
        //     cc.sys.localStorage.setItem("recordUuid",uuid);
        //     // agentId && cc.sys.localStorage.setItem("agentId",agentId);

        //     (window.shareToTimeLine && window.shareToTimeLine());
        //     (window.shareToSession && window.shareToSession());
        // }
    },

    onClickInviate:function(){
        // cc.module.audioMgr.playUIClick();
        // var name = cc.module.self.nickname;
        // var agentId = this._game.agentId;
        // var headimg = cc.module.self.headimg;
        // var roomId = this._game.roomId;
        // var uuid = this._game.uuid;
        // var rateAA = this._game.form.rateAA;
        // var baseScore = this._game.form.baseScore;
        // var classic = this._game.form.classic;
        // var noSpecial = this._game.form.noSpecial;
        // var noKing = this._game.form.noKing;
        // var isGun = this._game.form.isGun;
        // var numOfGame = this._game.form.numOfGame;
        // var shareTitle = (classic?(noSpecial?"打枪无特殊牌":"打枪有特殊牌"):(noKing?"逗基十三水无王":(isGun?"逗基十三水有王打枪":"逗基十三水有王")) );
        // shareTitle += " 底分"+baseScore;
        // var shareDes = (rateAA ? "AA制房间号":"房主制房间号") +roomId+"，"+name.slice(0,6)+(agentId?(",代理号"+agentId):"")+"在逗基十三水中创建了"+numOfGame+"局" +(classic ? "经典模式":"通比模式");
        // cc.module.anysdkMgr.shareToSession(shareTitle,shareDes,roomId,agentId);
    },

    startTimer:function(time,timerNode,callFun){
        var timer = cc.isValid(timerNode)?timerNode:this.node.getChildByName("timer");
        this.stopTimer(timer);
        timer.active = true;
        timer.getComponent(cc.Label).string = time;
        var reflash = timer.getChildByName("reflash");
        var action = cc.repeat(cc.rotateBy(2,360),time)
        reflash.runAction(action);
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

    //设置游戏信息
    setGameInfoPanel:function (data) {
        this.gameInfoPanel.active = true;
        var gameInfo = this.gameInfoPanel.getChildByName("room_info");
        var roomId = gameInfo.getChildByName("lbl_room_id").getComponent(cc.Label);
        var type = gameInfo.getChildByName("lbl_type").getComponent(cc.Label);
        var rate = gameInfo.getChildByName("lbl_rate").getComponent(cc.Label);
        roomId.string = "房号：" + data.roomId;
        type.string = returnGameTypeFun(data.form.gameRule);
        rate.string = data.form.gameWater + "金币/水";
        function returnGameTypeFun(type){
            var gameTypes = {
                "sss":"十三水",
                "qys":"全一色",
                "sbp":"十八扑",
                "dys":"多一色",
                "bbc":"百变场",
                "wpc":"王牌场"
            };
            return gameTypes[type];
        };
        /************背景**************/
        var sprite;
        var gameRule = {
            "sss":"13Water",
            "qys":"fullColor",
            "sbp":"18Water",
            "dys":"moreColor",
            "bbc":"changeable",
            "wpc":"joker",
        };
        this._color = cc.gameBgColor ? cc.gameBgColor : "green";
        switch (this._color) {
            case "pink":
                sprite = this.pink;
                break;
            case "purple":
                sprite = this.purple;
                break;
            case "blue":
                sprite = this.blue;
                break;
            case "gray":
                sprite = this.gray;
                break;
            default:
                sprite = this.green;
                break;
        }
        var typeSprite = "battle_roomIcon_"+this._game.form.gameType+"_"+this._color;
        var ruleSprite = "battle_roomIcon_"+gameRule[this._game.form.gameRule]+"_"+this._color;
        this.bgNode.getComponent(cc.Sprite).spriteFrame = sprite;
        this.areaNode.getComponent(cc.Sprite).spriteFrame = this.typeAtlas.getSpriteFrame(typeSprite);;
        this.ruleNode.getComponent(cc.Sprite).spriteFrame = this.typeAtlas.getSpriteFrame(ruleSprite);;
    },
    //初始化座位
    initSeat:function(){
        var personNum = this._game.form.numOfPerson;
        var playerSeatObj,positionObj;
        if(personNum==2){
            playerSeatObj = playerSeat2;
            positionObj = position2;
        }
        else if(personNum==3){
            playerSeatObj = playerSeat3;
            positionObj = position3;
        }
        else if(personNum==4){
            playerSeatObj = playerSeat4;
            positionObj = position4;
        }
        else if(personNum==5){
            playerSeatObj = playerSeat5;
            positionObj = position5;
        }
        else if(personNum==6){
            playerSeatObj = playerSeat6;
            positionObj = position6;
        }
        else if(personNum==7){
            playerSeatObj = playerSeat7;
            positionObj = position7;
        }
        else if(personNum==9){
           playerSeatObj = playerSeat;
           positionObj = position;
        }
        this._playersPanel.children.forEach(function(panelNode,index){
            seatsPosition[ playerSeatObj[panelNode.name] ] = {"x":panelNode.x,"y":panelNode.y};
            seatsPosition[index] = {"x":panelNode.x,"y":panelNode.y}
            panelNode._seatName = playerSeatObj[panelNode.name];
            SEAT[panelNode.name] = {};
            var userInfo = panelNode.getChildByName("userInfo");
            var seat_down = panelNode.getChildByName("seat_down");

            seat_down._seatName = playerSeatObj[panelNode.name];
            seat_down._defaultName = playerSeatObj[panelNode.name];

            
            cc.module.utils.addClickEvent(seat_down,this.node,"SszGame","clickSeat");

            userInfo.children.forEach(function(child){
                SEAT[panelNode.name][child.name] = {"x":child.x,"y":child.y,"anchorX":child.anchorX};
                if(child.name == "out"){
                    var rotate = child.getChildByName("rotate");
                    var upright = child.getChildByName("upright");
                    rotate.children.forEach(function(dao){
                        dao.children.forEach(function(node){
                            if(node.name == "dao"){
                                if(!SEAT[panelNode.name][child.name].score){
                                    SEAT[panelNode.name][child.name].score = {}
                                }
                                SEAT[panelNode.name][child.name].score[dao.name] = {"x":node.x,"y":node.y}
                            }
                        })
                    })
                    upright.children.forEach(function(dao){
                        dao.children.forEach(function(node){
                            if(node.name == "type"){
                                if(!SEAT[panelNode.name][child.name].type){
                                    SEAT[panelNode.name][child.name].type = {}
                                }
                                SEAT[panelNode.name][child.name].type[dao.name] = {"x":node.x,"y":node.y}
                            }
                        })
                    })
                }
            });
        }.bind(this));
    },

    setSeatInteractable:function(userId,sandUp,isSelf){
        this._playersPanel.children.forEach(function(playerPanel){
            if(playerPanel._userId == userId){
                playerPanel.getChildByName("seat_down").active = sandUp;
            };
            (isSelf && !playerPanel._userId) ? playerPanel.getChildByName("seat_down").active = sandUp:null;

        }.bind(this));
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
            name.getComponent(cc.Label).string = cc.module.utils.fromBase64(data.name);

            cc.module.imageCache.newImage(data.userId,function (spriteFrame) {
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
        }
        else{ // 坐下
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
        var personNum = this._game.form.numOfPerson;
        var playerSeatObj;
        if(personNum==2){
            playerSeatObj = playerSeat2;
        }
        else if(personNum==3){
            playerSeatObj = playerSeat3;
        }
        else if(personNum==4){
            playerSeatObj = playerSeat4;
        }
        else if(personNum==5){
            playerSeatObj = playerSeat5;
        }
        else if(personNum==6){
            playerSeatObj = playerSeat6;
        }
        else if(personNum==7){
            playerSeatObj = playerSeat7;
        }
        else if(personNum==9){
           playerSeatObj = playerSeat;
        }
        this._playersPanel.children.forEach(function(playerPanel){
            if(playerPanel.name == playerSeatObj[seatName]){
                var playerCpt = playerPanel.getComponent("SszPlayer");
                // var isOnRight = (playerPanel._seatName == "right") ? true :false;
                var isOnRight = (playerPanel._seatName.indexOf("right") != -1) ? true :false;
                var isSelf = this.isSelf(playerPanel._userId);
                isOnRight = isSelf?false:isOnRight;
                if( (playerCpt && playerCpt._userId ) || this._isCompareIng){
                    playerCpt.showInfo(player,function(){
                        this.setInfo(player,isOnRight);
                    });
                }
                else{
                    playerCpt && playerCpt.setInfo(player,isOnRight);
                }
            }
        }.bind(this));
    },

    setPlayersPanel:function (data) {
        if(!cc.isValid(this._topPlayers)){
            //上方的一个背景框
            this._topPlayers = this.node.getChildByName("top_player");
        }
        if(!this._playersPanel){
            var prefabMgr = this.getComponent("PrefabMgr"); 
            var personNum = this._game.form.numOfPerson;
            var playersPanel;
            if(personNum==2){
                playersPanel = "ssz_players_panel_2";
            }
            else if(personNum==3){
                playersPanel = "ssz_players_panel_3";
            }
            else if(personNum==4){
                playersPanel = "ssz_players_panel_4";
            }
            else if(personNum==5){
                playersPanel = "ssz_players_panel_5";
            }
            else if(personNum==6){
                playersPanel = "ssz_players_panel_6";
            }
            else if(personNum==7){
                playersPanel = "ssz_players_panel_7";
            }
            else if(personNum==9){
                playersPanel = "ssz_players_panel";
            }
            this._playersPanel = prefabMgr.ctorNodeByName(playersPanel);
            this._playerCpts = this._playersPanel.getComponentsInChildren("SszPlayer");
            this.initSeat();
            this.node.addChild(this._playersPanel);
        }
        var selfInfo = this.getself();
        data.players.forEach(function(player) {
            // 如果玩家没有坐下 或者这个位置有人了
            if(!player.seat || seatToPlayer[player.seat] ){
                var isSelf = this.isSelf(player.userId);
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
                // isSelf?this.changeBtnReadyActive(false):null;
                this._topPlayers.getChildByName("players").addChild(topPlayer);
                return;
            };
            seatToPlayer[player.seat] = player.userId;
            // var seats = this._playersPanel.getChildByName("seat");
            this.setplayerSeat(player.seat,player);
            if(this.isSelf(player.userId)){
                cc.module.self.seat = player.seat;
            }
            // 观战功能
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
    //换座位方法及动画
    seatAnim:function(seatName,data){
        var runTime = 0.2;
        var personNum = this._game.form.numOfPerson;
        var playerSeatObj,positionObj;
        if(personNum==2){
            playerSeatObj = playerSeat2;
            positionObj = position2;
        }
        else if(personNum==3){
            playerSeatObj = playerSeat3;
            positionObj = position3;
        }
        else if(personNum==4){
            playerSeatObj = playerSeat4;
            positionObj = position4;
        }
        else if(personNum==5){
            playerSeatObj = playerSeat5;
            positionObj = position5;
        }
        else if(personNum==6){
            playerSeatObj = playerSeat6;
            positionObj = position6;
        }
        else if(personNum==7){
            playerSeatObj = playerSeat7;
            positionObj = position7;
        }
        else if(personNum==9){
           playerSeatObj = playerSeat;
           positionObj = position;
        }
        if(seatName != "bottom"){               // 点击的位置不是在最底下的
            var seatIndex = positionObj[seatName]; // 假设当前玩家选择的桌位/3
            this._playersPanel.children.forEach(function(panel){
                var action,seatNum,SP;
                seatNum = positionObj[panel._seatName];
                var finished =  cc.callFunc(function(){ 
                    var userInfo = panel.getChildByName("userInfo");
                    var playerCpt = panel.getComponent("SszPlayer");
                    playerCpt && playerCpt.setIsRight(panel._seatName == "top_right_top" || panel._seatName == "mid_right_top" || panel._seatName == "mid_right_bottom" || panel._seatName == "bottom_right_bottom");
                    // playerCpt && playerCpt.setIsRight(panel._seatName == "right");
                }.bind(this));

                var setPlayer = cc.callFunc(function(){
                    panel._seatName = positionObj[SP];  // 给点击的位置名称重新命名
                    var userInfo = panel.getChildByName("userInfo");
                    var seat_down = panel.getChildByName("seat_down");
                    seat_down._seatName = positionObj[SP];
                    if(panel._seatName == "top_right_top" || panel._seatName == "mid_right_top" || panel._seatName == "mid_right_bottom" || panel._seatName == "bottom_right_bottom"){
                        userInfo.getChildByName("gun").setScale(cc.v2(-1, 1));
                        userInfo.getChildByName("lbl_score").setPosition(cc.v2(-100, -16));
                        userInfo.getChildByName("lbl_name").setPosition(cc.v2(-67, 21));
                        userInfo.getChildByName("lbl_name").anchorX = 1;
                        userInfo.getChildByName("lbl_name").getComponent(cc.Label).horizontalAlign = 2;
                        userInfo.getChildByName("deal").anchorX = 1;
                        userInfo.getChildByName("voice").setScale(cc.v2(1, 1));
                        userInfo.getChildByName("interaction").getChildByName("bg").setScale(-1,-1);
                    }else{
                        userInfo.getChildByName("gun").setScale(cc.v2(1, 1));
                        userInfo.getChildByName("lbl_score").setPosition(cc.v2(100, -16));
                        userInfo.getChildByName("lbl_name").setPosition(cc.v2(67, 21));
                        userInfo.getChildByName("lbl_name").anchorX = 0;
                        userInfo.getChildByName("lbl_name").getComponent(cc.Label).horizontalAlign = 0;
                        userInfo.getChildByName("deal").anchorX = 0;
                        userInfo.getChildByName("voice").setScale(cc.v2(-1, 1));
                        userInfo.getChildByName("interaction").getChildByName("bg").setScale(1,-1);
                    };
                    userInfo.children.forEach(function(child){
                        child.x = SEAT[ playerSeatObj[panel._seatName] ][child.name].x;
                        child.y = SEAT[ playerSeatObj[panel._seatName] ][child.name].y;
                        child.anchorX = SEAT[ playerSeatObj[panel._seatName] ][child.name].anchorX;
                        if(child.name == "out"){
                            var rotate = child.getChildByName("rotate");
                            var upright = child.getChildByName("upright");
                            rotate.children.forEach(function(anDao){
                                anDao.children.forEach(function(node){
                                    if(node.name == "dao"){
                                        // node.anchorX = panel._seatName == "right"?1:0;
                                        node.anchorX = (panel._seatName == "top_right_top" || panel._seatName == "mid_right_top" || panel._seatName == "mid_right_bottom" || panel._seatName == "bottom_right_bottom")?1:0;
                                        node.setPosition(cc.v2( SEAT[playerSeatObj[panel._seatName]][child.name].score[anDao.name] ))
                                    }
                                });
                                // if(anDao.name == "total"){
                                //     if(panel._seatName == "top_right_top" || panel._seatName == "mid_right_top" || panel._seatName == "mid_right_bottom" || panel._seatName == "bottom_right_bottom"){
                                //         anDao.anchorX = -1
                                //     }
                                // }
                                // if(anDao.name != "total"){
                                //     var daoNode = anDao.getChildByName("dao");
                                //     var daoP = daoNode.getPosition();
                                //     console.log(daoP)
                                //     var parentNode = anDao.parent;
                                //     var totalNode = parentNode.getChildByName("total");
                                //     if(panel._seatName == "top_right_top" || panel._seatName == "mid_right_top" || panel._seatName == "mid_right_bottom" || panel._seatName == "bottom_right_bottom"){
                                //         daoP.x += 140;
                                //         daoP.y -= 100;
                                //     //     console.log('-------868 sszGame');
                                //         totalNode.setPosition( cc.v2(daoP.x,daoP.y) );
                                //     }
                                //     else{
                                //         totalNode.setPosition( cc.v2(daoP) );
                                //     }
                                // }
                            })
                            upright.children.forEach(function(anDao){
                                anDao.children.forEach(function(node){
                                    if(node.name == "type"){
                                        // node.anchorX = panel._seatName == "right"?1:0;
                                        node.anchorX = (panel._seatName == "top_right_top" || panel._seatName == "mid_right_top" || panel._seatName == "mid_right_bottom" || panel._seatName == "bottom_right_bottom")?1:0;
                                        node.setPosition(cc.v2( SEAT[playerSeatObj[panel._seatName]][child.name].type[anDao.name] ))
                                    }
                                })
                            })
                        }
                    }.bind(this));
                }.bind(this));

                var deleteNum;
                if(personNum==2){
                    SP = (seatNum+1 != 2)?seatNum+1:0;
                    action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer); 
                }
                else if(personNum==3){
                    deleteNum = 1.5-Math.abs(seatIndex-1.5);
                    if(seatIndex>1.5){
                        SP = (seatNum+deleteNum < 3)?seatNum+deleteNum:seatNum+deleteNum-3;
                        action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                    }else if(seatIndex<1.5){
                        SP = (seatNum-deleteNum < 0 )?seatNum-deleteNum+3:seatNum-deleteNum;
                        action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                    }else if( seatIndex ==1.5 ){  // seatIndex ==2  
                        if(seatNum<1.5){
                            SP = seatNum+1.5;
                            action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                        }else{
                            SP = seatNum-1.5;
                            action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer); 
                        }
                    }
                }
                else if(personNum==4){
                    if(seatIndex>2){//4个人
                        SP = (seatNum+1 != 4)?seatNum+1:0;
                        action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                    }
                    else if(seatIndex<2){
                        SP = (seatNum-1 < 0 )?3:seatNum-1;
                        action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                    }
                    else if( seatIndex ==2 ){  // seatIndex ==2  
                        if(seatNum<2){
                            SP = seatNum+2;
                            action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                        }else{
                            SP = seatNum-2;
                            action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer); 
                        }
                    }
                }
                else if(personNum==5){
                    deleteNum = 2.5-Math.abs(seatIndex-2.5);
                    if(seatIndex>2.5){
                        SP = (seatNum+deleteNum < 5)?seatNum+deleteNum:seatNum+deleteNum-5;
                        action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                    }else if(seatIndex<2.5){
                        SP = (seatNum-deleteNum < 0 )?seatNum-deleteNum+5:seatNum-deleteNum;
                        action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                    }else if( seatIndex ==2.5 ){  // seatIndex ==2  
                        if(seatNum<2.5){
                            SP = seatNum+2.5;
                            action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                        }else{
                            SP = seatNum-2.5;
                            action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer); 
                        }
                    }
                }
                else if(personNum==6){
                    deleteNum = 3- Math.abs(seatIndex-3);
                    if(seatIndex>3){//6个人
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
                }
                else if(personNum==7){
                    deleteNum = 3.5-Math.abs(seatIndex-3.5);
                    if(seatIndex>3.5){
                        SP = (seatNum+deleteNum < 7)?seatNum+deleteNum:seatNum+deleteNum-7;
                        action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                    }else if(seatIndex<3.5){
                        SP = (seatNum-deleteNum < 0 )?seatNum-deleteNum+7:seatNum-deleteNum;
                        action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                    }else if( seatIndex ==3.5 ){  // seatIndex ==2  
                        if(seatNum<3.5){
                            SP = seatNum+3.5;
                            action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                        }else{
                            SP = seatNum-3.5;
                            action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer); 
                        }
                    }
                }
                else if(personNum==9){
                    deleteNum = 4.5-Math.abs(seatIndex-4.5);
                    if(seatIndex>4.5){
                        SP = (seatNum+deleteNum < 9)?seatNum+deleteNum:seatNum+deleteNum-9;
                        action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                    }else if(seatIndex<4.5){
                        SP = (seatNum-deleteNum < 0 )?seatNum-deleteNum+9:seatNum-deleteNum;
                        action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                    }else if( seatIndex ==4.5 ){  // seatIndex ==2  
                        if(seatNum<4.5){
                            SP = seatNum+4.5;
                            action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                        }else{
                            SP = seatNum-4.5;
                            action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer); 
                        }
                    }
                }
                // if(seatIndex>2){//4个人
                //     SP = (seatNum+1 != 4)?seatNum+1:0;
                //     action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                // }
                // else if(seatIndex<2){
                //     SP = (seatNum-1 < 0 )?3:seatNum-1;
                //     action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                // }
                // else if( seatIndex ==2 ){  // seatIndex ==2  
                //     if(seatNum<2){
                //         SP = seatNum+2;
                //         action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer);
                //     }else{
                //         SP = seatNum-2;
                //         action = cc.spawn(cc.moveTo(runTime,seatsPosition[SP]),setPlayer); 
                //     }
                // }
                panel.runAction(cc.sequence(action,finished));
            }.bind(this));
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
   
    setOutPreview:function (data) {
        var playerCpt = this.getPlayerCptById(data.userId);
        playerCpt.setOutPreview(data);
    },
    
    setAllScore:function (data) {
        for(var i=0 ; i<data.length ; i++) {
            var playerCpt = this.getPlayerCptById(data[i].userId);
            if(playerCpt) {
                playerCpt.setScore(data[i].score);
            }
        }
    },

    setMenuAlertActive:function(active){
        var menu = this.node.getChildByName("menu");
        menu.getChildByName("menu_alert_bg").active = active;
    },

    /*---------------Get方法---------------------------------*/
    getDefaultHeadimg:function () {
        return this.defaultHeadimg;
    },

    getPokerMgr:function () {
        return this.getComponent("SszPokerMgr");
    },

    getPlayerCptByName:function(name){
        var playerPanel = this._playersPanel.getChildByName(name);
        var playerCpt = playerPanel.getComponent("SszPlayer");
        return playerCpt;
    },

    getPlayerCptById:function (userId) {
        for(var i=0 ; i<this._playerCpts.length ; i++) {
            if(this._playerCpts[i].getId() == userId) {
                return this._playerCpts[i];
            }
        }
    },

    getSszUtil:function () {
        return sszUtil;
    },

    getGame:function(){
        if(this._game){
            return this._game;
        }
    },

    addSocketEventHandler:function () {
        cc.module.socket.on(SEvents.Ssz.EVENT_INTERACTION,this.onReceiveInteraction.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_CHAT,this.onReceiveChat.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_QUICK_CHAT,this.onReceiveQuickChat.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_VOICE_MSG,this.onReceiveVoice.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_EMOJI_MSG,this.onReceiveEmoji.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_PROMPT,this.onReceivePrompt.bind(this));

        cc.module.socket.on(SEvents.Ssz.RECEIVE_DESTROY,this.onReceiveDestroy.bind(this));
        cc.module.socket.on(SEvents.Ssz.RECEIVE_PLAYER_ENTER,this.onReceivePlayerEnter.bind(this));
        cc.module.socket.on(SEvents.Ssz.SEND_LEAVE,this.onReceiveLeave.bind(this));
        cc.module.socket.on(SEvents.Ssz.RECEIVE_READY,this.onReceiveReady.bind(this));
        cc.module.socket.on(SEvents.Ssz.RECEIVE_DEAL,this.onReceiveDeal.bind(this));
        cc.module.socket.on(SEvents.Ssz.RECEIVE_OUT,this.onReceiveOut.bind(this));
        cc.module.socket.on(SEvents.Ssz.RECEIVE_ASK_LEAVE,this.onReceiveAskLeave.bind(this));
        cc.module.socket.on(SEvents.Ssz.RECEIVE_IS_AGREELEAVE,this.onReceiveIsAgreeLeave.bind(this));

        cc.module.socket.on(SEvents.Ssz.EVENT_AGREE_GEM,this.onReceiveAgreeGold.bind(this));
        cc.module.socket.on(SEvents.Ssz.RECEIVE_IS_AGREEGOLD,this.onReceiveIsAgreeGold.bind(this));

        cc.module.socket.on(SEvents.Ssz.RECEIVE_PLAYER_SEAT,this.onReceivePlayerSeat.bind(this));
        cc.module.socket.on(SEvents.Ssz.RECEIVE_PLAYER_STANDUP,this.onReceivePlayerSandUp.bind(this));
        cc.module.socket.on(SEvents.Ssz.PLAYERINSEAT,this.onReceivePlayerInSeat.bind(this));

        cc.module.socket.on(SEvents.Ssz.RECEIVE_COMPARE,this.onReceiveCompare.bind(this));
        cc.module.socket.on(SEvents.Ssz.RECEIVE_TIMEOUT,this.onReceiveTimeOut.bind(this));
        cc.module.socket.setOnReConnectListen(this.onReConnection.bind(this));

        cc.module.socket.on(SEvents.Ssz.RECEIVE_LESS_ADDGOLD,this.onReceiveLessAddGold.bind(this));
    },

    onReceivePrompt:function(data){
        if(data.msg){
            cc.module.wc.show(data.msg,1);
        }
    },

    onReceivePlayerInSeat:function(data){
        clearInterval(this._timeOut);
        cc.module.wc.show(data+"已经在该位置坐下了",true);
    },

    onReceiveInteraction:function(data){
        var formUserId = data.formUserId;
        var toUserId = data.toUserId;
        var emojiName = data.emojiName;
        var interEmoji = null;
        for(var i=0;i<this.emoji.length;i++){
            if(this.emoji[i].name == emojiName){
                interEmoji = cc.instantiate(this.emoji[i]);
            }
        }
        if(!interEmoji){
            return
        }
        interEmoji.zIndex = 10000;

        if(formUserId == toUserId){
            this._playerCpts.forEach(function(playerCpt){
                if( playerCpt._userId && playerCpt._userId != formUserId){
                    var fromPlayerCpt = this.getPlayerCptById(formUserId);
                    var fromPosition = fromPlayerCpt.node.getPosition();
                    var toPosition = playerCpt.node.getPosition();

                    var copyEmoji = cc.instantiate(interEmoji);
                    copyEmoji.setPosition(fromPosition);
                    this.node.addChild(copyEmoji)
                    var finished = cc.callFunc(function(){
                        var animation = copyEmoji.getComponent(cc.Animation);
                        animation.play(emojiName);
                        setTimeout(function(){
                            copyEmoji.removeFromParent(true);
                        },4000)
                    });
                    copyEmoji.runAction(cc.sequence([cc.moveTo(0.5,toPosition),finished]));
                }
            }.bind(this));
        }
        else{
            var fromPlayerCpt = this.getPlayerCptById(formUserId);
            var toPlayerCpt = this.getPlayerCptById(toUserId);
            var fromPosition = fromPlayerCpt.node.getPosition();
            var toPosition = toPlayerCpt.node.getPosition();
            interEmoji.setPosition(fromPosition);

            this.node.addChild(interEmoji)
            var finished = cc.callFunc(function(){
                var animation = interEmoji.getComponent(cc.Animation);
                animation.play(emojiName);
                setTimeout(function(){
                    interEmoji.removeFromParent(true);
                },4000)
            });
            interEmoji.runAction(cc.sequence([cc.moveTo(0.5,toPosition),finished]));
        }
    },

    onReceiveTimeOut:function(data){
        this._endingData = data.timeOut;
        this.showEndingPanel(data.timeOut);
    },

    onReceiveAgreeGold:function(){
        // this.changeBtnReadyActive(true);
    },
    
    onReceiveIsAgreeGold:function(data){//房主接收到玩家申请坐下的信息，是否允许玩家坐下
        console.log(data);
        if(data.gameInGoldIsLack){
            cc.module.wc.show(data.msg,true);
        }
        if(data.userId == cc.module.self.userId){
            return;
        }
        var topAgree = this.node.getChildByName("top_agree");
        if(topAgree){
            var prefabMgr = this.getComponent("PrefabMgr");
            this._topTips = prefabMgr.ctorNodeByName("top_tips");
            var name = this._topTips.getChildByName("lbl_name").getComponent(cc.Label);
            var allowIn = this._topTips.getChildByName("lbl_allow_in").getComponent(cc.Label);
            var lblTime = this._topTips.getChildByName("lbl_time");
            var btnConfirm = this._topTips.getChildByName("btn_confirm");
            var btnCancel = this._topTips.getChildByName("btn_cancel");
            // this._clickSeat = data.info;
            cc.module.utils.addClickEvent(btnConfirm,this.node,"SszGame","onclickAgreeGem",{seatInfo:data.info,code:"1",addGold:data.addGold});
            cc.module.utils.addClickEvent(btnCancel,this.node,"SszGame","onclickAgreeGem",{seatInfo:data.info,code:"0",addGold:data.addGold});
            name.string = data.name;
            allowIn.string = "带入："+data.gold;
            this._timePanel = lblTime;
            lblTime.active = true;
            var timeStr = lblTime.getComponent(cc.Label);
            this._agreeTime = 180;
            timeStr.string = this._agreeTime + "s";
            topAgree.addChild(this._topTips);
            // this._setTime = setTimeout(function(){
            //     this.onclickAgreeGem({seatInfo:data.info,code:"0"});
            // }.bind(this),180000);
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
        if(data.userId == cc.module.self.userId){
            this._askTime = null;
        }
        (isSelf && seatName != "bottom" && this.seatAnim(seatName,data));
        // isSelf?( (!this._isCompareIng && this.changeBtnReadyActive(true)) , cc.module.self.seat = seat):null;
        if(isSelf){
           !this._isCompareIng && this.onClickReady();
            cc.module.self.seat = seat;
            this._clickTime = null;
        }
    },

    onReceivePlayerSandUp:function(data){
        // console.log(data);
        var userId = data.userId;
        var isSelf = this.isSelf(data.userId);
        var players = this._game.players;
        for (var i=0;i<players.length;i++){
            if(players[i].userId == data.userId ){
                players[i].seat = false;
                var watch = this.node.getChildByName("menu").getChildByName("menu_alert_bg").getChildByName("watch").getChildByName("watch");
                var toggle = watch.getComponent(cc.Toggle);
                toggle.isChecked = false;
            }
        }
        var personNum = this._game.form.numOfPerson;
        var playerSeatObj;
        if(personNum==2){
            playerSeatObj = playerSeat2;
        }
        else if(personNum==3){
            playerSeatObj = playerSeat3;
        }
        else if(personNum==4){
            playerSeatObj = playerSeat4;
        }
        else if(personNum==5){
            playerSeatObj = playerSeat5;
        }
        else if(personNum==6){
            playerSeatObj = playerSeat6;
        }
        else if(personNum==7){
            playerSeatObj = playerSeat7;
        }
        else if(personNum==9){
           playerSeatObj = playerSeat;
        }

        //获取它的脚本
        var playerCpt = this.getPlayerCptByName(playerSeatObj[data.seat]);
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
        isSelf?(/*this.changeBtnReadyActive(false) ,*/ cc.module.self.seat = false):null;
        this.setTopPlayer(data,true);
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
            cc.module.wc.show(data.name+"不同意退出",true);
        }
    },  

    onclickOnceAgain:function(){
        cc.again = true;
        clearInterval(this._timeOut);
        cc.director.loadScene("hall");
    },

    onclickAgreeResult:function(e,result){
        var userId = cc.module.self.userId;
        var isAgree = result != "0";
        var btnRefuse = this._agreeLeave.getChildByName("panel").getChildByName("btn_refuse");
        var btnAgree = this._agreeLeave.getChildByName("panel").getChildByName("btn_agree");
        btnRefuse.active = false;
        btnAgree.active = false;
        cc.module.socket.send(SEvents.Ssz.SEND_AGREE_RESULT,{"userId":userId,"isAgree":isAgree});
    },

    onReceiveAskLeave:function(data){
        console.log(data);
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
            cc.module.utils.addClickEvent(btnRefuse,this.node,"SszGame","onclickAgreeResult","0");
            cc.module.utils.addClickEvent(btnAgree,this.node,"SszGame","onclickAgreeResult","1");
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

    onReceiveLeave:function(data){
        var userId = data.userId;
        this._leaveData = data;
        if(!this._isCompareIng){
            if(userId == cc.module.self.userId){
                clearInterval(this._timeOut);
                cc.director.loadScene("hall");
            }else{
                // 其他玩家退出
                this._playerCpts.forEach(function(playerCpt,index){
                    if(playerCpt._userId == userId){
                        this._isCompareIng? playerCpt.hideInfo(function(){this.reset()}) : playerCpt.reset();
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
        }
    },

    /*--------------------------------onClick方法----------------------------*/
    getImage:function(userId,callback){
         cc.module.imageCache.getImage(userId,function (spriteFrame) {
            if(!this.node) {
                return;
            }
            spriteFrame && callback(spriteFrame);
        }.bind(this));
    },

    clickCanvas:function(){
        this.setMenuAlertActive(false);
        this._playersPanel.children.forEach(function(panel){
            var interaction = panel.getChildByName("userInfo").getChildByName("interaction");
            if(interaction){
                interaction.active = false;
            }
        })
    },

    onclickStart:function(){
        cc.module.socket.send(SEvents.Ssz.SEND_GAME_START,null,true);
    },

    onClickAddGold:function(){//点击补充金币
        if(!cc.isValid(this._addGoldPanel)) {
            var prefabMgr = this.getComponent("PrefabMgr");
            this._addGoldPanel = prefabMgr.ctorNodeByName("add_gold_panel");
            this.node.addChild(this._addGoldPanel);
        }
        var pop = this._addGoldPanel.getComponent("Pop");
        pop && pop.pop();
    },

    clickSeat:function(e,data){//点击坐下位置 第一次点击弹出补充金币
        // console.log(e);
        if(cc.module.self.seat){
            return;
        }
        else {//设置补充金币
            var seat = e.target._defaultName;
            var seatName = e.target._seatName;
            var data = {"seat":seat,"seatName":seatName,"userId":cc.module.self.userId};
            this._seatData = data;
            console.log(data);
            // if(this._askTime>0){
            //     cc.module.wc.show("等待房主处理",true);
            //     console.log(this._askTime,'等待房主处理');
            //     return;
            // }
            this._askTime = 180;
            
            // if(this._isAsk){
                var askSeatPanel = this.node.getChildByName("ask_seat_panel");
                askSeatPanel.active = true;
                cc.module.utils.toTop(askSeatPanel);
                this.initAskPanel();
                // this._isAsk = false;
                // cc.module.socket.send(SEvents.Ssz.SEND_GET_SCORE,null,true);
            // }
            // else{
            //     cc.module.socket.send(SEvents.Ssz.SEND_PLAYER_ASK_SEAT,data,true);
            // }
        }
    },

    initAskPanel:function(){
        var askPanel = this.node.getChildByName("ask_seat_panel");
        var slider = askPanel.getChildByName("content").getChildByName("slider");
        this._slider = slider;
        if(slider) {
            cc.module.utils.addSlideEvent(slider,this.node,"SszGame","onSlider");
        };
        var water = this._game.form.gameWater;
        var addIn = this._game.form.gameInGold;
        this._lblAllowin = askPanel.getChildByName("content").getChildByName("lbl_allow_in").getComponent(cc.Label);
        this._lblWealth = askPanel.getChildByName("gold").getChildByName("wealth").getComponent(cc.Label);
        this._lblWater = askPanel.getChildByName("gold").getChildByName("water").getComponent(cc.Label);
        this._lblAllowin.string = addIn;
        this._lblWealth.string = cc.module.self.score;
        this._lblWater.string = addIn*0.1;
        this._Addin = addIn;
    },

    onSlider:function(e){
        var target = e.node;
        var bg = target.getChildByName("bg");
        bg.width = e.progress*490;
        var addIn = this._game.form.gameInGold;
        if(e.progress>=0 && e.progress<=0.4){
            this._lblAllowin.string = addIn;
            this._Addin = addIn;
        }
        else if(e.progress>=0.4 && e.progress<=0.8){
            this._lblAllowin.string = addIn+200;
            this._Addin = addIn+200;
        }
        else if(e.progress>=0.8 && e.progress<=1){
            this._lblAllowin.string = addIn+400;
            this._Addin = addIn+400;
        }
        this._lblWater.string = this._Addin*0.1
    },

    onClickAskSeat:function(data){//带入金币请求坐下
        var data = this._seatData;
        data["addGold"] = this._Addin;
        console.log(data);
        if(this._clickTime){
            cc.module.wc.show("请等待处理！",true);
        }
        else{
            this._clickTime = 180;
            cc.module.socket.send(SEvents.Ssz.SEND_PLAYER_ASK_SEAT,data,true);
        }
    },

    onclickSandUp:function(e,data){
        this.setMenuAlertActive(false);
        var info = {
            code:(data?data:0),
            userId:cc.module.self.userId
        }
        cc.module.socket.send(SEvents.Ssz.SEND_PLAYER_STANDUP,info,true); 
    },

    onClickIsAllowSet:function(){

    },

    onclickAgreeGem:function(e,data){//是否同意坐下，或补充金币
        var isAgree = (data.code != 0);
        // var data = this._clickSeat;
        data.isAgree = isAgree;
        console.log(data);
        cc.module.socket.send(SEvents.Ssz.EVENT_AGREE_GEM,data,false);
    },

    onClickSet:function () {
        if(!cc.isValid(this._setPanel)) {
            var prefabMgr = this.getComponent("PrefabMgr");
            this._setPanel = prefabMgr.ctorNodeByName("set_panel");
            if(this._setPanel) {
                this.node.addChild(this._setPanel);
                var btnSwitch = this._setPanel.getChildByName("panel").getChildByName("btn_switch_account");
                btnSwitch.active = false;
            }
        }
        var pop = this._setPanel.getComponent("Pop");
        pop.pop();
    },

    onclickMenu:function(){
        var menu = this.node.getChildByName("menu");
        var pop = menu.getComponent("Pop");
        var creatorNode = menu.getChildByName("menu_alert_bg").getChildByName("creator");
        creatorNode.active = (this._game.creator == cc.module.self.userId);
        pop.pop();
    },

    onClickChat:function () {
        if(!cc.module.self.seat){
            cc.module.wc.show("观战者不能使用表情",true);
            return;
        }
        cc.module.audioMgr.playUIClick();
        if(!cc.isValid(this._chatPanel)) {
            var prefabMgr = this.getComponent("PrefabMgr");
            this._chatPanel = prefabMgr.ctorNodeByName("chat_panel");
            if(cc.isValid(this._chatPanel)) {
                this.node.addChild(this._chatPanel);
            }
        }
        if(cc.isValid(this._chatPanel)) {
            var pop = this._chatPanel.getComponent("Pop");
            pop.pop();
        }
    },    

    onClickEmoji:function () {
        if(!cc.module.self.seat){
            cc.module.wc.show("观战者不能使用表情",true);
            return;
        }
        cc.module.audioMgr.playUIClick();
        if(!cc.isValid(this._emojiPanel)) {
            var prefabMgr = this.getComponent("PrefabMgr");
            this._emojiPanel = prefabMgr.ctorNodeByName("emoji_panel");
            if(cc.isValid(this._emojiPanel)) {
                this.node.addChild(this._emojiPanel);
            }
        }
        if(cc.isValid(this._emojiPanel)) {
            var pop = this._emojiPanel.getComponent("Pop");
            pop.pop();
        }
    },

    onclickInteraction:function(data){
        var formUserId = cc.module.self.userId;
        var toUserId = data.userId;
        var emojiName = data.emojiName;
        var emojiData = {"formUserId":formUserId,"toUserId":toUserId,"emojiName":emojiName};
        cc.module.socket.send(SEvents.Ssz.EVENT_INTERACTION,emojiData,true);
    },

    onClickReady:function () {
        cc.module.audioMgr.playUIClick();
        cc.module.socket.send(SEvents.Ssz.SEND_READY,null,true);
    },

    onClickLeave:function () {
        cc.module.audioMgr.playUIClick();
        if(!cc.isValid(this._askLeavePanel)) {
            var prefabMgr = this.getComponent("PrefabMgr");
            this._askLeavePanel = prefabMgr.ctorNodeByName("ssz_ask_leave_panel");
            if(cc.isValid(this._askLeavePanel)) {
                this.node.addChild(this._askLeavePanel);
                var panel = this._askLeavePanel.getChildByName("panel");
                var btnAsk = panel.getChildByName("btn_ask");
                cc.module.utils.addClickEvent(btnAsk,this.node,"SszGame","onClickAskLeaveConfirm","0");
            }
        }
        if(this._askLeavePanel) {
            var hint = this._askLeavePanel.getChildByName("panel").getChildByName("hint");
            hint.getComponent(cc.Label).string = "是否离开房间";
            var pop = this._askLeavePanel.getComponent("Pop");
            pop.pop();
            this.setMenuAlertActive(false);
        }
    },

    onClickAskLeaveConfirm:function (e,data) {
        cc.module.socket.send(SEvents.Ssz.SEND_LEAVE,{"userId":cc.module.self.userId,"destroy":data==1},true);
        var pop = this._askLeavePanel.getComponent("Pop");
        pop.unpop();
    },

    onClickDestroy:function () {
        cc.module.audioMgr.playUIClick();
        if(!cc.isValid(this._askLeavePanel)) {
            var prefabMgr = this.getComponent("PrefabMgr");
            this._askLeavePanel = prefabMgr.ctorNodeByName("ssz_ask_leave_panel");
            if(cc.isValid(this._askLeavePanel)) {
                this.node.addChild(this._askLeavePanel);
                var panel = this._askLeavePanel.getChildByName("panel");
                var btnAsk = panel.getChildByName("btn_ask");
                cc.module.utils.addClickEvent(btnAsk,this.node,"SszGame","onClickAskLeaveConfirm","1");
            }
        }
        if(this._askLeavePanel) {
            var hint = this._askLeavePanel.getChildByName("panel").getChildByName("hint");
            var msg = "";
            if(cc.module.self.seat){
                msg = "是否解散房间";
            }else{
                msg = "不在座位不能解散房间\n 是否离开房间？";
            }
            hint.getComponent(cc.Label).string = msg;
            var pop = this._askLeavePanel.getComponent("Pop");
            pop.pop();
            this.setMenuAlertActive(false);
        }
    },

    onClickMall:function(){
        var prefabMgr = this.getComponent("PrefabMgr");
        this._mallPanel = prefabMgr.ctorNodeByName("mall_panel");
        if(this._mallPanel){
            this.node.addChild(this._mallPanel);
        }
    },

    onClickShuffle: function onClickShuffle() {
        console.log('----shuffle');
        //cc.module.wc.show("暂未开通此功能", true);
        this.setShuffleStatus(false);
        var shuffleNode = this.node.getChildByName("shuffle");
        var animation = shuffleNode.getComponent(cc.Animation);
        animation.play();
        shuffleNode.active = true;
        setTimeout(function () {
            shuffleNode.active = false;
        }, 3000);

 /*       var copyShuffle = cc.instantiate(shuffleNode);
        copyShuffle.active = true;
        this.node.addChild(copyShuffle);
        
        var animation = copyShuffle.getComponent(cc.Animation);
        animation.play();
        setTimeout(function () {
            copyShuffle.removeFromParent(true);
        }, 4000);*/

        // var finished = cc.callFunc(function () {
        //     var animation = copyShuffle.getComponent(cc.Animation);
        //     animation.play(emojiName);
        //     setTimeout(function () {
        //         copyShuffle.removeFromParent(true);
        //     }, 4000);
        // });
        // copyShuffle.runAction(cc.sequence([cc.moveTo(0.1, toPosition), finished]));
    },

    /*---------------------------------OnReceive Socket Events--------------*/

    onReConnection:function () {
        clearInterval(this._timeOut);
        cc.director.loadScene("login");
        //此处处理断线重连问题
    },

    setRoomTimeOut:function(time){
        clearInterval(this._timeOut);
        this._time = time;
        var H = Math.floor(time/60);
        var S = time- Math.floor(time/60)*60;
        S = S<10?"0"+S:S;
        this.timeOut.string = (H+":"+S);

        this._timeOut = setInterval(function(){
            if(!this._timeOut){
                clearInterval(this._timeOut);
                return;
            }
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

    returnTimeOut:function(){
        // if(this._intervalTime){
        //     return this._intervalTime;
        // }
        if(this._time){
            return this._time;
        }
    },

    onReceiveGameInfo:function (data) {
        console.log(data);
        if(cc.isValid(data.errcode)) {
            clearInterval(this._timeOut);
            cc.director.loadScene("hall");
            return;
        }
        this._game = data;
        this.setWebShareMsg();
        this.addSocketEventHandler();
        this.setGameInfoPanel(data);
        this.setPlayersPanel(data);
        data.index == 0 ? this.setRoomTimeOut(data._intervalTime):this.timeOut.string = "";
        this._intervalTime = data._intervalTime;
        data.players.forEach(function (player) {
            // console.log(player);
            cc.module.imageCache.setImage(player.userId,player.headimg);   
            if(player.cardData && player.cardData.cards) {
                if(player.out != null && data.status == "wait_out"){
                    this.onReceiveOut({"userId":player.userId,"isSpecial":player.out.isSpecial});
                }
                else if(player.out == null && data.status == "wait_out"){
                    var playerCpt = this.getPlayerCptById(player.userId);
                    if(playerCpt){
                        playerCpt.deal();
                    }
                    if(this.isSelf(player.userId)){
                        var callfun = cc.callFunc(function () {
                            this.setMatePanelCards(player.cardData,data.countdown);
                        }.bind(this));
                        this.node.runAction(callfun);
                    }
                }
                var playerCpt = this.getPlayerCptById(player.userId);
                if(cc.isValid(playerCpt)) {
                    playerCpt.changeReadyActive(false);
                }
            
            }            
            if (data.status == "wait_ready") {
                if( !player.readyStatus){
                    if(this.isSelf(player.userId) /*&& data.index >0*/ && player.seat){
                        // !this._isCompareIng && this.changeBtnReadyActive(true);
                        this.onClickReady();
                    }
                }else{
                    var playerCpt = this.getPlayerCptById(player.userId);  
                    if(cc.isValid(playerCpt)) {
                        playerCpt.changeReadyActive(true);
                    }
                }
            };
        }.bind(this));
        if(this.getself() && this.getself().seat && data.requestLeave){
            data.applyLeave.dissolveTime -= 2;
            setTimeout(function(){
                this.onReceiveAskLeave(data.applyLeave);
            }.bind(this),1000)
        }
    },

    onReceiveDestroy:function (data) {
        clearInterval(this._timeOut);
        this.showEndingPanel(data);   
    },

    onReceivePlayerEnter:function (data) {
        cc.module.imageCache.setImage(data.userId,data.headimg);  
        this.setTopPlayer(data,true);
        this._game.players.push(data);
    },

    onReceiveReady:function (data) {
        var playerCpt = this.getPlayerCptById(data.userId);
        if(cc.isValid(playerCpt)) {
            playerCpt.changeReadyActive(true);
            // if(cc.module.self.leaf>=20){//洗牌按钮
            //     this.setShuffleStatus(true);
            // }
        }
        if(this.isSelf(data.userId)) {
            // this.changeBtnReadyActive(false);
            if(this._summaryPanel) {
                var pop = this._summaryPanel.getComponent("Pop");
                pop.unpop();
            }
        }
        if(data.countdown){
            var str = this.node.getChildByName("tips");
            str.active = true;
            str.getChildByName("lbl_tips").getComponent(cc.Label).string = "游戏即将开始：" + data.countdown;
            this._countdownTime = data.countdown;
            if(cc.module.self.leaf>=20){//洗牌按钮
                this.setShuffleStatus(true);
            }
        }
    },

    setTips:function(data){
        var str = this.node.getChildByName("tips");
        str.active = true;
        data.countdown > 0 ? str.getChildByName("lbl_tips").getComponent(cc.Label).string = "游戏即将开始：" + Math.ceil(data.countdown) : str.active = false;
    },

    onReceiveDeal:function (data) {
        console.log(data,'------1294');
        this.setShuffleStatus(false);
        clearInterval(this._timeOut) , this.timeOut.string = "";
        this._roomIndex = data.index;
        if( this._summaryPanel ){
            this._summaryPanel.active = false;
        }
        cc.module.audioMgr.playSFX("ssz_deal.mp3");
        if(this._playerCpts) {
            this._playerCpts.forEach(function (playerCpt) {
                playerCpt._userId && (
                    playerCpt.deal(),
                    playerCpt.changeReadyActive(false) 
                )
            }.bind(this));
        }
        var delayAction = cc.delayTime(1.2);
        var callfun = cc.callFunc(function () {
            data.cards && this.setMatePanelCards(data,data.time-1.2);
        }.bind(this));
        // this.changeBtnReadyActive(false);
        this.node.runAction(cc.sequence([delayAction,callfun]));
    },

    retrunRoomIndex:function(){
        if(this._roomIndex){
            return this._roomIndex;
        }
    },

    onReceiveOut:function (data) {
        if(this.isSelf(data.userId)) {
            this.alterMatePanelActive(false);
        }
        var playerCpt = this.getPlayerCptById(data.userId);
        playerCpt.out(data.isSpecial);
        this.setShuffleStatus(false);
    },

    onReceiveChat:function(data){
        var userId = data.userId;
        var chat = data.chat;
        var playerCpt = this.getPlayerCptById(userId);
        if(playerCpt) {
            playerCpt.setChat(chat);
        }
    },

    onReceiveQuickChat:function (data) {
        var userId = data.userId;
        var chatId = data.chatId;
        var playerCpt = this.getPlayerCptById(userId);
        if(playerCpt) {
            playerCpt.quickChat(chatId);
        }
        cc.module.audioMgr.playBySex(playerCpt.getSex(),"chat/"+chatId+".mp3");
    },

    onReceiveVoice:function (data) {
        if(cc.sys.isBrowser){
            var content = JSON.parse(data.content)
            window.downloadVoice && window.downloadVoice(content.msg);
            var playerCpt = this.getPlayerCptById(data.sender);
            playerCpt && playerCpt.voice(content.time/1000);
        }else{
            this._voices.push(data);
            this.playVoice();
        }
    },

    onReceiveEmoji:function (data) {
        if(data.userId != cc.module.self.userId){
            var playerCpt = this.getPlayerCptById(data.userId);
            playerCpt && playerCpt.emoji(data.emoji);
        }
    },

    onReceiveCompare:function (data) {
        console.log(data);
        this.stopTimer();
        this._isCompareIng = true;
        if(cc.isValid(data) && cc.isValid(data.detail)) {
            this._playerCpts.forEach(function (playerCpt) {
                if(cc.isValid(data.detail[playerCpt.getId()])) {
                    playerCpt.setCompareData(data.detail[playerCpt.getId()].out);
                }
            }.bind(this));
            //比头道
            var touOrder = [];
            var zhongOrder = [];
            var weiOrder = [];
            var special = [];
            var allShow = [];
            for(var i in data.detail) {
                if(data.detail[i].out.isSpecial) {
                    // console.log(" 特殊牌型 ",data.detail[i].out);
                    special.push( 
                        {
                            "score":returnSpecialScoreFun(data.detail[i].out.isSpecial),
                            "userId":i
                        }
                    );
                }
                else if (this._game.form.isAllShow) {
                    allShow.push(
                        {
                            "userId":i
                        }
                    );
                }
                else {
                    //i即是userId
                    var item1 = {
                        score:data.detail[i].out.tou.score,
                        userId:i
                    };
                    var item2 = {
                        score:data.detail[i].out.zhong.score,
                        userId:i
                    };
                    var item3 = {
                        score:data.detail[i].out.wei.score,
                        userId:i
                    };
                    touOrder.push(item1);
                    zhongOrder.push(item2);
                    weiOrder.push(item3);
                }
            }
            var sortFun = function (player1,player2) {
                return player1.score-player2.score;
            };
            touOrder.sort(sortFun);
            zhongOrder.sort(sortFun);
            weiOrder.sort(sortFun);
            special.sort(sortFun);
            var beginCompare = this.gameInfoPanel.getChildByName("begin_compare");
            var pop = beginCompare.getComponent("Pop");
            pop.pop(true);
            cc.module.audioMgr.playBySex(cc.module.self.sex,"ssz/start_compare.mp3");
            var time = 2;
            var actions = [];
            var forEachFun = function (item,dao) {
                var delayAction = cc.delayTime(time);
                if(time === 2) {
                    time = 1;
                }
                var callFun = cc.callFunc(function () {
                    pop.unpop();
                    var type = data.detail[item.userId].out[dao].type;
                    var score ;
                    var mp3Url = "ssz/"+type+".mp3";
                    if(dao === "tou") {
                        score = data.detail[item.userId].out.touScore;
                        if(type === "st") {
                            mp3Url = "ssz/cs.mp3";  // 冲三
                        }
                    }
                    else if(dao === "zhong") {
                        if(type === "hl") {
                            mp3Url = "ssz/zdhl.mp3";  // 中顿葫芦
                        }
                        score = data.detail[item.userId].out.zhongScore;
                    }else{
                        score = data.detail[item.userId].out.weiScore;
                    }
                    cc.module.audioMgr.playBySex(cc.module.self.sex,mp3Url);
                    var playerCpt = this.getPlayerCptById(item.userId);
                    var isSelf = this.isSelf(item.userId);
                    playerCpt.showAnDao(dao,score,isSelf);
                }.bind(this));
                actions.push(delayAction,callFun);
            }.bind(this);
            //比每一道
            touOrder.forEach(function (item) {
                forEachFun(item,"tou");
            }.bind(this));
            zhongOrder.forEach(function (item) {
                forEachFun(item,"zhong");
            }.bind(this));
            weiOrder.forEach(function (item) {
                forEachFun(item,"wei");
            }.bind(this));
            //全比
            allShow.forEach(function(item){
                var delayAction = cc.delayTime(time);
                if(time === 2) {
                    time = 1;
                }
                var callFun = cc.callFunc(function(){
                    pop.unpop();
                    var playerCpt = this.getPlayerCptById(item.userId);
                    playerCpt && playerCpt.showAllCards();
                }.bind(this));
                actions.push(delayAction,callFun);
            }.bind(this));
            //特殊牌
            special.forEach(function(item){
                var delayAction = cc.delayTime(time);
                if(time === 2) {
                    time = 1;
                }
                var callFun = cc.callFunc(function(){
                    pop.unpop();
                    var score = item.score;
                    var mp3Url = "ssz/"+returnSpecialScoreFun(score)+".mp3";
                    this.specialAnim(returnSpecialScoreFun(score));
                    cc.module.audioMgr.playBySex(cc.module.self.sex,mp3Url);
                    var playerCpt = this.getPlayerCptById(item.userId);
                    playerCpt && playerCpt.showAllDao();
                }.bind(this));
                actions.push(delayAction,callFun);
            }.bind(this));
            //打枪动画
            data.hitGuns.forEach(function (hitGun) {
                var hitGunDelayAction = cc.delayTime(1.6);
                var hitGunSFX = cc.callFunc(function () {
                    cc.module.audioMgr.playBySex(cc.module.self.sex,"ssz/daqiang.mp3");
                });
                var hitGunDelayAction2 = cc.delayTime(0.4);
                var hitGunCallFun = cc.callFunc(function () {
                    var fromPlayerCpt = this.getPlayerCptById(hitGun.from);
                    var toPlayerCpt = this.getPlayerCptById(hitGun.to);
                    if(fromPlayerCpt && toPlayerCpt) {
                        var fromWorldSpaceAR = fromPlayerCpt.getWorldSpaceAR();
                        var toWorldSpaceAR = toPlayerCpt.getWorldSpaceAR();
                        var rotate = this.convertToRotate(fromWorldSpaceAR,toWorldSpaceAR);
                        fromPlayerCpt.playHitGunAnim(rotate);
                        toPlayerCpt.playBeHitGunAnim();
                    }
                }.bind(this));
                actions.push(hitGunDelayAction,hitGunSFX,hitGunDelayAction2,hitGunCallFun);
            }.bind(this));

            if(cc.isValid(data.allHitGun)) {
                // if(!this._sszAnimPanel){
                //     var prefabMgr = this.getComponent("PrefabMgr");
                //     this._sszAnimPanel = prefabMgr.ctorNodeByName("ssz_anim_panel");
                //     if(this._sszAnimPanel) {
                //         this.node.addChild(this._sszAnimPanel);
                //     }
                // }
                var allHitGunCallFun = cc.callFunc(function () {
                    this.playAllHitGunAnim();
                }.bind(this));
                actions.push(allHitGunCallFun);
            }
            //显示小结
            var summaryDelayAction = cc.delayTime(3);
            var summaryCallFun = cc.callFunc(function () {
                this._isCompareIng = false;
                this.setAllScore(data.scores);
                if(cc.isValid(data.ending)) {
                    this.showSummaryPanel(data.detail,function(){
                        clearInterval(this._timeOut);
                        this.showEndingPanel(data.ending);
                        this.timeOut.string = "";
                    });
                }
                else {
                    this.showSummaryPanel(data.detail);
                }
                if(this._leaveData){
                    this.onReceiveLeave(this._leaveData);
                }
            }.bind(this));
            actions.push(summaryDelayAction,summaryCallFun);
            this.node.runAction(cc.sequence(actions));
        }
        function returnSpecialScoreFun(type){
            var specialTypes = {
                IS_QL:13,
                IS_YTL:12,
                IS_SRHZ:11,
                IS_STHS:10,
                IS_SFTX:9,
                IS_QD:8,
                IS_QX:7,
                IS_CYS:6,
                IS_STST:5,
                IS_WDST:4,
                IS_LDB:3,
                IS_SSZ:2,
                IS_STH:1,
                13:"zzql",   // 至尊青龙
                12:"ytl",   // 一条龙
                11:"srhz",
                10:"sths", // 三同花顺
                9:"sftx", // 三分天下
                8:"qd",
                7:"qx",
                6:"cys",   
                5:"stst", // 四套三条
                4:"wdst", 
                3:"ldb",   // 六岁半
                2:"ssz",   // 三顺子
                1:"sth"    // 三同花
            };
            return specialTypes[type];
        };
    },
    /*-----------------------------------------------------------------------*/

    changeBtnReadyActive:function (active) {
        return;
        var btnReady = this.node.getChildByName("menu_panel").getChildByName("btn_ready");
        btnReady.active = active;
    },

    setMatePanelCards:function (data,time) {//设置牌面板
        if(!cc.isValid(this._matePanel)) {
            var prefabMgr = this.getComponent("PrefabMgr");
            this._matePanel = prefabMgr.ctorNodeByName("ssz_mate_panel");
            if(this._matePanel) {
                this.node.addChild(this._matePanel);
            }
        }
        if(this._matePanel) {
            var pop = this._matePanel.getComponent("Pop");
            pop.pop();
            var sszMateCpt = this._matePanel.getComponent("SszMate");
            var isSpecial = (this._game.form.gameRule != "qys" && this._game.form.gameRule !="sbp" && this._game.form.gameRule != "bbc" && this._game.form.gameRule!="wpc");
            this._game.changeCard = data.changeCard;
            sszMateCpt.setCards(data.cards,time,isSpecial,data.changeCard);
            this.startTimer(time);
        }
    },

    alterMatePanelActive:function (active) {
        if(this._matePanel) {
            this._matePanel.active = active;
        }
    },

    convertToRotate:function (space1,space2) {
        var detailX = space2.x - space1.x;
        var detailY = space2.y - space1.y;
        return Math.atan2(detailY,detailX)*180/Math.PI;
    },

    showSummaryPanel:function (data,overrideReady) {
        this._isCompareIng = false;
         for(var userId in data){
            var isSelf = this.isSelf(userId);
            isSelf && cc.module.audioMgr.playBySex(cc.module.self.sex,"ssz/"+(data[userId].gap>0?"win.mp3":"lose.mp3"));
        }
        if(!cc.isValid(this._summaryPanel)) {
            var prefabMgr = this.getComponent("PrefabMgr");
            this._summaryPanel = prefabMgr.ctorNodeByName("ssz_summary_panel");
            if(cc.isValid(this._summaryPanel)) {
                this.node.addChild(this._summaryPanel);
            }
        }
        if(this._summaryPanel) {
            var pop = this._summaryPanel.getComponent("Pop");
            pop.pop();
            var summaryCpt = this._summaryPanel.getComponent("SszSummary");
            summaryCpt.setSummary(data,this._game,overrideReady);
        }
        
        for(var i=0;i<this._playerCpts.length;i++){
            var playerCpt = this._playerCpts[i];
            playerCpt._isCompareIng = false;
            if(playerCpt._callFun){
                playerCpt._callFun();
                playerCpt._callFun = false;
            }
        }
        this.setClickReadyCallBack(overrideReady);
        overrideReady && setTimeout(function(){
            this._clickReadyCallBack();
            this._summaryPanel.active = false;
            cc.module.self.seat = false;
        }.bind(this),1000);
        if(this._endingData){
            this.showEndingPanel(this._endingData);
        }
    },

    playVoice:function () {
        if(this._voices.length) {
            var data = this._voices.shift();
            var msgInfo = JSON.parse(data.content);
            var msgfile = "voicemsg.amr";
            this._voiceTime = msgInfo.time/1000;
            var playerCpt = this.getPlayerCptById(data.sender);
            playerCpt && playerCpt.voice(msgInfo.time/1000);

            cc.module.voiceMgr.writeVoice(msgfile,msgInfo.voice);
            cc.module.voiceMgr.play(msgfile);
        }
        else {
            cc.module.audioMgr.resumeAll();
        }
    },

    playAllHitGunAnim:function () {
        var quanLeiDa = this.node.getChildByName("quanleida");
        var pop = quanLeiDa.getComponent("Pop");
        pop.pop();
        var finished = cc.callFunc(function(){
            quanLeiDa.active = false;
            quanLeiDa.setScale(1,1);
        }) 
        var action = cc.sequence(cc.scaleTo(0.2,2.5,2.5),cc.delayTime(3),finished)
        quanLeiDa.runAction(action);
        cc.module.audioMgr.playBySex(cc.module.self.sex,"ssz/qld.mp3");
    },

    //同乐的表情
    playEmoji:function(emojiName){
        var emojiNode = this.node.getChildByName("emoji");
        emojiNode.removeAllChildren();
        if(emojiName){
            var interEmoji = null;
            for(var i=0;i<this.emoji.length;i++){
                if(this.emoji[i].name == emojiName){
                    interEmoji = cc.instantiate(this.emoji[i]);
                }
            }
            if(!interEmoji){
                return
            }
            emojiNode.addChild(interEmoji);
            interEmoji.zIndex = 10000;
            var animation = interEmoji.getComponent(cc.Animation);
            animation.play(emojiName);
        }
    },

    changeAgreeTime:function(time){
        var lblTime = this._topTips.getChildByName("lbl_time");
        var timeStr = lblTime.getComponent(cc.Label);
        timeStr.string = Math.ceil(time) + "s";
    },

    changeAskSeatTime:function(time){
        var askSeatPanel = this.node.getChildByName("ask_seat_panel");
        var lblTime = askSeatPanel.getChildByName("title").getChildByName("lbl_time").getComponent(cc.Label);
        var timeStr = lblTime.getComponent(cc.Label);
        timeStr.string = Math.ceil(time) + "s";
        if(time==1){
            askSeatPanel.active = false;
        }
    },

    showEndingPanel:function (data) {
        if(!this._isCompareIng){
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
                sszEndingCpt.ending(data,"ssz");
            }
        }
    },

    isSelf:function (userId) {
        return userId==cc.module.self.userId;
    },

    onReceiveLessAddGold:function(data){//发送给后台
        if(data){
            var userId = cc.module.self.userId;
            var addGold = data.addGold;
            var url = "http://120.27.229.21/tongle/addscore/add_score.php?id="+userId +"&code="+addGold;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    console.log(response,'------61');
                    if(response){
                        console.log('向后台发送成功----');
                    }
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        }   
    },

    update: function (dt) {
        if(this._voiceTime && this._voiceTime>0) {
            this._voiceTime -= dt;
            if(this._voiceTime<=0) {
                this._voiceTime = null;
                this.playVoice();
            }
        }
        if(this._topTips && this._agreeTime && this._agreeTime>0){
            this._agreeTime -= dt;
            this.changeAgreeTime(this._agreeTime);
            if(this._agreeTime<=0){
                this._agreeTime = null;
                this._topTips.active = false;
                this._timePanel = null;
            }
        }
        if(this._askTime && this._askTime>0){
            this._askTime -= dt;
            this.changeAskSeatTime(this._askTime);
            if(this._askTime<=0){
                this._askTime = null;
            }
        }
        if(this._clickTime && this._clickTime>0){
            this._clickTime -= dt;
            if(this._clickTime<=0){
                this._clickTime = null;
            }
        }
        if(this._countdownTime && this._countdownTime>0){
            this._countdownTime -= dt;
            this.setTips({countdown:this._countdownTime});
            if(this._countdownTime<=0){this._countdownTime = null};
        }
    }
});
