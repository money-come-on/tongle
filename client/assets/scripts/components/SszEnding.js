cc.Class({
    extends: cc.Component,

    properties: {
        lblRoomId:cc.Label,
        lblTime:cc.Label,
        lblCreator:cc.Label,
        lblPaiju:cc.Label,
        playersNode:cc.Node,
        noticeNode:cc.Node,
        playerPrefab:cc.Prefab,
    },

    onLoad: function () {
       this._gameType = null;
    },
    
    onDestroy:function(){
        // cc.sys.localStorage.removeItem("recordUuid");
    },
    
    ending:function (data,type) {
        console.log(data);
        this._gameType = type;
        cc.sys.localStorage.setItem("recordUuid",data.uuid);
        (window.shareToTimeLine && window.shareToTimeLine());
        (window.shareToSession && window.shareToSession());
        var Buffer = cc.module.Buffer;
        this.lblRoomId.string = "房间：" + data.roomId;
        this.lblTime.string = "时间：" + data.time;
        this.lblCreator.string = "房主：" + data.creatorName; /*new Buffer(data.creatorName ,'base64').toString();*/
        this.lblPaiju.string = "牌局时间：" + data.gameTime + "分钟";
        this.playersNode.removeAllChildren();
        data.players.sort(function(a,b){return b.score - a.score});
        
        data.players.forEach(function (player) {
            var playerNode = cc.instantiate(this.playerPrefab);
            var headimgCpt = playerNode.getChildByName("mask").getChildByName("headimg").getComponent(cc.Sprite);
            var lblNameCpt = playerNode.getChildByName("lbl_name").getComponent(cc.Label);
            var lblAllInCpt = playerNode.getChildByName("lbl_all_in").getComponent(cc.Label);
            var lblwaterCpt = playerNode.getChildByName("lbl_water").getComponent(cc.Label);
            var lblWinLoseCpt = playerNode.getChildByName("lbl_win_lose").getComponent(cc.Label);
            lblNameCpt.string = player.name;/*new Buffer(player.name ,'base64').toString();*/
            lblAllInCpt.string = player.allowIn?player.allowIn:0; // 允许带入
            lblwaterCpt.string = (player.winLose/player.water); // 水数
            lblWinLoseCpt.string = player.winLose; //总收益

            cc.module.imageCache.getImage(player.userId,function (spriteFrame) {
                if(!cc.isValid(headimgCpt)) {
                    return;
                }
                console.log(spriteFrame);
                if(spriteFrame) {
                    headimgCpt.spriteFrame = spriteFrame;
                }
            }.bind(this));
            this.playersNode.addChild(playerNode);
        }.bind(this));
    },

    onClickRecharge:function(){
        cc.recharge = true;
        cc.director.loadScene("hall");
        var SszGame = cc.find("Canvas").getComponent("SszGame");
        clearInterval(SszGame._timeOut);
    },

    onclickOnceAgain:function(){
        cc.again = true;
        cc.againType = this._gameType;
        console.log(cc.againType,'----66');
        cc.director.loadScene("hall");
        var SszGame = cc.find("Canvas").getComponent("SszGame");
        SszGame && clearInterval(SszGame._timeOut);
        var NnGame = cc.find("Canvas").getComponent("Game");
        NnGame && clearInterval(NnGame._timeOut);
    }, 

    onClickRenewFee:function () {
        cc.module.audioMgr.playUIClick();
    },
    
    onClickLeave:function () {
        cc.module.audioMgr.playUIClick();
        cc.director.loadScene("hall");
    },

    onClickShare:function(){
        cc.module.audioMgr.playUIClick();
        cc.module.anysdkMgr.shareResult();
    },
   
});
