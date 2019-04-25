cc.Class({
    extends: cc.Component,

    properties: {
        headimg:cc.Sprite,
        nickname:cc.Label,
        ip:cc.Label,
        id:cc.Label,
        sex:cc.Label,
        defaultSpriteFrame:cc.SpriteFrame
    },

    onLoad: function () {
    },

    setData:function (data) {
        this.nickname.string = "昵称：" + data.name;
        this.ip.string = "IP：" + data.ip;
        this.id.string = "ID：" + data.userId;
        this.sex.string = "性别：" + (data.sex==1?"男":"女");
        cc.module.imageCache.getImage(data.userId,function (spriteFrame) {
            if(!this.node) {
                return;
            }
            if(spriteFrame) {
                this.headimg.spriteFrame = spriteFrame;
            }
            else {
                this.headimg.spriteFrame = this.defaultSpriteFrame;
            }
        }.bind(this));
    }
});
