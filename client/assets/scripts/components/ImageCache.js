cc.Class({
    extends: cc.Component,

    properties: {
        _cache:null,
        _headImgUrl:null,
        _callbacks:null
    },

    init:function () {
        this._cache = {};
        this._callbacks = {};
        this._headImgUrl = {};
        this.addEventListener();
        return this;
    },

    addEventListener:function () {
        cc.module.socket.on(SEvents.RECEIVE_USER_HEADIMG_URL,this._receiveUrlHandler.bind(this));
    },
    
    _receiveUrlHandler:function (data) {
        if(data.errcode != null) {
            this._cache[data.userId] = "empty";
            if(this._callbacks[data.userId] != null) {
                this._callbacks[data.userId].forEach(function (cb) {
                    cb(null);
                });
            }
            return;
        }
        this._headImgUrl[data.userId] = data.url;
        this._load(data.userId,data.url);
    },

    _load:function (userId,url) {
        if(url == null || url=="") {

            this._cache[userId] = "empty";
            if(this._callbacks[userId] != null) {
                this._callbacks[userId].forEach(function (cb) {
                    cb(null);
                });
            }
            return;
        }
        this._headImgUrl[userId] = url;
        cc.loader.load({url:url,type:"jpg"},function (err,tex) {
            if(err) {
                this._cache[userId] = "empty";
                if(this._callbacks[userId] != null) {
                    this._callbacks[userId].forEach(function (cb) {
                        cb(null);
                    });
                }
                return;
            }
            this._cache[userId] = tex;
            if(this._callbacks[userId] != null) {
                this._callbacks[userId].forEach(function (cb) {
                    cb(new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height)));
                }.bind(this));
            }
        }.bind(this));
    },

    newImage:function(userId,callback){
        if(!this._headImgUrl[userId]){
            this.addImageOnloadCallback(userId,callback);
            return;
        };
        var url = this._headImgUrl[userId];
        cc.loader.load({url:url,type:"jpg"},function (err,tex) {
            if(err) {
                this._headImgUrl[userId] = null;
                return;
            }
            callback( new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height)) );
            
        }.bind(this));
    },

    setImage:function(userId,url){
        if(!url){
            return;
        }
        if(!this._headImgUrl[userId]){
            this._headImgUrl[userId] = url;
        }
    },

    getImage:function (userId,callback) {
        if(this._cache[userId] === "empty") {
            if(callback) {
                callback(null);
            }
            return;
        }
        if(this._cache[userId]) {
            if(callback) {
                var tex = this._cache[userId];
                callback(new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height)));
            }
            return;
        }
        this.addImageOnloadCallback(userId,callback);
    },
    
    addImageOnloadCallback:function (userId,callback) {
        this._callbacks[userId] = this._callbacks[userId] || [];
        if(this._callbacks[userId].length === 0) {
            cc.module.socket.send(SEvents.SEND_GET_HEADIMG_URL,{userId:userId});
        }
        this._callbacks[userId].push(callback);
    }
});
