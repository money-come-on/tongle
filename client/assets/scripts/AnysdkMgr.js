cc.Class({
    extends: cc.Component,
    properties: {
        _isCapturing:false,
        _isLoging:false,
        _shareURL:null
    },

    onLoad: function () {
    },
    
    init:function(){
        this.ANDROID_API = "com/hgf/nn/WXAPI";
        this.IOS_API = "AppController";
        return this;
    },

    log:function (tag,msg) {
        if(cc.sys.os == cc.sys.OS_ANDROID && !cc.sys.isBrowser){
            jsb.reflection.callStaticMethod(this.ANDROID_API, "log", "(Ljava/lang/String;Ljava/lang/String;)V",tag,msg);
        }
        else if(cc.sys.isBrowser) {
            // console.log(tag,msg);
        }
    },

    login:function(){
        if(cc.sys.os === cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_API, "Login", "()V");
        }
        else if(cc.sys.os === cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "login");
        }
        else{
            console.log("平台不支持微信登录");
        }
    },

    onLoginResp:function(code){
        this._isLoging = true;
        cc.module.socket.send(SEvents.SEND_AUTH,{code:code});
    },

    onShareResp:function () {
        if(cc.shareCallback) {
            cc.shareCallback();
        }
    },

    getLoginState:function () {
        return this._isLoging;
    },

    exit:function() {
        if(cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.IOS_API,"exitApp");
        }
        else {
            cc.director.end();
        }
    },

    share:function(title,desc,isToSession,roomId,agentId){
        var url = this._shareURL;
        if(roomId){
            url += "/?roomId="+roomId;
            if(agentId){
                url += "&agentId="+agentId;
            }
        }
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_API, "Share", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V",url,title,desc,isToSession);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "share:shareTitle:shareDesc:isShareToSession:",url,title,desc,isToSession);
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
        }
    },

    shareToSession:function(title,desc,roomId,agentId){
        this.share(title,desc,true,roomId,agentId);
    },

    shareToTimeLine:function(title,desc,roomId,agentId){
        this.share(title,desc,false,roomId,agentId);
    },
    
    shareResult:function(){
        if(this._isCapturing){
            return;
        }
        this._isCapturing = true;
        var size = cc.director.getWinSize();
        var currentDate = new Date();
        var fileName = "result_share.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if(jsb.fileUtils.isFileExist(fullPath)){
            jsb.fileUtils.removeFile(fullPath);
        }
        var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height),cc.Texture2D.PIXEL_FORMAT_RGBA8888,gl.DEPTH24_STENCIL8_OES);
        texture.setPosition(cc.p(size.width/2, size.height/2));
        texture.begin();
        cc.director.getRunningScene().visit();
        texture.end();
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_PNG);
        
        var self = this;
        var tryTimes = 0;
        var fn = function(){
            if(jsb.fileUtils.isFileExist(fullPath)){
                var height = 100;
                var scale = height/size.height;
			    var width = Math.floor(size.width * scale);
                
                if(cc.sys.os == cc.sys.OS_ANDROID){
                    jsb.reflection.callStaticMethod(self.ANDROID_API, "ShareIMG", "(Ljava/lang/String;II)V",fullPath,width,height);
                }
                else if(cc.sys.os == cc.sys.OS_IOS){
                    jsb.reflection.callStaticMethod(self.IOS_API, "shareIMG:width:height:",fullPath,width,height);
                }
                else{
                    console.log("platform:" + cc.sys.os + " dosn't implement share.");
                }
                self._isCapturing = false;
            }
            else{
                tryTimes++;
                if(tryTimes > 10){
                    console.log("time out...");
                    return;
                }
                setTimeout(fn,50); 
            }
        };
        setTimeout(fn,50);
    },

    setShareURL:function (url) {
        this._shareURL = url;
    },

    /*loadNative = function(url, callback){
        var dirpath =  jsb.fileUtils.getWritablePath() + 'img/';
        var filepath = dirpath + MD5(url) + '.png';

        function loadEnd(){
            cc.loader.load(filepath, function(err, tex){
                if(err){
                    console.error(err);
                }else{
                    var spriteFrame = new cc.SpriteFrame(tex);
                    if(spriteFrame){
                        //spriteFrame.retain();
                        callback(spriteFrame);
                    }
                }
            });
        }

        if( jsb.fileUtils.isFileExist(filepath) ){
            loadEnd();
            return;
        }

        var saveFile = function(data){
            if( typeof data !== 'undefined' ){
                //目录不存在先创建目录
                if( !jsb.fileUtils.isDirectoryExist(dirpath) ){
                    jsb.fileUtils.createDirectory(dirpath);
                }
                if( jsb.fileUtils.writeDataToFile(new Uint8Array(data),filepath) ){
                    console.log('Remote write file succeed.');
                    loadEnd();
                }else{
                    console.log('Remote write file failed.');
                }
            }
            else{
                console.log('Remote download file failed.');
            }
        };

        var xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function () {
            if (xhr.readyState===4 && xhr.status===200) {
                saveFile(xhr.response);
            }
            else{
                saveFile(null);
            }
        }.bind(this);
        xhr.open("GET", url, true);
        xhr.send();
    };*/
});
