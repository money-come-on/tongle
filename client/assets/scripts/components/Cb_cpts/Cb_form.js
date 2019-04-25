cc.Class({
    extends: cc.Component,

    properties: {
        gems:cc.Label,
        _numOfGame:null,
        _numOfPlayer:null,
        _baseScore:null,
        _time:null,
    },
    onLoad: function () {
        this._numOfGame = 10;
        this._numOfPlayer = 10;
        this._time = 60;
        this._baseScore = 1000;
        this._rate = 800;
    },

    setGems:function(){
        this._rate = (this._numOfGame + this._numOfPlayer -10)*80
        this.gems.string = "消耗砖石："+this._rate;
    },

    onClickNumOfGame:function (e,num) {
        cc.module.audioMgr.playUIClick();
        this._numOfGame = parseInt(num);
        this.setGems();
    },

    onclickNumOfPlayer:function(e,data){
        cc.module.audioMgr.playUIClick();
        this._numOfPlayer = parseInt(data);
        this.setGems();
    },

    onclickBaseScore:function (e,data) {
        cc.module.audioMgr.playUIClick();
        this._baseScore = parseInt(data);
    },

    onclickTime:function(e,data){
        cc.module.audioMgr.playUIClick();
        this._time = parseInt(data);
    },

     onClickConfirm:function (e,data) {
        cc.module.audioMgr.playUIClick();
        var clubId = null;
        if(cc.isClubId){
            clubId = cc.module.self.clubId;
        };
        var form = {
            rate:this._rate,
            numOfGame:this._numOfGame,
            numOfPlayer:this._numOfPlayer,
            time:this._time,
            baseScore:this._baseScore,
        }
        var data = {
            account:cc.module.self.account,
            sign:cc.module.self.sign,
            form:form, 
            clubId:clubId,
            game:"cb",
        };
        //console.log(data);  //return ;
        cc.module.socket.send(SEvents.SEND_CREATE_ROOM,data,true);
        var pop = this.getComponent("Pop");
        pop.unpop();
    },
});
