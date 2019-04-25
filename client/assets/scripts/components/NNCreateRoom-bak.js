cc.Class({
    extends: cc.Component,
    properties: {
        modeList:cc.Node,
        radios:{
            default:[],
            type:cc.ToggleGroup
            // type:cc.ToggleContainer
        },
        baseScoreItem:cc.Node,//其他模式的底分的滚动条
        doubleItem:cc.Node,//翻倍规则
        // rateLabel:[cc.Label],
        aalabel:cc.Label,
        fzlabel:cc.Label,
        optList:cc.ScrollView,
        // defaultMode:3,
        tbnnMaxScore:8,
        jhnnMaxScore:2,
        gxnnMaxScore:8,
        _numOfGame:null,
        _lastSelectMode:null,
        _form:null,
        _optList:null,
        _maxScore:0,
    },

    onLoad: function () {
        this._lastSelectMode = 3;
        this._numOfGame = 10;
        this.onclickRate(null,0)
    },

    selectMode:function (mode) {
        if(this._lastSelectMode != null) {
            if(this._lastSelectMode == mode) {
                return;
            }
        }
        this._lastSelectMode = mode;
    },

    onModeSelect:function (e,data) {
        cc.module.audioMgr.playUIClick();
        this.modeList.children.forEach(function (node) {
            node.x = 0;
        });
        e.target.x -= 20;
        var mode = parseInt(data);
        this.selectMode(mode);
    },

    formReset:function () {
        this._form = {
            tbScore:null,
            baseScore:null,         //底分
            maxGameNum:null,        //局数
            rate:null,              //房费
            double:null,            //翻倍
            maxGrabBanker:4,        //最大抢庄倍数
            bankerLimitScore:null,  //上庄分数
            fiveFlowerCow:false,    //五花牛
            fourFlowerCow:false,    //四花牛
            fiveSmallCow:false,     //五小牛
            bombCow:false,          //炸弹牛
            idleBetting:false,      //闲家推注
            disTwist:false,         //禁止搓牌
            disJoin:false,          //中途禁止加入
            jhMode:null,            //选择江华模式时是选择了庄家模式或者通比模式
            gxMode:null             //选择广西模式时是选择了庄家模式或者通比模式
        };
    },

    ctorForm:function () {
        this.formReset();
        this.radios.forEach(function (toggleGroup) {
            var name = toggleGroup.node.name;
            console.log(name,'---77');
            var toggles= toggleGroup.node.getComponentsInChildren(cc.Toggle);
            for(var i=0 ; i<toggles.length ; i++) {
                if(toggles[i].isChecked) {
                    this._form[name] = i;
                }
            }
        }.bind(this));
    },

    onClickNumOfGame:function(e,num){
        this._numOfGame = parseInt(num);
        var NnRate = cc.module.serverInfo.NnRate;
        var AArate = [
            NnRate.AaRateWith10,
            NnRate.AaRateWith15,
            NnRate.AaRateWith20,
            NnRate.AaRateWith30
        ];
        var gameMum = [10,15,20,30];
        var index = 0;
        for(var i=0;i<gameMum.length;i++){
            if(gameMum[i]==this._numOfGame){
                index = i;
            }
        }
        this.aalabel.string = "AA制("+AArate[index]+"钻石)";
        this.fzlabel.string = "房主制("+AArate[index]*6+"钻石)";
    },

    onclickRate:function(e,data){
        var _isAA = (parseInt(data) == 1);
        // var NnRate = cc.module.serverInfo.NnRate;
        // var AArate = [
        //     NnRate.AaRateWith10,
        //     NnRate.AaRateWith15,
        //     NnRate.AaRateWith20,
        //     NnRate.AaRateWith30
        // ];
        // var gameMum = [10,15,20,30];
        // this.rateLabel.forEach(function(redio,index){
        //     var rateString = gameMum[index]+"局（砖石*"+ (_isAA?AArate[index]:AArate[index]*6) +" )";
        //     redio.string = rateString;
        // }.bind(this));
    },

    fillFormOK:function (e,dk) {
        var clubId = null;
        if(cc.isClubId){
            clubId = cc.module.self.clubId;
        };
        this.ctorForm();
        switch (this._lastSelectMode) {
            case 0:
                delete this._form["bankerLimitScore"];
                delete this._form["maxGrabBanker"];
                delete this._form["tbScore"];
                delete this._form["jhMode"];
                delete this._form["gxMode"];
                break;
            case 1:
                delete this._form["maxGrabBanker"];
                delete this._form["tbScore"];
                delete this._form["jhMode"];
                delete this._form["gxMode"];
                break;
            case 2:
                delete this._form["bankerLimitScore"];
                delete this._form["maxGrabBanker"];
                delete this._form["tbScore"];
                delete this._form["jhMode"];
                delete this._form["gxMode"];
                break;
            case 3:
                delete this._form["bankerLimitScore"];
                delete this._form["tbScore"];
                delete this._form["jhMode"];
                delete this._form["gxMode"];
                break;
            case 4:
                delete this._form["bankerLimitScore"];
                delete this._form["maxGrabBanker"];
                delete this._form["gxMode"];
                if(this._form.jhMode == 0) {
                    //江华的庄家模式
                    delete this._form["tbScore"];
                }
                else {
                    //江华的通比模式
                    delete this._form["tbScore"];
                }
                delete this._form["double"];
                this._form["fiveFlowerCow"] = false;
                this._form["fiveSmallCow"] = false;
                break;
            case 5:
                delete this._form["bankerLimitScore"];
                delete this._form["maxGrabBanker"];
                this._form.gxMode = this._form.jhMode;
                delete this._form["jhMode"];
                if(this._form.gxMode == 0) {
                    //广西的庄家模式
                    delete this._form["tbScore"];
                }
                else {
                    //广西的通比模式
                    delete this._form["tbScore"];
                }
                this._form.double = 2;//表明是广西牛牛，自定义翻倍模式为2
                this._form["bombCow"] = false;
                this._form["fiveSmallCow"] = false;
                break;
        }
        this._form.mode = this._lastSelectMode;
        //this._form.rate = 0;//房费
        var data = {
            account:cc.module.self.account,
            sign:cc.module.self.sign,
            form:this._form,
            clubId:clubId,
            game:"nn",
        };
        data.form.rate = (this._form.rate == 1)?0:1 ;//房费
        console.log(data.form);
        //return;
        cc.module.socket.send(SEvents.SEND_CREATE_ROOM,data,true);
        var pop = this.getComponent("Pop");
        pop.unpop();
    },

    onScoreSlider:function (e) {
        this.optList.vertical = false;
        var target = e.node;
        var progress = target.getChildByName("progress");
        var progressCpt = progress.getComponent(cc.ProgressBar);
        progressCpt.progress = e.progress;
    },

    onClickItemBankerMode:function (e) {
        var targetNode = e.node;
        if(targetNode.name == "toggle1") {  //庄家模式
            this.playShow(this.baseScoreItem);
        }
        else { //通比模式
            this.playHidden(this.baseScoreItem);
        }
    },

    playHidden:function (node) {
        if(node.height>0) {
            var anim = node.getComponent(cc.Animation);
            anim.play("item_hidden");
        }
    },

    playShow:function (node) {
        if(node.height <= 0) {
            var anim = node.getComponent(cc.Animation);
            anim.play("item_show");
        }
    }
});

