var rong,chatTargetId,token;
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
function noticeOrder(){
    api.openWin({
        name: 'notice_order_win',
        url: 'notice_order_win.html',
        delay: 300
    });
}
function noticeDyanmic(){
    api.openWin({
        name: 'notice_dynamic_win',
        url: 'notice_dynamic_win.html',
        delay: 300
    });
}
function dynamicShow(id){
    api.openWin({
        name: 'dynamic_show_win',
        url: 'dynamic_show_win.html',
        pageParam: {dynamicId: id},
        delay: 300
    });
}

//打开聊天窗口
function chat(targetId,conversationType){
    if(conversationType=='PRIVATE'){
        //单聊
        rong.getLatestMessages({
            conversationType: 'PRIVATE',
            targetId: targetId,
            count: 20
        },function(ret,err){
            
            api.openWin({
                name: 'chat_win',
                url: 'chat_win.html',
                pageParam: {targetId: targetId,historyMessages:ret.result},
                delay: 300
            });
        })
    }else if(conversationType=='GROUP'){
        //群组
    }  
}
//未读消息数
function getUnreadCount(){
    rong.getTotalUnreadCount(function (ret, err) {
        alert(JSON.stringify(ret));
    })
}
function coversationList(){
    var userid = $api.getStorage('userid');
    var encrypt = $api.getStorage('encrypt');
    //消息列表
    rong.getConversationList(function (ret, err) {
        //alert(JSON.stringify(ret.result));
        if(ret.status=='success'){
            //alert(JSON.stringify(ret.result));
            var content = $api.byId('message-content');
            var tpl = $api.byId('message-template').text;
            var tempFn = doT.template(tpl);
            //循环一下重新组装消息里表，并获取用户信息
            var data = new Array();
            for(var i in ret.result){
                data[i] = {};
                if(ret.result[i].conversationTitle){
                    data[i]['conversationTitle'] = ret.result[i].conversationTitle;
                }
                
                data[i]['conversationType'] = ret.result[i].conversationType;
                data[i]['targetId'] = ret.result[i].targetId;
                if(ret.result[i].latestMessage){
                    data[i]['latestMessage'] = ret.result[i].latestMessage;
                    //消息内容
                    data[i]['text'] = ret.result[i].latestMessage.text;
                }
                
                data[i]['sentStatus'] = ret.result[i].sentStatus;
                data[i]['objectName'] = ret.result[i].objectName;
                data[i]['recievedStatus'] = ret.result[i].recievedStatus;
                data[i]['senderUserId'] = ret.result[i].senderUserId;
                data[i]['unreadMessageCount'] = ret.result[i].unreadMessageCount;
                data[i]['receivedTime'] = ret.result[i].receivedTime;
                data[i]['sentTime'] = formatDate(ret.result[i].sentTime);
                data[i]['isTop'] = ret.result[i].isTop;
                data[i]['latestMessageId'] = ret.result[i].latestMessageId;
                var url = '&c=message_app&a=getMemberInfo&userid='+userid+'&encrypt='+encrypt+'&toUserid='+ret.result[i].targetId;
                ajaxRequest(url, 'GET', '', function (retMember, err) {
                    if(retMember){
                        data[i]['nickname'] = retMember.nickname;
                        data[i]['avatar'] = retMember.avatar;
                        $api.text($api.byId('nickname_'+retMember.userid),''+retMember.nickname+'');
                        $api.attr($api.byId('avatar_'+retMember.userid),'src',''+retMember.avatar+'');
                        $api.prepend(content,tempFn(data));
                    }
                })
                
            }
            //alert(JSON.stringify(data));
            //$api.prepend(content,tempFn(data));
        }
    })
}

