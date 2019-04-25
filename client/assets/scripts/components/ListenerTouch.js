cc.Class({
    extends: cc.Component,

    properties: {
        tzExplain:cc.Node,
        aaExplain:cc.Node
    },

    onLoad: function () {

    },

    addListener:function () {
        this.node.on(cc.Node.EventType.TOUCH_START,this._handler,this);
    },

    removeListener:function () {
        this.node.on(cc.Node.EventType.TOUCH_START,this._handler,this);
    },

    onEnable:function () {
        this.addListener();
    },
    
    onDisable:function () {
        this.removeListener();
    },
    
    _handler:function () {
        var pop = this.node.getComponent("Pop");
        pop.unpop();
        if(this.tzExplain && this.tzExplain.opacity>0) {
            var tzPop = this.tzExplain.getComponent("Pop");
            tzPop.unpop();
        }
        if(this.aaExplain && this.aaExplain.opacity>0) {
            var aaPop = this.aaExplain.getComponent("Pop");
            aaPop.unpop();
        }
    }
});
