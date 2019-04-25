
cc.Class({
    extends: cc.Component,
    statics: {
        instances: null,
    },
    properties: {
        cardAllNode:[cc.Node],
        autoCardPrefab: cc.Prefab,
        ts: cc.Prefab,
        autoCardLayout: cc.Layout,
        touSprite:cc.Sprite,
        zhongSprite:cc.Sprite,
        weiSprite:cc.Sprite,
        _LayoutWithEvent: [],
        _LayoutWithDetail:[],
        _changeNodeSpaceAR:[],
        _allPokerType:null,
        _pokerMgr:null,
        _sszUtil:null,
    },

    // use this for initialization
    onLoad: function () {
        this._registerDaosLayoutClickEvent();
        this.cardTime = 0.1;
    },

    starts: function(ids,pokerMgr,sszUtil,changeCard) {
        this._pokerMgr = pokerMgr;
        this._sszUtil = sszUtil;
        this._allPokerType = this._sszUtil.getGroupAllPokerType(ids);
        var idsFirst =  this._allPokerType[0];
        idsFirst = idsFirst[2].ids.concat(idsFirst[1].ids).concat(idsFirst[0].ids);

        // if(changeCard){
        idsFirst.forEach(function (id,index) {
            var card = this.cardAllNode[index];
            var sprite = card.getComponent(cc.Sprite);
            sprite.spriteFrame = ((changeCard-26) == id ? this._pokerMgr.getPokerSFById(changeCard) : this._pokerMgr.getPokerSFById(id));
            card._cardId = id;
        }.bind(this));
        // }
        // else{
        //     idsFirst.forEach(function (id,index) {
        //         var card = this.cardAllNode[index];
        //         var sprite = card.getComponent(cc.Sprite);
        //         sprite.spriteFrame = this._pokerMgr.getPokerSFById(id);
        //         card._cardId = id;
        //     }.bind(this));
        // }
        this.setAutoCardPrefab();
    },

    setAutoCardPrefab: function() {
        if(!this._allPokerType) return;
        this.autoCardLayout.node.removeAllChildren();
        this.autoCardLayout.node.parent.getComponent(cc.ScrollView).scrollToLeft();
        for(var i = 0;i < this._allPokerType.length;i++){//添加预制体
            var autoCard = cc.instantiate(this.autoCardPrefab);
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "SszCardTypeCombine";
            eventHandler.handler = "clickAutoSelectedCards";
            eventHandler.customEventData = i;
            var cards = this._allPokerType[i];
            var k = 2;
            for(var j = 2;j >= 0;j--){
                var node = autoCard.children[k];
                this.setName(cards[j].name,j,node);
                k++;
            }
            autoCard.getComponent(cc.Button).clickEvents.push(eventHandler);
            this.autoCardLayout.node.addChild(autoCard);
        }
        this.clickAutoSelectedCards();
    },

    setName: function(type,level,node) {
        //level 2:tou 1:zhong 0:wei
        if(level == 2){
            if(type == "st"){
                node.getComponent(cc.Label).string = "冲三";
                return;
            }
        }
        if(level == 1){
            if(type == "hl"){
                node.getComponent(cc.Label).string = "中墩葫芦";
                return;
            }
        }

        if(type == "wt"){
            node.getComponent(cc.Label).string = "五同";
        }
        else if(type == "ths"){
            node.getComponent(cc.Label).string = "同花顺";
        }
        else if(type == "tz"){
            node.getComponent(cc.Label).string = "铁支";
        }
        else if(type == "hl"){
            node.getComponent(cc.Label).string = "葫芦";
        }
        else if(type == "th"){
            node.getComponent(cc.Label).string = "同花";
        }
        else if(type == "sz"){
            node.getComponent(cc.Label).string = "顺子";
        }
        else if(type == "st"){
            node.getComponent(cc.Label).string = "三条";
        }
        else if(type == "ld"){
            node.getComponent(cc.Label).string = "两对";
        }
        else if(type == "dz"){
            node.getComponent(cc.Label).string = "对子";
        }
        else if(type == "wl"){
            node.getComponent(cc.Label).string = "乌龙";
        }
    },

    clickAutoSelectedCards: function(event,indexs = 0) {
        cc.module.audioMgr.playUIClick();
        for(var i = 0; i < this.autoCardLayout.node.children.length;i++){
            var nodes = this.autoCardLayout.node.children[i];
            nodes.children[0].active = false;
        }
        this.autoCardLayout.node.children[indexs].children[0].active = true;

        this._LayoutWithEvent.forEach(function(nodes){
            nodes.color = new cc.Color(255, 255, 255);
            nodes.children.forEach(function(i){i.color = new cc.Color(255, 255, 255);});
        });
        this._LayoutWithEvent = [];
        this._LayoutWithDetail = [];

        var resultArray = this._allPokerType[indexs];
        resultArray = resultArray[2].ids.concat(resultArray[1].ids).concat(resultArray[0].ids);
        var cardAllNode = this.cardAllNode.filter(function(i){
            i.getComponent(cc.Button).interactable = false;
            return i;
        });

        for(var i = 0;i < resultArray.length;i++){
            var s = resultArray[i];
            for(var j = 0;j < cardAllNode.length;j++){
                var d = cardAllNode[j];
                if(d._cardId == s){
                    d.stopAllActions();
                    var detail = this._changeNodeSpaceAR[i];
                    d.runAction(cc.moveTo(this.cardTime,detail));
                    cardAllNode.splice(j,1);
                    break;
                }
            }
        }
        this.scheduleOnce(function(){
            this.cardAllNode.forEach(function(i){
                i.getComponent(cc.Button).interactable = true;
            });
            this.changeTypeSprite();
        }.bind(this),this.cardTime + 0.05);

    },

    /*获取节点的世界坐标*/
    _registerDaosLayoutClickEvent: function () {

        this._changeNodeSpaceAR = [];//记录所有牌的坐标
        this.cardAllNode.forEach(function(nodes){
            //获取节点的世界坐标
            var cardBackWorldSpace1 = nodes.convertToWorldSpaceAR(cc.v2(0, 0));
            //获取相对父节点所在的坐标
            var detail = nodes.parent.convertToNodeSpaceAR(cardBackWorldSpace1);

            this._changeNodeSpaceAR.push(detail);

        }.bind(this));
    },

    clickAllCard: function (event) {
        cc.module.audioMgr.playUIClick();
        if(this._LayoutWithEvent.length <= 1){
            var detail = event.target.getPosition();
            this._LayoutWithDetail.unshift(detail);
            this._LayoutWithEvent.push(event.target);
            event.target.color = new cc.Color(182, 182, 182);
            event.target.children.forEach(function(i){i.color = new cc.Color(182, 182, 182);});
        }
        if(this._LayoutWithEvent.length == 2){
            this._LayoutWithEvent.forEach(function(nodes,index){
                nodes.color = new cc.Color(255, 255, 255);
                nodes.children.forEach(function(i){i.color = new cc.Color(255, 255, 255);});
                nodes.getComponent(cc.Button).interactable = false;
                this.scheduleOnce(function () {
                    nodes.getComponent(cc.Button).interactable = true;
                    //this._setCardDaoSprite();
                }.bind(this), this.cardTime);
                nodes.stopAllActions();
                var detail = this._LayoutWithDetail[index];
                var callfun = cc.callFunc(function () {this.changeTypeSprite();}.bind(this));
                nodes.runAction(cc.sequence([cc.moveTo(this.cardTime,detail),callfun]));
            }.bind(this));
            this._LayoutWithEvent = [];
            this._LayoutWithDetail = [];
        }
    },

    onClickConfirmOut:function () {
        cc.module.audioMgr.playUIClick();
        var cardAllNode = this.cardAllNode.sort(function(a,b){return b.y - a.y;}).slice();
        var touIds = this.getContainerIds(cardAllNode.slice(0,3));
        var zhongIds = this.getContainerIds(cardAllNode.slice(3,8));
        var weiIds = this.getContainerIds(cardAllNode.slice(8,13));
        var game = cc.find("Canvas").getComponent("SszGame");
        var gameInfo = game.getGame();
        var gameRule = gameInfo.form.gameRule;
        if(gameRule=="qys"){
            var touTypeAndScore = this._sszUtil.getTypeNameAndScore(touIds,true);
            var zhongTypeAndScore = this._sszUtil.getTypeNameAndScore(zhongIds,true);
            var weiTypeAndScore = this._sszUtil.getTypeNameAndScore(weiIds,true);
        }
        else{
            var touTypeAndScore = this._sszUtil.getTypeNameAndScore(touIds,null);
            var zhongTypeAndScore = this._sszUtil.getTypeNameAndScore(zhongIds,null);
            var weiTypeAndScore = this._sszUtil.getTypeNameAndScore(weiIds,null);
        }
        
        if(touTypeAndScore.score > zhongTypeAndScore.score || zhongTypeAndScore.score > weiTypeAndScore.score){
            var ts = this.node.getChildByName("ts");
            if(!ts){
                ts = cc.instantiate(this.ts);
                this.node.addChild(ts);
            }
            ts.getComponent(cc.Animation).play("ts");
            return;
        }
        var data = {
            tou:{
                ids:this._sszUtil._typeCardsSortByScores(touIds),
                type:touTypeAndScore.name,
                score:touTypeAndScore.score
            },
            zhong:{
                ids:this._sszUtil._typeCardsSortByScores(zhongIds),
                type:zhongTypeAndScore.name,
                score:zhongTypeAndScore.score
            },
            wei:{
                ids:this._sszUtil._typeCardsSortByScores(weiIds),
                type:weiTypeAndScore.name,
                score:weiTypeAndScore.score
            },
            isSpecial:false
        };
        // console.log(data);
        // return;
        cc.module.socket.send(SEvents.Ssz.SEND_OUT,data,true);
        var game = cc.find("Canvas").getComponent("SszGame");
        game.setOutPreview(data);
    },

    changeTypeSprite:function () {
        var cardAllNode = this.cardAllNode.sort(function(a,b){return b.y - a.y;}).slice();
        var touIds = this.getContainerIds(cardAllNode.slice(0,3));
        var zhongIds = this.getContainerIds(cardAllNode.slice(3,8));
        var weiIds = this.getContainerIds(cardAllNode.slice(8,13));
        var touTypeAndScore = this._sszUtil.getTypeNameAndScore(touIds,null);
        var zhongTypeAndScore = this._sszUtil.getTypeNameAndScore(zhongIds,null);
        var weiTypeAndScore = this._sszUtil.getTypeNameAndScore(weiIds,null);
        var touName = touTypeAndScore.name;
        var zhongName = zhongTypeAndScore.name;
        var weiName = weiTypeAndScore.name;
        if(touName == "st") touName = 'cs';
        if(zhongName == "hl") zhongName = 'zdhl';
        // this.touSprite.spriteFrame = this._pokerMgr.getTypeSFByName(touName);
        // this.zhongSprite.spriteFrame = this._pokerMgr.getTypeSFByName(zhongName);
        // this.weiSprite.spriteFrame = this._pokerMgr.getTypeSFByName(weiName);
    },

    getContainerIds:function (container) {
        var ids = [];
        container.forEach(function (cardNode) {
            if(cc.isValid(cardNode._cardId)) {
                ids.push(cardNode._cardId);
            }
        });
        return ids;
    },
});