//监听新消息
function receiveMessageListener(){
    var userid = $api.getStorage('userid');
    var encrypt = $api.getStorage('encrypt');
    rong.setOnReceiveMessageListener(function (ret, err) {
        //alert(JSON.stringify(ret));
        //var d = JSON.parse(ret.result.message.content.data);
        //alert(d.content);
        if(ret.status=="success"){
            //发送一个有新消息的事件
            api.sendEvent({
                name:'getNewMessage',
                extra:{
                    key:'true'
                }
            })
            if(ret.result.message.conversationType=='SYSTEM'){
                
                if(ret.result.message.targetId=='1766'){
                    //alert(JSON.stringify(ret));
                    //alert(ret.result.message.targetId);
                    //系统消息
                    var noticeMessage = JSON.parse(ret.result.message.content.data);
                    var content = $api.byId('message-content');
                    var tpl = $api.byId('newMessage-template').text;
                    var tempFn = doT.template(tpl);
                    
                    var targetIdDom = $api.byId('message_'+ret.result.message.targetId);
                    var noticeData = {};
                    noticeData['targetId'] = ret.result.message.targetId;
                    noticeData['nickname'] = "动态通知";
                    noticeData['avatar'] = '../image/noticedynamic.png';
                    noticeData['conversationType'] = ret.result.message.conversationType;
                    noticeData['content'] = {};
                    noticeData['content']['text'] = noticeMessage.content;
                    //alert(JSON.stringify(noticeData));
                    if(targetIdDom){
                        //如果存在删除重写写入
                        $api.remove(targetIdDom);
                    }
                    $api.prepend(content,tempFn(noticeData));
                    echo.init({
                        offset: 0,
                        throttle: 250
                    });
                    //提醒
                    api.notification({
                        sound:'default',
                        notify:{
                            title:'动态提醒',
                            content:noticeMessage.content,
                            updateCurrent: true
                        }
                    }, function(ret, err){
                        
                    });
                }else if(ret.result.message.targetId=='2957'){
                    var noticeMessage = JSON.parse(ret.result.message.content.data);
                    var content = $api.byId('message-content');
                    var tpl = $api.byId('newMessage-template').text;
                    var tempFn = doT.template(tpl);
                    
                    var targetIdDom = $api.byId('message_'+ret.result.message.targetId);
                    var noticeData = {};
                    noticeData['targetId'] = ret.result.message.targetId;
                    noticeData['nickname'] = "订单通知";
                    noticeData['avatar'] = '../image/noticeorder.png';
                    noticeData['conversationType'] = ret.result.message.conversationType;
                    noticeData['content'] = {};
                    noticeData['content']['text'] = noticeMessage.content;
                    //alert(JSON.stringify(noticeData));
                    if(targetIdDom){
                        //如果存在删除重写写入
                        $api.remove(targetIdDom);
                    }
                    $api.prepend(content,tempFn(noticeData));
                    echo.init({
                        offset: 0,
                        throttle: 250
                    });
                    //提醒
                    api.notification({
                        sound:'default',
                        notify:{
                            title:'订单通知',
                            content:noticeMessage.content,
                            updateCurrent: true
                        }
                    }, function(ret, err){
                        
                    });
                }
                
            }else if(ret.result.message.conversationType=='PRIVATE'){
                //getUnreadCount();
                //聊天类
                var content = $api.byId('message-content');
                var tpl = $api.byId('newMessage-template').text;
                var tempFn = doT.template(tpl);
                
                var targetIdDom = $api.byId('message_'+ret.result.message.targetId);
                if(targetIdDom){
                    //如果存在删除重写写入
                    $api.remove(targetIdDom);
                }
                $api.prepend(content,tempFn(ret.result.message));
                

                //发送收到新消息事件，在会话页面接收监听
                api.sendEvent({
                    name:'getNewMessagePrivate',
                    extra:{
                        data:ret.result.message
                    }
                })
                //获取用户信息
                var url = '&c=message_app&a=getMemberInfo&userid='+userid+'&encrypt='+encrypt+'&toUserid='+ret.result.message.targetId;
                ajaxRequest(url, 'GET', '', function (retMember, err) {
                    if(retMember){
                        $api.text($api.byId('nickname_'+retMember.userid),''+retMember.nickname+'');
                        $api.attr($api.byId('avatar_'+retMember.userid),'data-echo',''+retMember.avatar+'');
                        echo.init({
                            offset: 0,
                            throttle: 250
                        });
                    }
                })
                //提醒,过滤当前会话用户id
                if(ret.result.message.targetId!=chatTargetId){
                    api.notification({
                        sound:'default',
                        notify:{
                            title:'新消息',
                            content:ret.result.message.content.text,
                            updateCurrent: true
                        }
                    }, function(ret, err){
                        
                    });
                }
                
            }
            
            
        }
    })
}
//聊天类消息发送
function sendMessage(type,targetId,content,extra,conversationType){
    var userid = $api.getStorage('userid');
    var encrypt = $api.getStorage('encrypt');
    if(type=='text'){
        //文字消息
        rong.sendTextMessage({
                conversationType: ''+conversationType+'',
                targetId: ''+targetId+'',
                text: ''+content+'',
                extra: ''+extra+''
            }, function (ret, err) {
                if (ret.status == 'prepare'){
                    if(conversationType=='PRIVATE'){
                        var messageData = ret.result.message;
                        //alert(JSON.stringify(ret.result));
                        var content = $api.byId('message-content');
                        var tpl = $api.byId('newMessage-template').text;
                        var tempFn = doT.template(tpl);
                        
                        var targetIdDom = $api.byId('message_'+messageData.targetId);
                        if(targetIdDom){
                            //如果存在删除重写写入
                            $api.remove(targetIdDom);
                        }
                        $api.prepend(content,tempFn(messageData));
                        //获取用户信息
                        var url = '&c=message_app&a=getMemberInfo&userid='+userid+'&encrypt='+encrypt+'&toUserid='+ret.result.message.targetId;
                        ajaxRequest(url, 'GET', '', function (retMember, err) {
                            if(retMember){
                                $api.text($api.byId('nickname_'+retMember.userid),''+retMember.nickname+'');
                                $api.attr($api.byId('avatar_'+retMember.userid),'data-echo',''+retMember.avatar+'');
                                echo.init({
                                    offset: 0,
                                    throttle: 250
                                });
                            }
                        })
                    }else if(conversationType=='GROUP'){
                        //群组类
                    }
                    
                }else if (ret.status == 'success'){
                    //成功后处理
                   
                    
                }else if (ret.status == 'error'){
                    //失败
                }
            }
        );
    }else if(type=='image'){
        //图片消息
        rong.sendImageMessage({
                conversationType: 'PRIVATE',
                targetId: targetId,
                imagePath: ''+content.text+'',
                extra: ''+content.extra+''
            }, function (ret, err) {
                if (ret.status == 'prepare'){
                    //准备
                }else if (ret.status == 'success'){
                    //成功
                }else if (ret.status == 'error'){
                    //失败
                }
            }
        );
    }else if(type=='voice'){
        //语音消息
    }else if(type=='loaction'){
        //位置消息
    }
}
function rongCloud(){
    var userid = $api.getStorage('userid');
    var encrypt = $api.getStorage('encrypt');
    var url = '&c=message_app&a=getToken&userid='+userid;
    ajaxRequest(url, 'GET', '', function (ret, err) {
        if(ret){
            token = ret.token;
        }
    })
    //融云初始化
    rong.init(function(ret, err){

    });
    //监听新消息
    receiveMessageListener();
    //连接
    rong.connect({
        token: ''+token+''
    },function(ret, err){
        /*if(ret.status=='success'){
            //消息列表
            coversationList();
        }*/
    });
    coversationList();
    //未读消息
    //getUnreadCount();
}
apiready = function(){
    getImgsPaths(sourcePath, function (emotion) {
        emotionData = emotion;
    });
    api.setRefreshHeaderInfo({
        visible: true,
        // loadingImgae: 'wgt://image/refresh-white.png',
        bgColor: '#efeff4',
        textColor: '#4d4d4d',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function (ret, err) {
        api.refreshHeaderLoadDone();
    });
    echo.init({
        offset: 0,
        throttle: 250
    });
    
    rong = api.require('rongCloud');
    rongCloud();
    //监听重新连接融云
    api.addEventListener({
        name: 'reRongCloudConnect'
    }, function(ret){
        if(ret && ret.value){
            var value = ret.value;
            if(value.key=='true'){
                rongCloud();
            }
        }
    });
    //监听正在聊天的用户id
    api.addEventListener({
        name:'chatIng'
    },function(ret){
        if(ret && ret.value){
            chatTargetId = ret.value.chatTargetId;
        }
    })
    //监听聊天新消息发送
    api.addEventListener({
        name:'sendMessage'
    },function(ret){
        if(ret && ret.value){
            var value = ret.value;
            sendMessage(''+value.type+'',''+value.targetId+'',''+value.content+'',''+value.extra+'',''+value.conversationType+'');
        }
    })


    //监听从其他页面打开会话窗口
    api.addEventListener({
        name:'chatFromOtherPage'
    },function(ret){
        if(ret && ret.value){
            var value = ret.value;
            if(value.conversationType=='PRIVATE'){
                //单聊
                rong.getLatestMessages({
                    conversationType: 'PRIVATE',
                    targetId: value.targetId,
                    count: 20
                },function(ret,err){
                    api.openWin({
                        name: 'chat_win',
                        url: 'chat_win.html',
                        pageParam: {targetId: value.targetId,historyMessages:ret.result},
                        delay: 300
                    });
                })
            }else if(conversationType=='GROUP'){
                //群组
            } 
        }
    })
};
function showSpace(){
    api.openWin({
        name: 'space_frame',
        url: 'space_frame.html',
        delay: 300
    });
}