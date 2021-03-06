var dynamicId,photosArr,chatBox,replyTotal,key,laudTotal,emotionData,uploadId,laudLock=false,userId;
function getRewardData(){
	
	api.ajax({
	    url:ApiUrl + '/index.php?act=member_travels&op=det_travels',
	    method: 'post',
	    dataType: 'json',
	    data: {values:{key:$api.getStorage('key'),dynamicId:api.pageParam['dynamicId']}}
    },function(ret,err){
    	//coding...
    	if (ret) {
            var content = $api.byId('dynamic-reward');
            var tpl = $api.byId('reward-template').text;
            var tempFn = doT.template(tpl);
            $api.prepend(content,tempFn(ret));
            api.parseTapmode();
            echo.init({
                offset: 100,
                throttle: 250,
                callback: function (element, op) {
                }
            });
        } else {
        
            if(err.code!=3){
                api.toast({
                    msg: err.msg,
                    duration:2000,
                    location: 'top'
                });
            }
        }
    });
}
//举报
function report(){
    api.prompt({
        title:'举报',
        msg:'请输入举报理由',
        buttons:['确定', '取消']
    },function(ret,err){
        if(ret.buttonIndex == 1){
            var data = {};
            data['userid'] = userid;
            data['dynamicid'] = dynamicId;
            data['remarks'] = ret.text;
            var url = '&c=dynamic_app&a=report'; 
            ajaxRequest(url, 'post', data, function (ret, err) {
                if(ret.status==1){
                    api.toast({
                        msg: '举报成功',
                        duration:2000,
                        location: 'top'
                    });
                }
            })
        }
    });
}
function reward(){
  /*  api.openFrame({
        name: 'dynamic_reward_frm',
        url: 'dynamic_reward_frm.html',
        bgColor: 'rgba(0,0,0,0)',
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        pageParam: {dynamicId: dynamicId},
        bounces: false,
        vScrollBarEnabled: false,
        hScrollBarEnabled: false
    });*/
  api.toast({
    msg: '正在开发中...',
    duration:2000,
    location: 'top'
});
}
var sourcePath = "widget://image/emotion";//表情存放目录
var emotionData;//存储表情
function transText(text, imgWidth, imgHeight){
    var imgWidth = imgWidth || 24;
    var imgHeight = imgHeight || 24;
    var regx= /\[(.*?)\]/gm;
    var textTransed = text.replace(regx,function(match){
        var imgSrc = emotionData[match];
        if( !imgSrc){ /* 说明不对应任何表情,直接返回即可.*/
            return match;
        }
        var img = "<img src='" + imgSrc+ "' width='" + imgWidth +  "' height ='" + imgHeight +"' />";
        return img;
    });
    return textTransed;   
}
/*获取所有表情图片的名称和真实URL地址，以JSON对象形式返回。其中以表情文本为 属性名，以图片真实路径为属性值*/
function getImgsPaths(sourcePathOfChatBox, callback){
    var jsonPath = sourcePathOfChatBox + "/emotion.json";//表情的JSON数组
    api.readFile({
        path: jsonPath
    },function(ret,err){
        if(ret.status){
            var emotionArray = JSON.parse(ret.data);
            var emotion = {};
            for(var i in emotionArray){
                var emotionItem = emotionArray[i];
                var emotionText = emotionItem["text"];
                var emotionUrl = "../image/emotion/"+emotionItem["name"]+".png";
                emotion[emotionText] = emotionUrl;
            }
            /*把emotion对象 回调出去*/
            if("function" === typeof(callback)){
                callback(emotion);
            }
        }
    });
}
function spaceShow(toUserid){
    api.openWin({
        name: 'space_win',
        url: 'space_win.html',
        pageParam: {toUserid: toUserid},
        delay: 300
    });
}

