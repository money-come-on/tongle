cc.Class({
    extends: cc.Component,

    properties: {
        sprite_frames : {
            default: [],
            type: cc.SpriteFrame
        },
        sfAtlas:cc.SpriteAtlas,
        duration: 0.1, // 帧的时间间隔
        loop: false,   // 是否循环播放
        playOnload: false, // 是否在组件加载的时候播放
        pingPong:false,//是否反向播放
        _sprite:null,
        _isPlaying:false,
        _callback:null,
        _playTime:0
    },

    onLoad: function () {
        if(cc.isValid(this.sfAtlas)) {
            var sprites = this.sfAtlas.getSpriteFrames();
            sprites.sort(function (a, b) {
                return parseInt(a.name) - parseInt(b.name);
            });
            this.sprite_frames = sprites;
        }
        this.sprite = this.node.getComponent(cc.Sprite);
        if (!this.sprite) {
            this.sprite = this.node.addComponent(cc.Sprite);
        }
        this.sprite.spriteFrame = this.sprite_frames[0];
        if (this.playOnload) {
            if (!this.loop) {
                this.playOnce(null);
            }
            else {
                this.playLoop();
            }
        }
    },

    playOnce: function(callback) {
        this.node.active = true;
        this._playTime = 0;
        this._isPlaying = true;
        this.loop = false;
        this._callback = callback;
    }, 

    playLoop: function() {
        this.node.active = true;
        this._playTime = 0;
        this._isPlaying = true;
        this.loop = true;
    },

    stopAnim: function() {
        this._isPlaying = false;
        this._playTime = 0;
        if(this._callback) {
            this._callback();
        }
    },

    update: function (dt) {
        if (!this._isPlaying) {
            return;
        }
        this._playTime += dt;
        var index = Math.floor(this._playTime / this.duration);
        if (this.loop) {
            var length = this.sprite_frames.length;
            if(index >= length) {
                if(this.pingPong) {
                    if(2*length - index <= 0) {
                        this.sprite.spriteFrame = this.sprite_frames[0];
                        this._playTime = 0;
                    }
                    this.sprite.spriteFrame = this.sprite_frames[2*length - index - 1];
                }
                else {
                    this._playTime = 0;
                    this.sprite.spriteFrame = this.sprite_frames[length-1];
                }
            }
            else {
                this.sprite.spriteFrame = this.sprite_frames[index];
            }
        }
        else {
            if (index >= this.sprite_frames.length) {
                var length = this.sprite_frames.length;
                if(this.pingPong) {
                    if(2*length - index <= 0) {
                        this.sprite.spriteFrame = this.sprite_frames[0];
                        this.stopAnim();
                        return;
                    }
                    this.sprite.spriteFrame = this.sprite_frames[2*length - index - 1];
                }
                else {
                    this.sprite.spriteFrame = this.sprite_frames[length - 1];
                    this.stopAnim();
                }
            }
            else {
                this.sprite.spriteFrame = this.sprite_frames[index];
            }
        }
    }
});
