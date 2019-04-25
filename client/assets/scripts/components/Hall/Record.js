cc.Class({
    extends: cc.Component,

    properties: {
        ptPanel:cc.Node,
        bsPanel:cc.Node,
        recordPanel:cc.Node,
        detailPanel:cc.Node,
        ptContent:cc.Node,
        bsContent:cc.Node,
        recordContent:cc.Node,
        detailContent:cc.Node,
        playerDetail:cc.Prefab,
        playerDetailItem:cc.Prefab,
        _endingsData:null,
        _recordDatas:null,
    },

    onLoad () {
        cc.module.socket.on(SEvents.RECEIVE_RECORD,this.onReceiveRecord.bind(this));
        cc.module.socket.on(SEvents.RECEIVE_RECORD_DETAIL,this.onReceiveDetail.bind(this));
        cc.module.socket.on(SEvents.GET_WIN_DETAIL,this.onReceiveWinDetail.bind(this));
    },
    
    start(){
    },

    onClickTitle(e,code){
        var ptPanel = this.node.getChildByName("pt_panel");
        var bsPanel = this.node.getChildByName("bs_panel");
        var node = cc.find("Canvas");
        var game = node.getComponent("Hall");
        ptPanel.active = (code==0);
        bsPanel.active = (code==1);
        game.loadCardAnim();
        
        var title = e.target.parent;
        title.children.forEach( function(child,index) {
            var childLbl = child.getChildByName("lbl_title");
            childLbl.color = new cc.Color(252,224,169,255);
        });
        cc.find("lbl_title",e.target).color = new cc.Color(0,0,0,255);
    },

    clickDetail(e){//点击详细战绩
        // console.log(e.target._uuid,"---82");
        var data = this._recordDatas;
        var recordDetailPanel = this.node.getChildByName("record_detail_panel");
        var roomInfo = recordDetailPanel.getChildByName("room_info");
        var playerDrtailPanel = recordDetailPanel.getChildByName("player_detail");
        var detailItem = recordDetailPanel.getChildByName("item");
        var headImgCpt = roomInfo.getChildByName("headimg").getChildByName("headimg").getComponent(cc.Sprite);
        var roomTime = roomInfo.getChildByName("lbl_time").getComponent(cc.Label);
        var roomType = roomInfo.getChildByName("lbl_room_type").getComponent(cc.Label);
        var roomName = roomInfo.getChildByName("lbl_room_name").getComponent(cc.Label);
        var roomWater = roomInfo.getChildByName("lbl_room_water").getComponent(cc.Label);
        var btnDetail = roomInfo.getChildByName("btn_datail");
        btnDetail._uuid = e.target._uuid;
        if(data.endings.length>0){
            playerDrtailPanel.removeAllChildren();
            for(var i=0;i<data.endings.length;i++){
                var record = JSON.parse(data.endings[i].ending);
                if(e.target._uuid == data.endings[i].uuid){
                    roomTime.string = record.time;
                    var mode = this.returnGameTypeFun(record.mode);
                    roomType.string = "来自"+record.creatorName+"的"+mode;
                    roomName.string = record.creatorName+"的房间";
                    roomWater.string = record.water+"金币/水";
                    cc.module.imageCache.newImage(record.creator,function (spriteFrame) {
                        if(!cc.isValid(this.node)) {
                            return;
                        }
                        cc.isValid(spriteFrame) ? (headImgCpt.spriteFrame = spriteFrame) : null;
                    }.bind(this));
                    for(var p in record.players){
                        var item = cc.instantiate(detailItem);
                        var itemName = item.getChildByName("lbl_name").getComponent(cc.Label);
                        var itemAllIn = item.getChildByName("lbl_all_in").getComponent(cc.Label);
                        var itemWater = item.getChildByName("lbl_water").getComponent(cc.Label);
                        var itemWin = item.getChildByName("lbl_win").getComponent(cc.Label);
                        itemName.string = record.players[p].name;
                        itemAllIn.string = record.players[p].allowIn;
                        itemWater.string = (record.players[p].winLose)/(record.players[p].water);
                        itemWin.string = record.players[p].winLose;
                        item.active = true;
                        playerDrtailPanel.addChild(item);
                    }
                }
            }
        }
    },

    onReceiveRecord(data){//接收战绩记录
        this._recordDatas = data;
        if(data.endings.length>0){
            var hallRecord = this.ptPanel.getChildByName("show_msg").getChildByName("hall_record_item");
            this.ptContent.removeAllChildren();
            for(var i=0;i<data.endings.length;i++){
                var hallRecordCpt = cc.instantiate(hallRecord);
                var record = JSON.parse(data.endings[i].ending);
                var lblData = hallRecordCpt.getChildByName("time_item").getChildByName("lbl_date").getComponent(cc.Label);
                var lblTime = hallRecordCpt.getChildByName("time_item").getChildByName("lbl_time").getComponent(cc.Label);
                var roomName = hallRecordCpt.getChildByName("time_item").getChildByName("room_name").getComponent(cc.Label);
                var headImgCpt = hallRecordCpt.getChildByName("room_item").getChildByName("headimg").getChildByName("headimg").getComponent(cc.Sprite);
                var lblRoomName = hallRecordCpt.getChildByName("room_item").getChildByName("lbl_room_name").getComponent(cc.Label);
                var lblWater = hallRecordCpt.getChildByName("room_item").getChildByName("lbl_water").getComponent(cc.Label);
                var lblGameTime = hallRecordCpt.getChildByName("room_item").getChildByName("lbl_ju_time").getComponent(cc.Label);
                var lblWin = hallRecordCpt.getChildByName("room_item").getChildByName("lbl_win").getComponent(cc.Label);
                hallRecordCpt._uuid = data.endings[i].uuid;
                var time = record.time;
                var gameDate = time.slice(0,10);
                var gameHMS = time.slice(11);
                lblData.string = gameDate;
                lblTime.string = gameHMS;
                var mode = this.returnGameTypeFun(record.mode);
                roomName.string = "来自"+record.creatorName+"的"+mode;
                lblRoomName.string = record.creatorName+"的房间";
                cc.module.imageCache.newImage(record.creator,function (spriteFrame) {
                    if(!cc.isValid(this.node)) {
                        return;
                    }
                    cc.isValid(spriteFrame) ? (headImgCpt.spriteFrame = spriteFrame) : null;
                }.bind(this));
                lblWater.string = record.water+"金币/水";
                lblGameTime.string = record.gameTime;
                cc.module.utils.addClickEvent(hallRecordCpt,this.node,"Record","clickDetail");
                hallRecordCpt.active = true;
                this.ptContent.addChild(hallRecordCpt);
            }
        }
    },

    getDetail(e){//获取详细战绩
        var uuid = e.target._uuid;
        if(uuid){
            cc.module.socket.send(SEvents.SEND_GET_RECORD_DETAIL,{uuid:uuid},true);
        }
    },

    onReceiveDetail(data){//接收详细战绩
        // console.log(data);
        this.detailPanel.active = true;
        this.detailContent.removeAllChildren();
        var recordArr = data.detail;
        if(recordArr && recordArr.length>0){
            for(var i=0;i<recordArr.length;i++){
                var recordinfo = recordArr[i];
                var players = JSON.parse(recordinfo.players);
                var detail = players.detail;
                var playerDetail = cc.instantiate(this.playerDetail);
                var face = playerDetail.getChildByName("face");
                var indexPanel = playerDetail.getChildByName("index");
                var lblIndex = indexPanel.getChildByName("lbl_index").getComponent(cc.Label);
                var lblDate = indexPanel.getChildByName("lbl_date").getComponent(cc.Label);
                var lblTime = indexPanel.getChildByName("lbl_time").getComponent(cc.Label);
                lblIndex.string = "第"+recordinfo.index+"局";
                lblDate.string = "2019-03-28";
                lblTime.string = "21:21";
                var detaileContent = playerDetail.getChildByName("player_detail").getChildByName("content");
                detaileContent.removeAllChildren();
                for(var player in detail){
                    var playerDetailItem = cc.instantiate(this.playerDetailItem);
                    var playerName = playerDetailItem.getChildByName("lbl_name").getComponent(cc.Label);
                    var playerwin = playerDetailItem.getChildByName("lbl_win").getComponent(cc.Label);
                    playerName.string = detail[player].name;
                    playerwin.string = detail[player].gap;
                    playerDetailItem.active = true;
                    if(player==cc.module.self.userId){
                        face.children[0].active = (detail[player].gap<0);
                        face.children[1].active = (detail[player].gap==0);
                        face.children[2].active = (detail[player].gap>0);
                    }
                    detaileContent.addChild(playerDetailItem);
                }
                playerDetail.active = true;
                this.detailContent.addChild(playerDetail);
            }
        }
    },

    onReceiveWinDetail(data){//接收玩家盈亏
        if(data){   
            var lblWin = cc.find("total/gap/lbl_gap",this.ptPanel).getComponent(cc.Label);
            lblWin.string = data.win;
        }
    },

    returnGameTypeFun(type){//返回玩法类型
        var gameTypes = {
            "sss":"十三水",
            "qys":"全一色",
            "sbp":"十八扑",
            "dys":"多一色",
            "bbc":"百变场",
            "wpc":"王牌场"
        };
        return gameTypes[type];
    },
});
