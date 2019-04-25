cc.Class({
    extends: cc.Component,
    properties: {
        _controlNode:cc.Node
    },

    onLoad: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,function(e) {
            if(e.keyCode != cc.KEY.back) {
                return;
            }
            if(!cc.isValid(this._controlNode)) {
                var prefabMgr = this.getComponent("PrefabMgr");
                if(prefabMgr) {
                    var exitPanel = prefabMgr.getNode("exit_panel");
                    if(exitPanel) {
                        this.node.addChild(exitPanel);
                        this._controlNode = exitPanel;
                    }
                }
            }
            if(this._controlNode) {
                var pop = this.controlNode.getComponent("Pop");
                if(pop) {
                    pop.isTop = true;
                    pop.setConfirmCallback(this._onConfirmClick);
                    pop.pop();
                }
            }
        }.bind(this));
    },
    
    _onConfirmClick:function() {
        cc.game.end();
    }
});
