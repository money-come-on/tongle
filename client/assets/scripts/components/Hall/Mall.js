cc.Class({
    extends: cc.Component,

    properties: {
        goldNode:cc.Node,
        gemsNode:cc.Node,
        lblLeaf:cc.Label,
        lblGold:cc.Label,
    },

    onLoad () {
        this.goldNode.active = !0;
        this.gemsNode.active = !1;
        cc.module.socket.on(SEvents.RECEIVE_WEALTH,this.onReceiveWealth.bind(this));
        cc.module.socket.on(SEvents.EVENT_EXCHANGE_GOLD,this.onReceiveExchange.bind(this));
    },

    start () {
        cc.module.socket.send(SEvents.SEND_WEALTH,null,true);
        this.setWealth(cc.module.self);
    },

    onReceiveWealth (data) {//接收财富信息
        if(!cc.isValid(data.errcode)) {
            this.setWealth(data);
        }
    },

    onReceiveExchange(data){
        console.log(data);
        if(data){
            cc.module.wc.show(data.msg,true);
            if(data.code){
                this.start();
            }
        }
    },

    setWealth (data) {//设置金币、钻石
        // console.log(data)
        if(this.lblLeaf) {
            this.lblLeaf.string = data.leaf;
        }
        if(this.lblGold){
            this.lblGold.string = data.gold;
        }
    },

    onClickTitle(e,code){//点击导航栏
        this.goldNode.active = code == 0;
        this.gemsNode.active = code == 1;
        var title = e.target.parent;
        title.children.forEach( function(child,index) {
            var childLbl = child.getChildByName("lbl_title");
            childLbl.color = new cc.Color(252,224,169,255);
        });
        cc.find("lbl_title",e.target).color = new cc.Color(0,0,0,255);
    },

    onClickChangeGold(e,data){
        var hall = cc.find("Canvas");
        var tipsPanel = hall.getChildByName("tips_chose_panel");
        var tipsStr = cc.find("panel/gem",tipsPanel);
        var pop = tipsPanel.getComponent("Pop");
        var msg;
        if(cc.module.self.leaf>data){
            msg = "是否兑换金币";
            pop && pop.setConfirmCallback(
                function () {
                    if(data){
                        cc.module.socket.send(SEvents.EVENT_EXCHANGE_GOLD,{leaf:data,userId:cc.module.self.userId},true);
                        tipsPanel.active = false;
                    }
                }
            );
        }
        else{
            msg = "您的钻石不足，点击确定前往商城购买";
            pop && pop.setConfirmCallback(
                function () {
                    if(data){
                        pop && pop.unpop()
                    }
                }
            );
        }
        tipsStr.getComponent(cc.Label).string = msg;
        pop && pop.pop();
    },

    onClickBuy(e,data){
        if(data){
            var userId = cc.module.self.userId;
            var url = "http://120.27.229.21/tongle/codepay/index.php?price="+ data +"&userId="+userId;
            cc.sys.openURL(url);
        }
    },

    // update (dt) {},
});
