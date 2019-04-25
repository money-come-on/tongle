cc.Class({
    extends: cc.Component,
    statics:{
        url:null,
        init:function (config) {
            this.url = config.URL + ":" + config.HTTP_PORT;
            return this;
        },
        sendRequest : function(path,data,callback,url){
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            var str = "?";
            for(var k in data){
                if(str != "?"){
                    str += "&";
                }
                str += k + "=" + data[k];
            }
            url = url || this.url;
            url += path;
            xhr.open("GET",url, true);
            if (cc.sys.isNative){
                xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
            }
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                    try {
                        var ret = JSON.parse(xhr.responseText);
                        if(callback){
                            callback(ret);
                        }
                    } catch (e) {
                        if(callback){
                            callback(null);
                        }
                    }
                    finally{}
                }
            };
            xhr.send();
            return xhr;
        }
    }
});