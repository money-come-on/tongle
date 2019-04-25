var BP = {
    "jin":null,
    "long":null,
    "chu":null,
    "hu":null,
};
const quickChatMsg = {
    0:"快点啊，等得花儿都谢了",
    1:"不要吵了，不要吵了，专心玩游戏吧",
    2:"不要走，决战到天亮",
    3:"底牌亮出来，绝对吓死你",
    4:"风水轮流转，底裤都输光了",
    5:"看我通杀全场，这些钱都是我的",
    6:"不好意思，我要离开一会儿",
    7:"怎么又断线，网络怎么这么差啊",
}
var BT = {
    "hu":{total:0,betting:0},
    "jin":{total:0,betting:0},
    "chu":{total:0,betting:0},
    "long":{total:0,betting:0},
};

cc.Class({
    extends: cc.Component,

    properties: {
        BaoBack:cc.Prefab,
        boxs:{
            default:[],
            type:cc.SpriteFrame,
        },
        jin:cc.SpriteFrame,
        chu:cc.SpriteFrame,
        hu:cc.SpriteFrame,
        long:cc.SpriteFrame,

        baojin:cc.SpriteFrame,
        baochu:cc.SpriteFrame,
        baohu:cc.SpriteFrame,
        baolong:cc.SpriteFrame,

        chip1:cc.Prefab,
        chip10:cc.Prefab,
        chip50:cc.Prefab,
        chip100:cc.Prefab,

        _gameInfoPanel:null,
        _timerPanel:null,
        _bankerPanel:null,
        _playersListPanel:null,
        _recordPanel:null,
        _selfPanel:null,
        _selectBao:null,
        _baoNode:null,
        _gamePanel:null,
        _evil:false,

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
        this._gameInfoPanel = this.node.getChildByName("gameInfo");
        this._timerPanel = this.node.getChildByName("timer");
        this._bankerPanel = this.node.getChildByName("banker");
        this._playersListPanel = this.node.getChildByName("players_panel");
        this._selfPanel = this.node.getChildByName("self_panel");
        this._gamePanel = this.node.getChildByName("game");
        this._recordPanel = this.node.getChildByName("record_panel");
        this._detailsPanel = this.node.getChildByName("details");
        this._chiAnimNode = this.node.getChildByName("chipAnim");
        this._wc = this.node.getChildByName("wait_conn_panel");
        var baosNode = this._gamePanel.getChildByName("bao");
        baosNode.children.forEach(function(bao){
            if(bao.name !="box"){
                BP[bao.name] = bao.getPosition();
                bao.x = 0;
                bao.y = 0;
            }
        })
    },

    start:function(){
        BT = {
            "hu":{total:0,betting:0},
            "jin":{total:0,betting:0},
            "chu":{total:0,betting:0},
            "long":{total:0,betting:0},
        };
        cc.module.self.seat = true;
        this._isPlaying = false;

        this.initBetting(BT);
        this.initTimer();
        cc.module.socket.send(SEvents.SEND_GET_GAME_INFO,null,true);
        cc.module.socket.on(SEvents.RECEIVE_GAME_INFO,this.onReceiveGameInfo.bind(this));
    },
    setWebShareMsg:function(data){
        if(cc.sys.isBrowser){
            var numOfPlayer = data.form.numOfPlayer;
            var numOfGame = data.form.numOfGame;
            var baseScore = data.form.baseScore;
            var time = data.form.time;
            var roomId = data.roomId;
            var uuid = data.uuid;

            var shareTitle ="铜宝，底分"+baseScore;
            var shareDes = "房间号"+roomId+"，"+cc.module.self.nickname.slice(0,6)+"在宁波游戏中创建"+numOfPlayer+"人，"+numOfGame+"局，"+"底分： "+baseScore+"分，下注时间："+time+"秒"+"的房间，点击进入房间";
            cc.sys.localStorage.setItem("roomId",roomId);
            cc.sys.localStorage.setItem("shareTitle",shareTitle);
            cc.sys.localStorage.setItem("recordUuid",uuid);

            cc.sys.localStorage.setItem("shareTitle",shareTitle);
            cc.sys.localStorage.setItem("shareDes",shareDes);
            (window.shareToTimeLine && window.shareToTimeLine());
            (window.shareToSession && window.shareToSession());
        }

    },

    boxAnima:function(code,callback){
       var box = this._gamePanel.getChildByName("bao").getChildByName("box")
       var boxScr = box.getComponent("Cb_anim");
       boxScr && boxScr.playOnce(code,callback);
    },

    addSocketEventHandler:function(){
        cc.module.socket.on(SEvents.RECEIVE_VOICE_MSG,this.onReceiveVoice.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_CHAT,this.onReceiveChat.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_QUICK_CHAT,this.onReceiveQuickChat.bind(this));
        cc.module.socket.on(SEvents.cb.CB_NEW_PLAYER_ENTER,this.onReceivePlayerEnter.bind(this));
        cc.module.socket.on(SEvents.cb.CB_LEAVE_ROOM_EVENT,this.onReceiveLeaveRoom.bind(this))
        cc.module.socket.on(SEvents.cb.CB_DISSOLVE_ROOM_EVENT,this.onReceiveDissolveRoom.bind(this))

        cc.module.socket.on(SEvents.cb.CB_START_GAME_EVENT,this.onReceiveStartGame.bind(this));
        cc.module.socket.on(SEvents.cb.CB_NEXT_GAME_EVENT,this.onReceiveNextGame.bind(this));
        cc.module.socket.on(SEvents.cb.CB_TURN_ON_EVENT,this.onReceiveTurnOn.bind(this));
        cc.module.socket.on(SEvents.cb.CB_GAME_END_EVENT,this.onReceiveGmaeEnd.bind(this));

        cc.module.socket.on(SEvents.cb.CB_BANKER_PUSH_BAO_EVENT,this.onReceiveBankerPushBao.bind(this));
        cc.module.socket.on(SEvents.cb.CB_RESET_BETTING_EVENT,this.onReceiveResetBetting.bind(this));
        cc.module.socket.on(SEvents.cb.CB_PLAYER_BETTING_EVENT,this.onReceivePlayerBetting.bind(this));
        cc.module.socket.on(SEvents.cb.CB_CAN_BETTING_EVENT,this.onReceiveCanBetting.bind(this));
        cc.module.socket.on(SEvents.cb.CB_AGAIN_EVENT,this.onReceiveAgain.bind(this));
        cc.module.socket.setOnReConnectListen(this.onReConnection.bind(this));
    }, 
    onReConnection:function(){
        cc.director.loadScene("login");
    },
    onReceiveVoice:function (data) {
        console.log(data)
        if(cc.sys.isBrowser){
            var content = JSON.parse(data.content)
            window.downloadVoice && window.downloadVoice(content.msg);
            this.onChat("[语音]",data.sender)
        }else{
            // this._voices.push(data);
            // this.playVoice();
        }
    },

    onReceiveChat:function(data){
        console.log(data);
        this.onChat(data.chat,data.userId)
    },
    onReceiveQuickChat:function(data){
        // quickChatMsg
        var str = quickChatMsg[data.chatId];
        this.onChat(str,data.userId)
    },
    onChat:function(str,userId){
        var playerName = "";
        var userId = userId;
        this._gameData.players.forEach(function(player){
            if(player.userId == userId){
                playerName = player.name;
            }
        })
        var chatMsg = this.node.getChildByName("chat_msg");
        var content = chatMsg.getChildByName("mask").getChildByName("content");
        var msg = chatMsg.getChildByName("msg");
        var newMsg = cc.instantiate(msg);
        newMsg.getComponent(cc.Label).string = playerName+"："+str;
        newMsg.active = true;
        content.addChild(newMsg);
    },

    onReceiveAgain:function(data){
        if(data.errcode){
            cc.module.wc.show(data.errmsg,true);
            var pop = this._wc.getComponent("Pop");
            pop && pop.setConfirmCallback(function(){
               cc.director.loadScene("hall");
            });
            return;
        };
        var again = data.again;
        var win = this._gamePanel.getChildByName("win");
        this.stopAction(win);
        this._endIng = false;
        this._isPlaying = false;
        if(again){
            cc.module.wc.show("庄家已续费房间",true)
            var baosNode = this._gamePanel.getChildByName("bao");
            baosNode.children.forEach(function(bao){
                if(bao.name !="box"){
                    bao.x = 0;
                    bao.y = 0;
                }
            })
            baosNode.active = false;
        }else{
            cc.module.wc.show("庄家已解散房间",true);
            var pop = this._wc.getComponent("Pop");
            pop && pop.setConfirmCallback(function(){
               cc.director.loadScene("hall");
            });
        }
    },
    
    onReceiveGmaeEnd:function(data){
        console.log(" -- 游戏结束 -- ");
        this._endIng = true;
        this._isPlaying = false;
    },

    onReceiveTurnOn:function(data){
        var isBanker = cc.module.self.userId == this._gameData.creator;
        var bao = data.bao;
        var boas = {
            "jin":this.baojin,
            "chu":this.baochu,
            "hu":this.baohu,
            "long":this.baolong
        };

        this._evil = false;
        this._isPlaying = false;
        this.startTimer(data.cd);
        var boxNode = this._gamePanel.getChildByName("bao").getChildByName("box");
        var boxNodeP = boxNode.getPosition();
        var BaoNode = cc.instantiate(this.BaoBack);
        var baoNodeCpt = BaoNode.getComponent(cc.Sprite);
        boxNodeP.y+= boxNode.height/2;
        BaoNode.setPosition(boxNodeP);
        BaoNode.scaleX = 0;
        BaoNode.scaleY = 0;
        baoNodeCpt.spriteFrame = boas[bao];
        this._baoNode = BaoNode;
        this._chiAnimNode.addChild(BaoNode);
        var action = cc.scaleTo(0.5,1,1);
        var box = this._gamePanel.getChildByName("bao").getChildByName("box")
        var boxAction = cc.repeat( cc.sequence(cc.rotateTo(0.05,-10),cc.rotateTo(0.05,10)),10 ); 
        var finished = cc.callFunc(function(){
            this.boxAnima(0,function(){
                BaoNode.runAction(action);
                this.computChipAnim(data);
            }.bind(this));
            box.rotation = 0;
        }.bind(this));
        box.runAction( cc.sequence(boxAction,finished));
        this.stopChipAction();
        this.resetBankerSelectBao(); 
        this.setChipBtn(isBanker,false,"等待开始");
    },


    onReceiveNextGame:function(data){
        if(data.errcode){
            cc.module.wc.show(data.errmsg,true);
            var pop = this._wc.getComponent("Pop");
            pop && pop.setConfirmCallback(function(){
                cc.director.loadScene("hall");
            });
            return
        }
        // console.log(data);
        var index = data.index;
        var userId = cc.module.self.userId;
        var isBanker = userId == this._gameData.creator;
        var intera = isBanker;  
        var win = this._gamePanel.getChildByName("win");
        var evil = data.evil;
        this._evil = evil && evil[userId] //&& !isBanker;
        console.log(" -- 作弊 -- ",this._evil);


        cc.module.audioMgr.playMusic("pushBao");
        this.stopAction(win);
        this._isPlaying = true ;
        this._baoNode = null;
        this._detailsPanel.active = false;
        this._gamePanel.getChildByName("btnStart").active = false;
        this.setChipBtn(isBanker,intera,"等待庄家放宝");
        this.setGameIndex(index);
        this.startTimer(data.cd);
        // this.setCanBetting(data.canBT[userId],isBanker);
        this.initBetting({
            "jin":{
                "total":0,
                "betting":0},
            "hu":{
                "total":0,
                "betting":0},
            "chu":{
                "total":0,
                "betting":0},
            "long":{
                "total":0,
                "betting":0},
        });
        this._chiAnimNode.removeAllChildren();
        this.resetChipAnim(null,true);
    },

    onReceiveStartGame:function(data){
        // 开始游戏
        cc.module.audioMgr.playMusic("pushBao");
        var index = data.index;
        var userId = cc.module.self.userId
        var isBanker = userId == this._gameData.creator;
        var intera = isBanker;  // 是庄家对应的按钮可互交，不是庄家对应的按钮不可互交  
        this._isPlaying = true;
        this._gamePanel.getChildByName("btnStart").active = false;
        this.setChipBtn(isBanker,intera,"等待庄家放宝");
        this.setGameIndex(index);
        this.initBaosNode();
        this.startTimer(data.cd);
        // this.setCanBetting(data.canBT[userId],isBanker);
        this.initBetting({
            "jin":{
                "total":0,
                "betting":0},
            "hu":{
                "total":0,
                "betting":0},
            "chu":{
                "total":0,
                "betting":0},
            "long":{
                "total":0,
                "betting":0},
        });
    },

    onReceiveBankerPushBao:function(data){
        // 庄家放宝
        this._isPlaying = true;
        var userId = cc.module.self.userId
        var isBanker = userId == this._gameData.creator;
        if(data.userId == userId){
            // 庄家
            this.setChipBtn(true,false,"等待玩家下注");
            this.boxAnima(1);
        }
        else{
            var backNode = cc.instantiate(this.BaoBack);
            var bankerNodeP = this._bankerPanel.getPosition();
            backNode.setPosition(bankerNodeP);
            this.node.addChild(backNode);

            var boxNode = this._gamePanel.getChildByName("bao").getChildByName("box");
            var boxNodeP = boxNode.getPosition();
            boxNodeP.y+= boxNode.height/2;
            var action = cc.sequence(cc.moveTo(0.5,boxNodeP),cc.delayTime(0.5),cc.scaleTo(0.5,0,0)) 
            var finished = cc.callFunc(function(){
                backNode.destroy();
                this.boxAnima(1);
            }.bind(this))
            backNode.runAction( cc.sequence(action,finished))
            //  闲家
            this.setChipBtn(false,true,"");
            this.setCanBetting(data.canBT[userId],isBanker);
            // 作弊 显示玩家放什么宝
            if(this._evil && !isBanker){
                var win = this._gamePanel.getChildByName("win");
                var baos = this._gamePanel.getChildByName("bao");
                var baosP = baos.getPosition();
                var baoName = data.bao;
                var baop = null;
                baos.children.forEach(function(bao){
                    if(bao.name == baoName){
                        baop = bao.getPosition();
                    }
                })
                baop.x += baosP.x;
                baop.y += baosP.y;

                win.setPosition(baop);
                this.startAction(win);
            }
            // 作弊

        }
        cc.module.audioMgr.playMusic("startBetting");
        var cd = data.cd;
        this.startTimer(cd);
        // this.resetBankerSelectBao();
    },
    startAction(node){
        if(!node){
            return;
        }
        this.stopAction(node);
        node._num = 1;
        node.active = true;
        node.opacity = 255;
        node._status = 1; // 1 表示显示状态
        node._fn = function(){
            if(node._status === 1){ // 如果是显示状态
                if(node._num >=6){
                    node._status=0;
                    node._num = 0;
                    node.opacity = 0;
                }
            }else{
                if(node._num>=4){
                    node._status=1;
                    node._num = 0;
                    node.opacity = 255;
                }
            }
            node._num++;
        }
        this.schedule(node._fn,0.1);
    },

    stopAction(node){
        if(!node){
            return;
        }
        node.active = false;
        node.opacity = 255;
        node._num = 1;
        node._status = 1; // 1 表示显示状态
        this.unschedule(node._fn);
    },

    onReceiveDissolveRoom:function(data){
        // console.log(" -- 解散房间 -- ");
        cc.module.wc.show("房间已解散",true);
        this.stopTimer();
        var pop = this._wc.getComponent("Pop");
        pop && pop.setConfirmCallback(function(){
            cc.director.loadScene("hall");
        });
    },


    onReceiveLeaveRoom:function(data){
        if(data.errcode){
            cc.module.wc.show(data.errmsg,true);
            return;
        }
        if(data.userId == cc.module.self.userId){
            cc.module.wc.show("正在返回大厅")
            cc.director.loadScene("hall");
        }
        else{
            var num = this._playersListPanel.getChildByName("title_bg").getChildByName("num");
            var infoLists = this._playersListPanel.getChildByName("info_lists");
            var scrollView = infoLists.getChildByName("scrollView");
            var scrollViewCpt = scrollView.getComponent(cc.ScrollView);
            var content = scrollViewCpt.content;
            content.children.forEach(function(item){
                if(item._userId == data.userId){
                    // item.removeFromParent(true);
                    item.destroy();
                }
            });
            var players = this._gameData.players
            for(var i=0;i<players.length;i++){
                if(players[i].userId == data.userId){
                    this._gameData.players.splice(i,1);
                    break;
                }
            }
            num.getComponent(cc.Label).string = this._gameData.players.length;
        }
    },

    onReceivePlayerEnter:function(data){
        var num = this._playersListPanel.getChildByName("title_bg").getChildByName("num");
        var infoLists = this._playersListPanel.getChildByName("info_lists");
        var scrollView = infoLists.getChildByName("scrollView");
        var scrollViewCpt = scrollView.getComponent(cc.ScrollView);
        var apply = scrollView.getChildByName("apply");
        var item = scrollView.getChildByName("item");
        var content = scrollViewCpt.content;
        var newItem = cc.instantiate(item);
        var name = newItem.getChildByName("name");
        var chipNum = newItem.getChildByName("chipNum");
        var headImg = newItem.getChildByName("mask").getChildByName("headImg");
        var headImgCpt = headImg.getComponent(cc.Sprite);
        name.getComponent(cc.Label).string = data.name;
        chipNum.getComponent(cc.Label).string = data.gold;
        cc.module.imageCache.newImage(data.userId,function(spriteFrame){
            if(spriteFrame){
                headImgCpt.spriteFrame = spriteFrame;
            }
        })
        newItem.active = true;
        newItem._userId = data.userId;
        content.addChild(newItem);
        this._gameData.players.push(data);
        num.getComponent(cc.Label).string = this._gameData.players.length;
    },  

    onReceiveCanBetting:function(data){
        this.setCanBetting(data,false)
    },

    resetChipAnim:function(userId,isAll){
        if(isAll){
            this._chiAnimNode.removeAllChildren();
            return;
        }
        var len = this._chiAnimNode.children.length;
        for(var i=0;i<len; i++){
            var chip = this._chiAnimNode.children[i];
            if(chip && chip._userId == userId){
                chip.destroy();
            }
        }
    },

    getSelfNumPosition:function(){
        var selfP = this._selfPanel.getPosition();
        var chipNumNode = this._selfPanel.getChildByName("chip_num");
        var chipP = chipNumNode.getPosition();

        return  {
            "x":(selfP.x + chipP.x),
            "y":(selfP.y + chipP.y)
        }

    },
    getSelfData:function(userId){
        var players = this._gameData.players;
        for(var i=0;i<players.length;i++){
            var player = players[i];
            if(player.userId == userId){
                return player;
            }
        }
        return null;
    },

    setDetails:function(data){
        var panel = this._detailsPanel.getChildByName("panel");
        var scrollView = panel.getChildByName("scrollView");
        var scrollViewCpt = scrollView.getComponent(cc.ScrollView);
        var content = scrollViewCpt.content;
        var item = content.getChildByName("item");
        content.removeAllChildren();
        var fn = function(userId,detail){
            var newItem = cc.instantiate(item);
            var name = newItem.getChildByName("name");
            var total = newItem.getChildByName("total");
            var result = newItem.getChildByName("result");
            var headImg = newItem.getChildByName("mask").getChildByName("headImg");
            var headImgCpt = headImg.getComponent(cc.Sprite);
            var playerInfo = this.getSelfData(userId);
            total.getComponent(cc.Label).string = Math.floor(detail.total);

            result.getComponent(cc.Label).string = detail.result;
            name.getComponent(cc.Label).string = playerInfo ? playerInfo.name:"";

            cc.module.imageCache.newImage(userId,function(spriteFrame){
                if(spriteFrame){
                    headImgCpt.spriteFrame = spriteFrame; 
                }
            })
            content.addChild(newItem);
        }.bind(this);

        for(var i in data.details){
            var detail = data.details[i];
            detail && fn(i,detail);
            if(detail && i == this._gameData.creator){
                var bankerChip = this._bankerPanel.getChildByName("chip");
                bankerChip.getComponent(cc.Label).string = Math.floor(detail.total);
            }
        }

        this._detailsPanel.active = true;
        if(this._endIng){
            var dPop = this._detailsPanel.getComponent("Pop");
            dPop && dPop.setConfirmCallback(function(){
                this.setGameEnd();
            }.bind(this))
        }
    },

    setGameEnd:function(){
        if(!this._endIng){
            return;
        }
        var win = this._gamePanel.getChildByName("win");
        this.stopAction(win);
        var endPanel = this.node.getChildByName("end_panel");
        var hint = endPanel.getChildByName("panel").getChildByName("hint");
        var btnConsle = endPanel.getChildByName("panel").getChildByName("btns").getChildByName("consle");
        if(cc.module.self.userId == this._gameData.creator){
            hint.getComponent(cc.Label).string = "房间已经结束,是否继续\n 继续游戏扣取"+this._gameData.rate+"钻石";
        }else{
            hint.getComponent(cc.Label).string = "房间已经结束,庄家正在选择是否继续";
            btnConsle.active = false;
        }
        var pop = endPanel.getComponent("Pop");
        pop && pop.setConfirmCallback(function(){
            cc.module.socket.send(SEvents.cb.CB_AGAIN_EVENT,{"again":true},true);
        });
        pop && pop.setCancelCallback(function(){
            cc.module.socket.send(SEvents.cb.CB_AGAIN_EVENT,{"again":false},true);
        });
        pop && pop.pop();
    },

    resultAnim:function(data){
        console.log(data)
        var detail = data.details[cc.module.self.userId];
        if(!detail){
            return;
        }
        var isBanker = this._gameData.creator == cc.module.self.userId;
        var result = detail.result;
        var total = detail.total;
        var win = detail.win;
        var resultNode = this._selfPanel.getChildByName("chip_num").getChildByName("result");
        var numNode = this._selfPanel.getChildByName("chip_num").getChildByName("num");

        if(isBanker){
            resultNode.getComponent(cc.Label).string ="输赢：" +( win>0?("+"+win):win ) ;
        }else{
            resultNode.getComponent(cc.Label).string = "中奖："+Number(win)+"\n输赢："+ (Number(result)>0?"+"+result:result);
        }
        
        resultNode.y = -20;

        var fn = cc.callFunc(function(){
            var num = numNode.getComponent(cc.Label).string;
            num = (Number(num) + Number(win)).toFixed(1);
            numNode.getComponent(cc.Label).string = num;
        }) 

        var finished = cc.callFunc(function(){
            resultNode.opacity = 0;
            this.setDetails(data);
        }.bind(this))

        var action = cc.sequence(
            cc.spawn(cc.moveTo(0.6,resultNode.x,0),cc.fadeTo(0.6,255)),
            cc.spawn(fn,cc.delayTime(3)),
            cc.spawn(cc.moveTo(0.6,resultNode.x,20),cc.fadeTo(0.6,0)),
            finished
        );
        resultNode.runAction(action);
    },

    setPlayersChip:function(data){
        // console.log(data)
        var infoLists = this._playersListPanel.getChildByName("info_lists");
        var scrollView = infoLists.getChildByName("scrollView");
        var scrollViewCpt = scrollView.getComponent(cc.ScrollView);
        var content = scrollViewCpt.content;
        content.children.forEach(function(item){
            var userId = item._userId;
            if(data[userId]){
                 var chipNum = item.getChildByName("chipNum");
                 chipNum.getComponent(cc.Label).string = Number(data[userId].total).toFixed(1);
            }
        })
    },

    computChipAnim:function(data){
        var bao = data.bao;
        var baoNode = this._recordPanel.getChildByName('bao');
        var newNode = cc.instantiate(baoNode);
        var baoCpt = newNode.getComponent(cc.Sprite);
        var layout = this._recordPanel.getChildByName("layout");
        if(layout.children.length == 15){
            layout.children[0].destroy();
        }
        baoCpt.spriteFrame = this[bao];
        newNode.active = true;
        layout.addChild(newNode);
        this.setPlayersChip(data.details)
        this.resultAnim(data);
    },


    chipAnim:function(data,isSelf){
        // 下注动画
        var chips = {
            1:this.chip1,
            10:this.chip10,
            50:this.chip50,
            100:this.chip100,
        };
        var baoName = data.baoName;
        var chipNum = data.chipNum;
        var userId = data.userId;
        var newChipNode = cc.instantiate(chips[chipNum]);
        var startP;
        if(isSelf){
            var selfP = this._selfPanel.getPosition();
            var playeCPhipBtns = this._selfPanel.getChildByName("player_chip_btns");
            var chipNode = playeCPhipBtns.getChildByName("chip"+chipNum);
            var chipNodeP = chipNode.getPosition();
            startP = {
                "x":selfP.x + chipNodeP.x,
                "y":selfP.y + chipNodeP.y
            }
        }else{
            var playersP = this._playersListPanel.getPosition();
            var title = this._playersListPanel.getChildByName("title_bg");
            startP = {
                "x":playersP.x + title.x,
                "y":playersP.y + title.y
            }
        }

        newChipNode._baoName = baoName;
        newChipNode._chipNum = chipNum;
        newChipNode._userId = userId;
        newChipNode.setPosition(startP);

        var baosNode = this._gamePanel.getChildByName("bao");
        var baosNodeP = baosNode.getPosition()
        var baoNode = baosNode.getChildByName(baoName);
        var baoNodeP = baoNode.getPosition();

        var endP = {};
        endP.x =(baoNodeP.x + baosNodeP.x);
        endP.y =(baoNodeP.y + baosNodeP.y);
        endP.x += Math.floor(Math.random()*60*(Math.random()>0.5?-1:1));
        endP.y += Math.floor(Math.random()*60*(Math.random()>0.5?-1:1));

        var action = cc.moveTo(0.5,endP);
        newChipNode.runAction(action);
        this._chiAnimNode.addChild(newChipNode);
    },

    onReceivePlayerBetting:function(data){
        if(data.errcode){
            cc.module.wc.show(data.errmsg,true);
            return;
        }
        var userId = data.userId;
        var chipNum = data.chipNum;
        var baoName = data.baoName;
        var isSelf = userId == cc.module.self.userId
        if(isSelf){
            // 自己下注动画
            var selfChipNum = this._selfPanel.getChildByName("chip_num").getChildByName("num");
            var num = selfChipNum.getComponent(cc.Label).string;
            num = Number(num - chipNum).toFixed(1)
            selfChipNum.getComponent(cc.Label).string = num;
        }  
        else{
            // 其他玩家下注动画
        }
        this.chipAnim(data,isSelf);
        var baosNode = this._gamePanel.getChildByName("bao");
        var bao = baosNode.getChildByName(baoName);
        var totalNum = bao.getChildByName("total").getChildByName("num");
        var bettingNum = bao.getChildByName("betting").getChildByName("num");
        totalNum.getComponent(cc.Label).string += chipNum;
        if(cc.module.self.userId == this._gameData.creator || userId == cc.module.self.userId){
            bettingNum.getComponent(cc.Label).string += chipNum;
        }
    },

    onReceiveResetBetting:function(data){
        console.log( " -- 重置 -- ")
        console.log(data);
        var userId = data.userId;
        var betting = data.betting;
        var isBanker = this._gameData.creator == cc.module.self.userId;
        var isSelf = userId == cc.module.self.userId;

        console.log(isBanker,isSelf)
        var baosNode = this._gamePanel.getChildByName("bao");
        baosNode.children.forEach(function(baoBtn){
            if(baoBtn.name!="box" && betting[baoBtn.name]){
                var totalNum = baoBtn.getChildByName("total").getChildByName("num");
                var bettingNum = baoBtn.getChildByName("betting").getChildByName("num");
                (isBanker || isSelf) && (bettingNum.getComponent(cc.Label).string -= betting[baoBtn.name]);
                (totalNum.getComponent(cc.Label).string -= betting[baoBtn.name]);
            }
        })
        if(userId == cc.module.self.userId){
            var canBT = data.canBT;
            var total = 0
            for(var bao in betting){
                total += betting[bao];
            }
            var selfChipNum = this._selfPanel.getChildByName("chip_num").getChildByName("num");
            var num = selfChipNum.getComponent(cc.Label).string;
            num = (Number(num) + Number(total)).toFixed(1);
            selfChipNum.getComponent(cc.Label).string = num;
            this.setCanBetting(canBT,false);
        }
        this.stopChipAction();
        this.resetChipAnim(userId,false);
    },

    onReceiveGameInfo:function(data){
        // console.log(data)
        if(cc.isValid(data.errcode)) {
            clearInterval(this._timeOut);
            cc.director.loadScene("hall");
            return;
        }
        

        console.log(data);
        this._chiAnimNode.removeAllChildren();
        this._gameData = data;
        this.initSelfInfo(data);
        this.initBaosRecord(data.baos);
        this.setWebShareMsg(data);
        this.addSocketEventHandler();
        this.setPlayersPanel(data);
        this.setGameInfo(data);
        var userId = cc.module.self.userId;
        var isBanker = userId == data.creator;
        var selfInfo = this.getSelfData(userId);
        this._isPlaying = (selfInfo && selfInfo.isPlaying) || isBanker;
        var waitStart = function(){
            var btnStart = this._gamePanel.getChildByName("btnStart");
            btnStart.active = isBanker;
            this.setChipBtn(isBanker,false,"等待开始");

        }.bind(this);

        var waitPush = function(){
            var intera = userId == data.creator;
            this.setChipBtn(isBanker,intera,"等待庄家放宝");
            this.startTimer(data.cd);
            this.setTotalBetting(data.betting);
            this.setBoxStatus(1);
            this.setCanBetting(data.canBT[userId],isBanker);
        }.bind(this);

        var waitBetting = function(){
            var intera = userId != data.creator;
            this.setChipBtn(isBanker,intera,"等待玩家下注");
            this.startTimer(data.cd);
            this.setTotalBetting(data.betting);
            this.setBoxStatus(0);
            this.setCanBetting(data.canBT[userId],isBanker);
        }.bind(this);

        var waitNext = function(){
            var intera = userId != data.creator;
            this.setChipBtn(isBanker,false,"等待开始");
            this.startTimer(data.cd);
            this.setBoxStatus(1);
            this.setCanBetting(data.canBT[userId],isBanker);
        }

        if(data.index!=0 && data.status != "waitStart"){
            // index 不等于0 说明是中途进来的
            this.initBaosNode();
        }

        if(data.status == "waitStart"){
            waitStart();
        }
        else if(data.status == "waitPush"){
            waitPush();
        }
        else if(data.status == "waitBetting"){
            waitBetting();
        }
        else if(data.status == "waitNext"){

        }
        else if(data.status == "end"){
            this._endIng = true;
            this.setGameEnd();
        }
    },  

    setCanBetting:function(data,isBanker){
        var canBetting = this._gamePanel.getChildByName("canBetting");
        canBetting.active = !isBanker;
        if(isBanker ){
            return;
        }
        var canBT = data;
        canBetting.children.forEach(function(bao){
            var num = bao.getChildByName("num");
            num.getComponent(cc.Label).string = canBT && canBT[bao.name]?canBT[bao.name]:0;
        })
    },

    setTotalBetting:function(data){
        // 设置所有下注
        /* 数据格式
            {
                888888:{hu:10:jin:10}
                100001:{long:10:chu:10}
            }
        */
        // TT ==> total    PB ==> playerBetting   B ==> betting
        var userId = cc.module.self.userId;
        var TT = {"jin":0, "hu":0, "chu":0, "long":0 };
        var PB = data[userId];
        var isBanker = userId == this._gameData.creator;
        for(var id in data){
            if(data[id]){
                for(var B in data[id]){
                    TT[B] += data[id][B];
                }
            }
        }
        var bao = this._gamePanel.getChildByName("bao");
        bao.children.forEach(function(item){
            if(item.name != "box"){
                var betting = item.getChildByName("betting");
                var total = item.getChildByName("total");
                total.getChildByName("num").getComponent(cc.Label).string = TT && TT[item.name]?TT[item.name]:0;
                if(isBanker){
                    betting.getChildByName("num").getComponent(cc.Label).string = TT && TT[item.name]?TT[item.name]:0;
                }
                else{
                    betting.getChildByName("num").getComponent(cc.Label).string = PB && PB[item.name]?PB[item.name]:0;
                }
            }
        })
    },

    setSelfBetting:function(data){
        // 设置自己的下注
    },

    initBaosRecord:function(data){
        // 设置所有开宝记录
        // return;
        if(data.length>10){
            data = data.splice(data.length-15,15);
        }
        var baoNode = this._recordPanel.getChildByName("bao");
        var recordRayout = this._recordPanel.getChildByName("layout");
        data.forEach(function(bao){
            var newNode = cc.instantiate(baoNode);
            var newNodeCpt = newNode.getComponent(cc.Sprite);
            newNodeCpt.spriteFrame = this[bao];
            newNode.active = true;
            recordRayout.addChild(newNode);
        }.bind(this))
        // console.log(recordRayout);

    },

    setGameInfo:function(data){
        var roomId = this._gameInfoPanel.getChildByName("roomId");
        var numOfPlayer = this._gameInfoPanel.getChildByName("numOfPlayer");
        var jushu = this._gameInfoPanel.getChildByName("jushu");
        roomId.getChildByName("num").getComponent(cc.Label).string = data.roomId;
        numOfPlayer.getChildByName("num").getComponent(cc.Label).string = data.players.length+"/"+data.form.numOfPlayer;
        jushu.getChildByName("num").getComponent(cc.Label).string = data.index+"/"+data.form.numOfGame;
    },

    setBanker:function(banker){
        if(!banker){
            return;
        }
        var name = this._bankerPanel.getChildByName("name");
        var chip = this._bankerPanel.getChildByName("chip");
        var headImg = this._bankerPanel.getChildByName("mask").getChildByName("headImg");
        var headImgCpt = headImg.getComponent(cc.Sprite);
        name.getComponent(cc.Label).string = banker.name;
        chip.getComponent(cc.Label).string = Number(banker.gold).toFixed(1);
        cc.module.imageCache.newImage(banker.userId,function(spriteFrame){
            if(spriteFrame){
                headImgCpt.spriteFrame = spriteFrame;
            }
        })
    },

    setBoxStatus:function(code){
        // code 1代开  0关闭；
        var box = this._gamePanel.getChildByName("bao").getChildByName("box");
        var boxCpt = box.getComponent(cc.Sprite);
        boxCpt.spriteFrame = (code == 0? this.boxs[0]:this.boxs[this.boxs.length-1]);

    },

    setPlayersPanel:function(data){
        var players = data.players;
        var num = this._playersListPanel.getChildByName("title_bg").getChildByName("num");
        var infoLists = this._playersListPanel.getChildByName("info_lists");
        var scrollView = infoLists.getChildByName("scrollView");
        var scrollViewCpt = scrollView.getComponent(cc.ScrollView);
        var apply = scrollView.getChildByName("apply");
        var item = scrollView.getChildByName("item");
        var content = scrollViewCpt.content;
        content.removeAllChildren();
        players.forEach(function(player){
            var newItem = cc.instantiate(item);
            var name = newItem.getChildByName("name");
            var chipNum = newItem.getChildByName("chipNum");
            var headImg = newItem.getChildByName("mask").getChildByName("headImg");
            var headImgCpt = headImg.getComponent(cc.Sprite);
            name.getComponent(cc.Label).string = player.name;
            if(player.userId == cc.module.self.userId){
                var total = 0;
                if(data.status == "waitPush" ){
                    if(betting){
                        for(var bao in betting){
                            total += Number( betting[bao] ) ;
                        }
                    }
                }
                player.gold-=total;
                // var num = Number(player.gold-total).toFixed(1)
                // chipNum.getChildByName("num").getComponent(cc.Label).string = num;
            }

            chipNum.getComponent(cc.Label).string = player.gold;
            cc.module.imageCache.newImage(player.userId,function(spriteFrame){
                if(spriteFrame){
                    headImgCpt.spriteFrame = spriteFrame;
                }
            })
            newItem._userId = player.userId;
            newItem.active = true;
            content.addChild(newItem)
        }.bind(this))
        num.getComponent(cc.Label).string = players.length;
    },

    setGameIndex:function(index){
        var data = this._gameData;
        var jushu = this._gameInfoPanel.getChildByName("jushu");
        jushu.getChildByName("num").getComponent(cc.Label).string = index+"/"+data.form.numOfGame;
    },

    setChipBtn:function(isBanker,intera,msg){
        var isPlaying = this._isPlaying;
        var selfInfo = this.getSelfData(cc.module.self.userId);
        var chipBtns = this._selfPanel.getChildByName(isBanker? "banker_chip_btns":"player_chip_btns");
        var mask = this._selfPanel.getChildByName("mask");
        var title = mask.getChildByName("title");
        var btn = this._selfPanel.getChildByName("btn").getChildByName(isBanker?"btn_sure":"btn_reset");
        chipBtns.children.forEach(function(chipBtn){
            if(chipBtn.name != "select" && chipBtn.name != "circle"){
                chipBtn.getComponent(cc.Button).interactable = (intera && isPlaying) || this._evil;
            }
        }.bind(this))
        if(isPlaying){
            // 设置筹码按钮可互交性
            title.getComponent(cc.Label).string = msg;
            btn.getComponent(cc.Button).interactable = intera;
            mask.active = !intera;
            if(this._evil && isBanker){
                btn.getComponent(cc.Button).interactable = true;
                mask.active = false;
            }
        }else{
            btn.getComponent(cc.Button).interactable = false;
            title.getComponent(cc.Label).string = "等待下一局";
            if(this._gameData.status == "waitStart"){
                title.getComponent(cc.Label).string = "等待开始";
            }
            mask.active = true; 
        }
    },

    startTimer:function(time,timerNode,callFun){
        var timer = cc.isValid(timerNode)?timerNode:this.node.getChildByName("timer");
        this.stopTimer(timer);
        timer.active = true;
        var num = timer.getChildByName("num");
        num.getComponent(cc.Label).string = time;
        timer.callback = function(){
            time--;
            var labTime = timer.getChildByName("num").getComponent(cc.Label);
            labTime ? labTime.string = Math.floor(time):null;
            if(time<0){
                callFun && callFun();
                this.stopTimer(timer);
            }
        };
        this.schedule(timer.callback,1);
    },
    
    stopTimer:function(timerNode){
        var timer = cc.isValid(timerNode) ? timerNode:this.node.getChildByName("timer");
        var num = timer.getChildByName("num");
        num.getComponent(cc.Label).string = null;
        timer.active = false;
        this.unschedule(timer.callback);
    },

    initBaosNode:function(){
        // 初始化宝
        // var canBetting = this._gamePanel.getChildByName("canBetting");
        var isBanker = cc.module.self.userId == this._gameData.creator;
        var baosNode = this._gamePanel.getChildByName("bao");
        var newBP = {
            "jin":BP.chu,
            "chu":BP.jin,
            "hu":BP.long,
            "long":BP.hu,
        }
        baosNode.children.forEach(function(bao){
            if(bao.name!="box"){
                var action = cc.moveTo(0.5, (isBanker?BP[bao.name]:newBP[bao.name]) );
                bao.runAction(action)
            }
        });
        // canBetting.active = true;
        baosNode.active = true;
    },

    initTimer:function(){
        var num = this._timerPanel.getChildByName("num");
        num.getComponent(cc.Label).string = null;
        this._timerPanel.active = false;
    },

    initSelfInfo:function(data){
        // 初始化个人信息
        var userId = cc.module.self.userId;
        var selfData = this.getSelfData(userId);
        var headImgUrl = cc.module.self.headimgurl;
        var isBanker = (data.creator == userId);
        var selfInfo = this._selfPanel.getChildByName("info");
        var gameBtns = this._selfPanel.getChildByName("gameBtns");
        var chipNum = this._selfPanel.getChildByName("chip_num");
        var headImg = selfInfo.getChildByName("mask").getChildByName("headImg");
        var headImgCpt = headImg.getComponent(cc.Sprite);
        var name = selfInfo.getChildByName("name");
        name.getComponent(cc.Label).string = selfData.name;

        var betting = data.betting[userId];
        var total = 0;
        if(data.status == "waitPush" ){
            if(betting){
                for(var bao in betting){
                    total += Number( betting[bao] ) ;
                }
            }
        }
        var num = Number(selfData.gold-total).toFixed(1)
        chipNum.getChildByName("num").getComponent(cc.Label).string = num;

        cc.module.imageCache.newImage(userId,function (spriteFrame) {
            if(spriteFrame) {
               headImgCpt.spriteFrame = spriteFrame;
            }
        }.bind(this));
        gameBtns.getChildByName("btn_dissolve").active = isBanker;
        gameBtns.getChildByName("btn_leave").active = !isBanker;
        gameBtns.getChildByName("btn_disconnet").active = !isBanker;
        this._bankerPanel.active = !isBanker;
        this._selfPanel.getChildByName("player_chip_btns").active = !isBanker;
        this._selfPanel.getChildByName("banker_chip_btns").active = isBanker;
        this._selfPanel.getChildByName("btn").getChildByName("btn_reset").active = !isBanker;
        this._selfPanel.getChildByName("btn").getChildByName("btn_sure").active = isBanker;
        if(!isBanker){
            var players = data.players;
            var banker = null;
            for(var i=0;i<players.length;i++){
                if(players[i].isBanker){
                    banker = players[i];
                }
            }
            this.setBanker(banker);
        }
    },

    initCanBetting:function(){
        // 重置可下注
        var canBetting = this._gamePanel.getChildByName("canBetting");
        canBetting.children.forEach(function(bao){
            var num = bao.getChildByName("num");
            num.getComponent(cc.Label).string = "";
        })
    },

    initBetting:function(data){
        // 重置下载
        var bao = this._gamePanel.getChildByName("bao");
        bao.children.forEach(function(item){
            if(item.name != "box"){
                var betting = item.getChildByName("betting");
                var total = item.getChildByName("total");
                total.getChildByName("num").getComponent(cc.Label).string = data[item.name].total;
                betting.getChildByName("num").getComponent(cc.Label).string = data[item.name].betting;
            }
        })
    },

    initRecord:function(){
        var layout = this._recordPanel.getChildByName("layout");
        layout.removeAllChildren();
    },
    
    onStartGame:function(){
        if(this._gameData.creator != cc.module.self.userId){
            return;
        }
        cc.module.socket.send(SEvents.cb.CB_START_GAME_EVENT,null,true);
    },

    backToHall:function(){
        cc.module.audioMgr.playUIClick();
        cc.director.loadScene("hall");
    },

    onLeaveRoom:function(e,code){
        cc.module.audioMgr.playUIClick();
        // 离开房间
        var amoment = code ==0;
        if(amoment){
            //暂时离开
            cc.inGame = "cb_game";
            cc.director.loadScene("hall");
        }
        else{
            // 退出房间 或者解散房间
            var destroy = code ==2;
            var userId = cc.module.self.userId;
            cc.module.socket.send(SEvents.cb.CB_LEAVE_ROOM_EVENT,{"destroy":destroy,"userId":userId},false);
        }
    },
    
    onPlayersListsNode:function(){
        var infoLists = this._playersListPanel.getChildByName("info_lists");
        infoLists.active = !infoLists.active;
    },

    onBankerSelectBao:function(e,data){
        cc.module.audioMgr.playUIClick();
        // 庄家选择宝
        var parent = e.target.parent;
        var select = parent.getChildByName("select");
        var btn = e.target;
        var btnP = btn.getPositionX();
        select.setPositionX(btnP);
        select.active = true;
        this._selectBao = data;
    },

    onSureSelectBao:function(e){
        cc.module.audioMgr.playUIClick();
        var bao = this._selectBao;
        if(!bao){
            return
        }
        console.log(bao);
        // this.resetBankerSelectBao(); 
        cc.module.socket.send(SEvents.cb.CB_BANKER_PUSH_BAO_EVENT,{"bao":bao},true);
    },
    
    onPlayerSelectChip:function(e,num){
        cc.module.audioMgr.playUIClick();
        var playerChipBtns = this._selfPanel.getChildByName("player_chip_btns");
        var circle = playerChipBtns.getChildByName("circle");
        var chipBtnP = e.target.getPositionX();
        var action = cc.rotateBy(2,360);
        circle.active = true;
        circle.stopAllActions();
        circle.setPositionX(chipBtnP);
        circle.runAction(cc.repeatForever(action));
        if( num == this._selectChipNum){
            if( circle.active ){
                this._selectChipNum = null;
                circle.stopAllActions();
                circle.active = false;
            }
        }else{
            this._selectChipNum = parseInt(num);
        }
    },

    stopChipAction:function(){
        var playerChipBtns = this._selfPanel.getChildByName("player_chip_btns");
        var circle = playerChipBtns.getChildByName("circle");
        circle.stopAllActions();
        circle.active = false;
        this._selectChipNum = null;
    },

    onPlayerSelectBao:function(e,data){
        cc.module.audioMgr.playUIClick();
        var chipNum = this._selectChipNum;
        if(!chipNum){
            return;
        }
        var baoName = e.target.name;
        cc.module.socket.send(SEvents.cb.CB_PLAYER_BETTING_EVENT,{"chipNum":chipNum,"baoName":baoName},true)
    },

    onBetting:function(data){
        cc.module.audioMgr.playUIClick();
        var userId = data.userId;
        var chipNum = data.chipNum;
        var baoName = data.baoName;
        var baosNode = this._gamePanel.getChildByName("bao");
        var bao = baosNode.getChildByName(baoName);
        var totalNum = bao.getChildByName("total").getChildByName("num");
        var bettingNum = bao.getChildByName("betting").getChildByName("num");
        totalNum.getComponent(cc.Label).string += chipNum;
        bettingNum.getComponent(cc.Label).string += chipNum;
    },

    onResetBetting:function(data){
        cc.module.socket.send(SEvents.cb.CB_RESET_BETTING_EVENT,null,true)
    },

    resetBankerSelectBao:function(){
        var bankerChiBtns = this._selfPanel.getChildByName("banker_chip_btns");
        var selectNode = bankerChiBtns.getChildByName("select");
        selectNode.active = false;
        this._selectBao = null;
    },


    onDestroy:function(){
        cc.module.socket.off(SEvents.RECEIVE_VOICE_MSG);
        cc.module.socket.off(SEvents.RECEIVE_CHAT);
        cc.module.socket.off(SEvents.RECEIVE_QUICK_CHAT);
        cc.module.socket.off(SEvents.cb.CB_NEW_PLAYER_ENTER);
        cc.module.socket.off(SEvents.cb.CB_LEAVE_ROOM_EVENT)
        cc.module.socket.off(SEvents.cb.CB_DISSOLVE_ROOM_EVENT)

        cc.module.socket.off(SEvents.cb.CB_START_GAME_EVENT);
        cc.module.socket.off(SEvents.cb.CB_NEXT_GAME_EVENT);
        cc.module.socket.off(SEvents.cb.CB_TURN_ON_EVENT);
        cc.module.socket.off(SEvents.cb.CB_GAME_END_EVENT);

        cc.module.socket.off(SEvents.cb.CB_BANKER_PUSH_BAO_EVENT);
        cc.module.socket.off(SEvents.cb.CB_RESET_BETTING_EVENT);
        cc.module.socket.off(SEvents.cb.CB_PLAYER_BETTING_EVENT);
        cc.module.socket.off(SEvents.cb.CB_CAN_BETTING_EVENT);
        cc.module.socket.off(SEvents.cb.CB_AGAIN_EVENT);
    },
    update: function (dt) {
        // if(this._voiceTime && this._voiceTime>0) {
        //     this._voiceTime -= dt;
        //     if(this._voiceTime<=0) {
        //         this._voiceTime = null;
        //         this.playVoice();
        //     }
        // }
    }
});
