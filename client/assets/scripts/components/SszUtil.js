//exports = {};
var A2345IsMin = true;

var ElectionTypeScore = {
    WT: 10000000000000000,
    THS:9000000000000000,
    TZ: 8000000000000000,
    HL: 7000000000000000,
    TH: 6000000000000000,
    SZ: 5000000000000000,
    ST: 4000000000000000,
    LD: 3000000000000000,
    DZ: 2000000000000000,
    WL: 1000000000000000
};
//全一色,铁支比同花顺大
var _ElectionTypeScore = {
    WT: 10000000000000000,
    TZ: 9000000000000000,
    THS:8000000000000000,
    HL: 7000000000000000,
    TH: 6000000000000000,
    SZ: 5000000000000000,
    ST: 4000000000000000,
    LD: 3000000000000000,
    DZ: 2000000000000000,
    WL: 1000000000000000
};

exports._typeCardsSortByScores = _typeCardsSortByScores;

exports.delIds = delIds;

exports.idToPoint = idToPoint;

exports.getGroupAllPokerType = getGroupAllPokerType;

exports.getAllHoldTypeWithNormal = getAllHoldType;

exports.getAllHoldTypeWithSpecial = getSpecialType;

exports.sortIDByPointAndColor = sortIDByPointAndColor;

exports.getElectionByName = getElectionByName;

exports.getElectionScore = getElectionScore;

exports.getTypeNameAndScore = getTypeNameAndScore;

exports.isWL = function (score) {
    return parseInt(score/ElectionTypeScore.WL) === 1;
};

exports.isDZ = function (score) {
    return parseInt(score/ElectionTypeScore.DZ) === 1;
};

exports.isLD = function (score) {
    return parseInt(score/ElectionTypeScore.LD) === 1;
};
exports.isST = function (score) {
    return parseInt(score/ElectionTypeScore.ST) === 1;
};

exports.isHL = function (score) {
    return parseInt(score/ElectionTypeScore.HL) === 1;
};

exports.isTZ = function (score) {
    return parseInt(score/ElectionTypeScore.TZ) === 1;
};

exports.isTHS = function (score) {
    return parseInt(score/ElectionTypeScore.THS) === 1;
};

exports.isWT = function (score) {
    return parseInt(score/ElectionTypeScore.WT) === 1;
};

function clone(object) {
    var o={};
    if (object instanceof Array) {
        o = [];
    }
    for (var key in object) {
        o[key] = (typeof(object[key])==="object") && object[key] != null ? clone(object[key]) : object[key];
    }
    return o;
}

function getTypeNameAndScore(ids,isQys) {//全一色的铁支比同花顺大
    var score = exports.getElectionScore(ids.slice(),isQys);
    if(isQys){
        for(var i in ElectionTypeScore) {
            if(_ElectionTypeScore[i]/_ElectionTypeScore.WL === parseInt(score/_ElectionTypeScore.WL)) {
                return {
                    score:score,
                    name:i.toLowerCase(),
                    ids:ids
                }
            }
        }
    }
    else{
        // var score = exports.getElectionScore(ids.slice(),null);
        for(var i in ElectionTypeScore) {
            if(ElectionTypeScore[i]/ElectionTypeScore.WL === parseInt(score/ElectionTypeScore.WL)) {
                return {
                    score:score,
                    name:i.toLowerCase(),
                    ids:ids
                }
            }
        }
    }
}

//获得点数
function idToPoint(id) {
    if(id == 53 || id == 52) return id;
    return id%13+1;
}
function idsCount(ids) {
    ids.sort(function (a,b) {
        return b-a;
    });
    var total = 0;
    ids.forEach(function (id) {
        total += id;
    });
}
//获得点数数组
function idsToPoints(ids) {
    var points = [];
    ids.forEach(function (id) {
        points.push(idToPoint(id));
    });
    return points;
}
//获得花色
function idToColor(id) {
    if(id === 52) return 4;
    if(id === 53) return 5;
    return Math.floor(id/13);
}

//获得点数数组
function idsToColors(ids) {
    var points = [];
    ids.forEach(function (id) {
        points.push(idToColor(id));
    });
    return points;
}
//点数与花色转为id
function pointsToIds(points,color) {
    var ids = [];
    points.forEach(function (point) {
        if(point === 14) {
            point = 1;
        }
        ids.push(13*color+point-1);
    });
    return ids;
}
//获取点数统计
function getPointCountMap(ids) {
    /*
     * {
     *   "point":个数
     * }
     */
    var map = {};
    ids.forEach(function (id) {
        var point = idToPoint(id);
        var count = map[point];
        count = isValid(count) ? count+1 : 1;
        map[point] = count;
    });
    return map;
}
//获取花色统计
function getColorCountMap(ids) {
    /*
     *{
     *   "color":个数
     * }
     */
    var map = {};
    ids.forEach(function (id) {
        var color = idToColor(id);
        var count = map[color];
        count = isValid(count) ? count+1 : 1;
        map[color] = count;
    });
}

function getGroupByPoint(ids) {
    /*
     根据点数进行分组
     {
     "point":[id1,id2,id3]
     "point":[id1,id2]
     }
     */
    var game = cc.find("Canvas").getComponent("SszGame");
    var gameInfo = game.getGame();
    var gameRule = gameInfo.form.gameRule;
    var changeCard = gameInfo.changeCard;
    var group = {};
    ids.forEach(function (id) {
        var point = idToPoint(id);
        var arr = group[point];
        if(id !== 53 && id !== 52 && id !== (changeCard-26)){
            if(isValid(arr)) {
                arr.push(id);
            }
            else {
                group[point] = [];
                group[point].push(id);
            }
        }
    });
    return group;
}

function getGroupByResult(groupByPoker,length) {
    /*
     根据length进行分组
     {
     "point":[id1,id2]
     "point":[id1,id2]
     }
     */
    if(length <= 0) return [];
    var result = [];
    for (var prop in groupByPoker) {
        var pointIndexs = groupByPoker[prop];
        while (pointIndexs.length >= length) {//有多的分割多个数组
            var splices = pointIndexs.splice(0, length);
            if (splices.length >= length) result.push(splices);
        }
        //if (pointIndexs.length >= length) result.push(pointIndexs);
    }
    return result.filter(function(a){if(a) return true;});
}

function getGroupByColor(ids) {
    /*
     根据颜色进行分组
     {
     "color":[id1,id2,id3]
     "color":[id1,id2]
     }
     */
    var game = cc.find("Canvas").getComponent("SszGame");
    var gameInfo = game.getGame();
    var changeCard = gameInfo.changeCard;
    var group = {};
    ids.forEach(function (id) {
        var color = idToColor(id);
        var arr = group[color];
        if(id !== 53 && id !== 52 && id !== (changeCard-26)) {
            if (isValid(arr) || id == 53 || id == 52 || id == (changeCard-26)) {
                arr.push(id);
            }
            else {
                group[color] = [];
                group[color].push(id);
            }
        }
    });
    return group;
}
function getGroupByPointGui(ids) {
    /*
     获取鬼牌[]  //百变牌
     */
    var game = cc.find("Canvas").getComponent("SszGame");
    var gameInfo = game.getGame();
    var changeCard = gameInfo.changeCard;
    var group = [];
    ids.forEach(function (id) {
        if(id == 53 || id == 52 || id == (changeCard-26)){
            group.push(id);
        }
    });
    return group;
}

function getAllHoldType(ids) {
    if(!ids || !ids.length) {return;}
    var groupByPoint = getGroupByPoint(ids);
    var groupByColor = getGroupByColor(ids);
    var points = idsToPoints(ids);
    var pointsGui = getGroupByPointGui(ids);
    return {
        wt:isHoldWT(groupByPoint, pointsGui),
        ths:isHoldTHS(groupByColor, pointsGui),
        tz:isHoldTZ(groupByPoint, pointsGui),
        hl:isHoldHL(groupByPoint, pointsGui),
        th:isHoldTH(groupByColor, pointsGui),
        sz:isHoldSZ(points, pointsGui),
        st:isHoldST(groupByPoint, pointsGui),
        ld:isHoldLD(groupByPoint, pointsGui),
        dz:isHoldDZ(groupByPoint, pointsGui)
    };
}

