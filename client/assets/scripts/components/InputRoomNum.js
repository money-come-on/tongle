cc.Class({
    extends: cc.Component,

    properties: {
        nums:{
            default:[],
            type:[cc.Label]
        },
        _finishCallback:null,
        _inputIndex:0
    },

    onLoad: function () {
    },
    
    onEnable:function(){
        this.onResetClicked();
    },
    
    onInputFinished:function(roomId) {
        var pop = this.getComponent("Pop");
        if(pop) {
            pop.unpop();
        }
        if(this._inputFinishCallback) {
            this._inputFinishCallback(roomId);
        }
    },

    setInputFinishCallback:function (callback) {
        this._inputFinishCallback = callback;
    },

    onInput:function(num){
        cc.module.audioMgr.playUIClick();
        if(this._inputIndex >= this.nums.length){
            return;
        }
        this.nums[this._inputIndex].string = num;
        this._inputIndex += 1;
        
        // if(this._inputIndex == this.nums.length){
        //     var roomId = this.parseRoomID();
        //     this.onInputFinished(roomId);
        // }
    },

    onClickConfirm:function(){
        if(this._inputIndex == this.nums.length){
            var roomId = this.parseRoomID();
            this.onInputFinished(roomId);
        }
        else{
            cc.module.wc.show("请输入6位数的房间号",true);
        }
    },

    onNumclick:function(e,data){
        this.onInput( parseInt(data) );  
    },

    onResetClicked:function(){
        cc.module.audioMgr.playUIClick();
        for(var i = 0; i < this.nums.length; ++i){
            this.nums[i].string = "";
        }
        this._inputIndex = 0;
    },

    onDelClicked:function(){
        cc.module.audioMgr.playUIClick();
        if(this._inputIndex > 0){
            this._inputIndex -= 1;
            this.nums[this._inputIndex].string = "";
        }
    },
    
    parseRoomID:function(){
        var str = "";
        for(var i = 0; i < this.nums.length; ++i){
            str += this.nums[i].string;
        }
        return str;
    }
});
