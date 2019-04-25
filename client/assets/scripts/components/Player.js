cc.Class({
    extends: cc.Component,

    properties: {
        goldIconPrefab:cc.Prefab,
        goldPanel:cc.Node,
        headimg:cc.Sprite,
        lblName:cc.Label,
        lblScore:cc.Label,
        bankerIcon:cc.Node,
        statusIcon:cc.Sprite,
        lblChat:cc.Label,
        voiceIcon:cc.Node,
        emojiNode:cc.Node,
        dealNode:cc.Node,
        showNode:cc.Node,
        typeAndMultiple:cc.Node,
        lblObtain:cc.Label,
        defaultHeadImg:cc.SpriteFrame,
        readySpriteFrame:cc.SpriteFrame,
        twistSpriteFrame:cc.SpriteFrame,
        offlineSpriteFrame:cc.SpriteFrame,
        _isReady:false,
        _isTwist:false,
        _isOnline:true,
        _isCompareIng:false,

        _nnType:null,
        _multiple:null,
        _userId:null,
        _nickname:null,
        _sex:null,
        _ip:null,
        _chatTime:null,
        _voiceTime:null,
        _emojiTime:null,
        _cards:[],
        _dealCards:null,
        _defaultChatShowTime:3,
        _defaultDealActionTime:0.1,
        _defaultTranformActionTime:0.2
    },

    onLoad: function () {
        this._defaultTranformActionTime = 0.2;
        this._defaultDealActionTime = 0.1;
        this._defaultChatShowTime = 3;
        this.lblChat.string = "";
        this.voiceIcon.active = false;
        this.lblChat.node.parent.active = false;
        this.emojiNode.active = false;
        this.goldPanel.active = false;
        this.lblObtain.node.active = false;
        if(!this.lbcScore){
            this.lbcScore = cc.instantiate(this.lblScore.node)/**/;
            this.node.addChild(this.lbcScore);
            this.lbcScore = this.lbcScore.getComponent(cc.Label);
            this.lbcScore.node.x=-18;
            this.lbcScore.node.y=103;
            this.lbcScore.node.scaleY = 1.5;
            this.lbcScore.node.scaleX = 1.5;

            this.lbcScore.node.active=false;
        }
        // cc.module.utils.addClickEvent(this.headimg.node,this.node,"Player","onHeadimgClick");
    },

    hideInfo:function(callFun){
        this.node.getChildByName("userInfo").getChildByName("bg").active = false;
        this.node.getChildByName("userInfo").getChildByName("headimg_panel").active = false;
        this.node.getChildByName("userInfo").getChildByName("banker_icon").active = false;
        this.node.getChildByName("userInfo").getChildByName("nickname").active = false;
        this.node.getChildByName("userInfo").getChildByName("lblScore").active = false;
        this.node.getChildByName("seat_down").active = true;
        // this.node.getChildByName("userInfo").active = false;
        callFun ? this._callFun = callFun:null;
    },

    showInfo:function(player,callFun){
        this.node.getChildByName("userInfo").getChildByName("bg").active = true;
        this.node.getChildByName("userInfo").getChildByName("headimg_panel").active = true;
        this.node.getChildByName("userInfo").getChildByName("banker_icon").active = true;
        this.node.getChildByName("userInfo").getChildByName("nickname").active = true;
        this.node.getChildByName("userInfo").getChildByName("lblScore").active = true;
        this.node.getChildByName("seat_down").active = false;
        this.node.getChildByName("userInfo").active = true;

        this.lblName.string = player.name;
        this.setScore(player.totalScore);

        /*cc.module.imageCache.newImage(player.userId,function (spriteFrame) {
            if(!cc.isValid(this.node)) {
                return;
            }
            this.headimg.spriteFrame = cc.isValid(spriteFrame)?spriteFrame : game.getDefaultHeadimg();
        }.bind(this));*/

        cc.loader.load({url:player.headimg,type:"jpg"},function (err,tex) {
            if(err) {
                // this._headImgUrl[userId] = null;
                this.getImage(player.userId);
                return;
            }
            this.headimg.spriteFrame = new cc.SpriteFrame(tex);
        }.bind(this));

        callFun ? this._callFun = callFun:null;
    },

    reset:function () {
        this._userId = null;
        // this._II = null;
        this._sex = null;
        this.node.getChildByName("userInfo").active = false;
        this.node.getChildByName("seat_down").active = true;
        this.node.getChildByName("userInfo").getChildByName("bg").active = false;
        this.node.getChildByName("userInfo").getChildByName("headimg_panel").active = false;
        this.node.getChildByName("userInfo").getChildByName("banker_icon").active = false;
        this.node.getChildByName("userInfo").getChildByName("nickname").active = false;
        this.node.getChildByName("userInfo").getChildByName("lblScore").active = false;
        this.dealNode.active = false;
        this.showNode.active = false;
        this._callFun = null;
    },

    getUserId:function () {
        return this._userId;
    },

    getNickname:function () {
        return this._nickname;
    },

    getBankerIcon:function () {
        return this.bankerIcon;
    },

    getHeadimg:function () {
        return this.headimg;
    },

    getSex:function () {
        return this._sex;
    },

    getAble:function () {
        return this._userId != null;
    },

    playDealAnim:function (dealCards,order) {
        this.dealNode.active = true;
        this._dealCards = dealCards;
        this._isCompareIng = this._userId?true:false;
            dealCards.forEach(function (dealCard,index) {
            var cardBack
            if(cc.module.self.userId == this.getUserId()) {
                cardBack = this.dealNode.children[index];
            }
            else {
                cardBack = this.dealNode.children[this.dealNode.children.length-1-index];
            }
            var cardBackWorldSpace = cardBack.convertToWorldSpaceAR(cc.v2(0,0));
            var detail = dealCard.convertToNodeSpaceAR(cardBackWorldSpace);
            var scale= cardBack.width/dealCard.width;
            dealCard.runAction(this.getDealAction(scale,detail,order,index));
        }.bind(this));
        return this._defaultDealActionTime*5;
    },

    getDealAction:function (scale,detail,order,index) {
        var moveAction = cc.moveBy(this._defaultDealActionTime,detail.x,detail.y);
        var scaleAction = cc.scaleTo(this._defaultDealActionTime,scale,scale);
        var spawnAction = cc.spawn([moveAction,scaleAction]);
        var sequence;
        if(index===0) {
            var callfunc = cc.callFunc(function () {
                cc.module.audioMgr.playSFX("deal.mp3");
            }.bind(this));
            sequence = [cc.delayTime(this._defaultDealActionTime/2*order*5),cc.delayTime(this._defaultDealActionTime/2*index),callfunc,spawnAction];
        }
        else {
            sequence = [cc.delayTime(this._defaultDealActionTime/2*order*5),cc.delayTime(this._defaultDealActionTime/2*index),spawnAction];
        }
        return cc.sequence(sequence);
    },

    showPoker:function (cards,callback) {
        this.dealNode.active = true;
        this._cards = cards;
        this._cards.forEach(function (cardId,index) {
            var dealCard = this.dealNode.children[index];
            if(dealCard._cardId != null) {
                return;
            }
            dealCard._cardId = cardId;

            var scaleAction1 = cc.scaleTo(this._defaultTranformActionTime,0,1);
            var scaleAction2 = cc.scaleTo(this._defaultTranformActionTime,1,1);
            var tranformSFCallfun = cc.callFunc(function () {
                var sprite = dealCard.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.module.pokerMgr.getMinPokerSFById(cardId);
            });
            var sequenceAction;
            if(callback && index===cards.length-1) {
                var finishCallback = cc.callFunc(function () {
                    callback();
                });
                sequenceAction = cc.sequence([scaleAction1,tranformSFCallfun,scaleAction2,finishCallback]);
            }
            else {
                sequenceAction = cc.sequence([scaleAction1,tranformSFCallfun,scaleAction2]);
            }
            dealCard.runAction(sequenceAction);
        }.bind(this));
    },

    hidePoker:function () {
        this.dealNode.children.forEach(function (card) {
            card.active = false;
        });
    },

    showAllPokerBack:function () {
        /*if(this._dealCards) {
            this._dealCards.forEach(function (dealCard) {
                dealCard.removeFromParent();
            });
        }*/
        this.dealNode.children.forEach(function (dealCard) {
            dealCard.stopAllActions();
            var sprite = dealCard.getComponent(cc.Sprite);
            sprite.spriteFrame = cc.module.pokerMgr.getPokerBackSF();
            dealCard._cardId = null;
            dealCard.active = true;
        });
    },

    playTwistAnim:function (twistCards,callback) {
       
    },

    playTwistOneAnim:function (twistCards,callback) {
        var twistCard = twistCards[0];
        twistCard.anchorX = 0.5;
        var cardBack = this.dealNode.children[this.dealNode.children.length-1];
        var cardBackWorldSpace = cardBack.convertToWorldSpaceAR(cc.v2(0,0));
        var detail = twistCard.convertToNodeSpaceAR(cardBackWorldSpace);
        var scale= cardBack.width/twistCard.width;
        var moveAction = cc.moveBy(this._defaultDealActionTime*2,detail.x,detail.y);
        var scaleAction = cc.scaleTo(this._defaultDealActionTime*2,scale,scale);
        var callfunc = cc.callFunc(function () {
            if(callback) {
                callback();
            }
        }.bind(this));
        var spawnAction = cc.spawn([moveAction,scaleAction]);
        twistCard.runAction(cc.sequence([spawnAction,callfunc]));
    },

    setCards:function (cards) {
        this._cards = cards;
    },

    getCards:function () {
        return this._cards;
    },

    showTypeAndMultiple:function () {
        this.typeAndMultiple.width = 0;
        var pop = this.typeAndMultiple.getComponent("Pop");
        pop.pop();
        this.playNNTypeSFX();
    },

    hideTypeAndMultiple:function () {
        var pop = this.typeAndMultiple.getComponent("Pop");
        pop.unpop();
    },

    setType:function (typeId,config) {
        this._nnType = typeId;
        var type = this.typeAndMultiple.getChildByName("type");
        var sprite = type.getComponent(cc.Sprite);
        sprite.spriteFrame = cc.module.pokerMgr.getNNTypeSpriteFrame(typeId,config);
    },

    setMultiple:function (multiple) {
        this._multiple = multiple;
        var multipleNode = this.typeAndMultiple.getChildByName("multiple");
        var sprite = multipleNode.getComponent(cc.Sprite);
        sprite.spriteFrame = cc.module.pokerMgr.getMultipleSrptieFrame(multiple);
        multipleNode.active = !(sprite.spriteFrame==null);
    },

    setInfo:function (player) {
        this.node.getChildByName("userInfo").active = true;
        this.node.getChildByName("seat_down").active = false;

        this.node.getChildByName("userInfo").getChildByName("bg").active = true;
        this.node.getChildByName("userInfo").getChildByName("headimg_panel").active = true;
        this.node.getChildByName("userInfo").getChildByName("banker_icon").active = true;
        this.node.getChildByName("userInfo").getChildByName("nickname").active = true;
        this.node.getChildByName("userInfo").getChildByName("lblScore").active = true;

        this.show();
        
        this._nickname = player.name;
        this._ip = player.ip;
        this._userId = player.userId;
        this._sex = player.sex;
        this.lblName.string = player.name;
        this.lblScore.string = player.totalScore;
        this.bankerIcon.active = player.isBanker;
        this.setReady(player.readyStatus);
        this.setTwist(player.twistStatus);
        this.setOnlineStatus(player.onlineStatus);
        this.setStatus();
       /* cc.module.imageCache.newImage(player.userId,function (spriteFrame) {
            if(!this.node) {
                return;
            }
            if(spriteFrame) {
                this.headimg.spriteFrame = spriteFrame;
            }
            else {
                this.headimg.spriteFrame = this.defaultHeadImg;
            }
        }.bind(this));*/


        cc.loader.load({url:player.headimg,type:"jpg"},function (err,tex) {
            if(err) {
                // this._headImgUrl[userId] = null;
                this.getImage(player.userId);
                return;
            }
            this.headimg.spriteFrame = new cc.SpriteFrame(tex);
        }.bind(this));
    },
    getImage:function(userId){
        cc.module.imageCache.getImage(userId,function (spriteFrame) {
            if(!this.node) {
                return;
            }
            if(spriteFrame) {
                this.headimg.spriteFrame = spriteFrame;
            }
            else {
                this.headimg.spriteFrame = this.defaultHeadImg;
            }
        }.bind(this));
    },

    setScore:function (score) {
        var xscore = parseInt(score)-this.getScore();
        this.lbcScore.node.active=true;
        if(xscore>=0)xscore="+"+xscore;
        this.lbcScore.string = xscore;
        var delayAction = cc.delayTime(3);
        var callfun = cc.callFunc(function () {
            this.lbcScore.node.active=false;
        }.bind(this));
        this.node.runAction(cc.sequence([delayAction,callfun]));

        this.lblScore.string = score;
    },

    getScore:function () {
        return parseInt(this.lblScore.string);
    },

    setReady:function (status) {
        this._isReady = status;
        this.setStatus();
    },

    setBanker:function (isBanker) {
        this.bankerIcon.active = isBanker;
    },

    getReadyStatus:function () {
        return this._isReady;
    },

    setTwist:function (status) {
        this._isTwist = status;
        this.setStatus();
    },

    setOnlineStatus:function (status) {
        this._isOnline = status;
        this.setStatus();
    },

    setStatus:function () {
        if(!this._isOnline) {
            this.headimg.node.color = new cc.Color(80, 80, 80);
            this.statusIcon.node.active = true;
            this.statusIcon.spriteFrame = this.offlineSpriteFrame;
        }
        else if(this._isReady) {
            this.headimg.node.color = new cc.Color(80, 80, 80);
            this.statusIcon.node.active = true;
            this.statusIcon.spriteFrame = this.readySpriteFrame;
        }
        else if(this._isTwist) {
            this.headimg.node.color = new cc.Color(80, 80, 80);
            this.statusIcon.node.active = true;
            this.statusIcon.spriteFrame = this.twistSpriteFrame;
        }
        else {
            this.headimg.node.color = new cc.Color(255, 255, 255);
            this.statusIcon.spriteFrame = null;
            this.statusIcon.node.active = false;
        }
    },

    quickChat:function (chatId) {
        var chat = "";
        switch(chatId) {
            case 0:
                chat = "快点啊！等得花都谢了！";
                break;
            case 1:
                chat = "不要吵了，专心玩游戏吧";
                break;
            case 2:
                chat = "不要走，决战到天亮";
                break;
            case 3:
                chat = "底牌亮出来，绝对吓死你";
                break;
            case 4:
                chat = "风水轮流转，底裤都输光了";
                break;
            case 5:
                chat = "看我通杀全场，这些钱都是我的";
                break;
            case 6:
                chat = "不好意思，我要离开一会儿";
                break;
            case 7:
                chat = "怎么又断线，网络怎么这么差啊";
                break;
        }
        this.lblChat.string = chat;
        this.lblChat.node.parent.active = true;
        this._chatTime = this._defaultChatShowTime;
    },

    voice:function (time) {
        this._voiceTime = time;
        this.voiceIcon.active = true;
    },

    emoji:function (animName) {
        this.emojiNode.active = true;
        this._emojiTime = this._defaultChatShowTime;
        var anim = this.emojiNode.getComponent(cc.Animation);
        anim.play(animName);
        console.log("表情：",animName);
    },

    hideChatBubble:function () {
        this._chatTime = null;
        this.lblChat.string = "";
        this.lblChat.node.parent.active = false;
    },

    hideVoiceBubble:function () {
        this._voiceTime = null;
        this.voiceIcon.active = false;
    },

    hideEmoji:function () {
        this.emojiNode.active = false;
        var anim = this.emojiNode.getComponent(cc.Animation);
        anim.stop();
    },

    playNNTypeSFX:function () {
        if(this._nnType==null || this._nnType=="finish" || this._nnType=="no_grab_banker" || this._nnType=="grab_banker") {
            return;
        }
        var url = "type/n" + this._nnType + ".mp3";
        cc.module.audioMgr.playBySex(this._sex,url);
    },

    hide:function () {
        this.node.active = false;
        this._userId = null;
        this._cards = [];
    },

    show:function () {
        this.node.active = true;
    },

    betting:function (score) {
        this.goldPanel.children.forEach(function (node,index) {
            if(node.name == "later_gold_icon") {
                node.removeFromParent();
            }
        });
        var goldIcon = this.goldPanel.getChildByName("gold_icon");
        var lblGoldNum = this.goldPanel.getChildByName("lbl_gold_num").getComponent(cc.Label);
        this.goldPanel.active = true;
        goldIcon.active = false;
        lblGoldNum.node.active = false;
        var goldIconWorldAR = goldIcon.convertToWorldSpaceAR(cc.v2(0,0));
        for(var i=0 ; i<score ; i++) {
            var goldPrefab = cc.instantiate(this.goldIconPrefab);
            goldPrefab.name = "later_gold_icon";
            this.goldPanel.addChild(goldPrefab);
            var headimgWorldAR = this.headimg.node.convertToWorldSpaceAR(cc.v2(0,0));
            var goldPrefabDetail = goldPrefab.convertToNodeSpaceAR(headimgWorldAR);
            goldPrefab.x += goldPrefabDetail.x+Math.floor(Math.random()*10*(Math.random()>0.5?-1:1));
            goldPrefab.y += goldPrefabDetail.y+Math.floor(Math.random()*10*(Math.random()>0.5?-1:1));
            var actionDetail = goldPrefab.convertToNodeSpaceAR(goldIconWorldAR);
            var moveAction = cc.moveBy(0.3,actionDetail.x,actionDetail.y);
            var delayAction = cc.delayTime(i*0.05);
            if(i == score-1) {
                var callfun = cc.callFunc(function () {
                    lblGoldNum.string = score;
                    lblGoldNum.node.active = true;
                    goldIcon.active = true;
                    this.goldPanel.children.forEach(function (node,index) {
                        if(node.name == "later_gold_icon") {
                            node.removeFromParent();
                        }
                    });
                }.bind(this));
                goldPrefab.runAction(cc.sequence([delayAction,moveAction,callfun]));
            }
            else {
                goldPrefab.runAction(cc.sequence([delayAction,moveAction]));
            }
        }
        cc.module.audioMgr.playSFX("gold.mp3");
    },

    hideBetting:function () {
        this.goldPanel.active = false;
    },

    showObain:function (obain) {
        this.lblObtain.string = obain>0 ? "+"+obain : obain;
        this.lblObtain.node.active = true;
    },

    hideObain:function () {
        this.lblObtain.node.active = false;
    },

    play:function (cardGroup) {
        this.showNode.active = true;
        var group1 = this.showNode.getChildByName("group1");
        var group2 = this.showNode.getChildByName("group2");
        var all = [group1,group2];
        all.forEach(function (group,i) {
            group.children.forEach(function (card,index) {
                var sprite = card.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.module.pokerMgr.getMinPokerSFById(cardGroup[i][index]);
                card.active = sprite.spriteFrame!=null;
            });
        });
        this.showTypeAndMultiple();
    },

    hidePlayCard:function () {
        this.showNode.active = false;
    },

    update:function (dt) {
        if(this._chatTime) {
            this._chatTime -= dt;
            if(this._chatTime <= 0) {
                this._chatTime = null;
                this.hideChatBubble();
            }
        }
        if(this._voiceTime) {
            this._voiceTime -= dt;
            if(this._voiceTime <= 0) {
                this._voiceTime = null;
                this.hideVoiceBubble();
            }
        }
        if(this._emojiTime) {
            this._emojiTime -= dt;
            if(this._emojiTime <= 0) {
                this._emojiTime = null;
                this.hideEmoji();
            }
        }
    }
});