function getSpecialType(ids) {
    var groupByPoint = getGroupByPoint(ids);
    var groupByColor = getGroupByColor(ids);
    var points = idsToPoints(ids);
    var pointsGui = getGroupByPointGui(ids);
    var types = {
        IS_QL:false,
        IS_YTL:false,
        IS_SRHZ:false,
        IS_STHS:false,
        IS_SFTX:false,
        IS_QD:false,
        IS_QX:false,
        IS_CYS:false,
        IS_STST:false,
        IS_WDST:false,
        IS_LDB:false,
        IS_SSZ:false,
        IS_STH:false
    };
    if(pointsGui.length > 0){
        return types;
    }
    if(isHoldQL(groupByPoint,groupByColor)) {
        types.IS_QL = true;
        return types;
    }
    else if(isHoldYTL(groupByPoint)) {
        types.IS_YTL = true;
        return types;
    }
    else if(isHoldSRHZ(points)) {
        types.IS_SRHZ = true;
        return types;
    }
    else if(isHoldSTHS(groupByPoint,groupByColor)) {
        types.IS_STHS = true;
        return types;
    }
    else if(isHoldSFTX(groupByPoint)) {
        types.IS_SFTX = true;
        return types;
    }
    else if(isHoldQD(points)) {
        types.IS_QD = true;
        return types;
    }
    else if(isHoldQX(points)) {
        types.IS_QX = true;
        return types;
    }
    else if(isHoldCYS(groupByColor)) {
        types.IS_CYS = true;
        return types;
    }
    else if(isHoldSTST(groupByPoint)) {
        types.IS_STST = true;
        return types;
    }
    else if(isHoldWDST(groupByPoint)) {
        types.IS_WDST = true;
        return types;
    }
    else if(isHoldLDB(groupByPoint)) {
        types.IS_LDB = true;
        return types;
    }
    else if(isHoldSSZ(points)) {
        types.IS_SSZ = true;
        return types;
    }
    else if(isHoldSTH(groupByColor)) {
        types.IS_STH = true;
        return types;
    }
    return types;
}

function isHoldWithA(arr,isID) {
    for(var i=0 ; i<arr.length ; i++) {
        var point = isID ? idToPoint(arr[i]) : arr[i];
        if(point === 1) {
            return true;
        }
    }
}
//默认升序排列
function sortIDByPoint(id1,id2,isDesc) {
    if(isDesc) {
        //降序
        return idToPoint(id2)-idToPoint(id1);
    }
    else {
        //升序
        return idToPoint(id1)-idToPoint(id2);
    }
}
//默认升序排列
function sortIDByColor(id1,id2,isDesc) {
    if(isDesc) {
        //降序
        return idToColor(id2)-idToColor(id1);
    }
    else {
        //升序
        return idToColor(id1)-idToColor(id2);
    }
}

function sortIDByPointAndColor(id1,id2,isDesc) {
    if(isDesc) {
        var rs1 = idToPoint(id2)-idToPoint(id1);
        rs1 = rs1===0 ? idToColor(id2)-idToColor(id1):rs1;
        return rs1;
    }
    else {
        var rs2 = idToPoint(id1)-idToPoint(id2);
        rs2 = rs2===0 ? idToColor(id1)-idToColor(id2):rs2;
        return rs2;
    }
}
//默认升序排列
function sortPointByPoint(point1,point2,isDesc) {
    if(isDesc) {
        //降序
        return point2-point1;
    }
    else {
        //升序
        return point1-point2;
    }
}

function turnOneATo14(points) {
    for(var i=0 ; i<points.length ; i++) {
        if(points[i] === 1) {
            points[i] = 14;
            return points;
        }
    }
    return points;
}

function turnAllATo14(points) {
    for(var i=0 ; i<points.length ; i++) {
        if(points[i] === 1) {
            points[i] = 14;
        }
    }
    return points;
}
/*----------------------------------特殊牌----------------------------------*/
//三同花
function isHoldSTH(groupByColor) {
    cc.sthSort = [];
    for(var i in groupByColor) {
        var length = groupByColor[i].length;
        if(length == 3){
            cc.sthSort[2] = groupByColor[i];
        }
        else if(length == 5){
            if(cc.sthSort[1]){
                cc.sthSort[0] = groupByColor[i];
            }else{
                cc.sthSort[1] = groupByColor[i];
            }
        }
        else if(length == 8){
            cc.sthSort[0] = groupByColor[i].slice(0,5);
            cc.sthSort[2] = groupByColor[i].slice(5,8);
        }
        var remainder = length % 5;
        if( remainder!==3 && remainder!==0) {
            cc.sthSort = null;
            return false;
        }
    }

    return true;
}
//三顺子
function isHoldSSZ(points) {
    /*
     var arr = [26,39,14,28,2,29,30,18,45,9,23,50,12];三顺子
     var arr = [12,11,2,40,3,43,44,16,17,31,19,0,7];三顺子
     var arr = [9,22,35,48,23,10,36,49,8,21,34,47,33];不是三顺子
     var arr = [39,1,41,29,30,14,28,42,4,5,18,32,46];三顺子
     */
    points.sort(sortPointByPoint);
    cc.sszSort = [];
    var r = checkIsHoldSSZ(points);
    if(!r && isHoldWithA(points)) {
        turnOneATo14(points);
        r = isHoldSSZ(points);
    }
    if(!r){
        cc.sszSort = null;
    }
    return r;
}
//检查是否是三顺子
function checkIsHoldSSZ(points){
    if(points.length === 0) {
        return true;
    }
    var notRepetPointOf5 = getNotRepeatOfNum(points , 5);
    var notRepetPointOf3 = false;
    var result = false;

    if(notRepetPointOf5) {
        if(isSZ(notRepetPointOf5.result)) {
            cc.sszSort[0] = notRepetPointOf5.result;
            result = checkIsHoldSSZ(notRepetPointOf5.theRest);
        }
        else {
            notRepetPointOf3 = getNotRepeatOfNum(points , 3);
            if(isSZ(notRepetPointOf3.result)) {
                cc.sszSort[2] = notRepetPointOf3.result;
                result = checkIsHoldSSZ(notRepetPointOf3.theRest);
            }
        }
    }
    if (result === false) {
        notRepetPointOf3 = getNotRepeatOfNum(points , 3);
        if(notRepetPointOf3 && isSZ(notRepetPointOf3.result)) {
            cc.sszSort[2] = notRepetPointOf3.result;
            result = checkIsHoldSSZ(notRepetPointOf3.theRest);
        }
    }
    return result;
}

