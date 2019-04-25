cc.Class({
    extends: cc.Component,

    properties: {
        phoneNum:cc.EditBox,
        code:cc.EditBox,
        password:cc.EditBox,
        repassword:cc.EditBox,
        _registTime:null
    },

    onLoad: function () {
        
    },

    onClickGetCode: function(){//获取验证码
        if(this._registTime){
            cc.module.wc.show("一分钟后才能获取验证码",true);
            return;
        }
        var phoneNum = this.phoneNum.string;
        console.log(phoneNum);
        var patrn = /1[3|5|7|8|]\d{9}/;
        if(patrn.test(phoneNum)){
            var url = "http://120.27.229.21/tongle/sendcode/index.php?phone="+phoneNum;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    console.log(response);
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        }
        else{
            cc.module.wc.show("请输入正确的手机号码",true);
        }
        this._registTime = 60;
        var Interval = setInterval(function () {
            this._registTime -= 1;
            if(this._registTime<=0)clearTimeout(Interval);
        }.bind(this),1000);
    },

    onClickCheckedCode:function(){//点击验证
        var phoneNum = this.phoneNum.string;
        var codeNum = this.code.string;
        console.log(codeNum);
        var patrn = /1[3|5|7|8|]\d{9}/;
        if(patrn.test(phoneNum) && codeNum){
            var url = "http://120.27.229.21/tongle/sendcode/verify.php?phone="+phoneNum +"&code="+codeNum;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    console.log(response);
                    if(response==1){
                        var setPasswordPanel = this.node.getChildByName("setPassword");
                        var pop = setPasswordPanel.getComponent("Pop");
                        pop && pop.pop();
                    }
                    else{
                        cc.module.wc.show("验证失败",true);
                    }
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
            this.phoneNum.string = "";
            this.code.string = "";
            this.node.active = false;
        }
        else if(!patrn.test(phoneNum)){
            cc.module.wc.show("请输入正确的手机号码",true);
        }
        else if(!codeNum){
            cc.module.wc.show("请输入验证码",true);
        }
    },

    onClickResetPassword:function(){
        var password = this.password.string;
        var repassword = this.repassword.string;
        if(!password){
            cc.module.wc.show("请设置密码",true);
        }
        else if(repassword != password){
            cc.module.wc.show("密码和确认密码不一致",true);
        }
        else if(password && (repassword == password)){
            cc.module.socket.send(SEvents.RESET_PASSWORD,{phoneNum:phoneNum,userId:cc.module.self.userId,password:password},true);
        }
    },

    update: function (dt) {
        
    },
});