function reply(touserid,tonickname){
    //chatBox
    chatBox.close();
    //var frameHeight = api.frameHeight; 
    /*api.setFrameAttr({
        name: 'dynamic_show_frm',
        rect:{
            h:frameHeight-50
        }
    });*/
    chatBox.open({
        placeholder: '回复:'+tonickname,
        maxRows: 4,
        emotionPath: sourcePath,
        styles: {
            inputBar: {
                borderColor: '#d9d9d9',
                bgColor: '#f2f2f2'
            },
            inputBox: {
                borderColor: '#B3B3B3',
                bgColor: '#FFFFFF'
            },
            emotionBtn: {
                normalImg: 'widget://image/chatBox/face1.png'
            },
            keyboardBtn: {
                normalImg: 'widget://image/chatBox/key1.png'
            }
        }
    }, function(ret){
        //点击发送按钮
        if(ret.eventType=='send'){
       
            if(ret.msg){
                //alert(JSON.stringify(ret.msg));
                //回复内容
                var newData = [];
                var newDataArr = [];
                newDataArr[0] = newData;
              //  newData['usernickname'] = nickname;
                newData['member_avatar'] = avatar;
                newData['member_name'] = tonickname;
                newData['com_content'] = transText(ret.msg);
                newData['inputtime'] = '刚刚';
                //alert(transText(ret.msg));
                //同步至服务器
                var data = {};
                data['uploadId'] = uploadId;
              //  data['userid'] = userid;
              //  data['encrypt'] = encrypt;
                data['content'] = ret.msg;
                data['touid'] = touserid;
                
              //  alert(JSON.stringify(data));
                if(data['content']){
                   // var replyUrl = '/index.php?act=member_travels&op=img_add_com';
                    api.ajax({
	                    url: ApiUrl + '/index.php?act=member_travels&op=img_com_add',
				        method: 'post',
				        dataType: 'json',
	                    data:{
	                    	values:{key:key,uploadId:uploadId,content:ret.msg}
	                    }
                    },function(retData,errI){
                    	//coding...
                    	//alert(JSON.stringify(retData));
                        if(retData.datas.msg.stats==1){
                            insertReply(newDataArr);
                            chatBox.closeKeyboard();
                        }else{
                        	api.toast({
	                            msg:'回复失败',
	                            duration:2000,
                   				location: 'top'
                            });
                                            
                        }               	
                    	
                    });
                   /* ajaxRequest(replyUrl, 'post', data, function (retData, err) {

                    })*/
                    
                }
            }
        }
    });
    /*chatBox.open({
        switchButton:{
            faceNormal : "widget://image/chatBox/face1.png",
            faceHighlight : "widget://image/chatBox/face1.png",
            addNormal : "",
            addHighlight : "",
            keyboardNormal : "widget://image/chatBox/key1.png",
            keyboardHighlight : "widget://image/chatBox/key1.png"
        },
        sourcePath:sourcePath,
        //addButtons:addButtonAry,
        placeholder: '回复:'+tonickname
    },function(ret,err){
        //alert(ret.eventType);
        if(ret.eventType=='send'){
            if(ret.msg){
                //alert(JSON.stringify(ret.msg));
                //回复内容
                var newData = [];
                var newDataArr = [];
                newDataArr[0] = newData;
                newData['usernickname'] = nickname;
                newData['useravatar'] = avatar;
                newData['tonickname'] = tonickname;
                newData['content'] = transText(ret.msg);
                newData['inputtime'] = '刚刚';
                //alert(transText(ret.msg));
                //同步至服务器
                var data = {};
                data['dynamicid'] = dynamicId;
                data['userid'] = userid;
                data['encrypt'] = encrypt;
                data['content'] = ret.msg;
                data['touid'] = touserid;
                if(data['content']){
                    var replyUrl = '&c=dynamic_app&a=reply';
                    ajaxRequest(replyUrl, 'post', data, function (retData, err) {
                        if(retData){
                            insertReply(newDataArr);
                        }
                    })
                    
                }
            }
        }
    });*/
}