//五对三条
function isHoldWDST(groupByPoint) {
    var odd = false;
    for(var i in groupByPoint) {
        if(groupByPoint[i].length%2 !== 0) {
            if(odd) {
                return false;
            }
            odd = groupByPoint[i].length;
        }
    }
    return odd == 3;
}
//六对半
function isHoldLDB(groupByPoint) {
    var odd = 0;
    for(var i in groupByPoint) {
        if(groupByPoint[i].length%2 !== 0) {
            if(odd) {
                return false;
            }
            odd ++;
        }
    }
    return odd == 1;
}
//四套三条
function isHoldSTST(groupByPoint) {
    var threeTol = 0;
    for(var i in groupByPoint) {
        if(groupByPoint[i].length >= 6) {
            threeTol += 2;
        }
        else if(groupByPoint[i].length >= 3) {
            threeTol ++;
        }
    }
    return threeTol===4;
}
//三分天下
function isHoldSFTX(groupByPoint) {
    var fourTol = 0;
    for(var i in groupByPoint) {
        if(groupByPoint[i].length >= 4) {
            fourTol ++;
        }
    }
    return fourTol===3;
}
//十二皇族
function isHoldSRHZ(groupByPoint) {
    for(var i in groupByPoint) {
        if(groupByPoint[i] <= 9) {
            return false;
        }
    }
    return true;
}
//全大
function isHoldQD(groupByPoint) {
    for(var i in groupByPoint) {
        if(groupByPoint[i] >= 9) {
            return false;
        }
    }
    return true;
}
//全小
function isHoldQX(groupByPoint) {
    for(var i in groupByPoint) {
        if(groupByPoint[i] >= 9 && groupByPoint[i] !== 1) {
            return false;
        }
    }
    return true;
}
//凑一色
function isHoldCYS(groupByPoint) {
    var color4 = groupByPoint[3] || [];
    var color3 = groupByPoint[2] || [];
    var color2 = groupByPoint[1] || [];
    var color1 = groupByPoint[0] || [];
    var black = color4.concat(color2);
    var red = color3.concat(color1);
    if(black.length == 13 || red.length == 13){
        return true;
    }
    return false;

}
//一条龙
function isHoldYTL(groupByPoint) {
    for(var i in groupByPoint) {
        if(groupByPoint[i].length > 1) {
            return false;
        }
    }
    return true;
}
//青龙
function isHoldQL(groupByPoint,groupByColor) {
    var isYTL = isHoldYTL(groupByPoint);
    var colorTol = 0;
    if(isYTL) {
        for(var i in groupByColor) {
            colorTol ++;
        }
    }
    return isYTL&&colorTol===1;
}
//三同花顺
function isHoldSTHS(groupByPoint,groupByColor) {
    //var arr = [15,35,16,17,26,32,33,34,14,36,37,38,31];
    var isSTH = isHoldSTH(groupByColor);
    if(!isSTH) {
        return false;
    }
    for(var i in groupByColor) {
        var points = idsToPoints(groupByColor[i]);
        var rs = isHoldSSZ(points);
        if(!rs) {
            return false;
        }
    }
    return true;
}
/*--------------------------------------普通牌型-------------------------------------*/
//五同
function isHoldWT(groupByPoint, pointsGui) {
    for(var i in groupByPoint) {
        if(groupByPoint[i].length >= 5-pointsGui.length) {
            return true;
        }
    }
    return false;
}
//同花顺
function isHoldTHS(groupByColor, pointsGui) {
    for(var i in groupByColor) {
        if(groupByColor[i].length >= 5-pointsGui.length) {
            var points = idsToPoints(groupByColor[i]);
            points = dereplication(points);//去重,对原数组无影响
            points.sort(sortPointByPoint);
            for(var i=0 ; i<=points.length-5+pointsGui.length ; i++) {
                if( isSZGui(points.slice(i,i+5-pointsGui.length),pointsGui) ) {
                    return true;
                }
            }
            if(isHoldWithA(points)) {
                points = turnOneATo14(points);
                points.sort(sortPointByPoint);
                for(var k=0 ; k<=points.length-5+pointsGui.length ; k++) {
                    if( isSZGui(points.slice(k,k+5-pointsGui.length),pointsGui) ) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
//铁支
function isHoldTZ(groupByPoint, pointsGui) {
    var fourTol = false;
    var oneTol = false;
    for(var i in groupByPoint) {
        if(groupByPoint[i].length >= 4-pointsGui.length) {
            fourTol ++;
        }
        else {
            oneTol ++;
        }
    }
    return (fourTol>=2) || (fourTol>=1 && oneTol>=1);
}
//葫芦
function isHoldHL(groupByPoint, pointsGui) {
    var threeTol = 0;
    var twoTol = 0;
    for(var i in groupByPoint) {
        if (groupByPoint[i].length >= 3) {
            threeTol ++;
        }
        else if(groupByPoint[i].length >= 2) {
            twoTol ++;
        }
    }
    return (threeTol>=2) || (threeTol>=1 && twoTol>=1) || (twoTol>=2 && pointsGui.length>=1);
}
//同花
function isHoldTH(groupByColor, pointsGui) {
    for(var i in groupByColor) {
        if(groupByColor[i].length >= 5-pointsGui.length) {
            return true;
        }
    }
    return false;
}
//顺子
function isHoldSZ(points, pointsGui) {//11s
    if(points.length < 5) {return false;}
    points = dereplication(points);
    points.sort(sortPointByPoint);
    for(var k=0 ; k<=points.length-5+pointsGui.length ; k++) {
        if( isSZGui(points.slice(k,k+5-pointsGui.length),pointsGui) ) {
            return true;
        }
    }
    if(isHoldWithA(points)) {
        points = turnOneATo14(points);
        points.sort(sortPointByPoint);
        for(var k=0 ; k<=points.length-5+pointsGui.length ; k++) {
            if( isSZGui(points.slice(k,k+5-pointsGui.length),pointsGui) ) {
                return true;
            }
        }
    }
    return false;
}
//三条
function isHoldST(groupByPoint, pointsGui) {
    for(var i in groupByPoint) {
        if(groupByPoint[i].length >= 3-pointsGui.length)return true;
    }
    return false;
}
//两对
function isHoldLD(groupByPoint, pointsGui) {
    var doubleTol = 0;
    for(var i in groupByPoint) {
        if(groupByPoint[i].length >= 2) {
            doubleTol ++;
        }
    }
    return doubleTol>=2;
}
//对子
function isHoldDZ(groupByPoint, pointsGui) {
    var lentgh = 2 - pointsGui.length <= 0?1:2 - pointsGui.length;
    for(var i in groupByPoint) {
        if(groupByPoint[i].length >= lentgh) {
            return true;
        }
    }
    return false;
}
//是否为顺子
function isSZ(points) {
    var last = null;
    points.sort(sortPointByPoint);
    for(var i=0 ; i<points.length ; i++) {
        if(last === null) {
            last = points[i];
        }
        else if(points[i] - last !== 1) {
            return false;
        }
        else {
            last = points[i];
        }
    }
    return true;
}

function isKQJAnd123(points) {
    if(!points || !points.length) return false;

    var is14 = true;//是A K Q J 10 ;

    var is1 = true;//是1 2 3 4 5

    points.forEach(function (card) {
        if (card < 10 && card != 1) is14 = false;
    });//不是A K Q J 10

    points.forEach(function (card) {
        if ((card > 5 && card != 14) && card != 20) is1 = false;
    });//不是1 2 3 4 5});
    return is14 || is1;
}

//是否为顺子 可检测鬼牌
function isSZGui(pointsA,pointsGui) {
    if(pointsA && pointsA.length){
        var points = pointsA.filter(function(point){return point <= 51;});
    }else{
        return false;
    }
    if( points.length +  pointsGui.length !== 5) return false;

    points.sort(function (a1, a2) {return a1 - a2;});
    var length = points.length - 1;
    var a1point = parseInt(points[length])/* == 1?14:parseInt(points[length])*/;
    var a2point = parseInt(points[0])/* == 1?14:parseInt(points[0])*/;

    var bool = a1point - a2point <= 4 || isKQJAnd123(points);

    if (bool) return true;

    return false;
}
//去重的方法
function dereplication(arr) {
    var result = [];
    arr.forEach(function (a) {
        if(result.indexOf(a) === -1) {
            result.push(a);
        }
    });
    return result;
}

//去重的方法
function dereplicationByPoint(ids) {
    var map = {};
    var result = [];
    ids.forEach(function (id) {
        var point = idToPoint(id);
        if(!isValid(map[point])) {
            map[point] = id;
            result.push(id);
        }
    });
    return result;
}

function getNotRepeatOfNum(arr,num) {
    var result = [];
    var newArr = arr.slice(0);
    for(var i=0 ; i<newArr.length ; ) {
        if(result.indexOf(newArr[i]) === -1) {
            result.push(newArr[i]);
            newArr.splice(i,1);
            if(result.length === num) {
                break;
            }
        }
        else {
            i++;
        }
    }
    if(result.length < num) {
        return false;
    }
    return {
        result:result,
        theRest:newArr
    }
}

function getNotRepeat(arr) {
    var result = [];
    var newArr = [];
    for(var i=0 ; i<arr.length ; i++) {
        if(result.indexOf(arr[i]) === -1) {
            result.push(arr[i]);
        }
        else {
            newArr.push(arr[i]);
        }
    }
    return {
        result:result,
        theRest:newArr
    };
}

function isValid(obj) {
    return obj!==null&&obj!==undefined;
}

function getAnWT(groupByPoint,lastElection,pointsGui,length,isRetuenAll) {
    var result = [];
    var lastIsST = lastElection===null?false:isHoldST(getGroupByPoint(lastElection),pointsGui);

    for (var t = 0; t < pointsGui.length + 1; t++) {

        var num = length - t == 0 ?1:length - t;

        var re = getGroupByResult(clone(groupByPoint),num);

        for (var i = 0; i < re.length; i++) {

            re[i] = re[i].concat(pointsGui.slice(0, length-num));

            re[i].sort(function (a,b) {
                return b-a;
            });
        }

        result = result.concat(re);
    }

    var resultArrays = reptAnSort(result);/*去重排序*/

    if(isRetuenAll) return resultArrays;

    if(!lastIsST) {
        return resultArrays[0];
    }
    lastElection.sort(function (a,b) {
        return b-a;
    });
    var lastIndex = -1;
    for(var i=0 ; i<resultArrays.length ; i++) {
        if(resultArrays[i].toString() === lastElection.toString()) {
            lastIndex = i;
            break;
        }
    }
    return resultArrays[(lastIndex+1) % resultArrays.length];
}

function getAnTHS(groupByColor,lastElection,pointsGui,isRetuenAll) {
    var lastIsTHS = (lastElection==null||lastElection.length!==5) ? false:isHoldTHS(getGroupByColor(lastElection),pointsGui);
    var allTHSMap = {};
    var pointTHS = [];
    var allTHS = [];
    var length = 5;
    for(var i in groupByColor) {
        for(var q=0 ; q < pointsGui.length+1 ; q++) {
            var num = length-q;
            if(groupByColor[i].length >= num) {
                var points = idsToPoints(groupByColor[i]);
                points = dereplication(points);//去重，对原数组无影响;
                points.sort(sortPointByPoint);

                for(var j=0 ; j<=points.length-num ; j++) {
                    if( isSZGui(points.slice(j , j+num), pointsGui.slice(0,q)) ) {
                        pointTHS.push( points.slice(j , j+num) );
                    }
                }
                if(isHoldWithA(points)) {
                    points = turnOneATo14(points);
                    points.sort(sortPointByPoint);
                    for(var k=0 ; k<=points.length-num ; k++) {
                        if( isSZGui(points.slice(k , k+num), pointsGui.slice(0,q)) ) {
                            pointTHS.push( points.slice(k , k+num) );
                        }
                    }
                }
                while (pointTHS.length > 0) {
                    var sz = pointTHS.pop();
                    var ids = pointsToIds(sz,parseInt(i)).concat(pointsGui.slice(0,q));
                    allTHSMap[ids.toString()] = ids;
                }
            }
        }
    }

    for(var i in allTHSMap) {
        allTHS.push(allTHSMap[i]);
    }
    allTHSMap = null;
    if(allTHS.length === 0) {
        return;
    }

    allTHS = reptAnSort(allTHS);/*去重排序*/

    if(isRetuenAll) return allTHS;
    if(!lastIsTHS) {
        return allTHS[0];
    }
    var game = cc.find("Canvas").getComponent("SszGame");
    var gameInfo = game.getGame();
    var gameRule = gameInfo.form.gameRule;
    var isQys = (gameRule=="qys");
    var lastIndex = -1;
    var lastScore = getElectionScore(lastElection,isQys);
    for(var i=0 ; i<allTHS.length ; i++) {
        if(lastScore === getElectionScore( allTHS[i],isQys) ) {
            lastIndex = i;
            break;
        }
    }
    return allTHS[(lastIndex+1) % allTHS.length];
}

function getAnHL(groupByPoint,lastElection,pointsGui,isRetuenAll) {
    var lastIsHL = (lastElection===null || lastElection.length!==5)?false:isHoldHL(getGroupByPoint(lastElection), pointsGui);

    var sanTiao = getAnWT(groupByPoint,lastElection,pointsGui,3,true); //三条没有带单牌
    var duiZi = getAnWT(groupByPoint,lastElection,pointsGui,2,true);   //对子没有带单牌
    if (duiZi.length < 1) {
        return;
    }
    if (sanTiao.length < 1) {
        return;
    }

    var allHL = [];

    sanTiao.forEach(function (i_3) {
        var s = i_3;
        duiZi.forEach(function (i_2) {
            if( idToPoint(i_2[0]) >= 1 && idToPoint(i_2[1]) <= 51){
                if(i_3.indexOf(i_2[0]) == -1 && i_3.indexOf(i_2[1]) == -1){
                    s = i_3.concat(i_2);
                    allHL.push(s);
                }
            }
        });
    });
    if (allHL.length < 1) {
        return;
    }
    allHL = reptAnSort(allHL);/*去重排序*/

    if(isRetuenAll) return allHL;
    if(!lastIsHL) {
        return allHL[0];
    }
    lastElection.sort(function (a,b) {
        return b-a;
    });
    allHL.forEach(function (arr) {
        arr.sort(function (id1,id2) {
            return id2-id1;
        });
    });
    var lastIndex = -1;
    for(var i=0 ; i<allHL.length ; i++) {
        if(allHL[i].toString() === lastElection.toString()) {
            lastIndex = i;
            break;
        }
    }
    return allHL[(lastIndex+1) % allHL.length];
}

function getAnSZ(ids,lastElection,pointsGui,isRetuenAll) {
    var lastIsSZ = (lastElection===null || lastElection.length!==5)?false:isHoldSZ(idsToPoints(lastElection),pointsGui);
    ids = ids.filter(function(id){return id !== 52 || id !== 53;});
    ids = dereplicationByPoint(ids);
    ids.sort(sortIDByPoint);
    var allSZ = [];
    var length = 5;

    for(var j=0 ; j < pointsGui.length+1 ; j++) {
        var num = length-j;
        for(var i=0 ; i<=ids.length-num ; i++) {
            if( isSZGui(idsToPoints(ids.slice(i,i+num)),pointsGui) ) {
                allSZ.push(ids.slice(i,i+num).concat(pointsGui.slice(0,j)));
            }
        }
    }

    if( isHoldWithA(ids,true) ) {
        ids.sort(function (id1,id2) {
            var point1 = idToPoint(id1);
            var point2 = idToPoint(id2);
            point1 = point1===1?14:point1;
            point2 = point2===1?14:point2;
            var rs = point1-point2;
            rs = rs===0 ? (idToColor(id1)-idToColor(id2)):rs;
            return rs;
        });
        for(var j=0 ; j < pointsGui.length+1 ; j++) {
            var num = length - j;
            for (var i = 0; i <= ids.length - num; i++) {
                var points = idsToPoints(ids.slice(i, i + num));
                points = turnAllATo14(points);
                if (isSZGui(points,pointsGui)) {
                    allSZ.push(ids.slice(i, i + num).concat(pointsGui.slice(0,j)));
                }
            }
        }
    }

    if(allSZ.length === 0) {
        return [];
    }
    var map = {};
    allSZ.forEach(function (arr) {
        arr.sort(function (a,b) {
            return b-a;
        });
        map[arr.toString()] = arr;
    });
    var allSZNoRepeat = [];
    for(var i in map) {
        allSZNoRepeat.push(map[i]);
    }

    allSZNoRepeat = reptAnSort(allSZNoRepeat);/*去重排序*/

    if(isRetuenAll) return allSZNoRepeat;
    if(!lastIsSZ) {
        return allSZNoRepeat[0];
    }
    lastElection.sort(function (a,b) {
        return b-a;
    });
    var lastIndex = -1;
    for(var i=0 ; i<allSZNoRepeat.length ; i++) {
        if(allSZNoRepeat[i].toString() === lastElection.toString()) {
            lastIndex = i;
            break;
        }
    }
    return allSZNoRepeat[(lastIndex+1) % allSZNoRepeat.length];
}

function getAnLD(groupByPoint,lastElection,isRetuenAll) {
    var lastIsLD = lastElection===null?false:isHoldLD(getGroupByPoint(lastElection));
    var priorityDZ = [];
    var minorDZ = [];
    for(var i in groupByPoint) {
        if(groupByPoint[i].length === 2) {
            priorityDZ.push(groupByPoint[i]);
        }
        else if(groupByPoint[i].length > 2) {
            minorDZ.push(groupByPoint[i].slice(0,2));
        }
    }
    if(priorityDZ.length+minorDZ.length <2) {
        return [];
    }
    priorityDZ.sort(function (arr1,arr2) {
        return idToPoint(arr2[0]) -  idToPoint(arr1[0]);
    });
    minorDZ.sort(function (arr1,arr2) {
        return idToPoint(arr2[0]) -  idToPoint(arr1[0]);
    });
    var allDZ = priorityDZ.concat(minorDZ);
    var allLDGroup = sampling(allDZ,2);
    var allLD = [];
    allLDGroup.forEach(function (group) {
        allLD.push(group[0].concat(group[1]));
    });
    var allOne = [];
    var lengthOf5 = [];
    for(var i in groupByPoint) {
        if(groupByPoint[i].length === 1) {
            allOne.push(groupByPoint[i][0]);
        }
    }
    allOne.sort(function (a,b) {
        var pointA = idToPoint(a);
        var pointB = idToPoint(b);
        pointA = pointA===1?14:pointA;
        pointB = pointB===1?14:pointB;
        return pointA-pointB;
    });
    if(allOne.length > 0) {
        for(var i=0 ; i<allLD.length ; i++) {
            allLD[i].push(allOne[0]);
            lengthOf5.push(allLD[i]);
        }
    }
    if(lengthOf5.length > 0) {
        allLD = lengthOf5;
    }
    allLD = reptAnSort(allLD);/*去重排序*/

    if(isRetuenAll) return allLD;
    if(!lastIsLD) {
        return allLD[0];
    }
    allLD.forEach(function (arr) {
        arr.sort(function (a,b) {
            return b-a;
        });
    });
    lastElection.sort(function (a,b) {
        return b-a;
    });
    var lastIndex = -1;
    for(var i=0 ; i<allLD.length ; i++) {
        if(allLD[i].toString() === lastElection.toString()) {
            lastIndex = i;
            break;
        }
    }
    return allLD[(lastIndex+1) % allLD.length];
}

/*去重排序*/
function reptAnSort(result,length) {
    var resultJsons = {};
    var game = cc.find("Canvas").getComponent("SszGame");
    var gameInfo = game.getGame();
    var gameRule = gameInfo.form.gameRule;
    var isQys = (gameRule=="qys");
    for (var i = 0; i < result.length; ++i) {
        var func = result[i];
        if (func && func.length > 0) {
            func = _typeCardsSortByScores(func);
            resultJsons[func.toString()] = func;
        }
    }
    var results = [];
    for (var i in resultJsons) {
        results.push(resultJsons[i]);
    }
    results.sort(function (group1,group2) {
        return getElectionScore(group2,isQys)-getElectionScore(group1,isQys);
    });
    if(length){
        var countFun = function(names,name){
            var count = 0;
            for(var f = 0;f < names.length;f++) {
                if(names[f] == name) count++;
            }
            return count;
        };
        var nameA = [];
        var resultA = [];
        for (var i = 0; i < results.length; ++i) {
            var result1 = results[i];
            var name1 = getTypeNameAndScore(result1,isQys);
            if(countFun(nameA,name1.name) < length){
                nameA.push(name1.name);
                resultA.push(result1);
            }
        }
        return resultA;
    }
    return results;
}

//抽样方法，返回所有的抽样结果
function sampling(arr,num) {
    var variable = "i";
    var codeStr = "";
    var result = [];
    for(var i=0 ; i<num ; i++) {
        if(i===0) {
            codeStr += "for(var "+variable+"=0 ; "+variable+"<arr.length ; "+variable+"++) {";
        }
        else {
            codeStr += "for(var "+variable+"="+variable.substr(1)+"+1 ; "+variable+"<arr.length ; "+variable+"++) { ";
        }
        variable += "i";
    }
    var tempI = "i";
    var tempStr = "";
    for(var k=0 ; k<num ; k++) {
        var lastSymbol = (k===num-1)?"":",";
        tempStr += "arr[" + tempI + "]" + lastSymbol;
        tempI += "i";
    }
    codeStr += "result.push(["+ tempStr +"])";
    for(var j=0 ; j<num ; j++) {
        codeStr += "}";
    }
    eval(codeStr);
    return result;
}
//根据名字获得一组牌
function getElectionByName(ids,name,lastElection) {
    if(!ids || ids.length === 0){return [];}
    var groupByPoint = getGroupByPoint(ids);
    var groupByColor = getGroupByColor(ids);
    var points = idsToPoints(ids);
    var pointsGui = getGroupByPointGui(ids);
    var groupByPointSZ = ids.slice();
    delIds(pointsGui,groupByPointSZ);//去重
    if(!lastElection || lastElection.length===0) {
        lastElection = null;
    }
    if(name === "wt") {
        return getAnWT(groupByPoint,lastElection,pointsGui,5);
    }
    else if(name === "ths") {
        return getAnTHS(groupByColor,lastElection,pointsGui);
    }
    else if(name === "tz") {
        return getAnWT(groupByPoint,lastElection,pointsGui,4);
    }
    else if(name === "hl") {
        return getAnHL(groupByPoint,lastElection,pointsGui);
    }
    else if(name === "th") {
        return getAnWT(groupByColor,lastElection,pointsGui,5);
    }
    else if(name === "sz") {
        return getAnSZ(groupByPointSZ,lastElection,pointsGui);
    }
    else if(name === "st") {
        return getAnWT(groupByPoint,lastElection,pointsGui,3);
    }
    else if(name === "ld") {
        return getAnLD(groupByPoint,lastElection,pointsGui);
    }
    else if(name === "dz") {
        return getAnWT(groupByPoint,lastElection,pointsGui,2);
    }
}
//获得组合的类型的得分
function getElectionTypeScore(ids,groupByPoint,groupByColor,points,pointsGui,isQys) {
    if(isHoldWT(groupByPoint,pointsGui)){
        return ElectionTypeScore.WT;
    } else if (isHoldTHS(groupByColor,pointsGui)) {
        if(isQys){
            return _ElectionTypeScore.THS;
        }
        else {
            return ElectionTypeScore.THS;  
        }
        // return ElectionTypeScore.THS;
    } else if (isHoldTZ(groupByPoint,pointsGui)) {
        if(isQys){
            return _ElectionTypeScore.TZ;
        }
        else {
            return ElectionTypeScore.TZ;  
        }
        // return ElectionTypeScore.TZ;
    } else if (isHoldHL(groupByPoint,pointsGui)) {
        return ElectionTypeScore.HL;
    } else if (isHoldTH(groupByColor,pointsGui)) {
        return ElectionTypeScore.TH;
    } else if (isHoldSZ(points,pointsGui)) {
        return ElectionTypeScore.SZ;
    } else if (isHoldST(groupByPoint,pointsGui)) {
        return ElectionTypeScore.ST;
    } else if (isHoldLD(groupByPoint,pointsGui)) {
        return ElectionTypeScore.LD;
    } else if (isHoldDZ(groupByPoint,pointsGui)) {
        return ElectionTypeScore.DZ;
    }
    return ElectionTypeScore.WL;
}

//获得组合的得分，即类型分+牌大小 --备份
// function getElectionScore(ids) {
//     if(!ids || !ids.length || ids.length <= 0) return -1;
//     ids = ids.slice();
//     ids = _typeCardsSortByScores(ids,true);

//     var groupByPoint = getGroupByPoint(ids);
//     var groupByColor = getGroupByColor(ids);
//     var points = idsToPoints(ids);
//     var colors = idsToColors(ids);
//     var pointsGui = getGroupByPointGui(ids);
//     var typeScore = getElectionTypeScore(ids,groupByPoint,groupByColor,points,pointsGui);
//     var totalValue = "";
//     var totalColor = "";

//     if(isHoldWithA(points)) points = turnAllATo14(points.slice());

//     if((typeScore == ElectionTypeScore.THS || typeScore == ElectionTypeScore.SZ) && pointsGui.length > 0){
//         points = _changeCardScors(points);
//     }
//     var ii = 0;
//     if(typeScore == ElectionTypeScore.DZ){
//         ii = 2;
//     }
//     if(typeScore == ElectionTypeScore.LD){
//         ii = 4;
//     }
//     if(typeScore == ElectionTypeScore.ST){
//         ii = 3;
//     }
//     for(var i=0+ii ; i<colors.length ; i++) {
//         totalColor += colors[i];
//     }
//     for(var i=0 ; i<ii ; i++) {
//         totalColor = "0"+totalColor;
//     }

//     var max = 0;
//     var maxValue = 1;
//     var scoresHelper = _getCardPointsSameCount(ids.slice());
//     for(var i in scoresHelper){
//         var p = parseInt(scoresHelper[i]);
//         if(p > maxValue) maxValue = p;
//     }
//     for(var i in scoresHelper){
//         var p = parseInt(i) == 1?14:parseInt(i);
//         if(maxValue == parseInt(scoresHelper[i]) && p < 50 && max < p){
//             max = p;
//         }
//     }

//     if(max!=0)points.sort(function (a1s, a2s) {
//         var a1 = a1s;
//         var a2 = a2s;
//         if(a1 > 50) a1 = max;
//         if(a2 > 50) a2 = max;
//         var numberOfCard1 = scoresHelper[a1 == 14?1:a1];
//         var numberOfCard2 = scoresHelper[a2 == 14?1:a2];
//         if (numberOfCard2 != numberOfCard1) return numberOfCard2 - numberOfCard1;
//         if(a1 == 1) a1 = 14;
//         if(a2 == 1) a2 = 14;
//         return a2 - a1;
//     });
//     if(pointsGui.length > 0 && pointsGui[0] == 53) totalColor = "66666";
//     if(pointsGui.length > 0 && pointsGui[0] == 52) totalColor = "55555";
//     if(typeScore == ElectionTypeScore.THS || typeScore == ElectionTypeScore.SZ){
//         var idss = ids.slice().sort(function(a,b){
//             return b-a;
//         });
//         var cp = points;
//         // var cp = points = points.map(function(a){if(a==14) a=1;return a;}).sort(function(a,b){
//         //     return (b==14?0:b)-(a==14?0:a);
//         // });

//         var is14 = true;//是A K Q J 10 ;

//         points.forEach(function (card) {if (card < 10 && card != 1) is14 = false;});

//         if(is14){
//             cp = points = points.map(function(a){if(a==1) a=14;return a;}).sort(function(a,b){
//                 return b-a;
//             });
//         }

//         for(var i = 0; i < cp.length;i++){
//             for(var j = 0; j < idss.length;j++){
//                 if( (idToPoint(idss[j]) == 1?14:idToPoint(idss[j])) == (cp[i] == 1?14:cp[i])){
//                     idss.splice(j,1);
//                     break;
//                 }
//             }
//         }
//         var ccs = {};
//         for(var i = 0; i < cp.length;i++){
//             for(var j = 0; j < ids.length;j++){
//                 if((cp[i] == 1?14:cp[i]) == (idToPoint(ids[j]) == 1?14:idToPoint(ids[j]))){
//                     ccs[i]=idToColor(ids[j]);
//                     break;
//                 }
//             }
//             if(ccs[i] == null || ccs[i] == undefined){
//                 ccs[i] = idToColor(idss.splice(0,1)[0]);
//             }
//         }
//         //console.log(cp)
//         //console.log(ccs)
//         //console.log(idss)
//         totalColor = "";
//         for(var i in ccs){
//             totalColor+=ccs[i];
//         }
//         if(typeScore == ElectionTypeScore.THS){
//             for(var i in ccs){
//                 if(ccs[i]<=3){
//                     totalColor=ccs[i]+"";
//                 }
//             }
//             totalColor=totalColor+totalColor+totalColor+totalColor+totalColor;
//         }
//     }

//     for(var i=0 ; i<points.length ; i++) {
//         var p = (points[i]>=10 ? ""+points[i] : "0"+points[i]);
//         if(p==1) p=14;
//         if(p>15) p = (max>=10 ? ""+max : "0"+max);
//         totalValue += p;
//     }

//     if((typeScore == ElectionTypeScore.TH) /*&& pointsGui.length > 0*/){
//         var objKeys = Object.keys(scoresHelper);
//         objKeys = objKeys.sort(function(a,b){
//             var a1 = scoresHelper[a];
//             var b1 = scoresHelper[b];
//             if(a1 != b1) return b1-a1;
//             return (parseInt(b)==1?14:parseInt(b))-(parseInt(a)==1?14:parseInt(a));
//         });//这里写所需要的规则
//         var totalCont = "";
//         totalValue = "";
//         for(var i=0;i<objKeys.length;i++){
//             var v = parseInt(scoresHelper[objKeys[i]]);
//             var k = parseInt(objKeys[i])==1?14:parseInt(objKeys[i]);
//             if(v == 3){
//                 totalCont = "3000";
//             }
//             else if(v == 2){
//                 totalCont += "20";
//             }
//             totalValue = totalValue+(k>=10 ? k : "0"+k);
//         }
//         totalValue = totalCont+totalValue;
//     }
//     if(ids.length == 3){
//         totalValue += "0000";
//         if(pointsGui.length <= 0) totalColor += "00";
//     }
    
//     if(typeScore == ElectionTypeScore.DZ){
//         var guiColorMia = false;
//         var idsColor = _typeCardsSortByScores(ids,guiColorMia);
//         var colorsMia = idsToColors(idsColor);
//         totalColor = "";
//         for(var i=2 ; i<colorsMia.length ; i++) {
//             totalColor += colorsMia[i];
//         }
//         totalColor="00"+totalColor;
//         if(ids.length == 3)totalColor="00"+totalColor;
//     }
//     return typeScore+parseInt(totalValue+totalColor);
// }

//获得组合的得分，即类型分+牌大小
function getElectionScore(ids,isQys) {
    if(!ids || !ids.length || ids.length <= 0) return -1;
    ids = ids.slice();
    ids = _typeCardsSortByScores(ids,true);

    var groupByPoint = getGroupByPoint(ids);
    var groupByColor = getGroupByColor(ids);
    var points = idsToPoints(ids);
    var colors = idsToColors(ids);
    var pointsGui = getGroupByPointGui(ids);
    var typeScore = getElectionTypeScore(ids,groupByPoint,groupByColor,points,pointsGui,isQys);
    var totalValue = "";
    var totalColor = "";

    if(isHoldWithA(points)) points = turnAllATo14(points.slice());

    if((typeScore == ElectionTypeScore.THS || typeScore == ElectionTypeScore.SZ) && pointsGui.length > 0){
        points = _changeCardScors(points);
    }
    var ii = 0;
    if(typeScore == ElectionTypeScore.DZ){
        ii = 2;
    }
    if(typeScore == ElectionTypeScore.LD){
        ii = 4;
    }
    if(typeScore == ElectionTypeScore.ST){
        ii = 3;
    }
    for(var i=0+ii ; i<colors.length ; i++) {
        totalColor += colors[i];
    }
    for(var i=0 ; i<ii ; i++) {
        totalColor = "0"+totalColor;
    }

    var max = 0;
    var maxValue = 1;
    var scoresHelper = _getCardPointsSameCount(ids.slice());
    for(var i in scoresHelper){
        var p = parseInt(scoresHelper[i]);
        if(p > maxValue) maxValue = p;
    }
    for(var i in scoresHelper){
        var p = parseInt(i) == 1?14:parseInt(i);
        if(maxValue == parseInt(scoresHelper[i]) && p < 50 && max < p){
            max = p;
        }
    }

    if(max!=0)points.sort(function (a1s, a2s) {
        var a1 = a1s;
        var a2 = a2s;
        if(a1 > 50) a1 = max;
        if(a2 > 50) a2 = max;
        var numberOfCard1 = scoresHelper[a1 == 14?1:a1];
        var numberOfCard2 = scoresHelper[a2 == 14?1:a2];
        if (numberOfCard2 != numberOfCard1) return numberOfCard2 - numberOfCard1;
        if(a1 == 1) a1 = 14;
        if(a2 == 1) a2 = 14;
        return a2 - a1;
    });

    var game = cc.find("Canvas").getComponent("SszGame");
    var gameInfo = game.getGame();
    var changeCard = gameInfo.changeCard;
    if(pointsGui.length > 0 && pointsGui[0] == 53) totalColor = "66666";
    if(pointsGui.length > 0 && pointsGui[0] == 52) totalColor = "55555";
    if(pointsGui.length > 0 && pointsGui[0] == (changeCard-26)) totalColor = "44444";

    if(typeScore == ElectionTypeScore.THS || typeScore == ElectionTypeScore.SZ){
        var idss = ids.slice().sort(function(a,b){
            return b-a;
        });
        var cp = points;
        // var cp = points = points.map(function(a){if(a==14) a=1;return a;}).sort(function(a,b){
        //     return (b==14?0:b)-(a==14?0:a);
        // });

        var is14 = true;//是A K Q J 10 ;

        points.forEach(function (card) {if (card < 10 && card != 1) is14 = false;});

        if(is14){
            cp = points = points.map(function(a){if(a==1) a=14;return a;}).sort(function(a,b){
                return b-a;
            });
        }

        for(var i = 0; i < cp.length;i++){
            for(var j = 0; j < idss.length;j++){
                if( (idToPoint(idss[j]) == 1?14:idToPoint(idss[j])) == (cp[i] == 1?14:cp[i])){
                    idss.splice(j,1);
                    break;
                }
            }
        }
        var ccs = {};
        for(var i = 0; i < cp.length;i++){
            for(var j = 0; j < ids.length;j++){
                if((cp[i] == 1?14:cp[i]) == (idToPoint(ids[j]) == 1?14:idToPoint(ids[j]))){
                    ccs[i]=idToColor(ids[j]);
                    break;
                }
            }
            if(ccs[i] == null || ccs[i] == undefined){
                ccs[i] = idToColor(idss.splice(0,1)[0]);
            }
        }
        //console.log(cp)
        //console.log(ccs)
        //console.log(idss)
        totalColor = "";
        for(var i in ccs){
            totalColor+=ccs[i];
        }
        if(typeScore == ElectionTypeScore.THS){
            for(var i in ccs){
                if(ccs[i]<=3){
                    totalColor=ccs[i]+"";
                }
            }
            totalColor=totalColor+totalColor+totalColor+totalColor+totalColor;
        }
    }

    for(var i=0 ; i<points.length ; i++) {
        var p = (points[i]>=10 ? ""+points[i] : "0"+points[i]);
        if(p==1) p=14;
        if(p>15) p = (max>=10 ? ""+max : "0"+max);
        totalValue += p;
    }

    if((typeScore == ElectionTypeScore.TH) /*&& pointsGui.length > 0*/){
        var objKeys = Object.keys(scoresHelper);
        objKeys = objKeys.sort(function(a,b){
            var a1 = scoresHelper[a];
            var b1 = scoresHelper[b];
            if(a1 != b1) return b1-a1;
            return (parseInt(b)==1?14:parseInt(b))-(parseInt(a)==1?14:parseInt(a));
        });//这里写所需要的规则
        var totalCont = "";
        totalValue = "";
        for(var i=0;i<objKeys.length;i++){
            var v = parseInt(scoresHelper[objKeys[i]]);
            var k = parseInt(objKeys[i])==1?14:parseInt(objKeys[i]);
            if(v == 3){
                totalCont = "3000";
            }
            else if(v == 2){
                totalCont += "20";
            }
            totalValue = totalValue+(k>=10 ? k : "0"+k);
        }
        totalValue = totalCont+totalValue;
    }
    if(ids.length == 3){
        totalValue += "0000";
        if(pointsGui.length <= 0) totalColor += "00";
    }
    
    if(typeScore == ElectionTypeScore.DZ){
        var guiColorMia = false;
        var idsColor = _typeCardsSortByScores(ids,guiColorMia);
        var colorsMia = idsToColors(idsColor);
        totalColor = "";
        for(var i=2 ; i<colorsMia.length ; i++) {
            totalColor += colorsMia[i];
        }
        totalColor="00"+totalColor;
        if(ids.length == 3)totalColor="00"+totalColor;
    }
    return typeScore+parseInt(totalValue+totalColor);
}

/*排序从多到少 大到小*/
function _typeCardsSortByScores(ids,guiMin,byColor) {
    var game = cc.find("Canvas").getComponent("SszGame");
    var gameInfo = game.getGame();
    var changeCard = gameInfo.changeCard;

    var cardsGui = [];
    var newCards = [];
    for (var i = 0; i < ids.length; i++) {
        var number = ids[i];
        if (parseInt(number) >= 52) {
            cardsGui.push(number);
        }
        else if (parseInt(number) == (changeCard-26)) {
            cardsGui.push(number);
        }
        else{
            newCards.push(number);
        }
    }
    var scoresHelper = _getCardPointsSameCount(newCards);
    newCards.sort(function (id1, id2) {
        var a1 = idToPoint(id1);
        var a2 = idToPoint(id2);

        var c1 = idToColor(id1);
        var c2 = idToColor(id2);

        var numberOfCard1 = scoresHelper[a1];
        var numberOfCard2 = scoresHelper[a2];
        if(byColor){
            if (c2 != c1) return c2 - c1;
        }else{
            if (numberOfCard2 != numberOfCard1) return numberOfCard2 - numberOfCard1;
        }

        if(a1 == 1) a1 = 14;
        if(a2 == 1) a2 = 14;
        var scores1 = a1 + c1 / 10;
        var scores2 = a2 + c2 / 10;
        if(byColor){
            scores2 = parseInt((a2>=10?a2:"0"+a2));
            scores1 = parseInt((a1>=10?a1:"0"+a1));
        }
        return scores2 - scores1;
    });

    cardsGui.sort(function (id1, id2) {return id2 - id1;});
    if(cardsGui.length > 0 && guiMin){
        newCards = newCards.concat(cardsGui);
    }else{
        newCards = cardsGui.concat(newCards);
    }
    return newCards;
}

/*统计牌的个数*/
function _getCardPointsSameCount(ids) {
    var cardNumbers = {};
    var cards = idsToPoints(ids);
    for(var i in cards){
        var s = cards[i];
        if(cardNumbers[s]){
            cardNumbers[s] ++;
        }else{
            cardNumbers[s] = 1;
        }
    }
    return cardNumbers;
}

/*有鬼牌的话改变牌的分*/
function _changeCardScors(points) {
    var is14 = true;//是A K Q J 10 ;
    var is1 = true;//是1 2 3 4 5
    points = points.slice();
    points.forEach(function (card) {
        if (card < 10 && card != 1) is14 = false;
    });//不是A K Q J 10

    points.forEach(function (card) {
        if ((card > 5 && card != 14) && card < 52) is1 = false;
    });//不是1 2 3 4 5

    if(points.indexOf(14)==-1) is1 = false;//不是1 2 3 4 5;

    if (is14) { //是A K Q J 10 ;
        points.sort(function (a1, a2) {return a2 - a1;});
        var num = 14,
        scoresAyy = []; //一副牌的分数
        for (var i = 0; i < 5; i++) {
            scoresAyy.push(num);
            num -= 1;
        }
        for (var j = 0; j < scoresAyy.length; j++) {
            for (var i = 0; i < points.length; i++) {
                var cardScores = points[i];
                if (cardScores == scoresAyy[j] && cardScores < 15) scoresAyy.splice(j, 1); //删除不是鬼牌的分
            }
        }
        for (var j = 0; j < points.length; j++) {
            if (points[j] >= 52){
                points[j] = scoresAyy.splice(0, 1)[0];
            }
        }
    }
    else if (is1) { //是1 2 3 4 5
        points.sort(function (a1, a2) {return a2 - a1;});
        var num = 5,
        scoresAyy = []; //一副牌的分数
        for (var i = 0; i < 5; i++) {
            scoresAyy.push(num);
            num -= 1;
        }
        for (var i = 0; i < points.length; i++) {
            for (var j = 0; j < scoresAyy.length; j++) {
                var cardScores = points[i] == 14?1:points[i];
                if (cardScores == scoresAyy[j] && cardScores < 15){
                    scoresAyy.splice(j, 1);
                    break;
                }
            }
        }
        for (var j = 0; j < points.length; j++) {
            if (points[j] >= 52){
                points[j] = scoresAyy.splice(0, 1)[0];
            }
        }
    }
    else {
        points.sort(function (a1, a2) {return a1 - a2;});
        var scoresAyy = []; //用来装鬼牌分数
        for (var i = 0; i < 5; i++) {
            var s = parseInt(points[0]) + i; //最小的牌的分数
            scoresAyy.push(s);//一副牌的分数
        }
        for (var j = 0; j < scoresAyy.length; j++) {
            for (var i = 0; i < points.length; i++) {
                var cardScores = points[i];
                if (cardScores == scoresAyy[j] && cardScores < 15) scoresAyy.splice(j, 1); //删除不是鬼牌的分
            }
        }
        for (var j = 0; j < points.length; j++) {
            if (points[j] >= 52){
                points[j] = scoresAyy.splice(0, 1)[0];
            }
        } //改变牌的分数
    }
    points.sort(function (a1, a2) {return a2 - a1;});
    return points;
}

/*delIds要删除的 toDelIds被删除的*/
function delIds(delIds,toDelIds) {
    for(var i = 0; i < delIds.length;i++){
        var s = delIds[i];
        var indexs = toDelIds.indexOf(s);
        if(indexs >= 0) toDelIds.splice(indexs,1);
    }
}
/*选出分数最大的一组*/
function autoSelectCards (ids,isReturnAll,index,guiMin){
    if(!ids || ids.length === 0){return [];}
    if(!index) index = 0;
    var groupByPoint = getGroupByPoint(ids);
    var groupByColor = getGroupByColor(ids);
    var pointsGui = getGroupByPointGui(ids);
    var groupByPointSZ = ids.slice();
    delIds(pointsGui,groupByPointSZ);//去重
    var findFuncs = [
        getAnWT(groupByPoint,null,pointsGui,5,true),
        getAnTHS(groupByColor,null,pointsGui,true),
        getAnWT(groupByPoint,null,pointsGui,4,true),
        getAnHL(groupByPoint,null,pointsGui,true),
        getAnWT(groupByColor,null,pointsGui,5,true),
        getAnSZ(groupByPointSZ,null,pointsGui,true),
        getAnWT(groupByPoint,null,pointsGui,3,true),
        getAnLD(groupByPoint,null,pointsGui,true),
        getAnWT(groupByPoint,null,pointsGui,2,true),
    ];
    var indexArrays = [];
    var game = cc.find("Canvas").getComponent("SszGame");
    var gameInfo = game.getGame();
    var gameRule = gameInfo.form.gameRule;
    var isQys = (gameRule=="qys");
    for (var i = index; i < findFuncs.length; ++i) {
        var func = findFuncs[i];
        if (func && func.length > 0) {
            indexArrays = indexArrays.concat(func);
            indexArrays = reptAnSort(indexArrays);/*去重排序*/
            index = i+1;
            if(!isReturnAll) break;
        }
    }
    var idsArrAy = [];
    if (indexArrays && indexArrays.length > 0) {
        if(isReturnAll) return indexArrays;//返回全部
        // 找出同类型的牌里的分数最大的牌
        var maxScore = 0;
        indexArrays.forEach(function(idsArr){
            var score = getElectionScore(idsArr,isQys);
            var scoreStr = score+"";
            //var s1 = scoreStr.indexOf("52");
            //var s2 = scoreStr.indexOf("53");
            if(guiMin/* && (s1 < 5 || s1 < 6)*/){
                score = parseInt(scoreStr.replace('52', '00'));
                score = parseInt(scoreStr.replace('53', '00'));
            }
            if (score > maxScore) {
                maxScore = score;
                idsArrAy = idsArr;
            }
        });
    }
    return idsArrAy || [];
}

function getGroupAllPokerType(ids){
    //ids = [38,11,36,36,23,10,21,46,19,31,40,14,1];
    if(!ids || !ids.length || ids.length != 13) return;
    var game = cc.find("Canvas").getComponent("SszGame");
    var gameInfo = game.getGame();
    var gameRule = gameInfo.form.gameRule;
    var isQys = (gameRule=="qys");
    var length = 20;
    /*找出头道*/
    var tou = {};
    var zhong = {};
    var wei = autoSelectCards(ids.slice(),true).sort(function (arr1,arr2) {
        return getElectionScore(arr2,isQys)-getElectionScore(arr1,isQys);
    });
    wei = reptAnSort(wei,3).slice(0,length);/*去重排序*/
    var allTypeCards = [];
    /*找出中尾两道*/
    for(var i = 0;i < wei.length;i++){
        var cardsWei = wei[i];
        var newIds = _typeCardsSortByScores(ids.slice());
        /*从剩下的牌找出中道*/
        delIds(cardsWei,newIds);//去重
        var cardsZhongArrAy = autoSelectCards(newIds.slice(),true).sort(function (arr1,arr2) {
            return getElectionScore(arr2,isQys)-getElectionScore(arr1,isQys);
        });
        var cardsZhong = newIds.slice(0,5)||[];
        var max = 0;
        for (var j = 0; j < cardsZhongArrAy.length; ++j) {
            var scoreZhong = cardsZhongArrAy[j];
            /*找出最大的牌并且没有倒水的*/
            var z = getElectionScore(scoreZhong.slice(),isQys);
            if(max<z){
                max = z;
                cardsZhong = scoreZhong;
                //break;
            }
        }
        /*从剩下的牌找出头道*/
        delIds(cardsZhong,newIds);
        var cardsTouArrAy = autoSelectCards(newIds.slice(),true).sort(function (arr1,arr2) {
            return getElectionScore(arr2,isQys)-getElectionScore(arr1,isQys);
        });
        //console.log(newIds)
        var cardsTou = newIds.slice(0,3)||[];
        for (var j = 0; j < cardsTouArrAy.length; ++j) {
            var scoreTou = cardsTouArrAy[j];
            /*找出最大的牌并且没有倒水的*/
            if( getElectionScore(cardsZhong,isQys)>getElectionScore(scoreTou.slice(),isQys) ){
                cardsTou = scoreTou;
            }
        }
        var arrays = [];
        arrays.push(cardsWei);
        arrays.push(cardsZhong);
        arrays.push(cardsTou);
        allTypeCards.push(arrays);
    }
    /*整合头中尾三道*/
    var newId1s = ids.slice();
    var newW = autoSelectCards(newId1s,false,false,true) || [];
    delIds(newW,newId1s);//去重
    var newZ = autoSelectCards(newId1s,false,false,true) || [];
    delIds(newZ,newId1s);//去重
    var newT = autoSelectCards(newId1s,false,false,true) || [];
    allTypeCards.push([newW,newZ,newT]);
    //if(allTypeCards.length >= 0){
    var arr = [];
    var newIds = _typeCardsSortByScores(ids.slice());
    arr.push(newIds.slice(0,5));
    arr.push(newIds.slice(5,10));
    arr.push(newIds.slice(10,13));
    allTypeCards.push(arr);
    //}
    /*补全*/
    for(var i = 0;i < allTypeCards.length;i++){
        var newIds = ids.slice().sort(function(id1,id2){
            var a1 = idToPoint(id1) == 1?14:idToPoint(id1);
            var a2 = idToPoint(id2) == 1?14:idToPoint(id2);
            return a1-a2;
        });
        var typeCards = allTypeCards[i];
        delIds(typeCards[0],newIds);//去重
        delIds(typeCards[1],newIds);
        delIds(typeCards[2],newIds);
        while(newIds && newIds.length && newIds.length >= 1 && typeCards[0].length < 5){
            typeCards[0] = typeCards[0].concat(newIds.pop());
        }
        while(newIds && newIds.length && newIds.length >= 1 && typeCards[1].length < 5){
            typeCards[1] = typeCards[1].concat(newIds.pop());
        }
        while(newIds && newIds.length && newIds.length >= 1 && typeCards[2].length < 3){
            typeCards[2] = typeCards[2].concat(newIds.pop());
        }
        /*尾中倒水的话掉个位置*/
        if( getElectionScore(typeCards[0],isQys) < getElectionScore(typeCards[1],isQys) ){
            var tmp = typeCards[0];
            typeCards[0] = typeCards[1];
            typeCards[1] = tmp;
        }
        /*头中倒水的话删了*/
        if( getElectionScore(typeCards[1],isQys) < getElectionScore(typeCards[2],isQys) ){
            typeCards[0] = [];
            typeCards[1] = [];
            typeCards[2] = [];
        }
        typeCards[0] = typeCards[0] || [];
        typeCards[1] = typeCards[1] || [];
        typeCards[2] = typeCards[2] || [];
        //if(typeCards[0].length !== 5 || typeCards[1].length !== 5 || typeCards[2].length !== 3){
        //    allTypeCards.splice(i,1);
        //}
    }
    var newAllTypeCards = [];
    var namesArrAy = [];
    for(var i = 0;i < allTypeCards.length;i++){
        var typeCards = allTypeCards[i];
        if(typeCards[0].length == 5 && typeCards[1].length == 5 && typeCards[2].length == 3){
            var newTypeCards = [];
            newTypeCards[0] = getTypeNameAndScore( _typeCardsSortByScores(typeCards[0].slice(),isQys) );
            newTypeCards[1] = getTypeNameAndScore( _typeCardsSortByScores(typeCards[1].slice(),isQys) );
            newTypeCards[2] = getTypeNameAndScore( _typeCardsSortByScores(typeCards[2].slice(),isQys) );
            /*去重复类型的*/
            var names = newTypeCards[0].name+newTypeCards[1].name+newTypeCards[2].name;
            if(namesArrAy.indexOf(names) == -1){
                namesArrAy.push(names);
                newAllTypeCards.push(newTypeCards);
            }
        }
    }
    /*排序*/
    newAllTypeCards.sort(function (a1,a2) {
        var b0 = parseInt( (a2[0].score)/1000000000000000 ) + "";
        var b1 = parseInt( (a2[1].score)/1000000000000000 ) + "";
        var b2 = parseInt( (a2[2].score)/1000000000000000 ) + "";

        var s0 = parseInt( (a1[0].score)/1000000000000000 ) + "";
        var s1 = parseInt( (a1[1].score)/1000000000000000 ) + "";
        var s2 = parseInt( (a1[2].score)/1000000000000000 ) + "";

        var s = parseInt(s0 + s1 + s2);
        var b = parseInt(b0 + b1 + b2);
        return b - s;
    });
    return newAllTypeCards.slice(0,3);
}


//var ids = [4,5,2+3*13,
//    10,8,7+3*13,7+1*13,9+1*13,
//11+2*13,10+2*13,9+2*13,8+2*13,52];
//var cc = {};
//var ids = [1,2,3,
//    4,5,6,7,8,
//    9,10,11,12,13];
//isHoldSSZ(ids)
//console.log(cc)
//var ids = [8+1*13,1+1*13,5+1*13,2+1*13,52];
//var ids = [0+1*13,1+1*13,3,4+3*13,2+3*13,0+2*13,1+3*13,3+3*13,4,53 ,0,0,0];
//var idss = [0+0*13,1+0*13,3+0*13,7,53];
////console.log(getElectionScore(idss)>getElectionScore(ids));
//console.log(getElectionScore(ids));
//console.log(getElectionScore(idss));
//autoSelectCards(ids.slice(),true)
//autoSelectCards(arsdfsdfr,false,false,true));
