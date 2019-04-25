cc.Class({
    extends: cc.Component,

    properties: {
        // 
        operate:cc.Node,    // 操作
        club:cc.Node,       // 当前俱乐部
        clubInfo:cc.Node,   // 俱乐部信息
        creatNode:cc.Node,  // 创建俱乐部
        leaveNode:cc.Node,  // 离开俱乐部
        deleteNode:cc.Node, // 删除玩家
        joinNode:cc.Node,   // 加入俱乐部
        clubPlayersNode:cc.Node,
        playerDetail:cc.Node,
        keyboard:cc.Node,       // 键盘
        record:cc.Node,
        
        clubContent:cc.Node,
        clubName:cc.EditBox,
        clubNotice:cc.EditBox,

        nums:{
            default:[],
            type:[cc.Label]
        },

        chipValue:cc.Label,

        _numIndex:0,
        _clubInfo:null,
        _deleteUser:null,
        _applyJoin:null ,
        _clubRoom:null,
    },

    onLoad: function () {
        this._code = null;
        this._addUserId = null;
        this._chipValue = "";
        this._clubInfo = null;
        this._applyJoin = null;
        this._addType = null;
        cc.module.ClubData = null;
        this.addSocketEventHandler();
    },

    start:function(){
        this.club.active = false;
        if(cc.module.self.clubId){
            cc.module.socket.send(SEvents.GET_CLUB_EVENT,{clubId:cc.module.self.clubId},true);
            this.operate.active = false;
        }else{
            this.operate.active = true;
        }
    },
    
    playUIClick:function(){
        cc.module.audioMgr.playUIClick();
    },

    updataPlayerChip:function(userId,num,code){
        var player = this.getClubPlayer(userId);
        if(!player){
            return;
        }
        var all=0;
        if(code == 1){
            all = (Number(player.gold) + Number(num)).toFixed(1)
        }else{
            all = (Number(player.gold) - Number(num)).toFixed(1)
        }
        player && (player.gold = all);

        var scrollview = this.clubPlayersNode.getChildByName("scrollView");
        var scrollViewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollViewCpt.content;
        content.children.forEach(function(item){
            if(item._userId == userId){
                var gold = item.getChildByName("gold").getChildByName("num");
                var chip = gold.getComponent(cc.Label).string;
                if(code ==1){
                    var total = Number(chip) + Number(num);
                    gold.getComponent(cc.Label).string = total.toFixed(1)
                    // gold.getComponent(cc.Label).string += Number(num);
                }else{
                    var total = Number(chip) - Number(num);
                    gold.getComponent(cc.Label).string = total.toFixed(1)
                    // gold.getComponent(cc.Label).string -= Number(num);
                }
            }
        })
    },

    getClubPlayer:function(userId){
        if(!this._clubInfo){
            return;
        }
        var players = this._clubInfo.players;
        if(!players){
            return;
        }
        for(var i=0;i<players.length;i++){
            var player = players[i];
            if(player && player.userId == userId){
                return player;
            }
        }
        return null;
    },

    onAddChipNum:function(e,data){
        cc.module.audioMgr.playUIClick();
        var userId = data.userId;
        this._addUserId = userId;
        var code = data.code;
        var notice = this.keyboard.getChildByName("notice");
        notice.active = false;
        if(code == 0){
            var player = this.getClubPlayer(userId);
            cc.module.socket.send(SEvents.GET_PLAYER_CHIP_EVENT,{userId:userId},false)
        }
        if(!this._addUserId){
            cc.module.wc.show("请选择玩家",true);
            return
        }
        this.keyboard.active = true;
        cc.module.utils.toTop(this.keyboard);
        this._code = code;
        this._chipValue = "";
        this.chipValue.string = this._chipValue;
    },

    // 输入金额
    onClickChipNum:function(e,num){
        cc.module.audioMgr.playUIClick();
        if(this._chipValue.length >= 8 ){
            // console.log(this._chipValue);
            return;
        }
        this._chipValue += num;
        this.chipValue.string = this._chipValue;
    },

    // 重置数量
    onResetChipNum:function(){
        cc.module.audioMgr.playUIClick();
        this._chipValue = "";
        this.chipValue.string = this._chipValue;
    },

    // 删除数量
    onDeleteChipNum:function(){
        cc.module.audioMgr.playUIClick();
        this._chipValue = this._chipValue.substring(0,(this._chipValue.length-1) );
        this.chipValue.string = this._chipValue;
    },

    onSureAddChip:function(e,code){
        cc.module.audioMgr.playUIClick();
        if(code == 0){
            this._chipValue = "";
            this.chipValue.string = this._chipValue;
            this._addUserId = null;
            this._addType = null;
        }else{
            var chipNum = this.chipValue.string;
            var userId = this._addUserId;
            if(this._code ==0){
                var player = this.getClubPlayer(userId);
                var gold = player.gold;
                if(chipNum>gold){
                    cc.module.wc.show("已超出可下分范围",true);
                    return;
                }
            }
            if(this._addType =="club"){
                var data = {
                    num:chipNum,
                    userId:cc.module.self.userId,
                    clubId:this._clubInfo.info.clubId,
                }
                cc.module.socket.send(SEvents.ADD_CLUB_LEAF_EVENT,data,false);
            }else{
                var data = {
                    chipNum:chipNum,
                    addId:userId,
                    userId:cc.module.self.userId,
                    clubId:this._clubInfo.info.clubId,
                    code:this._code
                }
                cc.module.socket.send(SEvents.ADD_CHIP_EVENT,data,false);
            }
        }
        this._addType = null;
        this.keyboard.active = false;
        this.onResetChipNum();
    },

    // 更新俱乐部公告
    onChangClubNotice:function(e,num){
        cc.module.audioMgr.playUIClick();
        var btnAgree = this.clubNotice.node.getChildByName("agree");
        var btnDisagree = this.clubNotice.node.getChildByName("disagree");
        btnAgree.active = false;
        btnDisagree.active = false;
        if(num != 0){
            // 发送
            var data = {};
            data.msg = this.clubNotice.string;
            data.clubId = cc.module.self.clubId;
            cc.module.socket.send(SEvents.UPDATE_CLUB_NOTICE_EVENT,data);
        }else{
            this.clubNotice.string = this._clubInfo.info.notice?this._clubInfo.info.notice:"";
        }
    },

    // 编辑俱乐部公告
    onEditClubNotice:function(){
        cc.module.audioMgr.playUIClick();
        var str = this.clubNotice.string;
        if(!str){
            return;
        }
        var btnAgree = this.clubNotice.node.getChildByName("agree");
        var btnDisagree = this.clubNotice.node.getChildByName("disagree");
        if(str != this._clubInfo.info.notice){
            btnAgree.active = true;
            btnDisagree.active = true;
        }
    },

    //  更新俱乐部名
    onChangClubName:function(e,num){
        cc.module.audioMgr.playUIClick();
        var btnAgree = this.clubName.node.getChildByName("agree");
        var btnDisagree = this.clubName.node.getChildByName("disagree");
        btnAgree.active = false;
        btnDisagree.active = false;
        if(num !=0){
            var data = {};
            data.msg = this.clubName.string;
            data.clubId = cc.module.self.clubId;
            cc.module.socket.send(SEvents.UPDATE_CLUB_NAME_EVENT,data);
        }else{
            this.clubName.string = this._clubInfo.info.name
        }
    },

    //  编辑俱乐部名
    onEditClubName:function(){
        cc.module.audioMgr.playUIClick();
        var str = this.clubName.string;
        if(!str){
            return;
        }
        var agree = this.clubName.node.getChildByName("agree");
        var disagree = this.clubName.node.getChildByName("disagree");
        if(str != this._clubInfo.info.name){
            agree.active = true;
            disagree.active = true;
        }
    },

    // 输入数字
    onClickNum:function(e,num){
        cc.module.audioMgr.playUIClick();
        num = Number(num);
        if(this._numIndex >= this.nums.length){
            return;
        }
        this.nums[this._numIndex].string = num;
        this._numIndex += 1;
         if(this._numIndex == this.nums.length){
            var clubId = this.parseClubID();
            // 查询是否存在俱乐部
            cc.module.socket.send(SEvents.SELECT_CLUB_EVENT,{clubId:clubId},true)
        }
    },

    //转换成数字类型
    parseClubID:function(){
        var str = "";
        for(var i = 0; i < this.nums.length; ++i){
            str += this.nums[i].string;
        }
        return str;
    },

    onClickReset:function(){
        cc.module.audioMgr.playUIClick();
        for(var i = 0; i < this.nums.length; ++i){
            this.nums[i].string = "";
        }
        this._numIndex = 0;
        this.resetBtn();
        this.showApplyClubInfo(0,null,"");
    },

    showBtn:function(){
        var btnClubInfo = this.club.getChildByName("btn_club_info");
        btnClubInfo.active = true;
        btnClubInfo.opacity = 255;
        var btnClub = cc.find("Canvas/room_panel/btn_club");
        btnClub.opacity = 255;
    },

    startMsgAction(node){
        if(!node){
            return;
        }
        this.stopMsgAction(node);
        var btnClub = cc.find("Canvas/room_panel/btn_club");
        node._num = 1;
        node.active = true;
        node.opacity = 255;
        node._status = 1; // 1 表示显示状态
        node._fn = function(){
            if(node._status === 1){ // 如果是显示状态
                if(node._num >=6){
                    node._status=0;
                    node._num = 0;
                    node.opacity = 0;
                    btnClub.opacity = 0;
                }
            }else{
                if(node._num>=4){
                    node._status=1;
                    node._num = 0;
                    node.opacity = 255;
                    btnClub.opacity = 255;
                }
            }
            node._num++;
        }
        this.schedule(node._fn,0.1);
    },

    stopMsgAction(node){
        if(!node){
            console.log(" -- 难道是这里？ -- ")
            return;
        }
        this.unschedule(node._fn);
        setTimeout(function(){
            node.active = true;
            node.opacity = 255;
            node._num = 0;
            node._status = 1; // 1 表示显示状态
            var btnClub = cc.find("Canvas/room_panel/btn_club");
            btnClub.opacity = 255;
        },100)
    },

    resetBtn:function(){
        var panel = this.joinNode.getChildByName("panel");
        var btnJoin = panel.getChildByName("info").getChildByName("join_btn");
        var btnCpt = btnJoin.getComponent(cc.Button);
        var notice = panel.getChildByName("info").getChildByName("notice");
        notice.getComponent(cc.Label).string = "" ;
        btnCpt.active = false;
        btnCpt.clickEvents[0].customEventData = null;
    },

    onClickDel:function(){
        cc.module.audioMgr.playUIClick();
        if(this._numIndex > 0){
            this._numIndex -= 1;
            this.nums[this._numIndex].string = "";
        }
        this.resetBtn();
    },

    getPlayerRecharge:function(e,info){
        var getAll = false;
        var clubId = this._clubInfo.info.clubId;
        var userId = info.userId;
        var data = {
            getAll:getAll,
            clubId:clubId,
            userId:userId
        }
        // console.log(data);
        cc.module.socket.send(SEvents.GET_CLUB_RECHARGE_EVENT,data,false);
    },

    getRecharge:function(e,data){
        var getAll = cc.module.self.userId == this._clubInfo.info.creator;
        var clubId = this._clubInfo.info.clubId;
        var data = {
            getAll:getAll,
            clubId:clubId,
        }
        // console.log(data);
        cc.module.socket.send(SEvents.GET_CLUB_RECHARGE_EVENT,data,true);
    },

    onJoinClub:function(e,clubId){
        cc.module.audioMgr.playUIClick();
        if(!clubId){
            return;
        }
        var data = {};
        data.clubId = clubId;
        cc.module.socket.send(SEvents.APPLY_JOIN_EVENT,data,true);
    },

    setApplyJoin:function(data){
        var btnClubInfo = this.club.getChildByName("btn_club_info");
        var applyNode = this.clubInfo.getChildByName("apply_item");
        var scrollview = applyNode.getChildByName("scrollView");
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollviewCpt.content;
        var item = scrollview.getChildByName("item");
        for(var userId in data){
            if(data[userId]){
                var newItem = cc.instantiate(item);
                var desc = newItem.getChildByName("desc");
                var agreeBtn = newItem.getChildByName("agree");
                var disAgreeBtn = newItem.getChildByName("disagree");
                desc.getComponent(cc.Label).string = data[userId].name.slice(0,6)+" 申请加入俱乐部";
                cc.module.utils.addClickEvent(agreeBtn,this.node,"Club","onClickAgreeJoin",{agree:1,userId:userId} );
                cc.module.utils.addClickEvent(disAgreeBtn,this.node,"Club","onClickAgreeJoin",{agree:0,userId:userId} );
                newItem._userId = userId;
                newItem.active = true;
                content.addChild(newItem);
            }
        }   
        content.children.length >0 && this.startMsgAction(btnClubInfo);
    },

    addSocketEventHandler:function(){
        cc.module.socket.on(SEvents.DEDUCT_CLUB_LEAF_EVENT,this.onReceiveDeductClubLeaf.bind(this));
        cc.module.socket.on(SEvents.GET_CLUB_EVENT,this.onReceiveGetClub.bind(this));
        cc.module.socket.on(SEvents.CLUB_CREATE_EVENT,this.onReceiveCreateClub.bind(this));
        cc.module.socket.on(SEvents.GET_ALL_CLUB_EVENT,this.onReceiveGetAllClub.bind(this));
        cc.module.socket.on(SEvents.LEAVE_CLUB_EVENT,this.onReceiveLeaveClub.bind(this));
        cc.module.socket.on(SEvents.DISSOLVE_CLUB_EVENT,this.onReceiveDissolveClub.bind(this));

        cc.module.socket.on(SEvents.DELETE_USER_EVENT,this.onReceiveDeleteUser.bind(this));
        cc.module.socket.on(SEvents.AGREE_JOIN_EVENT,this.onReceiveAgreeJoin.bind(this));
        cc.module.socket.on(SEvents.APPLY_JOIN_EVENT,this.onReceiveApplyJoin.bind(this));
        cc.module.socket.on(SEvents.SELECT_CLUB_EVENT,this.onReceiveSelectClub.bind(this));
        cc.module.socket.on(SEvents.PLAYER_DEEDS_EVENT,this.onReceivePlayerDeeds.bind(this));
        cc.module.socket.on(SEvents.UPDATE_CLUB_NAME_EVENT,this.onReceiveUpdataName.bind(this));
        cc.module.socket.on(SEvents.UPDATE_CLUB_NOTICE_EVENT,this.onReceiveUpdataNotice.bind(this));

        cc.module.socket.on(SEvents.IS_IN_ROOM_EVENT,this.onReceiveIsInRoom.bind(this));
        cc.module.socket.on(SEvents.CREATE_CLUB_ROOM_EVENT,this.onReceiveCreateRoom.bind(this));
        cc.module.socket.on(SEvents.DISSOLVE_CLUB_ROOM_EVENT,this.onReceiveDissolveRoom.bind(this));
        cc.module.socket.on(SEvents.ENTER_CLUB_ROOM_EVENT,this.onReceiveEnterRoom.bind(this));
        cc.module.socket.on(SEvents.GET_PLAYER_CHIP_EVENT,this.onReceiveGetPlayerChip.bind(this));

        cc.module.socket.on(SEvents.GET_PLAYER_DETAIL_EVENT,this.onReceiveGetPlayerDetail.bind(this));
        cc.module.socket.on(SEvents.ADD_CLUB_LEAF_EVENT,this.onReceiveAddClubLeaf.bind(this));
        cc.module.socket.on(SEvents.GET_CLUB_RECHARGE_EVENT,this.onReceiveGetRecharge.bind(this));

        cc.module.socket.setOnReConnectListen(this.onReConnection.bind(this));
    },

    onReceiveGetRecharge:function(data){
        if(data.errcode){
            cc.module.wc.show(data.msg,true);
            return;
        }
        // console.log(data);
        var hint = this.record.getChildByName("club_panel_bg").getChildByName("hint");
        var total = this.record.getChildByName("club_panel_bg").getChildByName("total");
        var scrollview = this.record.getChildByName("club_panel_bg").getChildByName("scrollview");
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollviewCpt.content;
        var item = scrollview.getChildByName("item");
        var Lower =0,add = 0;
        content.removeAllChildren();
        data.forEach(function(obj){
            var newItem = cc.instantiate(item);
            var time = newItem.getChildByName("time");
            var result = newItem.getChildByName("result");
            var userId = newItem.getChildByName("userId");
            time.getComponent(cc.Label).string = obj.time;
            userId.getComponent(cc.Label).string = obj.userId;
            result.getComponent(cc.Label).string = obj.num ? obj.num:0;
            newItem.active = true;
            content.addChild(newItem);
            var num = Number(obj.num);
            num>=0 ?add+=num:Lower += num;
        })
        total.getChildByName("up").getComponent(cc.Label).string = "上分："+add;
        total.getChildByName("down").getComponent(cc.Label).string = "下分："+Lower;
        hint.active = data.length <=0;
        this.record.active = true;
        cc.module.utils.toTop(this.record);
    },

    onReceiveDeductClubLeaf:function(data){
        this._clubInfo.info.leaf -= Number(data.rate);
        var leafItem = this.clubInfo.getChildByName("leaf_item");        
        leafItem.getChildByName("msg").getComponent(cc.Label).string = this._clubInfo.info.leaf;
    },

    onReConnection:function(){
        cc.director.loadScene("login");
    },
    onReceiveAddClubLeaf:function(data){
        // console.log(data)
        if(data.errcode){
            cc.module.wc.show(data.errmsg,true);
            return
        }
        cc.module.wc.show("充值成功",true)
        this._clubInfo.info.leaf += Number(data.num);
        var leafItem = this.clubInfo.getChildByName("leaf_item");        
        leafItem.getChildByName("msg").getComponent(cc.Label).string = this._clubInfo.info.leaf;
        var weath = cc.find("Canvas/wealth_panel");
        var gold = weath.getChildByName("leaf_panel");
        var label = gold.getChildByName("lbl_leaf");
        var num =  label.getComponent(cc.Label).string;
        label.getComponent(cc.Label).string = Number(num) - Number(data.num);
    },
    onReceiveGetPlayerDetail:function(data){
        if(data.errcode){
            cc.module.wc.show(data.errmsg,true);
            return
        }
        // console.log(data);
        this.playerDetail.active = true;
        var panel = this.playerDetail.getChildByName("club_panel_bg");
        var scrollview = panel.getChildByName("scrollview");
        var hint = panel.getChildByName("hint");
        scrollview.active = data.length>0;
        hint.active = data.length <=0;
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollviewCpt.content;
        var item = scrollview.getChildByName("item");
        content.removeAllChildren();
        if(data.length>0){
            data.forEach(function(detail){
                var newItem = cc.instantiate(item);
                // var headimg = newItem.getChildByName("headimg");
                var time = newItem.getChildByName("time");
                var roomId = newItem.getChildByName("roomId");
                var result = newItem.getChildByName("result");
                time.getComponent(cc.Label).string = detail.time;
                roomId.getComponent(cc.Label).string = detail.roomId;
                result.getComponent(cc.Label).string = detail.num;
                newItem.active = true;
                content.addChild(newItem)
            })

        }
    },

    onReceiveGetPlayerChip:function(data){
        // console.log(data)
        var gold = data.gold;
        var notice = this.keyboard.getChildByName("notice");
        notice.getComponent(cc.Label).string = "最多可下"+gold+"分";
        notice.active = true;
    },

    onReceiveDissolveClub:function(data){
        if(data.errcode){
            cc.module.wc.show(data.errmsg,true);
            return;
        }
        this.club.active = false;
        this.operate.active = true;
        this.leaveNode.active = false;
        this.clubInfo.active = false;
        this._clubInfo = null;
        this.clearRooms();
        cc.module.ClubData = null;
        var weath = cc.find("Canvas/wealth_panel");
        var gold = weath.getChildByName("gold_panel");
        gold.getChildByName("lbl_gold").getComponent(cc.Label).string = 0;
        cc.module.wc.show(data.msg,true)
    },

    getRoomType :function(type,config){
        var msg = "";
        if(type ==1){
            // 十三张
            var numOfPerson = config.numOfPerson;
            var numOfGame = config.numOfGame;
            var noSpecial = config.noSpecial;
            var gunsRule = config.gunsRule;
            var noKing = config.noKing;
            var baseScore = config.baseScore;

            msg = numOfPerson+"人，"+numOfGame+"局，"+(noKing?"无王，":"有王，")+(noSpecial?"无特殊牌，":"有特殊牌，")+"底分"+baseScore+"分";
        }
        else if(type ==2){
            // 牛牛
            var baseConfig = this.checkConfig(config);
            var str = "";
            for(var prop in baseConfig){
                if( typeof baseConfig[prop] == 'string' ){
                    msg += baseConfig[prop]+" ";
                }else{
                   /*{0:...,1:....,}
                   */
                    if( typeof config[prop] == 'number'){
                        str += baseConfig[prop][ config[prop] ]+" ";
                    }
                   
                }
                
            }
            // console.log(str);
            // console.log(msg);
        }else if(type ==3){
            var numOfPlayer = config.numOfPlayer;
            var numOfGame = config.numOfGame;
            var baseScore = config.baseScore;
            var time = config.time;
            msg = numOfPlayer+"人，"+numOfGame+"局，"+"底分： "+baseScore+"分，下注时间："+time+"秒";
        }
        return msg;
    },

    getBaseConfig :function() {
        return {
            "mode":{
                "0":"牛牛上庄",
                "1":"固定庄家",
                "2":"通比牛牛",
                "3":"明牌抢庄",
                "4":"江华牛牛",
                "5":"广西牛牛"
            },
            "baseScore":{
                "0":"1/2",
                "1":"2/4",
                "2":"4/8"
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
                "1":"20",
                "2":"30",
                "3":"99999"
            },
            "rate":{
                "0":"房主支付",
                "1":"房费AA"
            },
            "double":{
                "0":"牛牛X4 牛九X3 牛八X2 牛七X2",
                "1":"牛牛X3 牛九X2 牛八X2",
                "2":"牛牛X3 牛九X2 牛八X2 牛七X2"
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
            "fiveSmallCow":"五小牛（8倍）",
            "bombCow":"炸弹牛（6倍）",
            "idleBetting":"闲家推注",
            "disTwist":"禁止搓牌",
            "disJoin":"禁止加入"
        }
    },

    checkConfig:function(config) {
        var baseConfig = this.getBaseConfig();
        switch (config.mode) {
            case 0:
                delete baseConfig.bankerLimitScore;
                delete baseConfig.maxGrabBanker;
                break;
            case 1:
                delete baseConfig.maxGrabBanker;
                break;
            case 2:
                delete baseConfig.bankerLimitScore;
                delete baseConfig.maxGrabBanker;
                delete baseConfig.baseScore;
                break;
            case 3:
                delete baseConfig.bankerLimitScore;
                break;
            case 4:
                delete baseConfig.bankerLimitScore;
                delete baseConfig.maxGrabBanker;
                if(config.jhMode==JH_MODE.BANKER) {
                    delete baseConfig.tbScore;
                }
                else {
                    delete baseConfig.baseScore;
                }
                delete baseConfig.double;
                config.fiveSmallCow = false;
                config.fiveFlowerCow = false;
                break;
            case 5:
                delete baseConfig.bankerLimitScore;
                delete baseConfig.maxGrabBanker;
                if(config.gxMode==GX_MODE.BANKER) {
                    delete baseConfig.tbScore;
                }
                else {
                    delete baseConfig.baseScore;
                }
                config.bombCow = false;
                config.fiveSmallCow = false;
                break;
        }
        return baseConfig;
       
    },

    onReceiveIsInRoom:function(data){
        var code = data.code; // 0表示在大厅
        var userId = data.userId;
        var scrollview = this.club.getChildByName("players").getChildByName("scrollView");
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollviewCpt.content;
        content.children.forEach(function(item){
            if(item._userId == userId){
                var online = item.getChildByName("online");
                online.getComponent(cc.Label).string = (code == 1)? "大厅":"房间";
                online.color = player.onlineStatus?cc.color(54,175,23,255):cc.color(255,0,0,255);
                online.getComponent(cc.LabelOutline).color = player.onlineStatus?cc.color(54,175,23,255):cc.color(255,0,0,255);
            }
        })

    },

    onStartGame:function(e,roomId){
        cc.module.audioMgr.playUIClick();
        if( cc.inGame ){
            cc.module.wc.show("正在进入房间");
            cc.director.loadScene(cc.inGame);
            return;
        };
        if(!roomId){
            return;
        }
        var data = {};
        data.roomId = roomId;
        data.clubId = cc.module.self.clubId;
        cc.module.socket.send(SEvents.ENTER_CLUB_ROOM_EVENT,data,true);
        cc.module.wc.show("正在加入房间"+roomId,true);
    },

    onReceiveCreateRoom:function(data){
        var rooms = this.club.getChildByName("rooms");
        var scrollview = rooms.getChildByName("scrollView");
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollviewCpt.content;
        if(data.code !==1){
            var roomId = data.roomId;
            content.children.forEach(function(item){
                if(item._roomId == roomId){
                    item.destroy();
                }
            })
            delete this._clubInfo.rooms[roomId];
        }else{
            var roomInfo = data.roomInfo;
            var config = roomInfo.config;
            var roomId = roomInfo.roomId;
            var item = scrollview.getChildByName("item");
            var newItem = cc.instantiate(item);
            var type = newItem.getChildByName("type");
            var desc = newItem.getChildByName("desc");
            var btnStart = newItem.getChildByName("btn_club_start");
            var num = newItem.getChildByName("person_bg").getChildByName("num");
            var gameType = ["","十三张","牛牛"];

            type.getComponent(cc.Label).string = gameType[roomInfo.type];
            desc.getComponent(cc.Label).string = this.getRoomType(roomInfo.type,roomInfo.config);
            if(roomInfo.type == 1){ // "十三张"
                num.getComponent(cc.Label).string = roomInfo.players.length+"/"+roomInfo.config.numOfPerson;
            }
            else if(roomInfo.type == 2){// "牛牛"
                num.getComponent(cc.Label).string = roomInfo.players.length+"/6";
            }
            // else if( roomInfo.type == 3){ // 铜宝
            //     num.getComponent(cc.Label).string = roomInfo.players.length+"/"+roomInfo.config.numOfPlayer;
            // }
            newItem._roomId = roomId;
            newItem.active = true;
            cc.module.utils.addClickEvent(btnStart,this.node,"Club","onStartGame",roomId );
            content.addChild(newItem);
            !this._clubInfo.rooms && (this._clubInfo.rooms = {});
            this._clubInfo.rooms[roomId] = roomInfo
        }
        cc.module.ClubData = this._clubInfo;
    },

    onReceiveDissolveRoom:function(data){
        var roomId = data.roomId;
        var roomLists = this.club.getChildByName("roomLists");
        var scrollview = roomLists.getChildByName("scrollView");
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollviewCpt.content;
        content.children.forEach(function(item){
            if(item._roomId && item._roomId == roomId){
                item.destroy();
            }
        })
    },

    onReceiveEnterRoom:function(data){
        if(data.type == "ssz"){
            cc.director.loadScene("ssz_game");
        }else if(data.type =="nn"){
            cc.director.loadScene("game");
        }else{

        }

    },

    // 更新俱乐部公告
    onReceiveUpdataNotice:function(data){
        if(!data.result){
            console.log("更新公告失败");
        }
        this.clubNotice.string = data.msg;
    },

    // 更新俱乐部名
    onReceiveUpdataName:function(data){
        if(!data.result){
            console.log("更新俱乐部名失败");
        };
        this.clubName.string = data.msg;
    },

    // 玩家事迹
    onReceivePlayerDeeds:function(data){
        // code 代号 1表示房间 2 表示在线状态......
        var code =  data.code;
        var userId = data.userId;
        var clubId = data.clubId;
        var roomId = data.roomId;
        var isOnline = data.isOnline;
        var clubData = cc.module.ClubData;
        if(clubData && clubData.players[userId]){
            if(code ===1 ){
                clubData.players[userId].roomId = roomId;
            }
            if(code === 2){
                clubData.players[userId].onlineStatus = isOnline;
            }
            this.updatePlayerDeeds(data);
        }
        this._clubInfo = cc.module.ClubData;
    },

    // 在大厅是否要更新玩家是否在房间 ？
    updatePlayerDeeds:function(data){
        var scrollview = this.club.getChildByName("players").getChildByName("scrollView");
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollviewCpt.content;
        for(var i=0;i<content.children.length;i++){
            var item = content.children[i];
            if(item._userId === data.userId){
                var online = item.getChildByName("online");
                if(data.code ===1){
                    if(data.roomId && this._clubInfo.rooms && this._clubInfo.rooms[data.roomId]){
                        var room = this._clubInfo.rooms[data.roomId];
                        if(!data.inRoom){
                            for(var i=0;i<room.players.length;i++){
                               (room.players[i] == data.userId) && room.players.splice(i,1);
                            }
                        }else{
                            this._clubInfo.rooms[data.roomId].players.push(data.userId);
                        }
                    }
                    online.getComponent(cc.Label).string = data.roomId ? "游戏中":"大厅";
                    online.color = data.roomId ?cc.color(255,0,0,255):cc.color(54,175,23,255);
                    online.getComponent(cc.LabelOutline).color = data.roomId? cc.color(255,0,0,255):cc.color(54,175,23,255);
                }
                else if(data.code ===2){
                    online.getComponent(cc.Label).string = data.isOnline ? "在线":"离线";
                    online.color = data.isOnline?cc.color(54,175,23,255):cc.color(100,100,100,255);
                    online.getComponent(cc.LabelOutline).color = data.isOnline?cc.color(54,175,23,255):cc.color(100,100,100,255);
                }
                break;
            }
        }
        this.updateRoomPlayer(data);
        cc.module.ClubData = this._clubInfo;
    },

    updateRoomPlayer:function(data){
        var rooms = this.club.getChildByName("rooms");
        var scrollview = rooms.getChildByName("scrollView");
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollviewCpt.content;
        content.children.forEach(function(item){
            if(data.roomId == item._roomId && this._clubInfo.rooms &&  this._clubInfo.rooms[data.roomId]){
                var room = this._clubInfo.rooms[data.roomId];
                var btnStart = item.getChildByName("btn_start");
                var num = item.getChildByName("person_bg").getChildByName("num");
               if(room.type ==1){
                    num.getComponent(cc.Label).string = room.players.length+"/"+room.config.numOfPerson;
                }
                else if(room.type ==2){
                    num.getComponent(cc.Label).string = room.players.length+"/6";
                }
                // else if( room.type == 3){ // 铜宝
                //     num.getComponent(cc.Label).string = room.players.length+"/"+room.config.numOfPlayer;
                // }
            }
        }.bind(this));
    },

    // 选择俱乐部
    onReceiveSelectClub:function(data){
        // console.log(data); //return
        var panel = this.joinNode.getChildByName("panel")
        var notice = panel.getChildByName("info").getChildByName("notice");
        var btnJoin = panel.getChildByName("info").getChildByName("join_btn");
        var btnCpt =  btnJoin.getComponent(cc.Button);
        btnCpt.active = data.clubId?true:false;
        btnCpt.clickEvents[0].customEventData = data.clubId;
        var code = data.name ? 1:0;
        var msg = code == 1 ? "":"不存在该俱乐部"
        this.showApplyClubInfo(code,data,msg)
    },

    // 显示申请俱乐部的信息
    showApplyClubInfo:function(code,data,msg){
        var info = this.joinNode.getChildByName("panel").getChildByName("info");
        var btnJoin = info.getChildByName("join_btn");
        var clubIco = info.getChildByName("club_ico");
        var clubName = info.getChildByName("club_name");
        var clubId = info.getChildByName("club_Id");
        var noticeBg = info.getChildByName("notice_bg");
        var notice = info.getChildByName("notice");
        var desc = info.getChildByName("desc");

        clubName.getComponent(cc.Label).string =data ? data.name:null;
        clubId.getComponent(cc.Label).string = data ? data.clubId:null;
        notice.getComponent(cc.Label).string = data ? data.notice:null;
        desc.getComponent(cc.Label).string = msg;

        btnJoin.active = (code == 1);
        clubIco.active = (code == 1);
        clubName.active = (code == 1);
        clubId.active = (code == 1);
        noticeBg.active = (code == 1);
        notice.active = (code == 1);
        desc.active = (code != 1);

    },

    // 接受玩家申请
    onReceiveApplyJoin:function(data){
        if(data.errcode){
            cc.module.wc.show(data.errmsg,true);
            return;
        }
        if(!this.club){
            return;
        }
        var userId = data.userId;
        var btnClubInfo = this.club.getChildByName("btn_club_info");
        var applyNode = this.clubInfo.getChildByName("apply_item");
        var scrollview = applyNode.getChildByName("scrollView");
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollviewCpt.content;
        var item = scrollview.getChildByName("item");
        var userInLists = false;
        for(var i=0;i<content.children.length;i++){
            var childItem = content.children[i];
            if(childItem._userId == userId){
                item = childItem;
                userInLists = true;
            }
        }
        var newItem = cc.instantiate(item);
        var agreeBtn = newItem.getChildByName("agree");
        var disAgreeBtn = newItem.getChildByName("disagree");
        var desc = newItem.getChildByName("desc");
        desc.getComponent(cc.Label).string = data.name.slice(0,6)+ " 申请加入俱乐部";
        if(!userInLists){
            cc.module.utils.addClickEvent(agreeBtn,this.node,"Club","onClickAgreeJoin",{agree:1,userId:userId} );
            cc.module.utils.addClickEvent(disAgreeBtn,this.node,"Club","onClickAgreeJoin",{agree:0,userId:userId} );
            newItem._userId = userId;
            newItem.active = true;
            content.addChild(newItem);
        }
        this.startMsgAction(btnClubInfo);
    },


    // 删除当前申请信息
    removeApplyItem:function(data){
        var joinor = data.joinor;
        var applyNode = this.clubInfo.getChildByName("apply_item");
        var applyScrollview = applyNode.getChildByName("scrollView");
        var applyScrollviewCpt = applyScrollview.getComponent(cc.ScrollView);
        var applyContent = applyScrollviewCpt.content;
        for(var i=0;i<applyContent.children.length;i++){
            var item = applyContent.children[i];
            if(item._userId == joinor){
                item.removeFromParent(true);
            }
        }
        if(applyContent.children.length<=0){
            var btnClubInfo = this.club.getChildByName("btn_club_info");
            this.stopMsgAction(btnClubInfo);
        }
    },

    // 同意加入
    onReceiveAgreeJoin:function(data){
        console.log(data);
        if(data.errcode){
            cc.module.wc.show(data.errmsg,true);
            this.removeApplyItem(data)
            return;
        };
        if(data.joinor == cc.module.self.userId && data.agree){
            // 当前玩家进入俱乐部
            var clubId = data.clubId;
            cc.module.self.clubId = clubId;
            cc.module.socket.send(SEvents.GET_CLUB_EVENT,{clubId:clubId},true);
            return;
        }   

        this.removeApplyItem(data);
        if(cc.module.ClubData){
            cc.module.ClubData.players[data.userId] = data;
            this._clubInfo = cc.module.ClubData;
        }

        // 其他玩家，会长不同意不用理会
        if( !data.agree ){ 
            return;
        }
        var scrollview = this.club.getChildByName("players").getChildByName("scrollView");
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollviewCpt.content;
        var item = content.getChildByName("item");
        var newItem = cc.instantiate(item);
        var name = newItem.getChildByName("name");
        var online = newItem.getChildByName("online");
        var headimg = newItem.getChildByName("headImg");
        online.getComponent(cc.Label).string = data.onlineStatus ? "在线":"离线";
        online.color = data.onlineStatus?cc.color(54,175,23,255):cc.color(100,100,100,255);
        online.getComponent(cc.LabelOutline).color = data.onlineStatus?cc.color(54,175,23,255):cc.color(100,100,100,255);
        if( data.onlineStatus ){
            online.getComponent(cc.Label).string = data.roomId ? "游戏中":"大厅";
            online.color = data.roomId ?cc.color(255,0,0,255):cc.color(54,175,23,255);
            online.getComponent(cc.LabelOutline).color = data.roomId ?cc.color(255,0,0,255):cc.color(54,175,23,255);
        }
        name.getComponent(cc.Label).string = data.name; 
        var headimgCpt = headimg.getComponent(cc.Sprite);
        cc.module.imageCache.getImage(data.userId,function (spriteFrame) {
            if(!cc.isValid(headimgCpt)){
                return;
            }
            if(spriteFrame) {
                headimgCpt.spriteFrame = spriteFrame;
            }
        }.bind(this));
        var clubData = cc.module.ClubData;
        newItem._userId = data.userId;
        content.addChild(newItem);
        this.mgrClubPlayers(data);
        this._clubInfo.players.push(data);
    },

    // 俱乐部玩家管理面板
    mgrClubPlayers:function(data){
        // console.log(data);
        var scrollView = this.clubPlayersNode.getChildByName("scrollView");
        var scrollViewCpt = scrollView.getComponent(cc.ScrollView);
        var content = scrollViewCpt.content;
        var item = content.getChildByName("item");
        var newItem = cc.instantiate(item);
        var name = newItem.getChildByName("name");
        var online = newItem.getChildByName("online");
        var headimg = newItem.getChildByName("headImg");
        var btnDelete = newItem.getChildByName("delete");
        // var btnAdd = newItem.getChildByName("add");
        // var btnLower = newItem.getChildByName("lower");
        var gold = newItem.getChildByName("gold").getChildByName('num');
        online.getComponent(cc.Label).string = data.onlineStatus ? "在线":"离线";
        online.color = data.onlineStatus?cc.color(54,175,23,255):cc.color(100,100,100,255);
        online.getComponent(cc.LabelOutline).color = data.onlineStatus?cc.color(54,175,23,255):cc.color(100,100,100,255);
        if( data.onlineStatus ){
            online.getComponent(cc.Label).string = data.roomId ? "游戏中":"大厅";
            online.color = data.roomId?cc.color(255,0,0,255):cc.color(54,175,23,255);
            online.getComponent(cc.LabelOutline).color = data.roomId?cc.color(255,0,0,255):cc.color(54,175,23,255);
        }
        // var playerName = data.name
        name.getComponent(cc.Label).string = data.name; /*new Buffer(playerName,'base64').toString();*/
        gold.getComponent(cc.Label).string = data.gold ? data.gold:0;
        var headimgCpt = headimg.getComponent(cc.Sprite);
        cc.module.imageCache.getImage(data.userId,function (spriteFrame) {
            if(!cc.isValid(headimgCpt)){
                return;
            }
            if(spriteFrame) {
                headimgCpt.spriteFrame = spriteFrame;
            }
        }.bind(this));
        newItem._userId = data.userId;
        if(this._clubInfo && this._clubInfo.info.creator == cc.module.self.userId ){
            // btnAdd.active = true;
            // btnLower.active = true;
            // cc.module.utils.addClickEvent(btnAdd,this.node,"Club","onAddChipNum",{userId:data.userId,code:1});
            // cc.module.utils.addClickEvent(btnLower,this.node,"Club","onAddChipNum",{userId:data.userId,code:0});
            if( data.userId != this._clubInfo.info.creator  ){
                cc.module.utils.addClickEvent(btnDelete,this.node,"Club","makeSureDeleteUser",data.userId);
                btnDelete.active = true;
            }
        }
        newItem.active = true;
        content.addChild(newItem);
    },

    // 所有俱乐部
    onReceiveGetAllClub:function(data){},

    // 删除会员
    onReceiveDeleteUser:function(data){
        if(data.errcode){
            cc.module.wc.show(data.errmsg);
            return;
        }

        this.deleteNode.active = false;
        var userId = data.userId;

        if(userId == cc.module.self.userId){
            this.club.active = false;
            this.deleteNode.active = false;
            this.leaveNode.active = false;
            this.operate.active = true;
            this.clubInfo.active = false;  
            this.creatNode.active = false;
            this.deleteNode.active = false;
            this.joinNode.active = false;   
            this.clubPlayersNode.active = false;
            this.playerDetail.active = false;
            this.keyboard.active = false ;      
            this.record.active = false;
            this.clearRooms();
            this._clubInfo = null;
            cc.module.ClubData = null;
            cc.module.wc.show(data.msg,true);
            cc.module.socket.send(SEvents.GET_CLUB_EVENT,{userId:cc.module.self.userId},false);
        }
        else{
            this.clubContent.children.forEach(function(child){
                if(child._userId == userId){
                    child.destroy();
                }
            })
            if( this._clubInfo ){
                var players = this._clubInfo.players;
                for(var i=0;i<players.length;i++){
                    var player = players[i];
                    if(player && player.userId == userId){
                        this._clubInfo.players.splice(i,1);
                        break;
                    }
                }
            }
            var scrollView = this.clubPlayersNode.getChildByName("scrollView");
            var scrollViewCpt = scrollView.getComponent(cc.ScrollView);
            var content = scrollViewCpt.content;
            content.children.forEach(function(playerNode){
                if(playerNode._userId == userId){
                    playerNode.destroy();
                }
            })
        }
    },

    clearRooms:function(){
        var rooms = this.club.getChildByName("rooms");
        var scrollview = rooms.getChildByName("scrollView");
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        scrollviewCpt.content.removeAllChildren();
    },

    // 离开俱乐部
    onReceiveLeaveClub:function(data){
        // console.log(" -- 退出俱乐部 -- ")
        if(data.errcode){
            cc.module.wc.show(data.errmsg,true)
            return;
        }
        if(data.userId == cc.module.self.userId){
            this.club.active = false;
            this.operate.active = true;
            this.leaveNode.active = false;
            this.clubInfo.active = false;
            this._clubInfo = null;
            this.clearRooms();
            cc.module.ClubData = null;
            var weath = cc.find("Canvas/wealth_panel");
            var gold = weath.getChildByName("gold_panel");
            gold.getChildByName("lbl_gold").getComponent(cc.Label).string = 0;
            cc.module.socket.send(SEvents.GET_CLUB_EVENT,{userId:cc.module.self.userId},false);
        }else{
            var scrollview = this.club.getChildByName("players").getChildByName("scrollView");
            var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
            var content = scrollviewCpt.content;
            for(var i=0;i<content.children.length;i++){
                var item = content.children[i];
                if(data.userId == item._userId){
                    item.destroy();
                };
            }
            var clubPlayerSV = this.clubPlayersNode.getChildByName("scrollView");
            var clubPlayerSVCpt = clubPlayerSV.getComponent(cc.ScrollView);
            var SVcontent = clubPlayerSVCpt.content;
            for(var i=0;i<SVcontent.children.length;i++){
                var item = SVcontent.children[i];
                if(data.userId == item._userId){
                    item.destroy();
                };
            }

        }
    },

    initClubPlayers:function(data){
        console.log(data);
        var scrollview = this.clubPlayersNode.getChildByName("scrollView");
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollviewCpt.content;
        var item = content.getChildByName("item");
        var players = data.players;
        content.removeAllChildren();
        players.forEach(function(player){
            var newItem = cc.instantiate(item);
            var name = newItem.getChildByName("name");
            var online = newItem.getChildByName("online");
            var headimg = newItem.getChildByName("headImg");
            var gold = newItem.getChildByName("gold").getChildByName("num");
            var btnDelete = newItem.getChildByName("delete");
            // var btnAdd = newItem.getChildByName("add");
            // var btnLower = newItem.getChildByName("lower");
            online.getComponent(cc.Label).string = player.onlineStatus ? "在线":"离线";
            online.color = player.onlineStatus?cc.color(54,175,23,255):cc.color(100,100,100,255);
            online.getComponent(cc.LabelOutline).color = player.onlineStatus?cc.color(54,175,23,255):cc.color(100,100,100,255);
            if( player.onlineStatus ){
                online.getComponent(cc.Label).string = player.roomId ? "游戏中":"大厅";
                online.color = player.roomId?cc.color(255,0,0,255):cc.color(54,175,23,255);
                online.getComponent(cc.LabelOutline).color = player.roomId?cc.color(255,0,0,255):cc.color(54,175,23,255);
            }
            // var playerName = player.name;
            name.getComponent(cc.Label).string = player.name; 
            gold.getComponent(cc.Label).string = player.gold?player.gold:0;
            var headimgCpt = headimg.getComponent(cc.Sprite);
            cc.module.imageCache.getImage(player.userId,function (spriteFrame) {
                if(!cc.isValid(headimgCpt)){
                    return;
                }
                if(spriteFrame) {
                    headimgCpt.spriteFrame = spriteFrame;
                }
            }.bind(this));
            newItem._userId = player.userId;
            if(data.info.creator == cc.module.self.userId  ){
                // btnAdd.active = true;
                // btnLower.active = true;
                cc.module.utils.addClickEvent(newItem,this.node,"Club","getPlayerRecharge",{userId:player.userId});
                // cc.module.utils.addClickEvent(btnAdd,this.node,"Club","onAddChipNum",{userId:player.userId,code:1});
                // cc.module.utils.addClickEvent(btnLower,this.node,"Club","onAddChipNum",{userId:player.userId,code:0});
                if( player.userId != data.info.creator){
                    cc.module.utils.addClickEvent(btnDelete,this.node,"Club","makeSureDeleteUser",player.userId);
                    btnDelete.active = true;
                }
            }
            newItem.active = true;
            content.addChild(newItem);
        }.bind(this))
    },

    // 设置俱乐部的玩家 
    setClubPlayers:function(data){
        // console.log(data);
        var scrollview = this.club.getChildByName("players").getChildByName("scrollView");
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollviewCpt.content;
        var item = content.getChildByName("item");
        var players = data.players;
        var isOwner = cc.module.self.userId == data.info.creator;
        content.removeAllChildren();
        players.forEach(function(player){
            var newItem = cc.instantiate(item);
            var name = newItem.getChildByName("name");
            var online = newItem.getChildByName("online");
            var headimg = newItem.getChildByName("headImg");
            var userId = newItem.getChildByName("userId");
            userId.getComponent(cc.Label).string = player.userId;
            online.getComponent(cc.Label).string = player.onlineStatus ? "在线":"离线";
            online.color = player.onlineStatus?cc.color(54,175,23,255):cc.color(100,100,100,255);
            online.getComponent(cc.LabelOutline).color = player.onlineStatus?cc.color(54,175,23,255):cc.color(100,100,100,255);
            if( player.onlineStatus ){
                online.getComponent(cc.Label).string = player.roomId ? "游戏中":"大厅";
                online.color = player.roomId?cc.color(255,0,0,255):cc.color(54,175,23,255);
                online.getComponent(cc.LabelOutline).color = player.roomId?cc.color(255,0,0,255):cc.color(54,175,23,255);
            }
            name.getComponent(cc.Label).string = player.name;
            var headimgCpt = headimg.getComponent(cc.Sprite);
            cc.module.imageCache.getImage(player.userId,function (spriteFrame) {
                if(!cc.isValid(headimgCpt)){
                    return;
                }
                if(spriteFrame) {
                    headimgCpt.spriteFrame = spriteFrame;
                }
            }.bind(this));
            newItem._userId = player.userId;
            newItem.active = true;
            if(isOwner || player.userId == cc.module.self.userId){
                cc.module.utils.addClickEvent(newItem,this.node,"Club","getPlayerDetail",player.userId);
            }
            content.addChild(newItem);
        }.bind(this))

    },

    getPlayerDetail:function(e,userId){
        // console.log(userId);
        if(!userId){
            return
        }
        cc.module.socket.send(SEvents.GET_PLAYER_DETAIL_EVENT,{userId:userId,clubId:cc.module.self.clubId},false);
    },

    // 设置俱乐部创建的房间
    setClubRooms:function(data){
        if(!data.rooms){
            return;
        }
        var scrollview = this.club.getChildByName("rooms").getChildByName("scrollView");
        var scrollviewCpt = scrollview.getComponent(cc.ScrollView);
        var content = scrollviewCpt.content;
        var item = scrollview.getChildByName("item");
        var gameType = ["","十三张","牛牛"];
        var rooms = [];
        for(var prop in data.rooms){
           data.rooms[prop] && rooms.push(data.rooms[prop])
        }
        rooms.forEach(function(room){
            var config = room.config;
            var roomId = room.roomId;
            var newItem = cc.instantiate(item);
            var type = newItem.getChildByName("type");
            var desc = newItem.getChildByName("desc");
            var btnStart = newItem.getChildByName("btn_club_start");
            var num = newItem.getChildByName("person_bg").getChildByName("num");
            type.getComponent(cc.Label).string = gameType[room.type];
            desc.getComponent(cc.Label).string = this.getRoomType(room.type,room.config);
            if(room.type == 1){
                num.getComponent(cc.Label).string = room.players.length+"/"+room.config.numOfPerson;
            }
            else if(room.type == 2){
                num.getComponent(cc.Label).string = room.players.length+"/6"
            }
            // else if( room.type == 3){ // 铜宝
            //     num.getComponent(cc.Label).string = room.players.length+"/"+room.config.numOfPlayer;
            // }
            newItem._roomId = roomId;
            newItem.active = true;
            cc.module.utils.addClickEvent(btnStart,this.node,"Club","onStartGame",roomId );
            content.addChild(newItem);
        }.bind(this));
    },

    // 设置俱乐部信息
    setClubInfo:function(data){
        var nameItem = this.clubInfo.getChildByName("name_item");
        var IdItem = this.clubInfo.getChildByName("id_item");
        var leafItem = this.clubInfo.getChildByName("leaf_item");
        var noticeItem = this.clubInfo.getChildByName("notice_item");
        var btns = this.clubInfo.getChildByName("btns");
        var btnMgrPlayer = btns.getChildByName("btn_playersMgr");
        btnMgrPlayer.active = data.creator == cc.module.self.userId;
        noticeItem.getChildByName("msg").getComponent(cc.EditBox).string = data.notice ? data.notice :"";
        nameItem.getChildByName("msg").getComponent(cc.EditBox).string = data.name;
        leafItem.getChildByName("msg").getComponent(cc.Label).string = data.leaf;
        IdItem.getChildByName("clubId").getComponent(cc.Label).string = data.clubId;
        if(data.creator == cc.module.self.userId){
            nameItem.getChildByName("mask").active = false;
            noticeItem.getChildByName("mask").active = false;
            var addBtn = leafItem.getChildByName("btn");
            addBtn.active = true;
            cc.module.utils.addClickEvent(addBtn,this.node,"Club","addClubLeaf");
        }
    },

    addClubLeaf:function(){
        // console.log(" -- 给俱乐部添加砖石 -- ");
        this.keyboard.active = true;
        cc.module.utils.toTop(this.keyboard);
        this._addType = "club";
    },

    // 获取俱乐部
    onReceiveGetClub:function(data){
        // console.log(data.players);
        this.operate.active = false;
        this.club.active = true;
        this.joinNode.active = false;
        this.creatNode.active = false;
        this.leaveNode.active = false;
        this._clubInfo = data;
        cc.module.ClubData = data;
        if(data.applyJoin && data.info.creator == cc.module.self.userId){
            this._applyJoin = data.applyJoin;
            this.setApplyJoin(this._applyJoin);
        }
        var btnInvite = this.club.getChildByName("players").getChildByName("invite");
        btnInvite.getChildByName("clubId").getComponent(cc.Label).string = "（"+data.info.clubId +"）";
        this.club.active = true;
        this.setClubInfo(data.info);
        this.setClubPlayers(data);
        this.setClubRooms(data);
        this.initClubPlayers(data);
    },  
    
    // 创建俱乐部
    onReceiveCreateClub:function(data){
        if(cc.isValid(data.errcode)) {
            cc.module.wc.show(data.errmsg,true);
            return;
        }
        cc.module.socket.send(SEvents.GET_CLUB_EVENT,{clubId:data.clubId},true);
        cc.module.self.clubId = data.clubId;
        this.creatNode.active = false;
    },

    // 同意玩家进入俱乐部
    onClickAgreeJoin:function(e,msg){
        if(!msg.userId){
            return;
        }
        var agree = msg.agree === 1;
        var data = {};
        data.agree = agree;
        data.clubId = cc.module.self.clubId;
        data.joinor = msg.userId;
        cc.module.socket.send(SEvents.AGREE_JOIN_EVENT,data,true);
    },

    // 点击申请
    onclickApplyJoin :function(e,clubId){
        if(clubId){
            var data = cc.module.self.getInfo();
            data.clubId = clubId;
            data.joinor = cc.module.self.userId;
            data.onlineStatus = true;
            cc.module.socket.send(SEvents.APPLY_JOIN_EVENT,data,true);
        }

    },

    // 创建俱乐部
    onclickCreateClub:function(e,num){
        cc.module.audioMgr.playUIClick();
        if(num!=1){
            this.clubName.string = "";
        }else{
            cc.module.socket.send(SEvents.CLUB_CREATE_EVENT,null,true);
        }
    },

    // 离开俱乐部
    onclickLeaveClub:function(){
        var clubId = cc.module.self.clubId;
        if(!clubId){
            return;
        }
        if(cc.module.self.userId == this._clubInfo.info.creator){
            // 如果是创建人
            cc.module.socket.send(SEvents.LEAVE_CLUB_EVENT,{clubId:clubId,isCreator:!0},true);
        }else{
            // 如果是会员则直接退出房间
            cc.module.socket.send(SEvents.LEAVE_CLUB_EVENT,{clubId:clubId,isCreator:!1},true);
        }
    },

    makeSureLeaveUser:function(){
        cc.module.audioMgr.playUIClick();
        var frame = this.leaveNode.getChildByName("frame");
        var desc = frame.getChildByName("description");
        if(cc.module.self.userId == this._clubInfo.info.creator){
            desc.getComponent(cc.Label).string = "是否解散俱乐部？";
        }else{
            desc.getComponent(cc.Label).string = "退出俱乐部分数将清空分数，是否退出？";
        }
    },

    // 确认是否删除玩家
    makeSureDeleteUser:function(e,userId){
        cc.module.audioMgr.playUIClick();
        var clubId = cc.module.self.clubId;
        var deleteNode = this.node.getChildByName("panel").getChildByName("deleteUser");
        var pop = deleteNode.getComponent("Pop");
        pop.pop();
        this._deleteUser = userId;
    },

    // 删除会员
    onclickDeletePlayer:function(e,userId){
        cc.module.audioMgr.playUIClick();
        var clubId = cc.module.self.clubId;
        var userId = this._deleteUser;
        if(!clubId || !userId){
            return;
        }
        cc.module.socket.send(SEvents.DELETE_USER_EVENT,{userId:userId,clubId:clubId},false);
    },

    // 查看俱乐部信息
    onClickClubInfo:function(){
        cc.module.audioMgr.playUIClick();
        var clubInfoNode = this.club.getChildByName("clubInfo");
        clubInfoNode.active = true;
    },

    onclickCloseDelete:function(){
        // cc.module.audioMgr.playUIClick();
        this._deleteUser = null;
    },

    onClickClose:function(){
        cc.module.audioMgr.playUIClick();
        this.node.active = false;
    },

    onHideJoinNode:function(e,num){
        var action ;
        if(num != 1){
            action = cc.scaleTo(0.2,0,0);
        }else{
            action = cc.scaleTo(0.2,1,1);
        }
        this.onClickReset();
        action && this.joinNode.runAction(action);
    },
    
    //  隐藏节点
    onHideNode:function(e,num){
        var action ;
        if(num != 1){
            action = cc.scaleTo(0.2,0,0);
        }else{
            action = cc.scaleTo(0.2,1,1);
        }
        action && e.target.parent.runAction(action)
    },  

    onDestroy:function () {
        cc.module.socket.off(SEvents.DEDUCT_CLUB_LEAF_EVENT);
        cc.module.socket.off(SEvents.GET_CLUB_EVENT);
        cc.module.socket.off(SEvents.CLUB_CREATE_EVENT);
        cc.module.socket.off(SEvents.GET_ALL_CLUB_EVENT);
        cc.module.socket.off(SEvents.LEAVE_CLUB_EVENT);
        cc.module.socket.off(SEvents.DISSOLVE_CLUB_EVENT);

        cc.module.socket.off(SEvents.DELETE_USER_EVENT);
        cc.module.socket.off(SEvents.AGREE_JOIN_EVENT);
        cc.module.socket.off(SEvents.APPLY_JOIN_EVENT);
        cc.module.socket.off(SEvents.SELECT_CLUB_EVENT);
        cc.module.socket.off(SEvents.PLAYER_DEEDS_EVENT);
        cc.module.socket.off(SEvents.UPDATE_CLUB_NAME_EVENT);
        cc.module.socket.off(SEvents.UPDATE_CLUB_NOTICE_EVENT);

        cc.module.socket.off(SEvents.IS_IN_ROOM_EVENT);
        cc.module.socket.off(SEvents.CREATE_CLUB_ROOM_EVENT);
        cc.module.socket.off(SEvents.DISSOLVE_CLUB_ROOM_EVENT);
        cc.module.socket.off(SEvents.ENTER_CLUB_ROOM_EVENT);
        cc.module.socket.off(SEvents.GET_PLAYER_CHIP_EVENT);

        cc.module.socket.off(SEvents.GET_PLAYER_DETAIL_EVENT);
        cc.module.socket.off(SEvents.ADD_CLUB_LEAF_EVENT);
        cc.module.socket.off(SEvents.GET_CLUB_RECHARGE_EVENT);
    }
   
});
