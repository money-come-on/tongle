cc.Class({
    extends: cc.Component,

    properties: {
        prefabs:{
            default:[],
            type:cc.Prefab
        }
    },

    onLoad: function () {
    },
    
    getPrefab:function (name) {
        for(var i=0 ; i<this.prefabs.length ; i++) {
            if(this.prefabs[i] && this.prefabs[i].name == name) {
                return this.prefabs[i];
            }
        }
        return null;
    },

    ctorNodeByName:function (name) {
        var prefab = this.getPrefab(name);
        if(cc.isValid(prefab)) {
            return cc.instantiate(prefab);
        }
        return null;
    }
});
