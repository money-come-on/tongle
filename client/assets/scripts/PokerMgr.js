var NN_TYPE_NAME = {
    "0":"art_font_mn",
    "1":"art_font_n1",
    "2":"art_font_n2",
    "3":"art_font_n3",
    "4":"art_font_n4",
    "5":"art_font_n5",
    "6":"art_font_n6",
    "7":"art_font_n7",
    "8":"art_font_n8",
    "9":"art_font_n9",
    "10":"art_font_nn",

    "12":"art_font_4hn",
    "13":"art_font_5hn",
    "15":"art_font_zdn",
    "14":"art_font_5xn",
    "finish":"finish",
    "grab_banker":"grab_banker",
    "no_grab_banker":"no_grab_banker"
};
var NN_TYPE_MULTIPLE = {
    "1":"art_font_x1",
    "2":"art_font_x2",
    "3":"art_font_x3",
    "4":"art_font_x4",
    "5":"art_font_x5",
    "6":"art_font_x6",
    "8":"art_font_x8",
    "10":"art_font_x10"
};
cc.Class({
    extends: cc.Component,

    properties: {
        _pokerAtlas:null,
        _minPokerAtlas:null,
        _pokerBackSpriteFrame:null,
        _pokerBackPrefab:null,
        _nnTypeAndMultipleAtals:null
    },

    setPokerAtlas:function (pokerAtlas) {
        this._pokerAtlas = pokerAtlas;
    },

    setMinPokerAtlas:function (pokerAtlas) {
        this._minPokerAtlas = pokerAtlas;
    },

    setPokerBackSF:function (pokerBackSF) {
        this._pokerBackSpriteFrame = pokerBackSF;
    },

    setPokerBackPrefab:function (prefab) {
        this._pokerBackPrefab = prefab;
    },

    setNNTypeAndMultipleAtals:function (atlas) {
        this._nnTypeAndMultipleAtals = atlas;
    },
    
    getPokerSFById:function (pokerId) {
        if(this._pokerAtlas) {
            return this._pokerAtlas.getSpriteFrame(pokerId);
        }
    },

    getMinPokerSFById:function (pokerId) {
        if(pokerId == null) {
            return null;
        }
        if(this._minPokerAtlas) {
            return this._minPokerAtlas.getSpriteFrame(pokerId);
        }
    },

    getPokerBackSF:function () {
        return this._pokerBackSpriteFrame;
    },

    getNewPokerBackNode:function () {
        return cc.instantiate(this._pokerBackPrefab);
    },

    getNNTypeSpriteFrame:function (typeId) {
        var name = NN_TYPE_NAME[typeId];
        return this._nnTypeAndMultipleAtals.getSpriteFrame(name);
    },

    getMultipleSrptieFrame:function (multiple) {

        var name =  NN_TYPE_MULTIPLE[multiple];
        if(name == null) {
            return null;
        }
        return this._nnTypeAndMultipleAtals.getSpriteFrame(name);
    },

    isNN:function (typeId) {
        return NN_TYPE_NAME[typeId] === "art_font_nn";
    }
});
