cc.Class({
    extends: cc.Component,

    properties: {
        mjContentNode:cc.Node,
        nnContentNode:cc.Node,
        sszContentNode:cc.Node,
        menuBarNode:cc.Node
    },

    onLoad: function () {
        this.menuBarNode.children.forEach(function (node) {
            cc.module.utils.addClickEvent(node,this.node,"PlayInfo","onClickGameClass");
        }.bind(this));
        this.onClickGameClass({target:this.menuBarNode.children[0]},true);
    },

    onClickGameClass:function (e,auto) {
        if(!auto) {
            cc.module.audioMgr.playUIClick();
        }
        var menuBarButtonCpts = this.menuBarNode.getComponentsInChildren(cc.Button);
        menuBarButtonCpts.forEach(function (cpt) {
            cpt.interactable = true;
        });
        var targetButton = e.target.getComponent(cc.Button);
        targetButton.interactable = false;
        this.nnContentNode.active = false;
        this.sszContentNode.active = false;
        this.mjContentNode.active = false;
        if(e.target.name === "btn_mj_play_info") {
            this.mjContentNode.active = true;
        }
        else if(e.target.name === "btn_nn_play_info") {
            this.nnContentNode.active = true;
        }
        else {
            this.sszContentNode.active = true;
        }
    }
});