function insertReply(newDataArr){
    var frameHeight = api.frameHeight;
    var content = $api.byId('dynamic-reply');
    var tpl = $api.byId('dynamicReply-template').text;
    var tempFn = doT.template(tpl);

    var noReply = $api.byId('noReply');
    if(noReply){
        $api.remove(noReply);
    }
    $api.prepend(content,tempFn(newDataArr));
    echo.init({
        offset: 100,
        throttle: 250,
        callback: function (element, op) {
        }
    });
    //回复数增加
 //   alert(replyTotal);
    replyTotal += 1;
    var replyTotalBox = $api.byId("replyTotal");
    $api.html(replyTotalBox,' '+replyTotal);
    

    //隐藏chatBox并还原frame高度
    /*setTimeout(function(){
        chatBox.close();
        api.setFrameAttr({
            name: 'dynamic_show_frm',
            rect:{
                h:frameHeight
            }reply(
        });
    },260);*/
    //向列表页发送事件更新数量
    api.sendEvent({
        name: 'updateReplyCount',
        extra:{dynamicId:dynamicId,newReplyTotal:replyTotal}
    });
}
function laud(touserid){
   /* if(laudLock==false){
        laudTotal += 1;

        var laudTotalBox = $api.byId("laudTotal");
        $api.html(laudTotalBox,' '+laudTotal);
        $api.addCls(laudTotalBox,'laud');
        //laudTotal = true;
        api.parseTapmode();
        $api.removeAttr(laudTotalBox, 'onclick');
        api.parseTapmode();
        var laudUrl = '&c=dynamic_app&a=laud';
        var data = {};
        data['dynamicid'] = dynamicId;
        data['userid'] = userid;
        laudLock = true;
        ajaxRequest(laudUrl, 'post', data, function (ret, err) {
            if(ret.status==1){
                //laudTotal = true;
                //向列表页发送事件更新数量
                api.sendEvent({
                    name: 'updateLaudCount',
                    extra:{dynamicId:dynamicId,newLaudTotal:laudTotal}
                });
            }
        })

        
    }*/
   api.toast({
	   msg:'正在开发中...',
	   duration:2000,
       location: 'top'
   });
    

}

