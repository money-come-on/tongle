cc.Class({
    extends: cc.Component,

    properties: {
        _touchRotation:null,
        _recordRotation:[],
        _maxRotatio:60,
        _completeRotation:20,
        _isComplete:false,
        _returnTime:0.3,
        _twistCards:null,
        _completeCallback:null,
        _isUp:false,
        _fiveGroup:null,
        _twsitOne:null,
        _twistOneCard:null,
        _twistOneBack:null
    },

    onLoad: function () {
        this._returnTime = 0.3;
        this._completeRotation = 20;
        this._fiveGroup = this.node.getChildByName("five_group");
        this._twsitOne = this.node.getChildByName("twist_one");
        this._fiveGroup.on(cc.Node.EventType.TOUCH_START,function (e) {
            if(this._isComplete && this._isUp) {
                return;
            }
            this._fiveGroupTouchStart(e);
        }.bind(this));
        this._fiveGroup.on(cc.Node.EventType.TOUCH_MOVE,function(e) {
            if(this._isComplete && this._isUp) {
                return;
            }
            this._fiveGroupTouchMove(e);
        }.bind(this));
        this._fiveGroup.on(cc.Node.EventType.TOUCH_END,function (e) {
            if(this._isComplete && this._isUp) {
                return;
            }
            if(this._isComplete) {
                this._isUp = true;
            }
            this._fiveGroupTouchCompleter();
        }.bind(this));
        this._fiveGroup.on(cc.Node.EventType.TOUCH_CANCEL,function (e) {
            if(this._isComplete && this._isUp) {
                return;
            }
            if(this._isComplete) {
                this._isUp = true;
            }
            this._fiveGroupTouchCompleter();
        }.bind(this));
        var mask = this._twsitOne.children[0];
        this._twistOneBack = mask.getChildByName("back");
        this._twistOneCard = mask.getChildByName("card");
        this._twistOneBack.on(cc.Node.EventType.TOUCH_MOVE,function (e) {
            if(this._isComplete && this._isUp) {
                return;
            }
            this._twistOneTouchMove(e,this._twistOneCard);
        }.bind(this));
        this._twistOneBack.on(cc.Node.EventType.TOUCH_END,function (e) {
            if(this._isComplete && this._isUp) {
                return;
            }
            if(this._isComplete) {
                this._isUp = true;
            }
            this._twistOneTouchCompleter(e,this._twistOneCard);
        }.bind(this));
        this._twistOneBack.on(cc.Node.EventType.TOUCH_CANCEL,function (e) {
            if(this._isComplete && this._isUp) {
                return;
            }
            if(this._isComplete) {
                this._isUp = true;
            }
            this._twistOneTouchCompleter(e,this._twistOneCard);
        }.bind(this));
    },

    twist:function (cards,callback) {
        var btnClose = this.node.parent.getChildByName("btn_close");
        btnClose.active = true;
        if(!this._fiveGroup) {
            this._fiveGroup = this.node.getChildByName("five_group");
        }
        if(!this._twsitOne) {
            this._twsitOne = this.node.getChildByName("twist_one");
        }
        if(!this._twistCards) {
            this._twistCards = this._fiveGroup.children;
        }
        var mask = this._twsitOne.children[0];
        if(!this._twistOneBack) {
            this._twistOneBack = mask.getChildByName("back");
        }
        if(!this._twistOneCard) {
            this._twistOneCard = mask.getChildByName("card");
        }
        this._completeCallback = callback;
        this._fiveGroup.active = (cards.length === 5);
        this._twsitOne.active = !this._fiveGroup.active;
        this._setPoker(cards);
        if(cards.length === 1) {
            this._twistOne();
        }
        else if(cards.length === 5) {
            this._twistFive();
        }
        var pop = this.node.parent.getComponent("Pop");
        pop.pop();
    },

    _setPoker:function (cards) {
        if(cards.length === 1) {
            var sprite = this._twistOneCard.getComponent(cc.Sprite);
            sprite.spriteFrame = cc.module.pokerMgr.getPokerSFById(cards[0]);
        }
        else if(cards.length === 5) {
            this._twistCards.forEach(function (card,index) {
                var sprite = card.getComponent(cc.Sprite);
                if(cards[index] != null) {
                    sprite.spriteFrame = cc.module.pokerMgr.getPokerSFById(cards[index]);
                }
            }.bind(this));
        }
    },

    _twistFive:function () {
        this._isUp = false;
        this._isComplete = false;
        this._twistCards.forEach(function (card) {
            card.anchorY = 0;
            card.y = 0;
            card.x = 0;
            card.opacity = 255;
            card.rotation = 0;
            card.scaleX = 1;
            card.scaleY = 1;
        }.bind(this));
    },

    _twistOne:function () {
        this._isComplete = false;
        this._isUp = false;
        if(this._twistOneCard) {
            this._twistOneCard.anchorX = 0;
            this._twistOneCard.x = 0;
            this._twistOneCard.children[0].opacity = 255;
        }
        if(this._twistOneBack) {
            this._twistOneBack.scaleX = 1;
            this._twistOneBack.scaleY = 1;
            this._twistOneBack.anchorX = 1;
            this._twistOneBack.x = 0;
            this._twistOneBack.y = 0;
        }
    },

    hidden:function (callback) {
        var pop = this.node.parent.getComponent("Pop");
        pop.unpop();
        //this.node.parent.active = false;
    },

    _fiveGroupTouchStart:function (e) {
        var touchPosition = e.getLocation();
        var thisARPosition = this._fiveGroup.convertToWorldSpaceAR(cc.v2(0,0));
        var detailX = touchPosition.x - thisARPosition.x;
        var detailY = touchPosition.y - thisARPosition.y;
        this._touchRotation = Math.atan2(detailY,detailX)*180/Math.PI;
        this._twistCards.forEach(function (card,index) {
            this._recordRotation[index] = card.rotation;
            card._maxRotatio = index<2 ? -(2-index)*this._maxRotatio/2 : (index-2)*this._maxRotatio/2;
            card._completeRotation = Math.abs(2-index)*this._completeRotation/2;
        }.bind(this));
    },

    _fiveGroupTouchMove:function (e) {
        var movePosition = e.getLocation();
        var thisARPosition = this._fiveGroup.convertToWorldSpaceAR(cc.v2(0,0));
        var detailX = movePosition.x - thisARPosition.x;
        var detailY = movePosition.y - thisARPosition.y;
        var moveRotation = Math.atan2(detailY,detailX)*180/Math.PI;
        var totation = (this._touchRotation-moveRotation)/8;
        this._twistCards.forEach(function (card,index) {
            var angle = index<2 ? -totation : totation;
            angle = index===2 ? 0 : angle;
            card.rotation = this._recordRotation[index] + angle*Math.abs(2-index);
            if((index-2)*card.rotation < 0) {
                card.rotation = 0;
            }
            if(Math.abs(card.rotation) > Math.abs(card._maxRotatio)) {
                card.rotation = card._maxRotatio;
            }
            if(Math.abs(card.rotation) > card._completeRotation) {
                this._isComplete = true;
            }
        }.bind(this));
    },

    _fiveGroupTouchCompleter:function () {
        if(this._isComplete) {
            var btnClose = this.node.parent.getChildByName("btn_close");
            btnClose.active = true;
            this._twistCards.forEach(function (card,index) {
                var rotationAction = cc.rotateTo(this._returnTime,0);
                var delayAction = cc.delayTime(this._returnTime * (this._twistCards.length-index)*0.3);
                var moveAction = cc.moveBy(this._returnTime*0.8,0,-(Math.abs(this._fiveGroup.y)+card.height));
                if(index === 0) {
                    var callfunc = cc.callFunc(function () {
                        if(this._completeCallback) {
                            this._completeCallback(this._twistCards);
                        }
                    }.bind(this));
                    card.runAction(cc.sequence([rotationAction,delayAction,moveAction,callfunc]));
                }
                else {
                    card.runAction(cc.sequence([rotationAction,delayAction,moveAction]));
                }
            }.bind(this));
        }
    },

    _twistOneTouchStart:function (e) {

    },

    _twistOneTouchMove:function (e,card) {
        var back = e.target;
        var deltaX = e.getDeltaX();
        back.x = back.x + deltaX;
        card.x -= deltaX;
        if(back.x < 0) {
            back.x = 0;
            card.x = 0;
        }
        if(back.x > back.width*0.4) {
            this._isComplete = true;
        }
    },

    _twistOneTouchCompleter:function (e,card) {
        var target = e.target;
        if(this._isComplete) {
            var btnClose = this.node.parent.getChildByName("btn_close");
            btnClose.active = true;
            var action1 = cc.moveTo(this._returnTime,target.width,0);
            var action2 = cc.moveTo(this._returnTime,-card.width,0);
            var wait = cc.delayTime(this._returnTime);
            var fadeTo = cc.fadeTo(this._returnTime,0);
            var animEndCallback = cc.callFunc(function () {
                if(this._completeCallback) {
                    this._completeCallback([target]);
                }
            }.bind(this));
            target.runAction(action1);
            card.runAction(action2);
            card.children[0].runAction(cc.sequence([wait,fadeTo,animEndCallback]));
        }
        else {
            var action1 = cc.moveTo(this._returnTime,0,0);
            var action2 = cc.moveTo(this._returnTime,0,0);
            target.runAction(action1);
            card.runAction(action2);
        }
    }

});
