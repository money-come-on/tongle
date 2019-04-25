cc.Class({
    extends: cc.Component,

    properties: {
        sszNode:cc.Node,
        nnNode:cc.Node,
        bscNode:cc.Node,
    },
    onLoad () {
        this.sszNode.active = true;
        this.nnNode.active = false;
        this.bscNode.active = false;
    },

    start () {

    },

    onClickSszMode(e,num){
        console.log(num)
        var person = cc.find("ssz/content/game_num_of_person/type",this.sszNode);
        var layout = person.getComponent(cc.Layout);
        person.children.forEach(function(child,index){
            child.active = (index<num);
        }.bind(this));
        if(num==3){
            layout.spacingX = 160;
        }
        else if(num==6){
            layout.spacingX = 70;
        }
        else if(num==7){
            layout.spacingX = 50;
        }
    },

    onClickGamemode(e,code){
        console.log(code);
    },
    
    onClickTitle(e,code){
        this.sszNode.active = code == 0;
        this.nnNode.active = code == 1;
        this.bscNode.active = code == 2;
        var title = e.target.parent;
        title.children.forEach( function(child,index) {
            var childLbl = child.getChildByName("lbl_title");
            childLbl.color = new cc.Color(252,224,169,255);
        });
        cc.find("lbl_title",e.target).color = new cc.Color(0,0,0,255);
    },
    
    update (dt) {},
});
