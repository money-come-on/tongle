cc.Class({
    extends: cc.Component,

    properties: {
        lblNotify:cc.Label
    },

    onLoad: function () {
        
    },
    
    setNotify:function(str) {
        this.lblNotify.string = str;
    }
});
