cc.Class({
    extends: cc.Component,

    properties: {
        paijuNode:cc.Node,
        gameHallNode:cc.Node,
        communityNode:cc.Node,
        sysClubpjItem:cc.Prefab,
        selfClubpjItem:cc.Prefab,
        paijuItem:cc.Prefab,
    },
    
    onLoad(){
        this.paijuNode.active = !0;
        this.gameHallNode.active = !1;
        this.communityNode.active = !1;
        this.addSocketEventHandler();
    },

    addSocketEventHandler(){
        cc.module.socket.on(SEvents.RECEIVE_PLAYER_INCLUB_EVENT,this.onReceivePlayInClub.bind(this));
        cc.module.socket.on(SEvents.GET_PERSON_OF_GAME,this.onReceivePersonGame.bind(this));
        // cc.module.socket.on(SEvents.GET_CLUB_CHAT_EVENT,this.onReceivePlayInClub.bind(this));
    },
    
    start () {
        this.paijuNode.active = !0;
        this.gameHallNode.active = !1;
        this.communityNode.active = !1;
        this.addSocketEventHandler();
    },
    
    onClickTitle(e,code){//点击title
        var node = cc.find("Canvas");
        var game = node.getComponent("Hall");
        var tips_logo = this.node.getChildByName("tips_logo");
        tips_logo.active = (code==0);
        (code != 1) && game.loadCardAnim();
        this.paijuNode.active = code == 0;
        this.gameHallNode.active = code == 1;
        this.communityNode.active = code == 2;
        var title = e.target.parent;
        title.children.forEach( function(child,index) {
            var childLbl = child.getChildByName("lbl_title");
            childLbl.color = new cc.Color(252,255,255,255);
        });
        cc.find("lbl_title",e.target).color = new cc.Color(252,224,169,255);
        // if(code==2){
        //     cc.module.socket.send(SEvents.GET_PLAYER_INCLUB_EVENT,null,true);
        // }
    },
    
    changeTitleColor(e,data){
        var personpj = cc.find("paiju_person",this.paijuNode);
        var compj = cc.find("paiju_com",this.paijuNode);
        var bisaipj = cc.find("paiju_bisai",this.paijuNode);
        personpj.active = data==0;
        compj.active = data==1;
        bisaipj.active = data==2;
        var node = cc.find("Canvas");
        var game = node.getComponent("Hall");
        game && game.loadCardAnim();
        var title = e.target.parent;
        title.children.forEach( function(child,index) {
            var childLbl = child.getChildByName("lbl_title");
            childLbl.color = new cc.Color(252,224,169,255);
        });
        cc.find("lbl_title",e.target).color = new cc.Color(0,0,0,255);
    },
    
    onClickGoldGame(){
        var hallCpt = cc.find("Canvas").getComponent("Hall");
        hallCpt && hallCpt.onClickGoldGame();
    },
    
    onClickGemsGame(){
        var hallCpt = cc.find("Canvas").getComponent("Hall");
        hallCpt && hallCpt.onClickGemsGame();
    },

    onClickJoinCommunity(){
        var hallCpt = cc.find("Canvas").getComponent("Hall");
        hallCpt && hallCpt.onClickJoinCommunity();
    }, 

    onClickCreatCommunity(){
        var hallCpt = cc.find("Canvas").getComponent("Hall");
        hallCpt && hallCpt.onClickCreatCommunity();
    },

    onReceivePlayInClub(data){
        console.log(data);
        var communityPanel = this.node.getChildByName("community_panel");
        var item = communityPanel.getChildByName("community_item");
        if(data){
            cc._communityData = data;
            if(data.rooms && data.rooms!="{}"){
                this.setSelfClubItem(data);
            }
            cc.isClubId = data.info.clubId;
            this.node.getChildByName("tips_logo").active = false;
            var region = item.getChildByName("bg").getChildByName("lbl_province");
            var region1 = item.getChildByName("location").getChildByName("lbl_location");
            var clubName = item.getChildByName("lbl_community");
            var person = item.getChildByName("max_person").getChildByName("lbl_person");
            region.getComponent(cc.Label).string = data.info.region;
            region1.getComponent(cc.Label).string = data.info.region;
            clubName.getComponent(cc.Label).string = data.info.name;
            person.getComponent(cc.Label).string = data.info.nowPerson + " / " + data.info.maxPerson;
            item.active = true;
        }
        else{
            item.active = false;
        }
    },

    onReceivePersonGame(data){
        console.log(data);
        var content = cc.find("paiju_person/content",this.paijuNode);
        if(data){
            content.removeAllChildren();
            for(var room in data){
                var form = data[room].form;
                var roomItem = cc.instantiate(this.paijuItem);
                var lblType = roomItem.getChildByName("club_mode").getChildByName("lbl_type").getComponent(cc.Label);
                var lblRoomId = roomItem.getChildByName("club_roomId").getComponent(cc.Label);
                var lblWater = roomItem.getChildByName("lbl_water").getComponent(cc.Label);
                var lblPerson = roomItem.getChildByName("lbl_person").getComponent(cc.Label);
                var lblGold = roomItem.getChildByName("lbl_gold").getComponent(cc.Label);
                var lblTime = roomItem.getChildByName("lbl_time").getComponent(cc.Label);
                var lblLessTime = roomItem.getChildByName("lbl_less_time").getComponent(cc.Label);
                var lblCreator = roomItem.getChildByName("lbl_creator").getComponent(cc.Label);
                lblType.string = this.getRoomRule(form.gameRule);
                lblRoomId.string = data[room].roomId;
                lblWater.string = form.gameWater+"金币/水";
                lblPerson.string = 0+"/"+form.numOfPerson;
                lblGold.string = form.gameInGold;
                lblTime.string = form.gameTime+"分钟";
                lblLessTime.string = form.gameTime+"分钟";
                lblCreator.string = "来自"+data[room].creatorName+"的房间";
                roomItem._roomId = data[room].roomId;
                cc.module.utils.addClickEvent(roomItem,this.node,"Paiju","onClickJoinRoom");
                roomItem.active = true;
                content.addChild(roomItem);
            }
        }
    },

    setPersonGame(data){
        console.log(data);
    },  

    setSelfClubItem(data){
        var content = cc.find("paiju_com/content",this.paijuNode);
        var cbItem = content.getChildByName("cb_pjitem")
        var clubName = cbItem.getChildByName("club_name");
        var clubIntro = cbItem.getChildByName("lbl_intro");
        var lbl_number = cbItem.getChildByName("status").getChildByName("lbl_num");
        clubName.getComponent(cc.Label).string = data.info.name;
        clubIntro.getComponent(cc.Label).string = data.info.introduce?data.info.introduce:"暂无简介...";
        this.node.getChildByName("tips_logo").active = false;
        cbItem.active = true;
    },

    setClubRoom(data){
        console.log(data,'----129');
    },

    onClickJoinRoom(e){
        console.log(e.target._roomId)
        var roomId = e.target._roomId;
        if(cc.isValid(roomId)){
            cc.module.socket.send(SEvents.SEND_ENTER_ROOM,{roomId:roomId},true);
            cc.module.wc.show("正在加入房间"+roomId);
        }
    },

    onClickClubItem(){//点击进社区牌局
        console.log('---130')
        var data = cc._communityData.rooms;
        var commPj = cc.find("Canvas/community_paiju");
        commPj.active = true;
        var compjCpt = commPj.getComponent("ComPaiju");
        compjCpt && compjCpt.setCulbRoom();
        cc.module.utils.toTop(commPj);
    }, 

    onClickCommunityItem(){
        var communityPanel = cc.find("Canvas/community_panel");
        var comChatCpt = communityPanel.getComponent("CommunityChatRoom");
        comChatCpt && comChatCpt.setChatRoom();
        communityPanel.active = true;
        cc.module.utils.toTop(communityPanel);
    },

    getRoomRule(rule){
        var gameRule = {
            "sss":"十三水",
            "qys":"全一色",
            "sbp":"十八扑",
            "dys":"多一色",
            "bbc":"百变场",
            "wpc":"王牌场"
        }
        return gameRule[rule];
    },

    update (dt) {
    },
});
