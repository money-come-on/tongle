cc.Class({
    extends: cc.Component,

    properties: {
        specialNode:cc.Node,
        containerSpacing:70,
        cardPrefab:cc.Prefab,
       
        timer:cc.Node,
        _pokerMgr:null,
        _cardNodes:null,
        _sszUtil:null,
        _specialType:null,
        _time:null,
    },

    onLoad: function () {
        var game = cc.find("Canvas").getComponent("SszGame");
        this._pokerMgr = game.getPokerMgr();
        this._sszUtil = game.getSszUtil();
    },
    
    setCards:function (ids,time,isSpecial,changeCard) {
        this.timer.active = true;
        this._time = time;
        this._reflash = this.timer.getChildByName("reflash");
        //this.startTimer(time);
        //ids = [12, 11];
        //ids = [12,11,2,40,3,43,44,16,17,31,19,0,7];
        ids.sort(this.sort);
        var CardTypeCombine = this.node.getChildByName("CardTypeCombine").getComponent("SszCardTypeCombine");
        CardTypeCombine.starts(ids.slice(),this._pokerMgr,this._sszUtil,changeCard);
        this.specialNode.active = false;
        isSpecial && this.isSpecial(ids.slice());
        this.node.runAction(this.getTransitionAnim());
        var game = cc.find("Canvas");
        var changeCardNode = game.getChildByName("change_card");
        var sszMateChangeCardNode = this.node.getChildByName("change_card");
        changeCardNode.active = changeCard ? true : false;
        sszMateChangeCardNode.active = changeCard ? true : false;
        if(changeCard){
            var card = changeCardNode.getChildByName("card").getComponent(cc.Sprite);
            var sssMateCard = sszMateChangeCardNode.getChildByName("card").getComponent(cc.Sprite);
            card.spriteFrame = this._pokerMgr.getPokerSFById(changeCard);
            sssMateCard.spriteFrame = this._pokerMgr.getPokerSFById(changeCard);
        }
    },

    isSpecial:function(ids){
        var specialRusult = this._sszUtil.getAllHoldTypeWithSpecial(ids);
        this._specialType = null;
        for(var i in specialRusult){
            if(specialRusult[i]){
                this._specialType = i;
                break;
            }
        }
        if(this._specialType){
            this.specialNode.active = true;
            var str = this.setSpecialStr(this._specialType);
            var specialStr = this.specialNode.getChildByName("content").getComponent(cc.Label);
            specialStr.string = str;
        }
    },

    onClickConfirmSpecialOut:function () {
        cc.module.audioMgr.playUIClick();
        var idsFirst = this.node.getChildByName("CardTypeCombine").getComponent("SszCardTypeCombine")._allPokerType[0];
        var data = {
            tou:idsFirst[2],
            zhong:idsFirst[1],
            wei:idsFirst[0],
            isSpecial:this._specialType
        };
        cc.module.socket.send(SEvents.Ssz.SEND_OUT,data,true);
        var game = cc.find("Canvas").getComponent("SszGame");
        game.setOutPreview(data);
        this.specialNode.active = false;
    },
    
    setSpecialStr:function(type){
        var str = "";
        if(type == "IS_QL"){
            str = "出现特殊牌型 至尊清龙 预计赢取每家 +108 分，是否按特殊牌型出牌";
        }
        else if(type == "IS_YTL"){
            str = "出现特殊牌型 一条龙 预计赢取每家 +72 分，是否按特殊牌型出牌";
        }
        else if(type == "IS_SRHZ"){
            str = "出现特殊牌型 十二皇族 预计赢取每家 +48 分，是否按特殊牌型出牌";
        }
        else if(type == "IS_STHS"){
            str = "出现特殊牌型 三同花顺 预计赢取每家 +40 分，是否按特殊牌型出牌";
        }
        else if(type == "IS_SFTX"){
            str = "出现特殊牌型 三分天下 预计赢取每家 +40 分，是否按特殊牌型出牌";
        }
        else if(type == "IS_QD"){
            str = "出现特殊牌型 全大 预计赢取每家 +20 分，是否按特殊牌型出牌";
        }
        else if(type == "IS_QX"){
            str = "出现特殊牌型 全小 预计赢取每家 +20 分，是否按特殊牌型出牌";
        }
        else if(type == "IS_CYS"){
            str = "出现特殊牌型 凑一色 预计赢取每家 +20 分，是否按特殊牌型出牌";
        }
        else if(type == "IS_STST"){
            str = "出现特殊牌型 四套三条 预计赢取每家 +12 分，是否按特殊牌型出牌";
        }
        else if(type == "IS_WDST"){
            str = "出现特殊牌型 五对三条 预计赢取每家 +10 分，是否按特殊牌型出牌";
        }
        else if(type == "IS_LDB"){
            str = "出现特殊牌型 六对半 预计赢取每家 +8 分，是否按特殊牌型出牌";
        }
        else if(type == "IS_SSZ"){
            str = "出现特殊牌型 三顺子 预计赢取每家 +8 分，是否按特殊牌型出牌";
        }
        else if(type == "IS_STH"){
            str = "出现特殊牌型 三同花 预计赢取每家 +6 分，是否按特殊牌型出牌";
        }
        return str;
    },
    
    setTime:function (time) {
        this.timer.getComponent(cc.Label).string = time;
    },

    changeTypeActive:function (node,active) {
        node.active = active;
    },

    alterBtnCancelAndOutActive:function (active) {
    },

    alterBtnElectionsActive:function (active) {
    },

    refreshElectioBtns:function () {
        var ids = [];
        var allTypes = this._sszUtil.getAllHoldTypeWithNormal(ids);
    },

    onTouchCardContainer:function (e) {
        var cardNode = this.getSelectCard(e);
        if(cardNode && !cardNode._isGray) {
            cardNode._isGray = true;
            cardNode.color = cc.color(200,200,200,255);
        }
        e.stopPropagation();
    },

    onTouchCardContainerEnd:function (e) {
        cc.module.audioMgr.playPokerSelected();
        e.target.children.forEach(function (cardNode) {
            cardNode.color = cc.color(255,255,255,255);
            cardNode.stopAllActions();
            if(cardNode._isGray) {
                if(cardNode.y === 30) {
                    cardNode.runAction(cc.moveTo(0.1,cardNode.x,0));
                }
                else {
                    cardNode.runAction(cc.moveTo(0.1,cardNode.x,30));
                }
            }
            delete cardNode._isGray;
        }.bind(this));
    },

    onClickMask:function (e) {
        cc.module.audioMgr.playUIClick();
    },

    onClickElection:function (e) {
      
    },

    onClickTouContainer:function (e) {
        // this.onClickDaoContainer(this.touContainer,3);
    },

    onClickZhongContainer:function (e) {
        // this.onClickDaoContainer(this.zhongContainer,5);
    },

    onClickWeiContainer:function (e) {
        // this.onClickDaoContainer(this.weiContainer,5);
    },
    
    //当点击每一道都来执行此方法
    onClickDaoContainer:function (container,maxLength) {
        cc.module.audioMgr.playUIClick();
        
        if(container.children.length === maxLength) {
            var ids = [];
            container.children.forEach(function (cardNode) {
                if(cc.isValid(cardNode._cardId)) {
                    ids.push(cardNode._cardId);
                }
            });
            if(ids.length === maxLength) {
                var allTypes = this._sszUtil.getAllHoldTypeWithNormal(ids);
                if(allTypes) {
                    var typeSpriteFrame;
                    for(var i in allTypes) {
                        if(allTypes[i]) {
                            typeSpriteFrame = this._pokerMgr.getTypeSFByName(i);
                            break;
                        }
                    }
                    if(!cc.isValid(typeSpriteFrame)) {
                        typeSpriteFrame = this._pokerMgr.getTypeSFByName("wl");
                    }
                }
            }
        }
        container.children.sort(function (node1,node2) {
            return this.sort(node1._cardId,node2._cardId);
        }.bind(this));
        container.children.forEach(function (node,index) {
            node.zIndex = index;
        }.bind(this));
    },

    onClickClearDaoContainer:function (e) {
        cc.module.audioMgr.playUIClick();
        var name = e.target.name;
        var container;
       
        container.children.forEach(function (cardNode) {
            if(cc.isValid(cardNode._cardId)) {
                var newCard = this.cloneCardNode(cardNode);
                cardNode.destroy();
            }
        }.bind(this));
       
        this.refreshPosition(this.cardContainer.children,false);
     
        this.onClickMask();
    },

    onClickAllCancel:function () {
        cc.module.audioMgr.playUIClick();
        this.onClickClearDaoContainer({target:{name:"btn_tou_clear"}});
        this.onClickClearDaoContainer({target:{name:"btn_zhong_clear"}});
        this.onClickClearDaoContainer({target:{name:"btn_wei_clear"}});
    },

    onClickConfirmOut:function () {
        cc.module.audioMgr.playUIClick();
        var touTypeAndScore = this._sszUtil.getTypeNameAndScore(touIds);
        var zhongTypeAndScore = this._sszUtil.getTypeNameAndScore(zhongIds);
        var weiTypeAndScore = this._sszUtil.getTypeNameAndScore(weiIds);
        var data = {
            tou:{
                ids:touIds,
                type:touTypeAndScore.name,
                score:touTypeAndScore.score
            },
            zhong:{
                ids:zhongIds,
                type:zhongTypeAndScore.name,
                score:zhongTypeAndScore.score
            },
            wei:{
                ids:weiIds,
                type:weiTypeAndScore.name,
                score:weiTypeAndScore.score
            },
            isSpecial:false
        };
        cc.module.socket.send(SEvents.Ssz.SEND_OUT,data,true);
        var game = cc.find("Canvas").getComponent("SszGame");
        game.setOutPreview(data);
    },

    
    onClickSpecialCancel:function () {
        this.specialNode.active = false;
    },

    getContainerIds:function (container) {
        var ids = [];
        container.children.forEach(function (cardNode) {
            if(cc.isValid(cardNode._cardId)) {
                ids.push(cardNode._cardId);
            }
        });
        return ids;
    },

    cloneCardNode:function (cardNode) {
        var newCard = cc.instantiate(cardNode);
        newCard._cardId = cardNode._cardId;
        return newCard;
    },

    getSelectCard:function (e) {
        var target = e.target;
        var worldLocation = e.getLocation();
        var nodeLocation = target.convertToNodeSpaceAR(worldLocation);
        for(var i=target.children.length-1 ; i>=0 ; i--) {
            var rect = target.children[i].getBoundingBox();
            if(cc.rectContainsPoint(rect,nodeLocation)) {
                return target.children[i];
            }
        }
    },
    
    refreshPosition:function (cardNodes,isAction) {
        if(cardNodes.length === 0){return;}
        var isValidCardNodes = [];
        cardNodes.forEach(function (cardNode) {
            if(cc.isValid(cardNode._cardId)) {
                isValidCardNodes.push(cardNode);
            }
        });
        if(isValidCardNodes.length === 0){return;}
        var centerIndex = Math.floor((isValidCardNodes.length-1)/2);
        isValidCardNodes.forEach(function (cardNode,index) {
            if(isAction) {
                cardNode.stopAllActions();
                var moveAction = cc.moveTo(0.2,(index-centerIndex)*this.containerSpacing,0);
                cardNode.runAction(moveAction);
            }
            else {
                cardNode.x = (index-centerIndex)*this.containerSpacing;
            }
        }.bind(this));
    },
    
    sort:function (id1,id2) {
        var point1 = id1%13+1;
        var point2 = id2%13+1;
        point1 = point1===1?14:point1;
        point2 = point2===1?14:point2;
        var rs = point2-point1;
        rs = rs===0 ? (Math.floor(id2/13)-Math.floor(id1/13)):rs;
        return rs;
    },
    //预留的倒水方法
    daoshui:function () {
        console.log("倒水了");
    },

    getTransitionAnim:function () {
        this.node.opacity = 0;
        this.node.scaleX = 1.5;
        this.node.scaleY = 1.5;
        var fadeAction = cc.fadeTo(0.2,255);
        var scaleAction = cc.scaleTo(0.2,1,1);
        return cc.spawn([fadeAction,scaleAction]);
    },
    
    update:function (dt) {
         if(cc.isValid(this._time) && this._time>0) {
             this._time -= dt;
             this.setTime(Math.round(this._time));
             this._reflash.rotation+=dt*200;
         }else if(this.timer.active){
             this.timer.active = false;
         }
    }
});
