cc.Class({
    extends: cc.Component,

    properties: {
        bgmVolume:0,
        sfxVolume:1.0,
        bgmAudioID:-1
    },

    init: function () {
        var bgm = cc.sys.localStorage.getItem("bgmVolume");
        if(bgm != null){
            this.bgmVolume = parseFloat(bgm);    
        }
        var sfx = cc.sys.localStorage.getItem("sfxVolume");
        if(sfx != null){
            this.sfxVolume = parseFloat(sfx);    
        }
        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            cc.audioEngine.resumeAll();
        });
    },
    
    getUrl:function(url){
        return cc.url.raw("resources/sounds/" + url);
    },

    getLocalBGMName:function () {
        return cc.sys.localStorage.getItem("bgmName");
    },
    
    playBGM:function(url){
        var audioUrl = this.getUrl(url);
        if(this.bgmAudioID >= 0){
            cc.audioEngine.stop(this.bgmAudioID);
        }
        this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
        if(this.bgmAudioID >= 0) {
            // cc.sys.localStorage.setItem("bgmName",url);
        }
        cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
    },
    
    playSFX:function(url){
        var audioUrl = this.getUrl(url);
        if(this.sfxVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.sfxVolume);
            cc.audioEngine.setVolume(audioId,this.sfxVolume);
        }
    },
    playMusic:function(type){
        var url = "cb/"+type+".mp3";
        this.playSFX(url);
    },

    preLoad:function(sex,url){
        if(sex == 1) {
            url = "male/" + url;
        }
        else {
            url = "female/" + url;
        }
        var audioUrl = this.getUrl(url);
        cc.audioEngine.preload(audioUrl,function(){});
    },

    playBySex:function (sex,url) {
        if(arguments.length == 1) {
            this.playSFX(arguments[0]);
            return;
        }
        if(sex == 1) {
            url = "male/" + url;
        }
        else {
            url = "female/" + url;
        }
        this.playSFX(url);
    },

    setSFXVolume:function(v){
        if(this.sfxVolume != v){
            cc.sys.localStorage.setItem("sfxVolume",v);
            this.sfxVolume = v;
        }
    },
    
    setBGMVolume:function(v,force){
        if(this.bgmAudioID >= 0){
            if(v > 0){
                if(this.bgmVolume <= 0) {
                    cc.audioEngine.resume(this.bgmAudioID);
                }
            }
            else{
                cc.audioEngine.pause(this.bgmAudioID);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }
        if(this.bgmVolume != v || force){
            cc.sys.localStorage.setItem("bgmVolume",v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID,v);
        }
    },
    
    pauseAll:function(){
        cc.audioEngine.pauseAll();
    },
    
    resumeAll:function(){
        cc.audioEngine.resumeAll();
    },
    
    playUIClick:function() {
        this.playSFX("btn_click.wav");
    },

    playPokerSelected:function () {
        this.playSFX("poker_selected.mp3");
    }
});
