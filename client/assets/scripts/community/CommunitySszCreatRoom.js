cc.Class({
    extends: cc.Component,

    properties: {
        contentPanel:cc.Node,
        typePanel:cc.Node,
        rulePanel:cc.Node,
        wealthPanel:cc.Node,
        numOfPersonPanel:cc.Node,
        outOrderPanel:cc.Node,
        outTimePanel:cc.Node,
        gaojiPanel:cc.Node,
        optList:cc.ScrollView,
        goldItem:cc.Node,
        gameTiemItem:cc.Node,
        lipaiTiemItem:cc.Node,
        controlItem:cc.Node,
        _form:null,
        _gameType:null,
        _gameRule:null,
        _gameWater:2,
        _gameInGold:400,
        _gameLeaf:80,
        _gameTime:60,
        _cscp:60,
        _allowIn:true,
        _isUp:true,
        _allowDouble:9,
        _numOfPerson:4,
        _isAllShow:false,
        _lessPerson:2,
    },

    onLoad:function(){
        this.initSlider();
        this.initColor();
    },

    initSlider:function(){
        var valueNode = this.goldItem.getChildByName("allow");
        var rateNode = this.goldItem.getChildByName("rate");
        var slider = this.goldItem.getChildByName("slider");
        this._slider = slider;
        if(slider) {
            var goldHandle = slider.getChildByName("Handle");
            cc.module.utils.addSlideEvent(slider,this.node,"CommunitySszCreatRoom","onWealthSlider");
        }
        this._lblValue = valueNode.getComponent(cc.Label);
        this._rateValue = rateNode.getComponent(cc.Label);
        this.setWealth();
        var gameTimeSlider = this.gameTiemItem.getChildByName("slider");
        this._gameTimeSlider = gameTimeSlider;
        if(gameTimeSlider){
            cc.module.utils.addSlideEvent(gameTimeSlider,this.node,"CommunitySszCreatRoom","ongameTimeSlider");
        }
        var lipaiTimeSlider = this.lipaiTiemItem.getChildByName("slider");
        this._lipaiTimeSlider = lipaiTimeSlider;
        if(lipaiTimeSlider){
            cc.module.utils.addSlideEvent(lipaiTimeSlider,this.node,"CommunitySszCreatRoom","onlipaiTimeSlider");
        }
        var controlSlider = this.controlItem.getChildByName("slider");
        this._controlSlider = controlSlider;
        if(controlSlider){
            cc.module.utils.addSlideEvent(controlSlider,this.node,"CommunitySszCreatRoom","oncontrolSlider");
        }
    },

    initColor:function(){
        var wealth = cc.find("wealth/title/lbl_wealth",this.wealthPanel);
        var boolean = this._gameInGold > cc.module.self.gold ? true : false;
        this.changLblColor(wealth,boolean);
        var rateStr = cc.find("content/rate/lbl_rate",this.gameTiemItem);
        var boolean = (this._gameLeaf > cc.module.self.leaf ? true : false);
        this.changLblColor(rateStr,boolean);
    },

    onClickGaoji:function(){
        var gaojiPanel = this.contentPanel.getChildByName("game_gaoji");
        var icon = this.contentPanel.getChildByName("btn_gaoji").getChildByName("icon");
        if(this._isUp){
            icon.rotation = 270;
            gaojiPanel.active = this._isUp;
            this._isUp = !this._isUp;
        }
        else{
            icon.rotation = 90;
            gaojiPanel.active = this._isUp;
            this._isUp = !this._isUp;
        }
    },

    onClickConfirm:function(){
        var clubId = null;
        if(cc.isClubId){
            clubId = cc.module.self.clubId;
            console.log(clubId);
            if(!clubId){
                clubId = cc.isClubId;
            }
        };
        cc.module.audioMgr.playUIClick();
        this.ctorForm();
        var data = {
            account:cc.module.self.account,
            sign:cc.module.self.sign,
            form:this._form, 
            clubId:clubId,
            game:"ssz",
            isClub:true
        };
        var pop = this.node.getComponent("Pop");
        pop&&pop.unpop();
        var goldIsLess = this._gameInGold > cc.module.self.gold ? true : false;
        var leafIsLess = (this._gameLeaf > cc.module.self.leaf ? true : false);
        if(goldIsLess || leafIsLess){
            cc.module.wc.show("你的金币/钻石不足",true);
        }
        else{
            cc.module.socket.send(SEvents.SEND_CREATE_ROOM,data,true);
        }
    },

    formReset:function () {
        this._form = {
            gameType:"fj",
            gameRule:"sss",
            gameWater:2,
            gameInGold:400,
            gameTime:60,
            gameLeaf:80,
            numOfPerson:4,
            isAllShow:false,
            cscp:60,
            allowIn:true,
            allowDouble:9,
            lessPerson:2,
            createName:cc.module.self.nickname
        };
    },

    checkForm:function(){
        var type = this.typePanel.getChildByName("type");
        var ruleType = this.rulePanel.getChildByName("type");
        var numOfPerson = this.numOfPersonPanel.getChildByName("type");
        var lessPerson = this.gaojiPanel.getChildByName("game_less_person").getChildByName("type");
        var outOrder = this.outOrderPanel.getChildByName("type");
        type.children.forEach( function(child,index) {
            var toggle = child.getComponent(cc.Toggle);
            if(toggle.isChecked){
                index === 0 ? (this._gameType = "fj") : (this._gameType = "zj");
            }
        }.bind(this));
        ruleType.children.forEach(function(child){
            var toggle = child.getComponent(cc.Toggle);
            if(toggle.isChecked){
                this._gameRule = child.name;
            }
        }.bind(this));
        numOfPerson.children.forEach(function(child){
            var toggle = child.getComponent(cc.Toggle);
            if(toggle.isChecked){
                this._numOfPerson = parseInt(child.name);
            }
        }.bind(this));
        lessPerson.children.forEach( function(child) {
            var toggle = child.getComponent(cc.Toggle);
            if(toggle.isChecked){
                if( parseInt(child.name) > this._numOfPerson){
                    this._lessPerson = 2;
                }else{
                    this._lessPerson = parseInt(child.name);
                }
            }
        }.bind(this));
        outOrder.children.forEach( function(child,index) {
            var toggle = child.getComponent(cc.Toggle);
            if(toggle.isChecked){
                this._isAllShow = (index === 1);
            }
        }.bind(this));
    },
   
    ctorForm:function () {
        this.formReset();
        this.checkForm();
        this._form.gameType = this._gameType;
        this._form.gameRule = this._gameRule;
        this._form.gameWater = this._gameWater;
        this._form.gameInGold = this._gameInGold;
        this._form.gameTime = this._gameTime;
        this._form.gameLeaf = this._gameLeaf;
        this._form.numOfPerson = this._numOfPerson;
        this._form.isAllShow = this._isAllShow;
        this._form.cscp = this._cscp;
        this._form.allowIn = this._allowIn;
        this._form.allowDouble = this._allowDouble;
        this._form.lessPerson = this._lessPerson;
    },

    onWealthSlider:function (e) {
        var target = e.node;
        var progress = target.getChildByName("progress");
        var progressCpt = progress.getComponent(cc.ProgressBar);
        progressCpt.progress = e.progress;
        var allowGold,waterGold;
        if(e.progress <= 0.1){
            allowGold = 200;
            waterGold = 1;
        }
        else if (0.1 < e.progress && e.progress <= 0.3) {
            allowGold = 400;
            waterGold = 2;
        }
        else if (0.3 < e.progress && e.progress <= 0.5) {
            allowGold = 1000;
            waterGold = 5;
        }
        else if (0.5 < e.progress && e.progress <= 0.7) {
            allowGold = 2000;
            waterGold = 10;
        }
        else if (0.7 < e.progress && e.progress <= 0.9) {
            allowGold = 4000;
            waterGold = 20;
        }
        else {
            allowGold = 6000;
            waterGold = 30;
        }
        this._gameInGold = allowGold;
        this._gameWater = waterGold;
        this._lblValue.string = allowGold;
        this._rateValue.string = waterGold+"金币/水";
        var wealth = this.wealthPanel.getChildByName("wealth").getChildByName("title").getChildByName("lbl_wealth");
        var boolean = allowGold > cc.module.self.gold ? true : false;
        this.changLblColor(wealth,boolean);
    },

    ongameTimeSlider:function (e) {
        var target = e.node;
        var progress = target.getChildByName("progress");
        var progressCpt = progress.getComponent(cc.ProgressBar);
        progressCpt.progress = e.progress;
        var gameTimeStr = cc.find("content/time/lbl_time",this.gameTiemItem);
        var rateStr = cc.find("content/rate/lbl_rate",this.gameTiemItem);
        var gameTime,rateLeaf;
        if(e.progress <= 0.1){
            gameTime = 20;
            rateLeaf = 40;
        }
        else if (0.1< e.progress && e.progress <= 0.3) {
            gameTime = 30;
            rateLeaf = 50;
        }
        else if (0.3 <e.progress && e.progress <= 0.5) {
            gameTime = 40;
            rateLeaf = 60;
        }
        else if (0.5< e.progress && e.progress <= 0.7) {
            gameTime = 60;
            rateLeaf = 80;
        }
        else if (0.7< e.progress && e.progress <= 0.9) {
            gameTime = 90;
            rateLeaf = 120;
        }
        else{
            gameTime = 120;
            rateLeaf = 160;
        }
        this._gameLeaf = rateLeaf;
        this._gameTime = gameTime;
        gameTimeStr.getComponent(cc.Label).string = gameTime +"分钟";
        rateStr.getComponent(cc.Label).string = rateLeaf;
        var boolean = (rateLeaf > cc.module.self.leaf ? true : false);
        this.changLblColor(rateStr,boolean);
    },
    
    onlipaiTimeSlider:function (e) {
        var target = e.node;
        var progress = target.getChildByName("progress");
        var progressCpt = progress.getComponent(cc.ProgressBar);
        progressCpt.progress = e.progress;
        var gameTimeStr = cc.find("content/time/lbl_time",this.gameTiemItem);
        var rateStr = cc.find("content/rate/lbl_rate",this.gameTiemItem);
        var gameOutTime;
        if(e.progress <= 0.1){
            gameOutTime = 30;
        }
        else if (0.1 < e.progress && e.progress <=0.3) {
            gameOutTime = 40;
        }
        else if (0.3 < e.progress && e.progress <=0.5) {
            gameOutTime = 50;
        }
        else if (0.5 < e.progress && e.progress <= 0.7) {
            gameOutTime = 60;
        }
        else if (0.7 < e.progress && e.progress <= 0.9) {
            gameOutTime = 90;
        }
        else{
            gameOutTime = 120;
        }
        this._cscp = gameOutTime;
        var gameOutTimeStr = cc.find("content/time/lbl_time",this.lipaiTiemItem);
        gameOutTimeStr.getComponent(cc.Label).string = gameOutTime +"秒";
    },

    oncontrolSlider:function (e) {
        var allowDouble = this.controlItem.getChildByName("content").getChildByName("allow_in").getChildByName("lbl_num");
        var slider = this._controlSlider.getComponent(cc.Slider);
        var progressBg = cc.find("progress/bg",this._controlSlider);
        progressBg.width = slider.progress * 510;
        var double;
        if(e.progress <= 0.1){
            double = 4;
        }
        else if (0.1 < e.progress && e.progress <= 0.3) {
            double = 5;
        }
        else if (0.3 < e.progress && e.progress <= 0.5) {
            double = 6;
        }
        else if (0.5 < e.progress && e.progress <= 0.7) {
            double = 7;
        }
        else if (0.7 < e.progress && e.progress <= 0.9) {
            double = 8;
        }
        else{
            double = 9;
        }
        this._allowDouble = double;
        allowDouble.getComponent(cc.Label).string = double == 9 ? "无限" : double;
    },

    setWealth:function(){
        var wealth = this.wealthPanel.getChildByName("wealth").getChildByName("title").getChildByName("lbl_wealth");
        var lblWealth = wealth.getComponent(cc.Label);
        lblWealth.string = cc.module.self.gold;
        var boolean = (this._gameInGold > cc.module.self.leaf ? true : false);
        this.changLblColor(wealth,boolean);
    },

    changLblColor:function(node,isRed){
        isRed ? node.color = new cc.Color(255,0,0,255) : node.color = new cc.Color(255,255,255,255);
    },

    onClickOnOff:function(e){
        var btn = e.target;
        btn.children[0].active = !(btn.children[0].active);
        btn.children[1].active = !(btn.children[1].active);
    },

    onClickAllowIn:function(e){
        var btn = e.target;
        btn.children[0].active = !(btn.children[0].active);
        btn.children[1].active = !(btn.children[1].active);
        this._allowIn = (btn.children[1].active);
    },  

    onClickNumOfPerson:function(e,num){
        console.log(num);
        var lessPerson = this.gaojiPanel.getChildByName("game_less_person").getChildByName("type");
        var two = lessPerson.children[0];
        var three = lessPerson.children[1];
        var four = lessPerson.children[2];
        num = parseInt(num);
        switch (num) {
            case 2:
                two.active = true;
                three.active = false;
                four.active = false;
                this._lessPerson = 2;
                two.getComponent(cc.Toggle).isChecked = true;
                three.getComponent(cc.Toggle).isChecked = false;
                four.getComponent(cc.Toggle).isChecked = false;
                break;
            case 3:
                two.active = true;
                three.active = true;
                four.active = false;
                break;
            default:
                two.active = true;
                three.active = true;
                four.active = true;
                break;
        }
    },

});
