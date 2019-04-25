cc.Class({
	extends: cc.Component,

	properties: {
		sysContent:cc.Node,
		itemNode:cc.Node,
		personContent:cc.Node,
		newDetailPanel:cc.Node,
	},

	onload(){
		this.sysContent.removeAllChildren();
		this.personContent.removeAllChildren();
		// cc.module.socket.send(SEvents.GET_MSG_EVENT,null,true);
		// cc.module.socket.on(SEvents.MSG_EVENT,this.onReceiveMsgEvent.bind(this));
		// cc.module.socket.on(SEvents.GET_MSG_EVENT,this.onReceiveGetMsgEvent.bind(this));
	},

	start(){
	},

	onClickTitle(e,code){
		var node = cc.find("Canvas");
		var game = node.getComponent("Hall");
		game.loadCardAnim();
		this.sysContent.active = code == 0;
		this.personContent.active = code == 1;
		var title = e.target.parent;
        title.children.forEach( function(child,index) {
            var childLbl = child.getChildByName("lbl_title");
            childLbl.color = new cc.Color(252,224,169,255);
        });
        e.target.children[1].color = new cc.Color(0,0,0,255);
	},

	onReceiveGetMsgEvent(data){
		/*data {
			0:{ code:{code:code,type:0,time:"2018/12/12 12:00:00",title:"标题",msg:你个龟孙子} },
			1:{ code:{code:code,type:0,time:"2018/12/12 12:00:00",title:"标题",msg:你个龟孙子} }
		}
		*/
		console.log(data);
		var sysMsg = data[0];
		var personMsg = data[1];
		for(var a in sysMsg){
			this.onReceiveMsgEvent(sysMsg[a]);
		}
		for(var b in personMsg){
			this.onReceiveMsgEvent(personMsg[b]);
		}
	},

	onReceiveMsgEvent(data){
		/*data = {code:code,type:0,time:"2018/12/12 12:00:00",title:"标题",msg:你个龟孙子}
		*/
		console.log(data);
		var tips_logo = this.node.getChildByName("tips_logo");
		tips_logo.active = false;
		var newItem = cc.instantiate(this.itemNode);
		var time = cc.find("time",newItem);
		var title = cc.find("info/content/title",newItem);
		var msg = cc.find("info/content/msg",newItem);

		time.getComponent(cc.Label).string = data.time;
		title.getComponent(cc.Label).string = data.title;
		msg.getComponent(cc.Label).string = (data.msg.substring(0,10)+"...");
		newItem.active = true;
		newItem._code = data.code;
		data.code == 0 ? this.sysContent.addChild(newItem) : this.personContent.addChild(newItem);
	},

});