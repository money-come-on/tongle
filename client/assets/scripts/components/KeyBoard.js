cc.Class({
    extends: cc.Component,
    properties: {
        lblValue:cc.Label,
        inputLength:6,
        placeholder:"请输入邀请码",
        _inputFinishCallback:null,
        _canEdit:true
    },

    setNotCanEdit:function () {
        this._canEdit = false;
    },

    onLoad: function () {
    },
    
    onEnable:function(){
        if(!this._canEdit) {
            return;
        }
        this.onResetClicked();
    },

    setInputFinishCallback:function (callback) {
        this._inputFinishCallback = callback;
    },

    onInput:function (e,data) {
        if(!this._canEdit) {
            return;
        }
        if(this.lblValue.string === this.placeholder) {
            this.lblValue.string = "";
        }
        this.addInput(parseInt(data));
    },
    
    addInput:function(num){
        this.lblValue.node.color = cc.color(255,255,255,255);
        if(this.lblValue.string.length >= this.inputLength) {
            return;
        }
        this.lblValue.string += num;
    },

    onResetClicked:function(){
        this.lblValue.string = this.placeholder;
        this.lblValue.node.color = cc.color(206,206,206,255);
    },

    onFinishClicked:function () {
        if(this.lblValue.string.length < this.inputLength) {
            return;
        }
        if(this._inputFinishCallback) {
            this._inputFinishCallback(this.lblValue.string);
        }
    },

    onDelClicked:function(){
        if(this.lblValue.string === this.placeholder) {
            return;
        }
        if(this.lblValue.string.length > 0) {
            this.lblValue.string = this.lblValue.string.substring(0,this.lblValue.string.length-1);
            if(this.lblValue.string.length === 0) {
                this.onResetClicked();
            }
        }
        else {
            this.lblValue.string = this.placeholder;
        }
    }
});
