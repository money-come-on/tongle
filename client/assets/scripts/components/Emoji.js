cc.Class({
    extends: cc.Component,

    properties: {
        emoji1Container:cc.Node,
        emoji2Container:cc.Node
    },

    onLoad: function () {
        if(this.emoji1Container) {
            this.emoji1Container.children.forEach(function (item,index) {
                cc.module.utils.addClickEvent(item,this.node,"Emoji","onclickEmoji");
            }.bind(this));
        }
        if(this.emoji2Container) {
            this.emoji2Container.children.forEach(function (item) {
                cc.module.utils.addClickEvent(item,this.node,"Emoji","onclickEmoji");
            }.bind(this));
        }
    },
    
    onclickEmoji:function(e){
        var emojiName = e.target.name;
        var node = cc.find("Canvas");
        var game = node.getComponent("SszGame");
        game && game.playEmoji(emojiName);
        cc.module.socket.send(SEvents.SEND_EMOJI,{emoji:emojiName},true);
    },
});
