cc.Class({
    extends: cc.Component,

    properties: {
        lblGems:cc.Label
    },

    onLoad: function () {
        this.setGems(cc.module.self.gems);
        this.addEventHandler();
        this.refresh();
    },

    addEventHandler:function () {
        cc.module.socket.on(SEvents.RECEIVE_GEMS,this.receiveGems.bind(this));
    },

    refresh:function () {
        cc.module.socket.send(SEvents.SEND_GEMS);
    },

    setGems:function (gems) {
        if(this.lblGems) {
            this.lblGems.string = gems;
        }
    },

    receiveGems:function (data) {
        if(data.gems != null) {
            this.setGems(data.gems);
        }
    }
});
