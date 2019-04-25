cc.Class({
    extends: cc.Component,

    properties: {
        //---------外部的玩法lbl
        lblOutRoomId:cc.Label,
        lblOutGameMode:cc.Label,
        lblOutBaseScore:cc.Label,
        lblOutJuShu:cc.Label,
        lblOutDouble:cc.Label,

        _ruleString:null,
        _maxGameNum:null
    },

    onLoad: function () {

    },
    getBaseConfig: function () {
        return {
            "mode":{
                "0":"无牛下庄",
                "1":"固定庄家",
                "2":"通比牛牛",
                "3":"明牌抢庄",
                "4":"江华牛牛",
                "5":"广西牛牛"
            },
            "baseScore":{
                0:1,
                1:3,
                2:5
            },
            "tbScore":{
                "1":1,
                "2":2,
                "3":3,
                "4":4,
                "5":5,
                "6":6,
                "7":7,
                "8":8
            },
            "maxGameNum":{
                "0":"10",
                "1":"15",
                "2":"20",
                "3":"30"
            },
            "rate":{
                "0":"房主支付",
                "1":"房费AA"
            },
            "double":{
                "0":"牛nXn倍(四炸18倍/ 五花牛15倍/四花牛12倍)",
                "1":"四炸6倍/五花牛5倍/四花牛4倍/牛牛3倍/牛九~牛七2倍/牛6~无牛为1倍",
                "2":"牛牛3倍/牛九~牛七2倍/牛6~无牛为1倍"
            },
            "bankerLimitScore":{
                "0":"0",
                "1":"100",
                "2":"150",
                "3":"200"
            },
            "maxGrabBanker":{
                "0":"1倍",
                "1":"2倍",
                "2":"3倍",
                "3":"4倍"
            },
            "jhMode":{
                "0":"庄家模式",
                "1":"通比模式"
            },
            "gxMode":{
                "0":"庄家模式",
                "1":"通比模式"
            },
            "fiveFlowerCow":"五花牛（5倍）",
            "fourFlowerCow":"四花牛（5倍）",
            "fiveSmallCow":"五小牛（8倍）",
            "bombCow":"炸弹牛（6倍）",
            "idleBetting":"闲家推注",
            "disTwist":"禁止搓牌",
            "disJoin":"禁止加入"
        }
    },
    clone: function (object) {
        var o={};
        if (object instanceof Array) {
            o = [];
        }
        for (var key in object) {
            o[key] = (typeof(object[key])==="object") && object[key] != null ? clone(object[key]) : object[key];
        }
        return o;
    },
    setAll:function (data) {
        this._ruleString = "";
        var config = this.clone(data.config);
        var baseConfig = this.getBaseConfig();
        for(var i in config){
            config[i] = baseConfig[i][config[i]];
        }
        this._maxGameNum = config.maxGameNum;
        this.lblOutRoomId.string = "房号：" + data.roomId||"";
        this.lblOutGameMode.string = "模式：" + config.mode||"";
        if(config.jhMode) {
            this.lblOutGameMode.string += "-"+config.jhMode;
        }
        else if(config.gxMode) {
            this.lblOutGameMode.string += "-"+config.gxMode;
        }
        var difen = config.baseScore == null? config.tbScore : config.baseScore;
        this.lblOutBaseScore.string = "底分：" + difen||"";
        this.lblOutJuShu.string = "局数：" + data.nowIndex + "/" + config.maxGameNum;
        this.lblOutDouble.string = config.double||"";
        this._ruleString += this.lblOutGameMode.string + "，";
        this._ruleString += this.lblOutBaseScore.string + "，";
        this._ruleString += "局数：" + config.maxGameNum + "，";
        this._ruleString += "支付方式：" + config.rate;
    },

    getRule:function () {
        return this._ruleString;
    },

    setNowIndex:function (nowIndex) {
        this.lblOutJuShu.string = "局数：" + nowIndex + "/" + this._maxGameNum;
    },

    getMaxGameNum:function () {
        return this._maxGameNum;
    }
});
