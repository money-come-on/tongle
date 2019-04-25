cc.Class({
    extends: cc.Component,

    properties: {
        timeOut:cc.Label,
    },

    onLoad: function () {
        this.init();
    },

    init:function(){
        var slider = this.node.getChildByName("content").getChildByName("slider");
        this._slider = slider;
        if(slider) {
            cc.module.utils.addSlideEvent(slider,this.node,"CreatorControl","onSlider");
        };
        var gameNode = cc.find("Canvas");
        var game = gameNode.getComponent("SszGame");
        var time = game.returnTimeOut();
        if(time){
            this._timeOutC = time;
            this.setRoomTimeOut(time);
        }
    },

    onSlider:function(e){
        var target = e.node;
        var bg = target.getChildByName("bg");
        var progress = 0;
        if(e.progress <= 0.1){
            progress = 0;
        }
        else if (0.1 < e.progress && e.progress <= 0.3) {
            progress = 0.2;
        }
        else if (0.3 < e.progress && e.progress <= 0.5) {
            progress = 0.4;
        }
        else if (0.5 < e.progress && e.progress <= 0.7) {
            progress = 0.6;
        }
        else if (0.7 < e.progress && e.progress <= 0.9) {
            progress = 0.8
        }
        else {
            progress = 1;
        }
        this._slider.getComponent(cc.Slider).progress = progress;
        bg.width = progress*490;
    },

    onClickCreatorTitle:function(e){
        var target = e.target;
        target.children.forEach( function(child) {
            child.active = !child.active;
        });
    },

    onClickGameEnd:function(){
        console.log('---------结束牌局');
        cc.module.socket.send(SEvents.Ssz.SEND_LEAVE,{"userId":cc.module.self.userId,"destroy":1,"creatorEnd":true},true);
    },

    setRoomTimeOut:function(time){
        if(cc.isValid(this.timeOut)){
            time -= 6;
            var H = Math.floor(time/60);
            var S = time- Math.floor(time/60)*60;
            S = S<10?"0"+S:S;
            this.timeOut.string = (H+":"+S);

            this._timeOutC = setInterval(function(){
                if(!this._timeOutC){
                    clearInterval(this._timeOutC);
                    return;
                }
                time--;
                H = Math.floor(time/60);
                S = time- Math.floor(time/60)*60;
                S = S<10?"0"+S:S;
                this.timeOut.string = (H+":"+S);
                if(time<=0){
                    clearInterval(this._timeOutC);
                    this.timeOut.string = "0";
                }
            }.bind(this),1000);
        }
    },

    onDisable:function(){
        clearInterval(this._timeOutC);
    },

    update: function (dt) {
    },
});
