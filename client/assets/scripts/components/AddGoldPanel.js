cc.Class({
	extends: cc.Component,

	properties: {
		lblWealth:cc.Label,
		lblWater:cc.Label,
        lblAllowin:cc.Label,
		time:cc.Node,
		_time:0,
        _Addin:0,
        _gameinfo:null,
    },

    onLoad: function () {
        this.init();
        this._time = 180;
        this.timeDown(this._time);
    },

    init:function(){
        var slider = this.node.getChildByName("content").getChildByName("slider");
        this._slider = slider;
        if(slider) {
            cc.module.utils.addSlideEvent(slider,this.node,"AddGoldPanel","onSlider");
        };
        var gameNode = cc.find("Canvas");
        var game = gameNode.getComponent("SszGame");
        this._gameinfo = game.getGame();
        console.log(this._gameinfo)
        var water = this._gameinfo.form.gameWater;
        var addIn = this._gameinfo.form.gameInGold;
        this.lblAllowin.string = addIn;
        this.lblWealth.string = cc.module.self.score;
        this.lblWater.string = addIn*0.1;
    },

    onSlider:function(e){
        var target = e.node;
        var bg = target.getChildByName("bg");
        bg.width = e.progress*490;
        var addIn = this._gameinfo.form.gameInGold;
        if(e.progress>=0 && e.progress<=0.4){
            this.lblAllowin.string = addIn;
            this._Addin = addIn;
        }
        else if(e.progress>=0.4 && e.progress<=0.8){
            this.lblAllowin.string = addIn+200;
            this._Addin = addIn+200;
        }
        else if(e.progress>=0.8 && e.progress<=1){
            this.lblAllowin.string = addIn+400;
            this._Addin = addIn+400;
        }
        this.lblWater.string = this._Addin*0.1
    },

    onClickConfirm:function(){
        console.log(this._Addin);
        console.log('----------confirm');
        var roomId = this._gameinfo.roomId;
        cc.module.socket.send(SEvents.Ssz.SSZ_ADD_GOLD,{userId:cc.module.self.userId,addGold:this._Addin,roomId:roomId},true); 
    },

    timeDown:function(time){
    	if(time){
    		this.time.getComponent(cc.Label).string = Math.ceil(time) + "s";
    	}
    },

    update: function(dt){
    	if(this._time && this._time >0){
    		this._time -= dt;
    		this.timeDown(this._time);
    		if(this._time<=0){
    			this._time = 0;
    		}
    	}
    },
});