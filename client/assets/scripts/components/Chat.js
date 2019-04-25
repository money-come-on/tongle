cc.Class({
    extends: cc.Component,

    properties: {
        chatContainer:cc.Node,
        emojiContainer:cc.Node
    },

    onLoad: function () {
        if(this.chatContainer) {
            this.chatContainer.children.forEach(function (item,index) {
                item.chatId = index;
                cc.module.utils.addClickEvent(item,this.node,"Chat","_clickChatItem");
            }.bind(this));
        }
        if(this.emojiContainer) {
            this.emojiContainer.children.forEach(function (item) {
                cc.module.utils.addClickEvent(item,this.node,"Chat","_clickEmojiItem");
            }.bind(this));
        }
    },
    
    _clickChatItem:function (e) {
        var chatId = e.target.chatId;
        if(chatId == null) {
            return;
        }
        cc.module.socket.send(SEvents.SEND_QUICK_CHAT,{chatId:chatId},true);
    },

    _clickEmojiItem:function (e) {
        var name = e.target.name;
        if(name == null || name == "") {
            return;
        }
        console.log(name)
        cc.module.socket.send(SEvents.SEND_EMOJI,{emoji:name},true);
    },

    onClickMenu:function(e,data){
        var quitChatPanel = this.chatContainer.parent;
        var emojiPanel = this.emojiContainer.parent;
        quitChatPanel.active = (data == 0);
        emojiPanel.active = (data == 1);
    },

});
