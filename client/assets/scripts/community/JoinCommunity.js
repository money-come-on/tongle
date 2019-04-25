cc.Class({
    extends: cc.Component,

    properties: {
       editbox:cc.EditBox,
       MsgPanel:cc.Node,
       MethPanel:cc.Node,
    },

    onLoad: function () {
    	this.node.getChildByName("join_panel").active = true;
    	this.MsgPanel.active = false;
    	this.MethPanel.active = false;
    	this.addSocketEventHandler();
    },

    addSocketEventHandler(){
    	cc.module.socket.on(SEvents.GET_CLUB_EVENT,this.onReceiveGetClub.bind(this));
    	cc.module.socket.on(SEvents.APPLY_JOIN_EVENT,this.onReceiveApplyJoin.bind(this));
    },
    /*----set----*/
    setCommunityMsg(data){//设置社区信息
    	this.MsgPanel.active = true;
    	var titleName = cc.find("title/lbl_title",this.MsgPanel);
    	var clubName = cc.find("club_name",this.MsgPanel);
    	var person = cc.find("person_num/lbl_person",this.MsgPanel);
    	var loca = cc.find("location/lbl_location",this.MsgPanel);
    	var creatorName = cc.find("common_creator/creator_msg/creator/creator_name",this.MsgPanel);
    	var creatorHeadImg = cc.find("common_creator/creator_msg/headimg/headimg",this.MsgPanel);
    	var intro = cc.find("common_creator/jianjie/lbl_jianjie",this.MsgPanel);

    	titleName.getComponent(cc.Label).string = data.info.name;
    	clubName.getComponent(cc.Label).string = data.info.name;
    	person.getComponent(cc.Label).string = data.info.nowPerson+" / "+data.info.maxPerson;
    	loca.getComponent(cc.Label).string = data.info.region;
    	for(var i=0;i<data.players.length;i++){
    		var name;
    		if(data.info.creator==data.players[i].userId){
    			name = data.players[i].name;
    			creatorName.getComponent(cc.Label).string = name;
    		}
    	}
    	if(data.info.introduce){
    		intro.getComponent(cc.Label).string = data.info.introduce;
    	}
    	var headimgCpt = creatorHeadImg.getComponent(cc.Sprite);
        cc.module.imageCache.getImage(data.info.creator,function (spriteFrame) {
            if(!cc.isValid(headimgCpt)){
                return;
            }
            if(spriteFrame) {
                headimgCpt.spriteFrame = spriteFrame;
            }
        }.bind(this));
    },

    setMethPlaceHold(){
    	var editbox = cc.find("community_checked/editbox",this.MethPanel);
    	var data = cc.module.self.getInfo();
   		editbox.getComponent(cc.EditBox).placeholder = "Hi,我是"+data.name;
    },

    /*---onClick----*/
   	onClickSerach(){//搜索社区
   		var clubName = this.editbox.string;
   		console.log(clubName);
   		var patrn = /\S/;
   		if(patrn.test(clubName)){
   			cc.module.socket.send(SEvents.GET_CLUB_EVENT,{nameOrId:clubName},true);
   		}
   		else{
   			this.showTips("请输入社区名或者ID！");
   		}
   	},

   	onClickApply(){//申请加入社区
   		console.log(cc._communityData);
   		if(cc._communityData){
   			this.showTips("只能加入一个社区，请联系上级！");
   			return;
   		}
   		var data = cc.module.self.getInfo();
   		var editbox = cc.find("community_checked/editbox",this.MethPanel);
   		var str = editbox.getComponent(cc.EditBox).string;
   		console.log(str);
   		var msg = str?str:"Hi,我是"+data.name;
        data.clubId = cc._applyClubId;
        data.joinor = cc.module.self.userId;
        data.onlineStatus = true;
        data.applyMsg = msg;
        cc.module.socket.send(SEvents.APPLY_JOIN_EVENT,data,true);
        this.node.active = false;
   	},

   	/*---onReceive--*/
   	onReceiveGetClub(data){//接收搜索的社区信息
   		console.log(data);
   		if(data){
   			this.setCommunityMsg(data);
   			cc._applyClubId = data.info.clubId;;
   		}
   		else{
   			this.showTips("未搜索到结果！");
   		}
   	},

   	onReceiveApplyJoin(data){
   		console.log(data);
   		if(data.errcode){
        	cc.module.wc.show(data.errmsg,true);
        }
   	},

    showTips:function(msg){//设置弹窗信息
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
