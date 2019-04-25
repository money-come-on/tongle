cc.Class({
    extends: cc.Component,

    properties: {
        sprite_frames : {
            default: [],
            type: cc.SpriteFrame
        },
        sfAtlas:cc.SpriteAtlas,
        duration: 0.1,      // 帧的时间间隔
        loop: false,        // 是否循环播放
        playOnload: false,  // 是否在组件加载的时候播放
        reverse:false,     // 是否反向播放
        _sprite:null,
        _isPlaying:false,
        _callback:null,
        _playTime:0
    },

    // use this for initialization
    onLoad: function () {
        this.sprite = this.node.getComponent(cc.Sprite);
        if (!this.sprite) {
            this.sprite = this.node.addComponent(cc.Sprite);
        }
        // this.sprite.spriteFrame = this.sprite_frames[0];
    },

    playOnce: function(code,callback) {
        this.reverse = code == 1;;
        this._playTime = 0;
        this._isPlaying = true;
        this._callback = callback;
    },
 
    stopAnim:function(){
        this._isPlaying = false;
        this._callback && this._callback();
    },

    update:function(dt){
        if(!this._isPlaying){
            return  
        }
        this._playTime += dt;
        var start = Math.floor(this._playTime / this.duration);
        if( !this.reverse ){
            if(start >= this.sprite_frames.length){
                var length = this.sprite_frames.length;
                this.sprite.spriteFrame = this.sprite_frames[length - 1];
                this.stopAnim();
            }
            else {
                this.sprite.spriteFrame = this.sprite_frames[start];
            }
        }
        else{
            var len = this.sprite_frames.length-1;
            if(start >= len){
                start = len;
            }
            var index = len - start;
            this.sprite.spriteFrame = this.sprite_frames[index];
        }
    }

});
