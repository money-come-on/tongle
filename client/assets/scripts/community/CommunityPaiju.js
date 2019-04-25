cc.Class({
    extends: cc.Component,

    properties: {
       logo:cc.Node,
       title:cc.Node,
       createPanel:cc.Node,
       comPjPanel:cc.Node,
       controlPanel:cc.Node,
    },

    onLoad: function () {
        this.init();
        this.addSocketEventHandler();
    },

    addSocketEventHandler(){
        cc.module.socket.on(SEvents.GET_CLUB_EVENT,this.onReceiveGetClub.bind(this));
    },

    init(){
        
        this.createPanel.active = false;
        this.comPjPanel.active = true;
        this.controlPanel.active = false;

        this.title.children.forEach( function(child,index) {
            var toggle = child.getComponent(cc.Toggle);
            var childLbl = child.getChildByName("lbl_title");
            toggle.isChecked = (index==1);
            childLbl.color = new cc.Color(252,224,169,255);
        });
        var lblTitle = this.title.getChildByName("toggle2").getChildByName("lbl_title");
        lblTitle.color = new cc.Color(0,0,0,255);
    },

    onClickTitle(e,code){
        if(cc._communityData.info.creator==cc.module.self.userId){
            this.createPanel.active = code == 0;
            this.comPjPanel.active = code == 1;
            this.controlPanel.active = code == 2;
            this.title.children.forEach( function(child,index) {
                var childLbl = child.getChildByName("lbl_title");
                childLbl.color = new cc.Color(252,224,169,255);
            });
            cc.find("lbl_title",e.target).color = new cc.Color(0,0,0,255);
        }
        else{
            this.title.children.forEach( function(child,index) {
                var toggle = child.getComponent(cc.Toggle);
                toggle.isChecked = (index==1);
            });
            this.showTips("抱歉你的社区等级不足");
        }
    },

    onReceiveGetClub(data){
        console.log(data);
        this.init();
        this.logo.active = !(JSON.stringify(data.rooms) == "{}" || cc.isValid(data.rooms));
        var clubPanel = this.comPjPanel.getChildByName("club_paiju");
        var paijuItem = this.comPjPanel.getChildByName("paiju_item");
        clubPanel.removeAllChildren();
        if(data.rooms){
            for (var roomId in data.rooms) {
                var form = data.rooms[roomId].config;
                var clubRoom = cc.instantiate(paijuItem);
                var lblType = clubRoom.getChildByName("club_mode").getChildByName("lbl_type");
                var clubRoomId = clubRoom.getChildByName("club_roomId");
                var lblWater = clubRoom.getChildByName("lbl_water");
                var lblPerson = clubRoom.getChildByName("lbl_person");
                var lblGold = clubRoom.getChildByName("lbl_gold");
                var lblTime = clubRoom.getChildByName("lbl_time");
                var lblLessTime = clubRoom.getChildByName("lbl_less_time");
                var lblcreator = clubRoom.getChildByName("lbl_creator");
                lblType.getComponent(cc.Label).string = this.getRoomRule(form.gameRule);
                clubRoomId.getComponent(cc.Label).string = roomId;
                lblWater.getComponent(cc.Label).string = form.gameWater+"金币";
                lblPerson.getComponent(cc.Label).string = data.rooms[roomId].players.length+"/"+form.numOfPerson;
                lblGold.getComponent(cc.Label).string = form.gameInGold;
                lblTime.getComponent(cc.Label).string = form.gameTime+"分钟";
                lblLessTime.getComponent(cc.Label).string = form.gameTime+"分钟结束";
                lblcreator.getComponent(cc.Label).string = "来自 "+form.createName+ "的房间";
                clubRoom.active = true;
                clubRoom._clubRoomId = roomId;
                cc.module.utils.addClickEvent(clubRoom,this.node,"CommunityPaiju","onClickEnterClubRoom",null);
                clubPanel.addChild(clubRoom);
            }
        }
    },

    onClickEnterClubRoom(e,data){
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

    showTips:function(msg){//设置弹窗信息
        if(msg){
            var hall = cc.find("Canvas");
            var tipsPanel = hall.getChildByName("tips_panel");
            tipsPanel.active = true;
            var tipsStr = cc.find("panel/info",tipsPanel);
            tipsStr.getComponent(cc.Label).string = msg;
            setTimeout(function(){
                tipsPanel.active = false;
            }.bind(this),2000);
            cc.module.utils.toTop(tipsPanel);
        }
    },

    // update: function (dt) {

    // },
});
