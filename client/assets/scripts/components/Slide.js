cc.Class({
    extends: cc.Component,

    properties: {
        unfoldSpriteFrame:cc.SpriteFrame,
        foldSpriteFrame:cc.SpriteFrame,
        position:"right",
        duration:0.1,
        deltaX:300,
        _countdown:null
    },

    onLoad: function () {
        this.node.active = false;
    },
    
    slide:function(e) {
        var target = e.target;
        if(this.position === "right") {
            this.node.active = true;
            this.node.runAction(this.getSlideAction(-this.deltaX));
            this.position = "left";
            if(this.foldSpriteFrame) {
                var sp = target.getComponent(cc.Sprite);
                sp.spriteFrame = this.foldSpriteFrame;
            }
        }
        else {
            this.node.runAction(this.getSlideAction(this.deltaX));
            this.position = "right";
            this._countdown = this.duration;
            if(this.unfoldSpriteFrame) {
                var sp = target.getComponent(cc.Sprite);
                sp.spriteFrame = this.unfoldSpriteFrame;
            }
        }
        
    },
    
    getSlideAction:function(deltaX) {
        return cc.moveBy(this.duration, deltaX, 0);
    },
    
    getRotationAction:function(rotation) {
        return cc.rotateTo(this.duration/10,rotation);
    },

    update:function(dt) {
        if(this._countdown) {
            this._countdown -= dt;
            if(this._countdown <= 0) {
                this.node.active = false;
                this._countdown = null;
            }
        }
    }

});
