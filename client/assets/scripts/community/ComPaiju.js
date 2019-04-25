cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad: function () {
    	
    },

    setCulbRoom:function(){
        var data = cc._communityData.rooms;
        var clubPaiju = this.node.getChildByName("paiju").getChildByName("club_paiju");
        clubPaiju.removeAllChildren();
        if(!data && data=="{}"){return};
        for (var roomId in data) {
            var pjItem = this.node.getChildByName("paiju").getChildByName("paiju_item");
            var form = data[roomId].config;
            var clubRoom = cc.instantiate(pjItem);
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
            lblPerson.getComponent(cc.Label).string = data[roomId].players.length+"/"+form.numOfPerson;
            lblGold.getComponent(cc.Label).string = form.gameInGold;
            lblTime.getComponent(cc.Label).string = form.gameTime+"分钟";
            lblLessTime.getComponent(cc.Label).string = form.gameTime+"分钟结束";
            lblcreator.getComponent(cc.Label).string = "来自 "+form.createName+ "的房间";
            clubRoom._clubRoomId = roomId;
            clubRoom.active = true;
            cc.module.utils.addClickEvent(clubRoom,this.node,"ComPaiju","onClickClubRoom",null);
            clubPaiju.addChild(clubRoom);
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
    
    onClickClubRoom(e,data){
        console.log(e);
        console.log(data);
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

    // update: function (dt) {

    // },
});
