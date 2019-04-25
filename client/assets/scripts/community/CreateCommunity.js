cc.Class({
    extends: cc.Component,

    properties: {
        editbox:cc.EditBox,
        locaStr:cc.Label,
        locaPanel:cc.Node,
        _locaName:"北京",
        _clubName:null,
    },

    onLoad: function () {
    	this._locaName = "北京";
        this.addSocketEventHandler();
    },

    addSocketEventHandler:function(){
    	cc.module.socket.on(SEvents.RECEIVE_PROMPT,this.onReceivePrompt.bind(this));
    	cc.module.socket.on(SEvents.GET_CLUB_EVENT,this.onReceiveClub.bind(this));
    },

    onClickLocation:function(e){//选择省份
    	var name = e.target.name;
    	this._locaName = this.getLocaName(name);
    	this.locaStr.string = this._locaName;
    },

    onClickCreatClub:function(){//创建社区
        console.log(this.editbox.string);
        var patrn = /^[0-9]*$/;
    	if(this.editbox.string.length<3 || patrn.test(this.editbox.string)){
    		this.showTips("请输入3-8字符，不要使用纯数字");
    		return;
    	}
    	this._clubName = this.editbox.string;
    	var data = {
    		locaName:this._locaName,
    		clubName:this._clubName,
    		userId:cc.module.self.userId
    	}
    	cc.module.socket.send(SEvents.CLUB_CREATE_EVENT,data,true);
    },
	
	onReceiveClub:function(data){//接收创建社区信息并设置
		console.log(data);
		if(data){
			var hall = cc.find("Canvas");
			var pjPanel = hall.getChildByName("paiju");
			var tips_logo = pjPanel.getChildByName("tips_logo");
			tips_logo.active = true;
			var title_top = pjPanel.getChildByName("title_top");
        	title_top.children.forEach( function(child,index) {
        		var toggle = child.getComponent(cc.Toggle);
	            toggle.isChecked = (index == 0);
            	var childLbl = child.getChildByName("lbl_title");
            	childLbl.color = index==0 ? new cc.Color(252,224,169,255):new cc.Color(252,255,255,255);
	        });
        	var paiJu = pjPanel.getChildByName("paiju_panel");
        	var gameHall = pjPanel.getChildByName("game_hall_panel");
        	var community = pjPanel.getChildByName("community_panel");
        	paiJu.active = true;
        	gameHall.active = false;
        	community.active = false;
        	var titleGroup = paiJu.getChildByName("title");
        	titleGroup.children.forEach( function(child,index) {
	            var childLbl = child.getChildByName("lbl_title");
	            var toggle = child.getComponent(cc.Toggle);
	            toggle.isChecked = (index == 1);
	            childLbl.color = index == 1 ? new cc.Color(0,0,0,255) :  new cc.Color(252,224,169,255);
	        });
			this.node.active = false;
		}
	},

    onReceivePrompt:function(data){//接收弹窗信息
    	console.log(data);
    	if(data.info){
    		this.showTips(data.info);
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

    getLocaName:function(name){//设置省份
    	var locaName = {
    		beijing:"北京",
    		tianjin:"天津",
    		shanghai:"上海",
    		chongqing:"重庆",
    		xianggang:"香港",
    		aomen:"澳门",
    		haiwai:"海外",
    		zhejiang:"浙江省",
    		anhui:"安徽省",
    		fujian:"福建省",
    		jiangxi:"江西省",
    		hunan:"湖南省",
    		shandong:"山东省",
    		henan:"河南省",
    		hubei:"湖北省",
    		guangdong:"广东省",
    		hainan:"海南省",
    		sichuan:"四川省",
    		hebei:"河北省",
    		guizhou:"贵州省",
    		shanxi:"山西省",
    		yunnan:"云南省",
    		liaoning:"辽宁省",
    		xianxi:"陕西省",
    		jilin:"吉林省",
    		gansu:"甘肃省",
    		heilongjiang:"黑龙江省",
    		qinghai:"青海省",
    		jiangsu:"江苏省",
    		taiwan:"台湾省",
    		neimenggu:"内蒙古自治区",
    		guangxi:"广西壮族自治区",
    		xizang:"西藏自治区",
    		ningxia:"宁夏回族自治区",
    		xinjiang:"新疆维吾尔自治区"
    	}
    	return locaName[name];
    },

    // update: function (dt) {

    // },
});
