if(window.io == null){
    window.io = require("SocketIO");
}
cc.Class({
    extends: cc.Component,
    statics: {
        ip:"",
        sio:null,
        _userId:null,
        isPinging:false,
        handlers:{},
        _isReconnect:false,
        _connectCallback:null,
        _disconnectCallback:null,
        _reconnectCallback:null,

        _pingInterval:2000,
        _connectState:false,
        _hearbeatInterval:null,
        _pingFailedCount:0,
        _connectCount:0,

        init:function (config) {
            this.ip = config.SOCKET+":"+config.SOCKET_PORT;
            this.startHearbeat();
            if(cc.sys.isBrowser){
                window.websocket = this;
            }
            return this;
        },

        setUserId:function (userId) {
            this._userId = userId;
        },

        connect:function() {

            var opts = {
                'reconnection':false,
                'force new connection': true,
                'transports':['websocket', 'polling']
            };
            this.sio = window.io.connect(this.ip,opts);
            this.sio.on('connect',function(data){
                this._connectState = true;
                // this._connectCount = 0;
                if(this._connectCallback) {
                    this._connectCallback(data);
                }
                if(this._isReconnect) {
                    if(cc.module.wc && cc.module.wc.node.active) {
                        cc.module.wc.hide();
                    }
                    if(this._reconnectCallback) {
                        this._reconnectCallback();
                    }
                    if(this._userId != null) {
                        this.send("reconnect",null,true);
                    }
                    this._isReconnect = false;
                }
            }.bind(this));

            this.sio.on('disconnect',this.onDisconnect.bind(this));
            this.sio.on("$_message",function (data) {
                if(typeof(data) === "string") {
                    data = JSON.parse(data);
                }
                var $_event = data.$_event;
                if($_event == null) {
                    return;
                }

                if(this.handlers[$_event]) {
                    this.handlers[$_event](data.data);
                }
                if($_event === "loginInOther"){
                    if(cc.loginInOther){
                        cc.loginInOther.zIndex = 100000;
                        cc.loginInOther.active = true;
                    }
                    
                }
              
            }.bind(this));

            this.sio.on("verification_online",function () {
                this.send("is_online",null,true);
            }.bind(this));
            
            this.sio.on("pong",this.onPong.bind(this));
        },

        on:function (event,callback) {
            this.handlers[event] = function(data){
                if(event != "disconnect" && typeof(data) == "string") {
                    data = JSON.parse(data);
                }
                callback(data);
            };
            cc.module.anysdkMgr.log("register socket event :",event);
        },

        off:function (event) {
            // console.log("移除socket事件：",event);
            delete this.handlers[event];
        },

        emit:function(event,data) {
            this.send(event,data);
        },

        isConnect:function () {
            return this._connectState;
        },

        startHearbeat:function(){
            this._hearbeatInterval = setInterval(function () {
                if(this._connectState) {
                    this.ping();
                }
            }.bind(this),this._pingInterval);
        },

        send:function(event,data,autoAddUserId){
            if(this.sio && this._connectState){
                if(data != null && (typeof(data) === "object")){
                    if(autoAddUserId) {
                        data.userId = this._userId;
                    }
                    data = JSON.stringify(data);
                }
                else if(data==null && autoAddUserId) {
                    data = {
                        userId:this._userId
                    };
                    data = JSON.stringify(data);
                }
                this.sio.emit(event,data);
            }
        },

        ping:function(){
            if(this._pingFailedCount >= 5) {
                this.close();
                return;
            }
            this._pingFailedCount ++;
            this.send("Ping");
        },

        onPong:function () {
            this._pingFailedCount = 0;
        },

        close:function(){
            this._pingFailedCount = 0;
            if(this.sio){
                //主动关闭的并不会触发disconnect事件，需要手动去调用
                this.sio.disconnect();
                this.sio = null;
                this.onDisconnect();
            }
        },

        test:function(callback){
            var xhr = cc.module.http.sendRequest("/test",null,function () {
                xhr = null;
                callback(true);
            });
            setTimeout(function(){
                if(xhr){
                    xhr.abort();
                    callback(false);
                }
            },2000);
        },

        onDisconnect:function () {
            if(!this._connectState) {
                return;
            }
            if(cc.module.wc) {
                cc.module.wc.show("网络已断开，正在尝试重新连接");
            }
            this._connectState = false;
            if(this._disconnectCallback) {
                this._disconnectCallback(data);
            }
            this.reconnect();
        },

        setOnConnectListen:function(fn) {
            this._connectCallback = fn;
        },

        setOnDisconnectListen:function(fn) {
            this._disconnectCallback = fn;
        },

        setOnReConnectListen:function (fn) {
            this._reconnectCallback = fn;
        },

        reconnect:function (force) {
            if(this.isConnect() && !force) {
                return;
            }
            this.test(function (rs) {
                 if(rs) {
                     this._isReconnect = true;
                     this.connect();
                 }
                 else {
                     this.reconnect(force);
                 }
            }.bind(this));
        }
    }
});