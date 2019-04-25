cc.Class({
    extends: cc.Component,

    properties: {
        rulePanel:cc.Node,
        title:cc.Node,
    },

    onLoad: function () {
        this.init();
    },

    init:function(){
        this.title.children.forEach(function(child){
            var toggle = child.getComponent(cc.Toggle);
            var lblTitle = child.getChildByName("lbl_title");
            toggle.isChecked = (child.name == "toggle1");
            lblTitle.color = (child.name == "toggle1" ? new cc.Color(0,0,0,255) : new cc.Color(255,224,160,255));
            lblTitle.getComponent(cc.LabelOutline).color = (child.name == "toggle1" ? new cc.Color(0,0,0,255) :new cc.Color(255,224,160,255));
        }.bind(this));
        this.rulePanel.children.forEach( function(child, index) {
            child.active = (index == 0);
        });
    },

    onClickTitle:function(e,data){
        this.changeColor(e);
        this.rulePanel.children.forEach( function(child, index) {
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

    onClickBack:function(){
        var action = cc.moveTo(0.5,-930,0);
        this.node.runAction(action);
    },

    // update: function (dt) {

    // },
});
