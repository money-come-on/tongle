cc.Class({
    extends: cc.Component,
    properties: {
        btnClose:cc.Node,
        lblContent:cc.Label,
        percentNode:cc.Node,
        _isShow:false
    },

    onLoad: function () {
        this.node.active = false;
        cc.module.wc = this;
    },

    show:function (str,hasBtn) {
        if(str) {
            try{
                this.lblContent.string = str;
            }
            catch(e) {
                throw new Error("this.lblContent ErrorMsg:"+str);
            }
        }
        if(!cc.isValid(hasBtn)) {
            hasBtn = false;
        }
        this.node.active = true;
        this.btnClose.active = hasBtn;
        var pop = this.node.getComponent("Pop");
        if(pop) {
            pop.pop();
        }
    },

    showPercent:function(percent){
        if(this.percentNode){
            this.percentNode.active = true;
            this.percentNode.getComponent(cc.Label).string = Math.floor(percent) + "%";
        }
    },

    hide:function () {
        this.node.active = false;
    }
});
