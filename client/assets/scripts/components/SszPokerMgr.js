cc.Class({
    extends: cc.Component,

    properties: {
        pokerAtlas:cc.SpriteAtlas,
        typeAtlas:cc.SpriteAtlas,
        specialAtlas:cc.SpriteAtlas,
        _horse:null
    },

    onLoad: function () {

    },

    setHorseId:function (horseId) {
        this._horse = horseId;
    },

    getPokerSFById:function (pokerId) {
        if(this.pokerAtlas) {
            if(pokerId === this._horse) {
                return this.horseAtlas.getSpriteFrame(pokerId);
            }
            return this.pokerAtlas.getSpriteFrame(pokerId);
        }
    },
    
    getPokerBackSF:function () {
        return this.getPokerSFById("poker_back");
    },

    getTypeSFByName:function (name) {
        return this.typeAtlas.getSpriteFrame(name);
    },

    getSpecialSFByName:function (name) {
        return this.specialAtlas.getSpriteFrame(name);
    },

});
