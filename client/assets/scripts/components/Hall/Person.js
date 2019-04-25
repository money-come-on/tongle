cc.Class({
    extends: cc.Component,

    properties: {
        defaultHeadImg:cc.SpriteFrame,
        manImg:cc.SpriteFrame,
        womenImg:cc.SpriteFrame,
        headimg:cc.Sprite,
        editBox:cc.EditBox,

        lblLeaf:cc.Label,
        lblGold:cc.Label,
        _lblName:cc.Label,
        _lblID:cc.Label,
        _lblIP:cc.Label,
        _lblSex:cc.Label
    },
    onLoad(){
    	if(cc.module.self == null) {
            return;
        }
        var name = cc.find("frame/lbl_name",this.node);
        var id = cc.find("frame/id_panel/lbl_id",this.node);
        var sex = cc.find("frame/sex",this.node);
        var ip = this.node.getChildByName("ip");
        this._lblID = id.getComponent(cc.Label);
        this._lblName = name.getComponent(cc.Label);
        if(sex) {
            this._lblSex = sex.getComponent(cc.Label);
            this._sexImg = sex.getComponent(cc.Sprite);
        }
        this.setHeadImg();
        this.setName(cc.module.self.nickname);
        this.setID(cc.module.self.userId);
        // this.setIP(cc.module.self.ip);
        this.setSex(cc.module.self.sex);
        this.setSexImg(cc.module.self.sex);
        cc.module.socket.on(SEvents.RECEIVE_WEALTH,this.onReceiveWealth.bind(this));
        cc.module.socket.on(SEvents.RETURNLEAF,this.onReceiveReturnLeaf.bind(this));
        cc.module.socket.on(SEvents.EVENT_CHANGE_NAME,this.onReceiveChangeName.bind(this));
    },

    start () {
    	this.setWealth(cc.module.self);
        this.refresh();
    },
    refresh:function () {
        cc.module.socket.send(SEvents.SEND_WEALTH,null,true);
    },
    onReceiveWealth:function (data) {
        if(!cc.isValid(data.errcode)) {
            this.setWealth(data);
        }
    },
    onReceiveReturnLeaf:function(data){
        if(this.lblLeaf){
            this.lblLeaf.string += parseInt(data);
            var lblLeaf = cc.find("edit_name/content/gold/had/lbl_gold",this.node);
            lblLeaf.getComponent(cc.Label).string = this.lblLeaf.string;
        }
    },
    setWealth:function (data) {
        if(this.lblLeaf) {
            this.lblLeaf.string = data.leaf;
            // var lblLeaf = this.node.getChildByName("edit_name").getChildByName("content").getChildByName("gold").getChildByName("had").getChildByName("lbl_gold");
            var lblLeaf = cc.find("edit_name/content/gold/had/lbl_gold",this.node);
            lblLeaf.getComponent(cc.Label).string = data.leaf;
        }
        if(this.lblGold){
            this.lblGold.string = data.gold;
        }
    },

    setHeadImg() {
        cc.module.imageCache.getImage(cc.module.self.userId,function (spriteFrame) {
            if(!this.node) {
                return;
            }
            if(spriteFrame) {
                this.headimg.spriteFrame = spriteFrame;
            }
            else {
                this.headimg.spriteFrame = this.defaultHeadImg;
            }
        }.bind(this))
    },

    setName(name) {
        if(this._lblName) {
            this._lblName.string = name;
        }
    },

    setID(id) {
        if(this._lblID) {
            this._lblID.string = id;
        }
    },

    setIP(ip) {
        if(this._lblIP) {
            this._lblIP.string = "IP:"+ip;
        }
    },

    setSex(sex) {
        if(this._lblSex) {
            sex = sex==1?"男":"女";
            this._lblSex.string = "性别:"+sex;
        }
    },

    setSexImg(sex){
        if(this._sexImg){
            sex = sex==1?this.manImg:this.womenImg;
            this._sexImg.spriteFrame = sex;
        }
    },

    onClickSet(){
    	var hallCpt = cc.find("Canvas").getComponent("Hall");
    	hallCpt && hallCpt.onClickSet();
    },
    
    onClickMall(){
    	var hallCpt = cc.find("Canvas").getComponent("Hall");
    	hallCpt && hallCpt.onClickMall();
    },

    onClickChangeName(){//修改姓名
        var name = this.editBox.string;
        var needNode = cc.find("edit_name/content/gold/pay/lbl_need",this.node);
        var lblNeed = needNode.getComponent(cc.Label).string;
        console.log(lblNeed)
        console.log(name,name.length)
        if(name!="" && name.length>0){
            console.log(cc.module.self.leaf>lblNeed)
            if(cc.module.self.leaf>lblNeed){
                var data = {
                    name:name,
                    userId:cc.module.self.userId,
                    need:lblNeed
                }
                cc.module.socket.send(SEvents.EVENT_CHANGE_NAME,data,true);
            }
            else{
                cc.module.wc.show("钻石不足，请前往商城充值!",true);
            }
        }
        else{
            cc.module.wc.show("请输入昵称",true);
        }
    },

    onReceiveChangeName(data){
        console.log(data)
        var pop = this.node.getChildByName("edit_name").getComponent("Pop");
        pop && pop.unpop();
        cc.module.wc.show(data.msg,true);
        if(!data.errcode){
            cc.module.self.nickname = data.name;
            this.setName(cc.module.self.nickname);
        }
        this.editBox.string = "";
    },

    // update (dt) {},
});
