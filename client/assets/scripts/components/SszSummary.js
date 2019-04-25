cc.Class({
    extends: cc.Component,

    properties: {
        contentNode:cc.Node,
        summaryItemPrefab:cc.Prefab,
        timer:cc.Node,
        _clickReadyCallBack:null,
        _cutDown:null,
    },

    onLoad: function () {
       var game = cc.find("Canvas").getComponent("SszGame");
        this._pokerMgr = game.getPokerMgr();
    },

    setGameIndex:function (index) {
        this.gameIndexLabel.string = index;
    },

    setSummary:function (data,gameData,overrideReady) {
        this.contentNode.removeAllChildren();
        for(var i in data){
            var playerNode = cc.instantiate(this.summaryItemPrefab);
            var headimgCpt = playerNode.getChildByName("mask").getChildByName("headimg").getComponent(cc.Sprite);
            var lblNameCpt = playerNode.getChildByName("lbl_name").getComponent(cc.Label);
            var lblScoreCpt = playerNode.getChildByName("lbl_score").getComponent(cc.Label);
            var touCardsNode = playerNode.getChildByName("cards").getChildByName("tou");
            var zhongCardsNode = playerNode.getChildByName("cards").getChildByName("zhong");
            var weiCardsNode = playerNode.getChildByName("cards").getChildByName("wei");
            lblNameCpt.string = data[i].name;
            lblScoreCpt.string = data[i].gap;
            var touCards = data[i].out.tou;
            var zhongCards = data[i].out.zhong;
            var weiCards = data[i].out.wei;
            cc.module.imageCache.getImage(data[i].out.userId,function (spriteFrame) {
                if(!cc.isValid(headimgCpt)) {
                    return;
                }
                if(spriteFrame) {
                    headimgCpt.spriteFrame = spriteFrame;
                }
            }.bind(this));
            this.setCards(touCardsNode,touCards);
            this.setCards(zhongCardsNode,zhongCards);
            this.setCards(weiCardsNode,weiCards);
            this.contentNode.addChild(playerNode);
        }

        function getCreator(){
            for(var i=0;i<gameData.players.length;i++){
                var player = gameData.players[i];
                if(player.isHomeowner){
                    return player;
                }
            }
        }
        this.startTimer(5,this.timer,function(){ });
        this.setClickReadyCallBack(overrideReady);
    },

    setCards:function(CardsNode,cards){
        CardsNode.children.forEach( function(child,index) {
            if(index==0){
                var typeCpt = child.getComponent(cc.Label);
                typeCpt.string = this.returnSszType(cards.type);
            }
            else{
                var id = cards.ids[index-1];
                var sprite = child.getComponent(cc.Sprite);
                sprite.spriteFrame = this._pokerMgr.getPokerSFById(id);
            }
        }.bind(this));
    },

    setWinOrLose:function (score) {
        var name = score>0?"draw_result_win":(score===0?"draw_result_draw":"draw_result_fail");
        this.finalNode.children.forEach(function (node) {
            node.active = node.name===name;
        }.bind(this));
    },

    setClickReadyCallBack:function (callback) {
        this._clickReadyCallBack = callback;
    },

    onClickReady:function () {
        cc.module.audioMgr.playUIClick();
        var seat = cc.module.self.seat;
        this.node.active = false
        seat && cc.module.socket.send(SEvents.Ssz.SEND_READY,null,true);
        // clearTimeout(this._cutDown);
    },
    
    onClickStandUp:function(){
        var sszGame = cc.find("Canvas").getComponent("SszGame");
        sszGame.onclickSandUp();
        this.node.active = false;
    },

    onClickHideSummary:function () {
        cc.module.audioMgr.playUIClick();
        var mask = this.node.getChildByName("mask");
        var panel = this.node.getChildByName("panel");
        mask.active = false;
        panel.active = false;
    },
    
    onClickShowSummary:function () {
        cc.module.audioMgr.playUIClick();
        var mask = this.node.getChildByName("mask");
        var panel = this.node.getChildByName("panel");
        mask.active = true;
        panel.active = true;
    },

    returnSszType:function(type){
        var Ssztype = {
            "wl":"乌龙",
            "dz":"对子",
            "ld":"两对",
            "st":"三条",
            "sz":"顺子",
            "th":"同花",
            "hl":"葫芦",
            "tz":"铁支",
            "ths":"同花顺",
            "wt":"五同",
        };
        var str = Ssztype[type]? Ssztype[type]:"";
        return str;
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
                this.node.active = false;
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

});
