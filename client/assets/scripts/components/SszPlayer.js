cc.Class({
    extends: cc.Component,

    properties: {
        dealSpacing:30,
        manyPersonScale:0.8,
        dealNode:cc.Node,
        headimg:cc.Sprite,
        // offlineNode:cc.Node,
        lblName:cc.Label,
        lblScore:cc.Label,
        readyNode:cc.Node,
        voiceNode:cc.Node,
        bubbleNode:cc.Node,
        emojiNode:cc.Node,  
        outNode:cc.Node,
        gunNode:cc.Node,
        beGunNode:cc.Node,
        lblChat:cc.Label,
        emojiAtlas:cc.SpriteAtlas,
        _isOnRight:true,
        _isCompareIng:false,
        _pokerMgr:null,
        _userId:null,
        _outPreviewData:null,
        _II:null,//个人信息的缩写
        _voiceTime:null,
        _sex:null,
        _seat:null,
        _chatTime:null,
        _emojiTime:null,
        _isNowStatuShowBack:true,
        _defaultChatShowTime:3
    },
    
    onLoad: function () {
        var game = cc.find("Canvas").getComponent("SszGame");
        this._pokerMgr = game.getPokerMgr();
        var rotate = this.outNode.getChildByName("rotate");
        rotate.on(cc.Node.EventType.TOUCH_START,this.onTouchStartOutPreview,this);
        //rotate.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEndOutPreview,this);
        //rotate.on(cc.Node.EventType.TOUCH_END,this.onTouchEndOutPreview,this);
        // this.node.getChildByName("seat_down").active = false;
    },

    reset:function () {
        this._userId = null;
        this._II = null;
        this._sex = null;
        this.node.getChildByName("userInfo").active = false;
        this.node.getChildByName("seat_down").active = true;
        this.node.getChildByName("userInfo").getChildByName("mask").active = false;
        this.node.getChildByName("userInfo").getChildByName("player_mask").active = false;
        this.node.getChildByName("userInfo").getChildByName("lbl_name").active = false;
        this.node.getChildByName("userInfo").getChildByName("lbl_score").active = false;
        this.outNode.active = false;
        this.dealNode.active = false;
        this._callFun = null;
    },

    showInfo:function(player,callFun){
        this.node.getChildByName("userInfo").getChildByName("mask").active = true;
        this.node.getChildByName("userInfo").getChildByName("player_mask").active = true;
        this.node.getChildByName("userInfo").getChildByName("lbl_name").active = true;
        this.node.getChildByName("userInfo").getChildByName("lbl_score").active = true;
        this.node.getChildByName("seat_down").active = false;
        this.node.getChildByName("userInfo").active = true;

        this.lblName.string = player.name;
        this.setScore(player.gold);
        console.log(player,'---73');
        /*cc.module.imageCache.getImage(player.userId,function (spriteFrame) {
            if(!cc.isValid(this.node)) {
                return;
            }
            this.headimg.spriteFrame = cc.isValid(spriteFrame)?spriteFrame : game.getDefaultHeadimg();
        }.bind(this));*/

        cc.loader.load({url:player.headimg,type:"jpg"},function (err,tex) {
            if(err) {
                this.getImage(player.userId,function(tex){
                    this.headimg.spriteFrame = tex;
                });
                return;
            }
            this.headimg.spriteFrame = new cc.SpriteFrame(tex);
        }.bind(this));
        callFun ? this._callFun = callFun:null;
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
    
    hideInfo:function(callFun){
        this.node.getChildByName("userInfo").getChildByName("mask").active = false;
        this.node.getChildByName("userInfo").getChildByName("player_mask").active = false;
        this.node.getChildByName("userInfo").getChildByName("lbl_name").active = false;
        this.node.getChildByName("userInfo").getChildByName("lbl_score").active = false;
        this.node.getChildByName("seat_down").active = true;
        // this.node.getChildByName("userInfo").active = false;
        callFun ? this._callFun = callFun:null;
    },

    setIsRight:function(isOnRight){
        this._isOnRight = isOnRight;  
        var deal = this.node.getChildByName("userInfo").getChildByName("deal");
        deal.children.forEach(function(child,index){
            if(isOnRight){
                child.x = -index*25;
            }else{
                child.x = 95+index*25;
            }
        });
    },

    setInfo:function (player,isOnRight) {
        var game = cc.find("Canvas").getComponent("SszGame");
        this.node.active = true;
        this.node.getChildByName("userInfo").active = true;

        this._II = {};
        this._II.ip = player.ip;
        this._II.userId = player.userId;
        this._II.name = player.name;
        this._II.sex = player.sex === 1?"男":"女";
        this._sex = player.sex;
        this._seat = player.seat;

        this._userId = player.userId;
        this._isOnRight = isOnRight;
        this.lblName.string = player.name;
        // console.log(player);
        this.setScore(player.totalScore);

        // this.offlineNode.active = !player.onlineStatus;
        this.readyNode.active = player.readyStatus;
        this.node.getChildByName("seat_down").active = false;
        this.node.getChildByName("userInfo").getChildByName("mask").active = true;
        this.node.getChildByName("userInfo").getChildByName("player_mask").active = true;
        this.node.getChildByName("userInfo").getChildByName("lbl_name").active = true;
        this.node.getChildByName("userInfo").getChildByName("lbl_score").active = true;

        //语音和聊天气泡
        this.voiceNode.active = false;
        this.bubbleNode.active = false;
        this.emojiNode.active = false;
        //发牌与出牌
        this.dealNode.active = false;
        this.outNode.active = false;

        // 设置头像

        // cc.module.imageCache.getImage(player.userId,function (spriteFrame) {
        //     if(!cc.isValid(this.node)) {
        //         return;
        //     }
        //     this.headimg.spriteFrame = cc.isValid(spriteFrame)?spriteFrame : game.getDefaultHeadimg();
        // }.bind(this));


        cc.loader.load({url:player.headimg,type:"jpg"},function (err,tex) {
            if(err) {
                this.getImage(player.userId,function(tex){
                    this.headimg.spriteFrame = tex;
                });
                return;
            }
            this.headimg.spriteFrame = new cc.SpriteFrame(tex);
        }.bind(this));
    },
    
    setChat:function(string){
        this.lblChat.string = string;
        this.lblChat.node.parent.active = true;
        this._chatTime = this._defaultChatShowTime;
    },
    
    setScore:function (score) {
        this.lblScore.string = score;
    },

    onclickHead:function(){
        if(!cc.module.self.seat){
            return;
        }
        var game = cc.find("Canvas").getComponent("SszGame");
        var interation = this.node.getChildByName("userInfo").getChildByName("interaction");
        interation.active = true;
    },

    onclickInteraction:function(e,name){
        var interation = this.node.getChildByName("userInfo").getChildByName("interaction");
        interation.active = false;
        if(!this._userId){
            return;
        }
        var emojiName = name;
        var game = cc.find("Canvas").getComponent("SszGame");
        game.onclickInteraction({"userId":this._userId,"emojiName":emojiName});
    },

    getWorldSpaceAR:function () {
        return this.node.convertToWorldSpaceAR(cc.v2(0,0));
    },

    getSex:function () {
        return this._sex;
    },

    deal:function () {
        this._isCompareIng = this._userId?true:false;
        this.dealNode.active = true;
        this.dealNode.children.forEach(function (pokerBack) {
            pokerBack.active = false;
        }.bind(this));
        var fun = function(pokerBack,index){
            setTimeout(function () {
                pokerBack.active = true;
            },30*index);
        };
        this.dealNode.children.forEach(function (pokerBack,index) {
            fun(pokerBack,index);
        }.bind(this));
        this.outNode.active = false;
    },

    out:function (isSpecial) {
        this.dealNode.active = false;
        this.outNode.active = true;
        var rotate = this.outNode.getChildByName("rotate");
        var upright = this.outNode.getChildByName("upright");
        var specialType = this.outNode.getChildByName("special_type");
        rotate.active = true;
        upright.active = false;
        specialType.active = false;
        var tScore = rotate.getChildByName("total").getChildByName("score");
        tScore.getComponent(cc.Label).string = 0;
        this.setRotateToBack();
        if(isSpecial) {
            this.onOutIsSpecial("tsp");
        }
    },

    setScale:function () {
        this.outNode.scaleX = this.manyPersonScale;
        this.outNode.scaleY = this.manyPersonScale;
    },

    setOutPreview:function (data) {
        this._outPreviewData = data;
    },

    onTouchStartOutPreview:function () {
        if(!cc.isValid(this._outPreviewData)) {
            return;
        }
   
        if(this._isNowStatuShowBack){
            this._isNowStatuShowBack = false;
            var touIds,zhongIds,weiIds;
            var touScore,zhongScore,weiScore;
            touIds = this._outPreviewData.tou.ids;
            zhongIds = this._outPreviewData.zhong.ids;
            weiIds = this._outPreviewData.wei.ids;

            touScore = this._outPreviewData.touScore||"";
            zhongScore = this._outPreviewData.zhongScore||"";
            weiScore = this._outPreviewData.weiScore||"";

            this.setAnRotateDaoToCard("tou",touIds,touScore);
            this.setAnRotateDaoToCard("zhong",zhongIds,zhongScore);
            this.setAnRotateDaoToCard("wei",weiIds,weiScore);
            if(!this._outPreviewData.isSpecial) return;
            var name = this._outPreviewData.isSpecial.substr(3).toLowerCase();
            this.onOutIsSpecial(name);
        }else{
            this.setRotateToBack();
            this._isNowStatuShowBack = true;
        }

    },

    onTouchEndOutPreview:function () {
        if (this.getId() != cc.module.self.userId) {
            return;
        }
        if(cc.isValid(this._outPreviewData)) {
            this.setRotateToBack();
        }
    },

    setCompareData:function (data) {
        this._outPreviewData = null;
        //this.setRotateToBack();
        this._isNowStatuShowBack = true;
        this.changeSpecialTypeActive(false);
        var upright = this.outNode.getChildByName("upright");
        upright.children.forEach(function (dao) {
            dao.active = false;
        });
        upright.active = false;
        if(cc.isValid(data.special)) {
            this.setOneDaoUpright("tou",data.tou.ids, "", data.tou.score, data.touScore);
            this.setOneDaoUpright("zhong",data.zhong.ids,"", data.zhong.score, data.zhongScore);
            this.setOneDaoUpright("wei",data.wei.ids, "", data.wei.score, data.weiScore);
        }
        else {
            this.setOneDaoUpright("tou",data.tou.ids, data.tou.type, data.tou.score, data.touScore);
            this.setOneDaoUpright("zhong",data.zhong.ids, data.zhong.type, data.zhong.score, data.zhongScore);
            this.setOneDaoUpright("wei",data.wei.ids, data.wei.type, data.wei.score, data.weiScore);
        }
    },

    /*--------------------------------------设置出牌数据和类型---------------------*/
    //设置指定的道的牌、类型、得分
    setOneDaoUpright:function (dao,cards,type,score,daoScore) {
        var upright = this.outNode.getChildByName("upright");
        var anDao = upright.getChildByName(dao);
        var index = -1;
        anDao._cards = cards;
        anDao.children.forEach(function (cardNode) {
            if(cardNode.name === "type") {
                var typeSprite = cardNode.getComponent(cc.Sprite);
                if(cc.isValid(type)) {
                    cardNode.active = true;
                    typeSprite.spriteFrame = this._pokerMgr.getTypeSFByName(type);
                }
                else{
                    cardNode.active = false;
                }
                return ;
            }
            if(cardNode.name === "card"){
                index ++;
                var sprite = cardNode.getComponent(cc.Sprite);
                sprite.spriteFrame = this._pokerMgr.getPokerSFById(cards[index]);
            }
        }.bind(this));
    },

    /*---------------------------------------显示出牌----------------------------*/
    showAnDao:function (dao,score,isSelf) {
        var upright = this.outNode.getChildByName("upright");
        var anDao = upright.getChildByName(dao);
        anDao.stopAllActions();
        upright.active = true;
        anDao.active = true;
        anDao.scaleX = 0.5;
        anDao.scaleY = 0.5;
        anDao.opacity = 0;

        var delayAction = cc.delayTime(1);
        var fun = cc.callFunc(function () {
            anDao.active = false;
            this.setAnRotateDaoToCard(dao,anDao._cards,score,isSelf);
        }.bind(this));
        anDao.runAction( cc.sequence([this.getSpringAction(0.05 , 1 , 1),delayAction,fun]));

        var rotate = this.outNode.getChildByName("rotate");
        var rotateDao = rotate.getChildByName(dao);
        rotateDao.active = false;
    },

    //显示特殊牌
    showAllDao:function () {
        this.showAnDao("tou",null);
        this.showAnDao("zhong",null);
        this.showAnDao("wei",null);
        this.changeSpecialTypeActive(true);
        var specialType = this.outNode.getChildByName("special_type");
        specialType.scaleX = 0.5;
        specialType.scaleY = 0.5;
        specialType.opacity = 0;
        specialType.runAction(this.getSpringAction(0.1 , 1.2 , 1.2));
    },

    //同时出牌
    showAllCards:function(){
        this.showAnDao("tou",null);
        this.showAnDao("zhong",null);
        this.showAnDao("wei",null);
    },
    
    /*--------------------------------------隐藏旋转出牌、竖着出牌、牌的类型、特殊牌类型------------*/
    hideRotate:function () {
        var rotate = this.outNode.getChildByName("rotate");
        rotate.active = false;
    },

    playHitGunAnim:function(rotate){
        // console.log(rotate);
        //手枪
        var direction = this.node.x>0 ? 1:-1;
        this.gunNode.active = true;
        this.gunNode.rotation = direction > 0 ? ( - direction * rotate):( direction * rotate );
        var yan = this.gunNode.getChildByName("yan");
        var animCpt = yan.getComponent("AnimCpt");
        cc.module.audioMgr.playSFX("ssz/gun.mp3");
        animCpt.playOnce(function () {
            cc.module.audioMgr.playSFX("ssz/gun.mp3");
            animCpt.playOnce(function () {
                cc.module.audioMgr.playSFX("ssz/gun.mp3");
                animCpt.playOnce(function () {
                    this.active = false;
                }.bind(yan));
            }.bind(yan));
        }.bind(this));
        var rotateAction = cc.rotateBy(0.1,-15);
        var rotateAction2 = cc.rotateBy(0.1,15);
        var callFun = cc.callFunc(function () {
            this.gunNode.active = false;
        }.bind(this));
        var repeatActioin = cc.repeat(cc.sequence([rotateAction,rotateAction2]),3);
        this.gunNode.runAction(cc.sequence([repeatActioin,callFun]));

        //海盗图的枪
        // this.gunNode.active = true;
        // var playMusic = cc.callFunc(function(){
        //      cc.module.audioMgr.playSFX("ssz/gun.mp3");
        // });
        // var finished = cc.callFunc(function(){
        //     this.gunNode.active = false;
        // }.bind(this));
        // var action = cc.repeat(cc.sequence(cc.spawn(cc.rotateTo(0.1,-10),playMusic),cc.rotateTo(0.1,0)),3);
        // this.gunNode.runAction(cc.sequence(action,finished));
    },

    playBeHitGunAnim:function () {
        var time = 0.2;
        this.beGunNode.active = true;
        this.beGunNode.children.forEach(function(dong,index) {
            dong.opacity = 0;
            var delayAction = cc.delayTime(time*index);
            var callFun = cc.callFunc(function () {
                this.opacity = 255;
            }.bind(dong));
            var delayAction2 = cc.delayTime(0.3);
            var opacityAction = cc.fadeTo(0.5,0);
            dong.runAction(cc.sequence([delayAction,callFun,delayAction2,opacityAction]));
        }.bind(this));
    },

    alterOutNodeActive:function (active) {
        this.outNode.active = active;
        this.node.getChildByName("userInfo").getChildByName("totalScore").active = false;
    },

    hideUpright:function () {
        var upright = this.outNode.getChildByName("upright");
        upright.active = false;
    },

    changeSpecialTypeActive:function (active) {
        var specialType = this.outNode.getChildByName("special_type");
        specialType.active = active;
    },
    
    /*------------------------------------玩家旋转出牌显示----------------------------------*/
    setRotateToBack:function () {
        var rotate = this.outNode.getChildByName("rotate");
        var total = rotate.getChildByName("total");
        var tou = rotate.getChildByName("tou");
        var zhong = rotate.getChildByName("zhong");
        var wei = rotate.getChildByName("wei");
        total.active = false;
        var setSpriteFrameFun = function (node) {
            if(node.name == "card"){
                var sprite = node.getComponent(cc.Sprite);
                sprite.spriteFrame = this._pokerMgr.getPokerBackSF();
            }
            if(node.name == "dao"){
                node.active = false;
            }
        };
        tou.children.forEach(setSpriteFrameFun.bind(this));
        zhong.children.forEach(setSpriteFrameFun.bind(this));
        wei.children.forEach(setSpriteFrameFun.bind(this));
    },

    setAnRotateDaoToCard:function (dao,ids,score,isSelf) {
        var rotate = this.outNode.getChildByName("rotate");
        var anDao = rotate.getChildByName(dao);
        anDao.active = true;
        var game = cc.find("Canvas").getComponent("SszGame");
        var gameInfo = game.getGame();
        var changeCard = gameInfo.changeCard;
        anDao.children.forEach(function (cardNode,index) {
            if(cardNode.name == "card"){
                var sprite = cardNode.getComponent(cc.Sprite);
                // sprite.spriteFrame = this._pokerMgr.getPokerSFById(ids[index]); 
                sprite.spriteFrame = ((changeCard-26)==ids[index]) ? this._pokerMgr.getPokerSFById(changeCard):this._pokerMgr.getPokerSFById(ids[index]);
            }else{ // dao
                if(isSelf){
                    var total = rotate.getChildByName("total");
                    var socre = cardNode.getChildByName("score");
                    var tScore = total.getChildByName("score");
                    cardNode.active = true;
                    total.active = true;
                    tScore.getComponent(cc.Label).string = ( Number(tScore.getComponent(cc.Label).string) + Number(score) );
                    socre.getComponent(cc.Label).string = (score>0? "+"+score:score);
                }
            }
        }.bind(this));
    },

    onOutIsSpecial:function (name) {
        var specialType = this.outNode.getChildByName("special_type");
        var spriteCpt = specialType.getComponent(cc.Sprite);
        spriteCpt.spriteFrame = this._pokerMgr.getTypeSFByName(name);
        specialType.active = true;
    },

    dis:function () {
        this.node.active = false;
        this._userId = null;
        this._II = null;
    },

    quickChat:function (chatId) {
        var chat = "";
        switch(chatId) {
            case 0:
                chat = "快点啊！等得花都谢了！";
                break;
            case 1:
                chat = "不要吵了，不要吵了，专心玩游戏吧";
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
        this.voiceNode.active = true;
    },

    emoji:function (id) {
        this.emojiNode.active = true;
        this._emojiTime = this._defaultChatShowTime;
        
        var animState = this.emojiNode.getComponent(cc.Animation).play(id);
        animState.wrapMode = cc.WrapMode.Loop;
    },

    hideVoiceBubble:function () {
        this._voiceTime = null;
        this.voiceNode.active = false;
    },

    hideChatBubble:function () {
        this._chatTime = null;
        this.lblChat.string = "";
        this.lblChat.node.parent.active = false;
    },

    hideEmoji:function () {
        this.emojiNode.active = false;
    },

    isUnUse:function () {
        return !cc.isValid(this._userId);
    },

    getId:function () {
        return this._userId;
    },

    changeReadyActive:function (active) {
        this.readyNode.active = active;
    },

    getSpringAction:function (duration,scaleX,scaleY) {
        var scaleBigAction = cc.scaleTo(duration,scaleX,scaleY);
        var scaleSmallAction = cc.scaleTo(duration,1,1);
        var opacityAction = cc.fadeTo(duration,255);
        var spawnAction = cc.spawn([scaleBigAction,opacityAction]);
        return cc.sequence([spawnAction,scaleSmallAction]);
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
