cc.Class({
    extends: cc.Component,

    properties: {
        _gameNode:null,
        creatorPanel:cc.Node,
        addGoldPanel:cc.Node,
        advancePanel:cc.Node,
    },

    onLoad: function () {
        this._gameNode = cc.find("Canvas");
    },

    onClickGameRule:function(){
        cc.module.audioMgr.playUIClick();
        var gameRulePanel = this._gameNode.getChildByName("game_rule_panel");
        gameRulePanel.active = true;
        var action = cc.moveTo(0.6,-103,0);
        gameRulePanel.runAction(action);
        cc.module.utils.toTop(gameRulePanel);
    },

    onclickSandUp:function(e,data){
        console.log(data);
        this.setMenuAlertActive(false);
        var info = {
            code:(data?data:0),
            userId:cc.module.self.userId
        }
        cc.module.socket.send(SEvents.Ssz.SEND_PLAYER_STANDUP,info,true);
    },

    setMenuAlertActive:function(active){
        this.node.active = active;
    },

    onClickLeave:function(e,data){
        cc.module.socket.send(SEvents.Ssz.SEND_LEAVE,{"userId":cc.module.self.userId,"destroy":data==1},true);
    },

    onClickAutoSandUp:function(e,data){
        console.log(e.isChecked);
        var info = {
            code:0,
            userId:cc.module.self.userId,
            autoSandUp:e.isChecked
        }
        cc.module.socket.send(SEvents.Ssz.SEND_PLAYER_AUTO_STANDUP,info,true);
    },

    onClickAutoLeaf:function(e,data){
        console.log(e.isChecked);
        var info = {
            userId:cc.module.self.userId,
            destroy:0,
            autoLeave:e.isChecked
        }
        cc.module.socket.send(SEvents.Ssz.SEND_AUTO_LEAVE,info,true);
    },

    update: function (dt) {

    },
});
