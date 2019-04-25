cc.Class({
    extends: cc.Component,

    properties: {
        _lblstr:null,
        _showTime:null
    },

    onLoad: function () {
        this._lblstr = this.node.getChildByName("lblstr").getComponent(cc.Label);
        cc.module.toast = this;
        this.node.active = false;
    },

    show:function (str,time) {
        this._lblstr.string = str;
        this._showTime = time || 2;
        this.node.active = true;
        this.node.zIndex = ++cc.module.zIndex;
    },

    update:function (dt) {
        if(this._showTime) {
            this._showTime -= dt;
            if(this._showTime <= 0) {
                this._showTime = null;
                this.node.active = false;
            }
        }
    }

});
