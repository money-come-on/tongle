cc.Class({
    extends: cc.Component,

    properties: {
        quickChatPanel:cc.Node,
        emojiPanel:cc.Node,
        chatInput:cc.EditBox
    },
    
    onLoad: function () {
        var quickChatContent = this.quickChatPanel.children[0];
        quickChatContent.children.forEach(function (item,index) {
            item._chatId = index;
            cc.module.utils.addClickEvent(item,this.node,"ChatPanelCpt","onClickQuickChatItem");
        }.bind(this));

        var emojiContent = this.emojiPanel.children[0];
        emojiContent.children.forEach(function (item) {
            cc.module.utils.addClickEvent(item,this.node,"ChatPanelCpt","onClickEmoji");
        }.bind(this));
    },
    
    onClickMenu:function (e) {
        cc.module.audioMgr.playUIClick();
        this.quickChatPanel.active = false;
        this.emojiPanel.active = false;
        if(e.target.name === "toggle_quick_chat") {
            this.quickChatPanel.active = true;
        }
        else if(e.target.name === "toggle_emoji") {
            this.emojiPanel.active = true;
        }
    },

    onClickQuickChatItem:function (e) {
        this.node.active = false;
        var target = e.target;
        var chatId = target._chatId;
        console.log(" -- chatId -- ",chatId)
        cc.module.socket.send(SEvents.SEND_QUICK_CHAT,{chatId:chatId},true);
    },

    onClickEmoji:function (e) {
        this.node.active = false;
        var target = e.target;
        // var sprite = target.getComponent(cc.Sprite);
        // var emojiId = sprite.spriteFrame.name;
        var emojiId = e.target.name;
        console.log(emojiId);
        cc.module.socket.send(SEvents.SEND_EMOJI,{emoji:emojiId},true);
    },
    
    onClickSend:function () {
        this.node.active = false;
        cc.module.audioMgr.playUIClick();
        var string = this.chatInput.string;
        console.log(string);
        if(string.length>0) {
            cc.module.socket.send(SEvents.SEND_CHAT,{chat:string},true);
            this.chatInput.string = "";
        }
    },
});
