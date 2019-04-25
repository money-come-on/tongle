cc.Class({
    extends: cc.Component,

    properties: {
        chatPanel:cc.Node,
        detailPanel:cc.Node,
        clubPlayerPanel:cc.Node,
        clubMethPanel:cc.Node,
        chatContent:cc.Node,
        otherMsg:cc.Prefab,
        sysMsg:cc.Prefab,
        selfMsg:cc.Prefab,
        editbox:cc.EditBox,
        jxPj:cc.Label,
    },

    onLoad: function () {
    	this.setChatRoom();
        this.addSocketEventHandler();
        this.chatPanel.active = true;
        this.detailPanel.active = false;
        this.clubPlayerPanel.active = false;
        this.clubMethPanel.active = false;
    },

    addSocketEventHandler(){
        cc.module.socket.on(SEvents.DISSOLVE_CLUB_EVENT,this.onReceiveDissolveClub.bind(this));
        cc.module.socket.on(SEvents.LEAVE_CLUB_EVENT,this.onReceiveLeaveClub.bind(this));
        cc.module.socket.on(SEvents.GET_CLUB_EVENT,this.onReceiveGetClub.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_CHAT_MSG,this.onReceiveChatMsg.bind(this));
        cc.module.socket.send(SEvents.GET_CLUB_CHAT_EVENT,{userId:cc.module.self.userId,clubId:cc._communityData.info.clubId},true);
        cc.module.socket.on(SEvents.GET_CLUB_CHAT_EVENT,this.onReceiveChatMsg.bind(this));
    },

    /*------  set -------*/
    setChatRoom(){
    	console.log(cc._communityData,'----37');
    	this.chatContent.removeAllChildren();
    	if(cc._communityData){
    		var clubName = this.chatPanel.getChildByName("title").getChildByName("lbl_title");
    		clubName.getComponent(cc.Label).string = cc._communityData.info.name;
    		this.setChatMsg(cc._communityData.info.chat);
            var goingIndex = 0;
            if(cc._communityData.rooms){
                var roomsData = cc._communityData.rooms;
                if(roomsData=="{}"){
                    return;
                }
                for(var room in roomsData){
                    goingIndex += 1;
                    var item = cc.instantiate(this.sysMsg);
                    var creatorName = item.getChildByName("lbl_name");
                    var time = item.getChildByName("time").getChildByName("lbl_time");
                    var chat = item.getChildByName("chat");
                    var lblGame = chat.getChildByName("lbl_game");
                    var roomId = chat.getChildByName("lbl_roomId");
                    var lblWater = chat.getChildByName("water").getChildByName("lbl_water");
                    var lessTime = item.getChildByName("time").getChildByName("lbl_time");
                    var config = roomsData[room].config;
                    item.active = true;
                    creatorName.getComponent(cc.Label).string = config.createName;
                    lblGame.getComponent(cc.Label).string = this.getRoomRule(config.gameRule);
                    roomId.getComponent(cc.Label).string = roomsData[room].roomId;
                    lblWater.getComponent(cc.Label).string = config.gameWater;
                    lessTime.getComponent(cc.Label).string = config.cTime;
                    this.chatContent.addChild(item);
                    chat._clubRoomId = roomsData[room].roomId;
                    cc.module.utils.addClickEvent(chat,this.node,"CommunityChatRoom","onClickEnterCbRoom",null);
                }
            }
            this.jxPj.string = goingIndex;
    	}
    },

    onClickEnterCbRoom(e,data){
        var roomId = e.target._clubRoomId;
        if(roomId){
            this.showTips("正在加入房间");
            var hallCpt = cc.find("Canvas");
            var comm = hallCpt.getChildByName("community_panel");
            var hall = hallCpt.getComponent("Hall");
            comm.active = false;
            this.node.active = false;
            hall.onClickToHall();
            cc.module.socket.send(SEvents.SEND_ENTER_ROOM,{roomId:roomId},true);
        }
    },

    setClubPlayersImg(data){//设置头像
        var content = cc.find("community_detail/content/players/content",this.detailPanel);
        if(data){
            var players = data.players;
            content.children.forEach( function(child, index) {
                if(players[index]){
                    child.active = true;
                    var name = child.getChildByName("lbl_name").getComponent(cc.Label);
                    var crown = child.getChildByName("crown");
                    crown.active = (data.info.creator==players[index].userId);
                    name.string = players[index].name;
                    child._userId = players[index].userId;
                    child._name = players[index].name;
                    var sprite = child.getChildByName("img").getChildByName("mask").getChildByName("img").getComponent(cc.Sprite);
                    cc.module.imageCache.getImage(players[index].userId,function (spriteFrame) {
                        if(!cc.isValid(this.node)) {
                            return;
                        }
                        sprite.spriteFrame = cc.isValid(spriteFrame)?spriteFrame : null;
                    }.bind(this));
                }
            }.bind(this));
        }
    },

    setChatMsg(data){//设置聊天内容
        console.log(JSON.parse(data),'---90聊天');
    	if(data){
            this.setClubMessage(JSON.parse(data));
    	}
    },

    onReceiveChatMsg(data){
        console.log(data,'-----chat');
        if(data.chat || data.chatMsg){
            this.setClubMessage(data);
        }
    },

    setClubMessage(data){
        var content = this.chatContent;
        var item = data.userId==cc.module.self.userId?cc.instantiate(this.selfMsg):cc.instantiate(this.otherMsg);
        var chat = item.getChildByName("chat").getChildByName("lbl_chat");
        var img = item.getChildByName("image").getChildByName("image");
        var name = item.getChildByName("lbl_name");
        var time = item.getChildByName("time").getChildByName("lbl_time");
        var sprite = img.getComponent(cc.Sprite);
        chat.getComponent(cc.Label).string = data.chatMsg;
        name.getComponent(cc.Label).string = data.name;
        time.getComponent(cc.Label).string = data.time;
        cc.module.imageCache.getImage(data.userId,function(spriteFrame){
            if(!cc.isValid(this.node)){
                return;
            }
            sprite.spriteFrame = cc.isValid(spriteFrame)?spriteFrame:null;
        }.bind(this));
        content.addChild(item);
    },

    setClubPlayers(){//设置社区成员
        if(this.clubPlayerPanel){
            var data = cc._communityData;
            this.clubPlayerPanel.active = true;
            var content = this.clubPlayerPanel.getChildByName("players").getChildByName("content");
            var playerNode = content.getChildByName("player_item");
            content.removeAllChildren();
            data.players.forEach( function(player, index) {
                var playerItem = cc.instantiate(playerNode);
                var headimg = playerItem.getChildByName("img").getChildByName("img").getComponent(cc.Sprite);
                var level = playerItem.getChildByName("level").getChildByName("lbl_level");
                var crown = playerItem.getChildByName("crown");
                var playerName = playerItem.getChildByName("lbl_name");
                var status = playerItem.getChildByName("lbl_status");//是否离线
                var btnBeLeave = playerItem.getChildByName("btn_leave");
                level.getComponent(cc.Label).string = (player.userId==cc._communityData.info.creator?"创建者":"普通成员");
                crown.active = (player.userId==cc._communityData.info.creator);
                playerName.getComponent(cc.Label).string = player.name;
                btnBeLeave.active = (cc.module.self.userId==cc._communityData.info.creator && cc.module.self.userId!=player.userId);
                if(btnBeLeave.active){
                    btnBeLeave._userId = player.userId;
                    playerItem._userId = player.userId;
                    btnBeLeave._name = player.name;
                    playerItem._name = player.name;
                }
                cc.module.imageCache.getImage(player.userId,function (spriteFrame) {
                    if(!cc.isValid(this.node)) {
                        return;
                    }
                    headimg.spriteFrame = cc.isValid(spriteFrame)?spriteFrame : null;
                }.bind(this));
                cc.module.utils.addClickEvent(btnBeLeave,this.node,"CommunityChatRoom","onClickBeLeave");
                content.addChild(playerItem);
            }.bind(this));
            cc.module.utils.toTop(this.clubPlayerPanel);
        }
    },

    setCommunityTop(data){//设置顶部的社区信息
        var communityTop = this.detailPanel.getChildByName("community_top");
        var titleClubName = cc.find("title/lbl_title",communityTop);
        var clubName = cc.find("community_msg/name",communityTop);
        var personNum = cc.find("community_msg/person_num/lbl_person",communityTop);
        var loca = cc.find("community_msg/location/lbl_location",communityTop);
        var btnTips = cc.find("community_msg/btn_dissolve/Label",communityTop);
        titleClubName.getComponent(cc.Label).string = data.info.name;
        clubName.getComponent(cc.Label).string = data.info.name;
        personNum.getComponent(cc.Label).string = data.info.nowPerson +" / "+data.info.maxPerson;
        loca.getComponent(cc.Label).string = data.info.region;
        btnTips.getComponent(cc.Label).string = (data.info.creator==cc.module.self.userId)?"解散社区":"退出社区";
    },

    setCommunityDetail(data){//设置社区详细的信息
        var communityDetail = this.detailPanel.getChildByName("community_detail");
        var clubId = cc.find("content/club_card/lbl_clubId",communityDetail);
        var clubIntro = cc.find("content/club_intro/lbl_intro",communityDetail);
        var creatime = cc.find("content/creat_time/lbl_time",communityDetail);
        var level = cc.find("content/auto_join/lbl_title",communityDetail);
        var clubMsg = cc.find("content/club_players/btn_message/lbl_msg",communityDetail);
        if(data.info.creator==cc.module.self.userId && data.info.apply){
            this.setMessage(data.info.apply);
        }
        clubId.getComponent(cc.Label).string = data.info.clubId;
        cc.module.self.clubId = data.info.clubId;
        level.getComponent(cc.Label).string = data.info.creator==cc.module.self.userId?"社长":"普通成员";
        clubIntro.getComponent(cc.Label).string = data.info.introduce ? data.info.introduce:"暂无介绍";
        creatime.getComponent(cc.Label).string = "创建于 " + data.info.time;
        this.setClubPlayersImg(data);
    },

    setMessage(data){//设置未读信息条数
        var communityDetail = this.detailPanel.getChildByName("community_detail");
        var clubMsg = cc.find("content/club_players/btn_message/lbl_msg",communityDetail);
        var msgStr = clubMsg.getComponent(cc.Label);
        msgStr.string = data+"封未读信息";
        var icon = cc.find("title/btn_detial/icon",this.chatPanel);
        var num = icon.getChildByName("lbl_num").getComponent(cc.Label);
        icon.active = (data>0);
        num.string = data;
    },

    setApplyJoin(data){//设置申请加入信息
        console.log(data);
        var content = this.clubMethPanel.getChildByName("message").getChildByName("content");
        var logo = this.clubMethPanel.getChildByName("logo");
        var applyMsg = this.clubMethPanel.getChildByName("message").getChildByName("apply_message");
        content.removeAllChildren();
        logo.active = (JSON.stringify(data) == "{}");
        for(var userId in data){
            if(data[userId]){
                var applyItem = cc.instantiate(applyMsg);
                var name = applyItem.getChildByName("name").getComponent(cc.Label);
                var msg = applyItem.getChildByName("apply_msg").getComponent(cc.Label);
                var headimg = applyItem.getChildByName("headimg").getChildByName("headimg");
                var agreeBtn = applyItem.getChildByName("btn_agree");
                var disAgreeBtn = applyItem.getChildByName("btn_refuse");
                name.string = data[userId].name;
                msg.string = data[userId].applyMsg;
                var headimgCpt = headimg.getComponent(cc.Sprite);
                cc.module.imageCache.getImage(userId,function (spriteFrame) {
                    if(!cc.isValid(headimgCpt)){
                        return;
                    }
                    if(spriteFrame) {
                        headimgCpt.spriteFrame = spriteFrame;
                    }
                }.bind(this));
                cc.module.utils.addClickEvent(agreeBtn,this.node,"CommunityChatRoom","onClickAgreeJoin",{agree:1,userId:userId});
                cc.module.utils.addClickEvent(disAgreeBtn,this.node,"CommunityChatRoom","onClickAgreeJoin",{agree:0,userId:userId});
                applyItem._userId = userId;
                applyItem.active = true;
                content.addChild(applyItem);
            }
        }              
    },
    
    showTips(msg){//设置弹窗信息
        var hall = cc.find("Canvas");
        var tipsPanel = hall.getChildByName("tips_panel");
        tipsPanel.active = true;
        var tipsStr = cc.find("panel/info",tipsPanel);
        tipsStr.getComponent(cc.Label).string = msg;
        setTimeout(function(){
            tipsPanel.active = false;
        }.bind(this),2000);
        cc.module.utils.toTop(tipsPanel);
    },

    /*-----onClick------*/
    onClickCommunityDetail(){
    	var data = cc._communityData;
    	this.setCommunityTop(data);
    	this.setCommunityDetail(data);
    	this.detailPanel.active = true;
    },

   	onClickClubPaiju(){//开局
        var hall = cc.find("Canvas");
        var comPj = hall.getChildByName("community_paiju_panel");
        var compaiju = comPj.getComponent("CommunityPaiju");
        compaiju && compaiju.init();
        comPj.active = true;
        cc.module.utils.toTop(comPj);
        cc.module.socket.send(SEvents.GET_CLUB_EVENT,{nameOrId:cc._communityData.info.clubId,userId:cc.module.self.userId},true);
   	},

    onClickDisslove(){//解散社区或退出社区
        var hall = cc.find("Canvas");
        var tipsPanel = hall.getChildByName("tips_chose_panel");
        var tipsStr = cc.find("panel/gem",tipsPanel);
        var pop = tipsPanel.getComponent("Pop");
        var msg = (cc._communityData.info.creator==cc.module.self.userId)? "是否解散社区" : "是否退出社区";
        tipsStr.getComponent(cc.Label).string = msg;
        pop && pop.pop();
        pop && pop.setConfirmCallback(
            function(){
                if(cc.module.self.userId == cc._communityData.info.creator){// 如果是创建人
                    cc.module.socket.send(SEvents.LEAVE_CLUB_EVENT,{clubId:cc._communityData.info.clubId,isCreator:!0,userId:cc.module.self.userId},true);
                }else{// 如果是会员则直接退出
                    cc.module.socket.send(SEvents.LEAVE_CLUB_EVENT,{clubId:cc._communityData.info.clubId,isCreator:!1,userId:cc.module.self.userId},true);
                } 
            }
        );
    },

    onClickBeLeave(e,data){//开除成员
        var userId = e.target._userId;
        var name = e.target._name;
        var hall = cc.find("Canvas");
        var tipsPanel = hall.getChildByName("tips_chose_panel");
        var tipsStr = cc.find("panel/gem",tipsPanel);
        var pop = tipsPanel.getComponent("Pop");
        var msg = "是否开除成员："+name;
        tipsStr.getComponent(cc.Label).string = msg;
        pop && pop.pop()
        pop && pop.setConfirmCallback(
            function () {
                if(userId){
                    cc.module.socket.send(SEvents.LEAVE_CLUB_EVENT,{clubId:cc._communityData.info.clubId,isCreator:!1,userId:userId},null);
                }
            }
        );
    },

   	onClickZige(){//开通官方资格
   		this.showTips("功能调整中");
   	},

   	onClickAutoIn(e){//自动同意入队申请
        var btnAutoIn = cc.find("community_detail/content/auto_join/btn_apply",this.detailPanel);
        var btn0 = btnAutoIn.getChildByName("0");
        var btn1 = btnAutoIn.getChildByName("1"); 
        btn0.active = !btn0.active;
        btn1.active = !btn1.active;
   	},

    onClickAgreeJoin:function(e,msg){//是否同意玩家加入社区
        console.log(msg);
        if(!msg.userId){
            return;
        }
        var logo = this.clubMethPanel.getChildByName("logo");
        var agree = msg.agree == 1;
        var data = {};
        data.agree = agree;
        data.clubId = cc.module.self.clubId;
        data.joinor = msg.userId;
        cc.module.socket.send(SEvents.AGREE_JOIN_EVENT,data,true);
        var content = this.clubMethPanel.getChildByName("message").getChildByName("content");
        content.children.forEach( function(applyPlayer, index) {
            if(applyPlayer._userId==msg.userId){
                applyPlayer.active = false;
            }
        });
        var status = true;
        for(var i=0;i<content.children.length;i++){
            if(content.children[i].active){
                status = false;
            }
        }
        logo.active = status;
        this.setMessage(0);
    },

   	onClickClubPlayers(){//社区成员
        this.setClubPlayers();
   	},

   	onClickClubMssage(){//社区信息/申请加入信息
        if(cc._communityData && cc._communityData.info.creator==cc.module.self.userId){  
            cc.module.socket.send(SEvents.GET_CLUB_EVENT,{nameOrId:cc._communityData.info.clubId,userId:cc.module.self.userId},true);
            var pop = this.clubMethPanel.getComponent("Pop");
            pop && pop.pop();
        }
        else{
            this.showTips("抱歉，你的权限不足");
        }
   	},

   	onClickUpgrade(){//点击升级

   	},

   	onClickFriendClub(){//点击关联社区

   	},

   	onClickClubFund(){//点击基金

   	},

   	onClickShareClub(){//点击分享名片
        
   	},

   	onClickVoice(){//点击语音
   		this.showTips("暂未开放此功能");
   	},

   	onClickEmoji(){//点击表情
   		this.showTips("暂未开放此功能");
   	},

    onClickSendChat(){//发送聊天信息
        var msg = this.editbox.string;
        console.log('----- 聊天信息:',msg);
        var patrn = /\S/;
        if(patrn.test(msg)){
            this.editbox.string = "";
            var data = {
                chatMsg:msg,
                userId:cc.module.self.userId,
                name:cc.module.self.nickname,
                headimg:cc.module.self.headimg,
                clubId:cc.module.self.clubId
            }
            cc.module.socket.send(SEvents.SEND_CHAT_MSG,data,true);
        }
        else {
            this.showTips("不能输入空白信息");
        }
    },

    /*---------------onReceive--------*/
    onReceiveGetClub(data){//接收社区信息
        console.log(data);
        cc.module.ClubData = data;
        if(data.applyJoin && data.info.creator == cc.module.self.userId){
            this._applyJoin = data.applyJoin;
            this.setApplyJoin(this._applyJoin);
        }
        else {    
            var logo = this.clubMethPanel.getChildByName("logo");
            logo.active = true; 
        }
    },

    onReceiveDissolveClub(data){//接收解散社区信息
        if(data.errcode){
            cc.module.wc.show(data.errmsg,true);
            return;
        }
        else {
            var hall = cc.find("Canvas");
            var communityPanel = hall.getChildByName("paiju").getChildByName("community_panel");
            var item = communityPanel.getChildByName("community_item");
            item.active = false;
            this.node.active = false;
        }
    },

    onReceiveLeaveClub(data){//接收离开社区信息
        if(data.errcode){
            cc.module.wc.show(data.errmsg,true)
            return;
        }
        if(data.userId == cc.module.self.userId){
            var hallCpt = cc.find("Canvas");
            var communityPanel = hallCpt.getChildByName("paiju").getChildByName("community_panel");
            var item = communityPanel.getChildByName("community_item");
            item.active = false;
            if(communityPanel.active){
                var hall = hallCpt.getComponent("Hall");
                hall.onClickToHall();
                this.node.active = false;
                communityPanel.active = false;
                cc.module.wc.show("您已退出俱乐部",true);
            }
            cc.module.socket.send(SEvents.GET_PLAYER_INCLUB_EVENT,null,true);
        }
        else{
            var content = this.clubPlayerPanel.getChildByName("players").getChildByName("content");
            content.children.forEach( function(playerItem,index) {
                if(data.userId == playerItem._userId){
                    playerItem.destroy();
                }
            }.bind(this));

            var clubPlayers = cc.find("community_detail/content/players/content",this.detailPanel);
            clubPlayers.children.forEach( function(element,index) {
                if(data.userId == element._userId){
                    element.active = false;
                }
            }.bind(this));
        }
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

    update: function (dt) {

    },
});
