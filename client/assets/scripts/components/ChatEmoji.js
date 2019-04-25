cc.Class({
    extends: cc.Component,

    properties: {
        quickChatSelectSF:cc.SpriteFrame,
        quickChatUnselectSF:cc.SpriteFrame,
        emojiSelectSF:cc.SpriteFrame,
        emojiUnselectSF:cc.SpriteFrame,
        duration:0.2,
        deltaX:450
    },

    onLoad: function () {
        this._btnQuickChat = this.node.getChildByName("btn_quick_chat");
        this._btnEmoji = this.node.getChildByName("btn_emoji");
        var view = this.node.getChildByName("view");
        if(view) {
            this._content = view.getChildByName("content");
        }
        if(this._btnQuickChat) {
            cc.module.utils.addClickEvent(this._btnQuickChat,this.node,"ChatEmoji","onSelectView");
        }
        if(this._btnEmoji) {
            cc.module.utils.addClickEvent(this._btnEmoji,this.node,"ChatEmoji","onSelectView");
        }
    },

    onSelectView:function (e) {
        var target = e.target;
        // console.log(target);
        if(target.name === "btn_quick_chat") {
            this._btnQuickChat.getComponent(cc.Sprite).spriteFrame = this.quickChatSelectSF;
            this._btnEmoji.getComponent(cc.Sprite).spriteFrame = this.emojiUnselectSF;
            if(this._content) {
                this._content.runAction(this.getMoveAction(0));
            }
        }
        else {
            this._btnQuickChat.getComponent(cc.Sprite).spriteFrame = this.quickChatUnselectSF;
            this._btnEmoji.getComponent(cc.Sprite).spriteFrame = this.emojiSelectSF;
            if(this._content) {
                this._content.runAction(this.getMoveAction(-this.deltaX));
            }
        }
    },
    
    getMoveAction:function (deltaX) {
        return cc.moveTo(this.duration,deltaX,0);
    }
});
