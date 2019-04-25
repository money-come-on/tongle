cc.Class({
    extends: cc.Component,

    properties: {
        recordPanel:cc.Node,
        title:cc.Node,
        recordItem:cc.Prefab,
        _gameNode:null,
        _game:null,
        _pokerMgr:null,
        _recordData:null,
        _nowIndex:null,
    },

    onLoad: function () {
        this._gameNode = cc.find("Canvas");
        this._game = cc.find("Canvas").getComponent("SszGame");
        this._pokerMgr = this._game.getPokerMgr();
        cc.module.socket.on(SEvents.RECEIVE_RECORD_DETAIL,this.onReceiveRecord.bind(this));
        cc.module.socket.on(SEvents.Ssz.GET_REAL_WAR,this.onReceiveGetRealWar.bind(this));
    },

    onClickTitle:function(e,data){
        this.changeColor(e);
        this.recordPanel.children.forEach( function(child, index) {
            child.active = (index == data);
        });
    },

    changeColor:function(e){
        var toggleName = e.target.name;
        this.title.children.forEach(function(child){
            var lblTitle = child.getChildByName("lbl_title");
            lblTitle.color = (child.name == toggleName ? new cc.Color(0,0,0,255) : new cc.Color(255,224,160,255));
            lblTitle.getComponent(cc.LabelOutline).color = (child.name == toggleName ? new cc.Color(0,0,0,255) :new cc.Color(255,224,160,255));
        }.bind(this));
    },

    onClickGameRecord:function(){
        cc.module.audioMgr.playUIClick();
        var gameNode = cc.find("Canvas");
        var gameRecordPanel = gameNode.getChildByName("game_record_panel");
        gameRecordPanel.active = true;
        var action = cc.moveTo(0.6,-103,0);
        gameRecordPanel.runAction(action);
        cc.module.utils.toTop(gameRecordPanel);
        var game = cc.find("Canvas").getComponent("SszGame");
        if(game){
            var uuid = game.getGame().uuid;
            var index = game.getGame().index;
            var roomId = game.getGame().roomId;
        }
        console.log(uuid,index)
        cc.module.socket.send(SEvents.SEND_GET_RECORD_DETAIL,{uuid:uuid,index:index},true);
        cc.module.socket.send(SEvents.Ssz.GET_REAL_WAR,{roomId:roomId,userId:cc.module.self.userId},true);
    },
    
    onClickBack:function(){
        var action = cc.moveTo(0.5,-930,0);
        this.node.runAction(action);
    },

    onClickPreOrNext:function(e,code){//战绩 上一局1、下一局0
        // console.log(code)
        if(this._recordData){
            var data = this._recordData;
            var recordArr = data.detail;
            var game = cc.find("Canvas").getComponent("SszGame");
            var index = game.retrunRoomIndex();
            console.log(index)
            var waterGold = game.getGame().form.gameWater;
            var content = this.recordPanel.getChildByName("2").getChildByName("content");
            var roomIndex = this.recordPanel.getChildByName("2").getChildByName("title").getChildByName("lbl_index");
            var recordItem = this.recordPanel.getChildByName("2").getChildByName("record_item");
            var playersRecord = content.getChildByName("players_record");
            if(recordArr && recordArr.length>0){
                this._nowIndex = code==1 ? this._nowIndex+1 : this._nowIndex-1;
                var recordinfo = recordArr[index-1-this._nowIndex];
                if(!recordinfo){
                    recordinfo = recordArr[recordArr.length-1-this._nowIndex];
                }
                // console.log(recordinfo);
                if(recordinfo){
                    playersRecord.removeAllChildren();
                    var players = JSON.parse(recordinfo.players);
                    var detail = players.detail;
                    for(var player in detail){
                        var item = cc.instantiate(recordItem);
                        item.active = true;
                        var headimg = item.getChildByName("player_item").getChildByName("player_mask").getChildByName("headimg");
                        var name = item.getChildByName("player_item").getChildByName("name");
                        var tou = item.getChildByName("cards").getChildByName("tou");
                        var zhong = item.getChildByName("cards").getChildByName("zhong");
                        var wei = item.getChildByName("cards").getChildByName("wei");
                        var water = item.getChildByName("score").getChildByName("water").getComponent(cc.Label);
                        var win = item.getChildByName("score").getChildByName("win").getComponent(cc.Label);
                        roomIndex.getComponent(cc.Label).string = recordinfo.index;
                        name.getComponent(cc.Label).string = detail[player].name;
                        tou.children.forEach(function(card,index){
                            if(card.name=="type"){
                                var Ssztype = this.returnSszType(detail[player].out.tou.type);
                                card.getComponent(cc.Label).string = Ssztype;
                            }
                            else{
                                var cardSprite = card.getComponent(cc.Sprite);
                                var cardId = detail[player].out.tou.ids[index];
                                cardSprite.spriteFrame = this._pokerMgr.getPokerSFById(cardId);
                            }
                        }.bind(this));
                        zhong.children.forEach(function(card,index){
                            if(card.name=="type"){
                                var Ssztype = this.returnSszType(detail[player].out.zhong.type);
                                card.getComponent(cc.Label).string = Ssztype;
                            }
                            else{
                                var cardSprite = card.getComponent(cc.Sprite);
                                var cardId = detail[player].out.zhong.ids[index];
                                cardSprite.spriteFrame = this._pokerMgr.getPokerSFById(cardId);
                            }
                        }.bind(this));
                        wei.children.forEach(function(card,index){
                            if(card.name=="type"){
                                var Ssztype = this.returnSszType(detail[player].out.wei.type);
                                card.getComponent(cc.Label).string = Ssztype;
                            }
                            else{
                                var cardSprite = card.getComponent(cc.Sprite);
                                var cardId = detail[player].out.wei.ids[index];
                                cardSprite.spriteFrame = this._pokerMgr.getPokerSFById(cardId);
                            }
                        }.bind(this));
                        var headImgCpt = headimg.getComponent(cc.Sprite);
                        cc.module.imageCache.getImage(player,function (spriteFrame) {
                            if(!cc.isValid(this.node)) {
                                return;
                            }
                            cc.isValid(spriteFrame) ? (headImgCpt.spriteFrame = spriteFrame) : null;
                        }.bind(this));
                        water.string = "水数：" + (detail[player].gap/waterGold);
                        win.string = "总收益："+ detail[player].gap;
                        playersRecord.addChild(item);
                    }
                }
                else{
                    this._nowIndex = code==1 ? this._nowIndex-1 : this._nowIndex+1;
                    cc.module.wc.show("暂无牌局",true);
                }

            } 
        }
    },

    onReceiveRecord:function(data){//战绩
        // console.log(data,'-------onReceiveRecord');
        this._recordData = data;
        var recordArr = data.detail;
        var game = cc.find("Canvas").getComponent("SszGame");
        var index = game.retrunRoomIndex();
        console.log(index);
        var waterGold = game.getGame().form.gameWater;
        var content = this.recordPanel.getChildByName("2").getChildByName("content");
        var roomIndex = this.recordPanel.getChildByName("2").getChildByName("title").getChildByName("lbl_index");
        var recordItem = this.recordPanel.getChildByName("2").getChildByName("record_item");
        var playersRecord = content.getChildByName("players_record");
        if(recordArr && recordArr.length>0){
            // console.log('-----166')
            var recordinfo = recordArr[index-1];
            if(!recordinfo){
                recordinfo = recordArr[recordArr.length-1];
            }
            console.log(recordinfo);
            if(recordinfo){
                playersRecord.removeAllChildren();
                var players = JSON.parse(recordinfo.players);
                var detail = players.detail;
                for(var player in detail){
                    var item = cc.instantiate(recordItem);
                    item.active = true;
                    var headimg = item.getChildByName("player_item").getChildByName("player_mask").getChildByName("headimg");
                    var name = item.getChildByName("player_item").getChildByName("name");
                    var tou = item.getChildByName("cards").getChildByName("tou");
                    var zhong = item.getChildByName("cards").getChildByName("zhong");
                    var wei = item.getChildByName("cards").getChildByName("wei");
                    var water = item.getChildByName("score").getChildByName("water").getComponent(cc.Label);
                    var win = item.getChildByName("score").getChildByName("win").getComponent(cc.Label);
                    roomIndex.getComponent(cc.Label).string = recordinfo.index;
                    name.getComponent(cc.Label).string = detail[player].name;
                    tou.children.forEach(function(card,index){
                        if(card.name=="type"){
                            var Ssztype = this.returnSszType(detail[player].out.tou.type);
                            card.getComponent(cc.Label).string = Ssztype;
                        }
                        else{
                            var cardSprite = card.getComponent(cc.Sprite);
                            var cardId = detail[player].out.tou.ids[index];
                            cardSprite.spriteFrame = this._pokerMgr.getPokerSFById(cardId);
                        }
                    }.bind(this));
                    zhong.children.forEach(function(card,index){
                        if(card.name=="type"){
                            var Ssztype = this.returnSszType(detail[player].out.zhong.type);
                            card.getComponent(cc.Label).string = Ssztype;
                        }
                        else{
                            var cardSprite = card.getComponent(cc.Sprite);
                            var cardId = detail[player].out.zhong.ids[index];
                            cardSprite.spriteFrame = this._pokerMgr.getPokerSFById(cardId);
                        }
                    }.bind(this));
                    wei.children.forEach(function(card,index){
                        if(card.name=="type"){
                            var Ssztype = this.returnSszType(detail[player].out.wei.type);
                            card.getComponent(cc.Label).string = Ssztype;
                        }
                        else{
                            var cardSprite = card.getComponent(cc.Sprite);
                            var cardId = detail[player].out.wei.ids[index];
                            cardSprite.spriteFrame = this._pokerMgr.getPokerSFById(cardId);
                        }
                    }.bind(this));
                    var headImgCpt = headimg.getComponent(cc.Sprite);
                    cc.module.imageCache.getImage(player,function (spriteFrame) {
                        if(!cc.isValid(this.node)) {
                            return;
                        }
                        cc.isValid(spriteFrame) ? (headImgCpt.spriteFrame = spriteFrame) : null;
                    }.bind(this));
                    water.string = "水数：" + detail[player].gap;
                    win.string = "总收益："+waterGold * detail[player].gap;
                    playersRecord.addChild(item);
                }
            }
        }
    },

    onReceiveGetRealWar:function(data){//接收实际战况信息
        console.log(data);
        var content = this.recordPanel.getChildByName("1").getChildByName("content");
        var warPanel = content.getChildByName("real_war").getChildByName("players_gold");
        var watchPanel = content.getChildByName("watch").getChildByName("looker_players");
        //---实时战况数据
        var recordItem = content.getChildByName("real_war").getChildByName("record_item");
        warPanel.removeAllChildren();
        for(var playerwar in data.war){
            var warItem = cc.instantiate(recordItem);
            var warname = warItem.getChildByName("name").getComponent(cc.Label);
            var allowIn = warItem.getChildByName("allow_in").getComponent(cc.Label);
            var water = warItem.getChildByName("water").getComponent(cc.Label);
            var win = warItem.getChildByName("win_gold").getComponent(cc.Label);
            warname.string = data.war[playerwar].name;
            allowIn.string = data.war[playerwar].allowIn;
            water.string = data.war[playerwar].water;
            win.string = data.war[playerwar].win;
            warItem.active = true;
            warPanel.addChild(warItem);
        }

        //---观战
        var lookerItem = content.getChildByName("watch").getChildByName("player_item");
        watchPanel.removeAllChildren();
        for(var looker in data.lookers){
            var item = cc.instantiate(lookerItem);
            var name = item.getChildByName("name").getComponent(cc.Label);
            var headImgCpt = item.getChildByName("player_mask").getChildByName("headimg").getComponent(cc.Sprite);
            name.string = data.lookers[looker].name;
            cc.module.imageCache.getImage(looker,function (spriteFrame) {
                if(!cc.isValid(this.node)) {
                    return;
                }
                cc.isValid(spriteFrame) ? (headImgCpt.spriteFrame = spriteFrame) : null;
            }.bind(this));
            item.active = true;
            watchPanel.addChild(item);
        }
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

    update: function (dt) {

    },
});
