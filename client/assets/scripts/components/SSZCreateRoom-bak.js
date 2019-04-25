cc.Class({
    extends: cc.Component,
    properties: {
        defaultMode:cc.Node,
        classicMode:[cc.Node],
        daodaobiMode:[cc.Node],
        aalabel:cc.Label,
        fzlabel:cc.Label,
        // rateContent:cc.Node,
        _numOfGame:null,
        _selectMode:null,
        _classic:null,
        _form:null,
        _numOfPerson:null,
        _isAA:null,
        _baseScore:null,
        _recordSelectHorseCardCpt:null
    },

    onLoad: function () {
        this._cMode = 1;
        this._dMode = 0;
        this._numOfGame = 20;
        this._numOfPerson = 4;
        this._isAA = false;
        this._selectMode = {0:0,1:0};
        this._baseScore = 1;
        this._classic = true;
        this._noSpecial = false;
        this._noKing = true;
        this._isGun = true;
        this._classicSelect = 0;
        this._daodaobiSelect = 0;        
    },

    start:function(){
        this.onclickRate(null,1);
        setTimeout(function(){
            this.classicMode.forEach(function(radio,index){
                radio.getComponent(cc.Toggle).isChecked = index ==1;
                var toggle = radio.getComponent(cc.Toggle);
            })
        }.bind(this),10)
    },

    onClickNumOfGame:function (e,num) {
        this._numOfGame = parseInt(num);
        var SszRate = cc.module.serverInfo.SszRate;
        var AArate = [
            SszRate.PersonWith4AndGameWith10,
            SszRate.PersonWith4AndGameWith15,
            SszRate.PersonWith4AndGameWith20,
            SszRate.PersonWith4AndGameWith30
        ]
        var gameMum = [10,15,20,30];
        var index = 2;
        for(var i=0;i<gameMum.length;i++){
            if(gameMum[i]==this._numOfGame){
                index = i;
            }
        }
        this.aalabel.string = "AA制("+AArate[index]+"钻石)";
        this.fzlabel.string = "房主制("+AArate[index]*4+"钻石)";
    },

    onclickBaseScore:function (e,data) {
        this._baseScore = parseInt(data);
    },

    onClickConfirm:function (e,data) {
        var clubId = null;
        if(cc.isClubId){
            clubId = cc.module.self.clubId;
        };
        cc.module.audioMgr.playUIClick();
        this.ctorForm();
        var data = {
            account:cc.module.self.account,
            sign:cc.module.self.sign,
            form:this._form, 
            clubId:clubId,
            game:"ssz",
        };
        // console.log(data.form);  return ;
        cc.module.socket.send(SEvents.SEND_CREATE_ROOM,data,true);
        var pop = this.getComponent("Pop");
        pop.unpop();
    },

    formReset:function () {
        this._form = {
            numOfGame:10,
            numOfPerson:4,
            rateAA:true,
            baseScore:null,
            classic:null,
            isGun:true,
            noKing:true,
            noSpecial:true,
        };
    },
   
    ctorForm:function () {
        this.formReset();
        this._form.numOfPerson = this._numOfPerson;
        this._form.numOfGame = this._numOfGame;
        this._form.rateAA = this._isAA;
        this._form.baseScore = this._baseScore;
        this._form.classic = this._classic;
        this._form.isGun = this._isGun;
        this._form.noKing = this._noKing;
        this._form.noSpecial = this._noSpecial;
       
    },

    setNumOfPerson:function (num) {
        num = parseInt(num);
        this._numOfPerson = num;
    },

    onclickRate:function(e,data){
        this._isAA = (parseInt(data) == 0);
    },

    clickSelectMode:function(e,data){
        if(e.node.parent.parent.name == "classic" ){
            this._noSpecial = parseInt(data) == 0;
            this._isGun = true;
            this._noKing = true;
            this._classicSelect = parseInt(data);
            this._classic && (this._cMode = parseInt(data) );
        }

        if(e.node.parent.parent.name == "daodaobi" ){
            this._noKing = parseInt(data) == 0;
            this._isGun = (parseInt(data) == 2);
            this._noSpecial = true;
            this._daodaobiSelect = parseInt(data)
            !this._classic && (this._dMode = parseInt(data));
        }
        // 不是经典模式，却点击经典模式下的选项 不显示
        if(e.node.parent.parent.name == "classic" && !this._classic){ // 
            e.isChecked = false;
        }
        if(e.node.parent.parent.name == "daodaobi" && this._classic){
            e.isChecked = false;
        }
    },

    clickMode:function(e,data){
        this._classic = (parseInt(data) == 0);
        this._classic ? (this._noKing = true,this._isGun == true):(this._noSpecial = true,this._isGun = this._daodaobiSelect == 2);
        this.changeMode(e,data)
    },

    changeMode :function(e,data){
        var group = e.node.getChildByName("group");
        var mode = this._classic ? this._cMode :this._dMode;
        var radio = group.children[mode];
        radio.getComponent(cc.Toggle).isChecked = true;
    },
    
    onclickPlayMode:function(e,data){
    },
});
