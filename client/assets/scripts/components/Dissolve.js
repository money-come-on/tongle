cc.Class({
    extends: cc.Component,

    properties: {
        players:cc.Node,
        lblTime:cc.Label,
        lblHint:cc.Label,
        btnAgree:cc.Button,
        btnRefuse:cc.Button,
        progress:cc.ProgressBar,
        waitIcon:cc.SpriteFrame,
        agreeIcon:cc.SpriteFrame,
        defaultHeadimg:cc.SpriteFrame,
        _defaultCountdown:null,
        _countdown:null
    },

    onLoad: function () {
    },

    set:function (data) {
        this.lblHint.string = "玩家【" + data.requestedName + "】正在申请解散房间";
        this._defaultCountdown = data.defaultCountdown;
        this._countdown =  data.countdown;
        this.lblTime.string = data.countdown;
        var players = this.players.children;
        this.btnAgree.node.active = true;
        this.btnRefuse.node.active = true;
        players.forEach(function (player,index) {
            if(index >= data.players.length) {
                player.active = false;
                return;
            }
            var headimg = player.getChildByName("headimg_panel").getChildByName("headimg_mask").getChildByName("headimg");
            var lblName = player.getChildByName("lbl_name").getComponent(cc.Label);
            var statusIcon = player.getChildByName("status").getComponent(cc.Sprite);
            var userId = data.players[index].userId;
            lblName.string = data.players[index].name;
            statusIcon.spriteFrame = data.players[index].status?this.agreeIcon:this.waitIcon;
            if(data.players[index].status && userId == cc.module.self.userId) {
                this.btnAgree.node.active = false;
                this.btnRefuse.node.active = false;
            }
            cc.module.imageCache.getImage(userId,function (spriteFrame) {
                if(headimg) {
                    var sprite = headimg.getComponent(cc.Sprite);
                    sprite.spriteFrame = spriteFrame || this.defaultHeadImg;
                }
            }.bind(this));
        }.bind(this));
    },

    update:function (dt) {
        if(this._countdown) {
            this._countdown -= dt;
            this.progress.progress = (this._defaultCountdown-this._countdown)/this._defaultCountdown;
            if(this._countdown <=0) {
                this._countdown = null;
                this.progress.progress = 1;
                this.lblTime.string = "00";
                return;
            }
            var time = Math.floor(this._countdown);
            this.lblTime.string = time<10 ? "0"+time : time;

        }
    }

});
