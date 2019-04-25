cc.Class({
    extends: cc.Component,

    properties: {
    },

    addClickEvent:function(node,target,component,handler,data){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        if(data){
            eventHandler.customEventData = data;
        }
        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
    
    addSlideEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        var slideEvents = node.getComponent(cc.Slider).slideEvents;
        slideEvents.push(eventHandler);
    },
    
    // 编码
    toBase64:function(content){
    	return new Buffer(content).toString("base64");
    },
    // 转码
    fromBase64:function(content){
	    return new Buffer(content,"base64").toString();
    },

    toTop:function (node) {
        var parent = node.parent;
        var maxZIndex = 0;
        if(parent) {
            parent.children.forEach(function (child) {
                maxZIndex = Math.max(maxZIndex,child.zIndex);
            });
            maxZIndex = Math.max(maxZIndex,parent.children.length);
        }
        maxZIndex ++;
        node.zIndex = maxZIndex;
    }

});
