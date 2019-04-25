cc.Class({
    extends: cc.Component,
    properties: {
        headimgurl:null,
        inviteCode:null,
        headimg:null,
        account:null,
        history:null,
	    userId:null,
        roomId:null,
		nickname:null,
        jscount:0,

        leaf:0,
		gold:0,
		sign:0,
        sex:0,
        ip:""
    },

    setInfo:function (data) {
        this.headimgurl = data.headimg + ".jpg";
        this.inviteCode = data.inviteCode;
        this.nickname   = data.name;
        this.history    = data.history;
        this.account    = data.account;
        this.roomId     = data.roomId;
        this.userId     = data.userId;
        this.sign       = data.sign;
        this.leaf       = data.leaf;
        this.gold       = data.gold;
        this.sex        = data.sex;
        this.ip         = data.ip;
        this.headimg    = data.headimg;
        this.clubId     = data.clubId;
        this.jscount    = data.jscount;
        this.score      = data.score;
    },

    getInfo:function(){
        return {
            headimgurl : this.headimgurl,
            inviteCode : this.inviteCode,
            name       : this.nickname,
            history    : this.history,
            account    : this.account,
            roomId     : this.roomId,
            userId     : this.userId,
            sign       : this.sign,
            leaf       : this.leaf,
            gold       : this.gold,
            sex        : this.sex,
            ip         : this.ip,
            jscount    : this.jscount,
            clubId     : this.clubId,
            score      : this.score,
        }
    },

    addSignInvalidListener:function () {
        cc.module.socket.on(SEvents.RECEIVE_SIGN_IVVALID,function () {
            cc.sys.localStorage.removeItem("wx_account");
            cc.sys.localStorage.removeItem("wx_sign");
        });
    }
});
