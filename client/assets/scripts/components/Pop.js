cc.Class({
    extends: cc.Component,
    properties: {
        controlNode:cc.Node,
        isTop:false,
        isUnpopUIClickSFX:false,
        _confirmCallback:null,
        _cancelCallback:null
    },

    onLoad: function () {
    },

    pop:function(isAction) {
        this.node.active = true;
        if(this.isTop) {
            cc.module.utils.toTop(this.node);
        }
        this.controlNode.active = true;
        if(isAction === true) {
            var scaleAction1 = cc.scaleTo(0.3,1.2,1.2);
            var scaleAction2 = cc.scaleTo(0.3,1,1);
            this.controlNode.runAction(cc.sequence([scaleAction1,scaleAction2]));
        }
    },

    unpop:function() {
        this.node.active = false;
        this.controlNode.active = false;
        if(this.isUnpopUIClickSFX) {
            cc.module.audioMgr.playUIClick();
        }
    },

    setConfirmCallback:function (fn) {
        this._confirmCallback = fn;
    },
    
    setCancelCallback:function (fn) {
        this._cancelCallback = fn;
    },
    
    onConfirmClick:function (e,data) {
        if(this._confirmCallback) {
            this._confirmCallback(e,data);
        }
        this.node.active = false;
    },
    
    onCancelClick:function (e,data) {
        if(this._cancelCallback) {
            this._cancelCallback(e,data);
        }
    }
});