function getOtherData(){
    //获得回复，点赞统计
    var getCountUrl = '&c=dynamic_app&a=dynamicOtherCount&dynamicid='+dynamicId;
    ajaxRequest(getCountUrl, 'GET', '', function (ret, err) {
        if (ret) {
            //alert(JSON.stringify(ret));
            var replyTotalBox = $api.byId("replyTotal");
            var laudTotalBox = $api.byId("laudTotal");
            $api.html(replyTotalBox,' '+ret.replyTotal);
            $api.html(laudTotalBox,' '+ret.laudTotal);
        }
    })
    hideLoading();
}
function getReplyData () {

    var getDynamicUrl = '/index.php?act=member_travels&op=img_com_list&uploadId='+uploadId+'&key='+key;
    ajaxRequest(getDynamicUrl, 'GET', '', function (ret, err) {
        
        if (ret.datas.data.stats==1) {
            var jsonData = ret.datas.imgcom_list;
            
            replyTotal = ret.datas.replyTotal;
            //替换内容表情
            for(var i in jsonData){
                jsonData[i]['com_content'] = transText(jsonData[i].com_content);
                
           }
           // alert(JSON.stringify(jsonData));
            var content = $api.byId('dynamic-reply');
            var tpl = $api.byId('dynamicReply-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,'');
            $api.prepend(content,tempFn(jsonData));
           /* if(jsonData.lenght>0){
                $api.html(content,'');
                $api.prepend(content,tempFn(jsonData));
                echo.init({
                    offset: 100,
                    throttle: 250,
                    callback: function (element, op) {
                    }
                });
            }*/
            api.parseTapmode();
        } else {
            if(err.code!=3){
                api.toast({
                    msg: err.msg,
                    duration:2000,
                    location: 'top'
                    
                });
            }
        }
    })
}
function spaceShow(toUserid){
    api.openWin({
        name: 'space_win',
        url: 'space_win.html',
        pageParam: {toUserid: toUserid},
        delay: 300
    });
}
function getLikeData(){
    var getDynamicUrl = '/index.php?act=member_travels&op=img_fol_list&uploadId='+uploadId+'&key='+key;
    ajaxRequest(getDynamicUrl, 'GET', '', function (ret, err) {
    	if(ret.datas.status == 1){
    		var retd = ret.datas.like_list;
            var content = $api.byId('dynamic-like');
            var tpl = $api.byId('dynamicLike-template').text;
            var tempFn = doT.template(tpl);
            var count = $api.byId('like-count');
            $api.text(count, retd.length);
            $api.html(content,'');
            $api.prepend(content,tempFn(retd));
    	}else{
            var count = $api.byId('like-count');
            $api.text(count, '0');
    	}
    })
}
function getData(){

	api.ajax({
	    url:ApiUrl + '/index.php?act=member_travels&op=img_com_info&key='+key+'&uploadId='+uploadId+'&userId='+userId,
	    method: 'get',
	    dataType: 'json',
	    data:{}
    },function(ret,err){
    	//coding...
    	//alert(JSON.stringify(ret));
    	if (ret.datas.data.stats==1) {
            var jsonData = ret.datas.img_info;
           // alert(JSON.stringify(jsonData));
           // laudTotal = jsonData.laudTotal;
            var content = $api.byId('dynamic-content');
            var tpl = $api.byId('dynamicShow-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(jsonData));
            echo.init({
                offset: 100,
                throttle: 250,
                callback: function (element, op) {
                }
            });
            hideLoading();
            api.parseTapmode();//优化点击事件
            reply(jsonData.member_info.member_id,jsonData.member_info.member_name);
        } else {
            if(err.code!=3){
                api.toast({
                    msg: err.msg,
                    duration:2000,
                    location: 'bottom'
                });
            }
        }

    });
    /*var getDynamicUrl = '&c=dynamic_app&a=dynamicShow&id='+dynamicId;
    ajaxRequest(getDynamicUrl, 'GET', '', function (ret, err) {
    })  */ 
}

//读取本地待上传动态
function readWaitFile(){
    var cacheDir = api.cacheDir;
    api.readFile({
        path: cacheDir+'/dynamic/'+dynamicId+'.json'
    }, function(ret, err){
        if(ret.status){
            var jsonData = JSON.parse(ret.data);
            if(jsonData.photosUrl){
                photosArr = jsonData.photosUrl;
            }
            laudTotal = jsonData.laudTotal;
            var content = $api.byId('dynamic-content');
            var tpl = $api.byId('dynamicShow-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(jsonData));
            echo.init({
                offset: 0,
                throttle: 250
            });
            //hideLoading();
        }
    });
}

function imageBrowser(orderNum){
    var obj = api.require('imageBrowser');
    obj.openImages({
        imageUrls: photosArr,
        showList:false,
        activeIndex:orderNum
    });
}

apiready = function(){
    showLoading();
	dynamicId = api.pageParam.dynamicId;
	uploadId = api.pageParam['uploadId'];
	key = $api.getStorage('key');
	userId = api.pageParam['userId'];
    getImgsPaths(sourcePath, function (emotion) {
        emotionData = emotion;
    });
    //根据ID判断本地待上传或服务器
    //if(dynamicId.substring(0,7)=='waiting'){
    getData();//读取基本内容
    getReplyData();//回复信息
    getLikeData();//回复信息
    getRewardData();
    api.addEventListener({
        name: 'rewardSuccess'
    }, function(ret){
        if(ret && ret.value){
            getRewardData();
        }
    });
    //chatBox = api.require('chatBox');UIChatBox
    chatBox = api.require('UIChatBox');
	api.addEventListener({
	    name:'swiperight'
	},function(ret,err){
	    api.closeWin({
	    	name: 'dynamic_tra_show_win'
	    });
	});
    api.parseTapmode();//优化点击事件
};