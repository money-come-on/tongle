cc.Class({
    extends: cc.Component,

    properties: {
        btnVoice:cc.Node,
        _lastTouchTime:null,
        _voice:null,
        _volume:null,
        _voice_failed:null,
        _lastCheckTime:-1,
        _timeBar:null,
        MAX_TIME:15000
    },

    onLoad: function () {
        this._voice = cc.find("Canvas/voice");
        this._voice.active = false;
        
        this._voice_failed = cc.find("Canvas/voice/voice_failed");
        this._voice_failed.active = false;
        
        this._timeBar = cc.find("Canvas/voice/time");
        this._timeBar.scaleX = 0.0;
        
        this._volume = cc.find("Canvas/voice/volume");
        for(var i = 1; i < this._volume.children.length; ++i){
            this._volume.children[i].active = false;
        }
        
        var btnVoice = cc.find("Canvas/voice/voice_failed/btn_ok");

        if(btnVoice){
            cc.module.utils.addClickEvent(btnVoice,this.node,"Voice","onBtnOKClicked");
        }
        
        var self = this;
        var btnVoice = cc.find("Canvas/right_btns/btn_voice");
        if(!cc.isValid(btnVoice)) {
            btnVoice = this.btnVoice;
        }
        if(btnVoice){
            btnVoice.on(cc.Node.EventType.TOUCH_START,function(){
                if(!cc.module.self.seat){
                    var sszGame = cc.find("Canvas").getComponent("sszGame");
                    sszGame && cc.module.wc.show("观战者不能使用语音",true);

                    var NnGame = cc.find("Canvas").getComponent("Game");
                    NnGame && NnGame.notify("观战者不能使用语音");
                    return;
                }
                cc.sys.isBrowser ? (window.startRecord && window.startRecord()) : ( console.log("语音开始"),cc.module.voiceMgr.prepare("record.amr"));
                self._lastTouchTime = Date.now();
                self._voice.active = true;
                self._voice_failed.active = false;
                cc.module.utils.toTop(self._voice);
            });
            btnVoice.on(cc.Node.EventType.TOUCH_END,function(){
                if(Date.now() - self._lastTouchTime < 1000){
                    self._voice_failed.active = true;
                    cc.module.voiceMgr.cancel();
                    var time = Date.now() - this._lastTouchTime;
                    (cc.sys.isBrowser && window.stopRecord && window.stopRecord(time));
                }
                else{
                    self.onVoiceOK();
                }
                self._lastTouchTime = null;
            });
            
            btnVoice.on(cc.Node.EventType.TOUCH_CANCEL,function(){
                // console.log("cc.Node.EventType.TOUCH_CANCEL");
                cc.module.voiceMgr.cancel();
                self._lastTouchTime = null;
                self._voice.active = false;
            });

        }
    },
    
    onVoiceOK:function(){
        if(this._lastTouchTime != null){
            if(cc.sys.isBrowser){
                var time = Date.now() - this._lastTouchTime;
                window.stopRecord && window.stopRecord(time)
            }else{
                cc.module.voiceMgr.release();
                var time = Date.now() - this._lastTouchTime;
                var msg = cc.module.voiceMgr.getVoiceData("record.amr");
                cc.module.socket.send(SEvents.SEND_VOICE_MSG,{voice:msg,time:time},true);
            }
        }
        this._voice.active = false;
    },
    
    onBtnOKClicked:function(){
        this._voice.active = false;
    },

    update: function (dt) {
        if(this._voice.active == true && this._voice_failed.active == false){
            if(Date.now() - this._lastCheckTime > 300){
                for(var i = 0; i < this._volume.children.length; ++i){
                    this._volume.children[i].active = false;
                }
                var v = cc.module.voiceMgr.getVoiceLevel(7);
                if(v >= 1 && v <= 7){
                    this._volume.children[v-1].active = true;   
                }
                this._lastCheckTime = Date.now();
            }
        }
        if(this._lastTouchTime){
            var time = Date.now() - this._lastTouchTime;
            if(time >= this.MAX_TIME){
                this.onVoiceOK();
                this._lastTouchTime = null;
            }
            else{
                var percent = time / this.MAX_TIME;
                this._timeBar.scaleX = 1 - percent;
            }
        }
    }
});
