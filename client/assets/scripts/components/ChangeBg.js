cc.Class({
    extends: cc.Component,

    properties: {
        Toggles:cc.Node,
        bgNode:cc.Node,
        areaNode:cc.Node,
        ruleNode:cc.Node,
        green:cc.SpriteFrame,
        pink:cc.SpriteFrame,
        purple:cc.SpriteFrame,
        blue:cc.SpriteFrame,
        gray:cc.SpriteFrame,
        typeAtlas:cc.SpriteAtlas,
        _gameBg:null,
        _gameArea:null,
        _gameRule:null,
        _color:null,
    },

    onLoad: function () {
        this.init();
    }, 

    init:function(){
        var gameNode = cc.find("Canvas");
        var game = gameNode.getComponent("SszGame");
        this._game = game.getGame();
        this._gameArea = this._game.form.gameType;
        this._gameRule = this._game.form.gameRule;
        this._color = "green";
    },

    onClickChange:function(e,color){
        this._color = color?color:"green";
    },

    onClickConfirm:function(){
        var sprite;
        var gameRule = {
            "sss":"13Water",
            "qys":"fullColor",
            "sbp":"18Water",
            "dys":"moreColor",
            "bbc":"changeable",
            "wpc":"joker",
        };
        switch (this._color) {
            case "pink":
                sprite = this.pink;
                break;
            case "purple":
                sprite = this.purple;
                break;
            case "blue":
                sprite = this.blue;
                break;
            case "gray":
                sprite = this.gray;
                break;
            default:
                sprite = this.green;
                break;
        }
        var typeSprite = "battle_roomIcon_"+this._gameArea+"_"+this._color;
        var ruleSprite = "battle_roomIcon_"+gameRule[this._gameRule]+"_"+this._color;
        this.bgNode.getComponent(cc.Sprite).spriteFrame = sprite;
        this.areaNode.getComponent(cc.Sprite).spriteFrame = this.typeAtlas.getSpriteFrame(typeSprite);;
        this.ruleNode.getComponent(cc.Sprite).spriteFrame = this.typeAtlas.getSpriteFrame(ruleSprite);;
        cc.gameBgColor = this._color;
        cc.typeSprite = typeSprite;
        cc.ruleSprite = ruleSprite;
        var pop = this.node.getComponent("Pop");
        pop && pop.unpop();
    },

    update: function (dt) {

    },
});
