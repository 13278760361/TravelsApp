var travelsId,photosArr,attendTotal,attendBoyTotal,attendGirlTotal,toUserid,userid,encrypt,key;
//打开聊天窗口
function chat(){
     api.sendEvent({
        name:'chatFromOtherPage',
        extra:{
            targetId:toUserid,
            conversationType:'PRIVATE'
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
function showMap(){
    api.openWin({
        name:'activity_show_map',
        url:'activity_show_map.html'
    })
}
function meet(meetuserid){
    var data = {};
    data['userid'] = userid;
    data['encrypt'] = encrypt;
    data['activityid'] = activityId;
    data['meetuserid'] = meetuserid;
    data['activitytype'] = 'aa';
    var attendUrl = '&c=activity_aa_app&a=meet';
    ajaxRequest(attendUrl, 'post', data, function (ret, err) {
        if(ret.status==1){
            var meet = $api.byId('meet_'+meetuserid);
            $api.addCls(meet,'active');
        }
    })
}
function getAttendData(){
    var getAttendUrl = '&c=activity_aa_app&a=getAttendData&activityid='+travelsId+'&userid='+userid+'&encrypt='+encrypt;
    ajaxRequest(getAttendUrl, 'GET', '', function (ret, err) {
        if (ret) {
            var jsonData = ret.data;
            var content = $api.byId('attend-content');
            var tpl = $api.byId('attend-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(jsonData));
            //hideLoading();

            //男女报名数量
            attendTotal = ret.info.attendtotal;
            attendBoyTotal = ret.info.attendtotal_boy;
            attendGirlTotal = ret.info.attendtotal_girl;

            var boyTotalDom = $api.byId('boy-total');
            var girlTotalDom = $api.byId('girl-total');
            $api.html(boyTotalDom,''+ret.info.attendtotal_boy+'');
            $api.html(girlTotalDom,''+ret.info.attendtotal_girl+'');
            echo.init({
                offset: 0,
                throttle: 250
            });
        } else {
            if(err.code!=3){
                api.toast({
                    msg: err.msg,
                    duration:2000,
                    location: 'bottom'
                });
            }
        }
    })
}

function attend(){
    var data = {};
    data['userid'] = userid;
    data['encrypt'] = encrypt;
    data['activityid'] = activityId;
    var attendUrl = '/index.php?act=activity&op=attend';
    ajaxRequest(attendUrl, 'post', data, function (ret, err) {
        if(ret.status==1){
            var attendBtn = $api.byId('attendBtn');
            $api.text(attendBtn,'报名成功');
            $api.addCls(attendBtn,'active');
            //插入数据
            var newData = [];
            var newDataArr = [];
            newDataArr[0] = newData;
            newData['nickname'] = nickname;
            newData['avatar'] = avatar;
            newData['sex'] = sex;
            newData['age'] = age;
            insertAttend(newDataArr);
        }else if(ret.status==0){
            api.toast({
                msg: '已经参与过了',
                duration:2000,
                location: 'top'
            })
        }
    })
}
function insertAttend(newDataArr){
    attendTotal += 1;
    var content = $api.byId('attend-content');
    var tpl = $api.byId('attend-template').text;
    var tempFn = doT.template(tpl);

    var noPerson = $api.byId('noPerson');
    if(noPerson){
        $api.remove(noPerson);
    }
    $api.prepend(content,tempFn(newDataArr));
    echo.init({
        offset: 0,
        throttle: 250
    });
    if(sex==1){
        attendBoyTotal += 1;
        var boyTotalDom = $api.byId('boy-total');
        $api.html(boyTotalDom,''+attendBoyTotal+'');
    }else if(sex==2){
        attendGirlTotal += 1;
        var girlTotalDom = $api.byId('girl-total');
        $api.html(girlTotalDom,''+attendGirlTotal+'');
    }

    //向列表页发送事件更新数量
    api.sendEvent({
        name: 'attendActivityAA',
        extra:{activityId:activityId,attendTotal:attendTotal}
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
function getData(){
    showLoading();
    var getActivityUrl = '/index.php?act=trip&op=travelsShow&travels_id='+travelsId+'&user_id='+userid;
    ajaxRequest(getActivityUrl, 'GET', '', function (ret, err) {
        if (ret) {
            var jsonData = ret.datas.travels_info;
            var travesImgList = jsonData.travels_img_list
          /*	for(var i=0;i<travesImgList.length;i++){
          	//alert(travesImgList[i].fup_id);
          		if(travesImgList[i].fup_id>0){
          		
          			
		            $('.aui-follow-'+travesImgList[i].fup_id).hide();
		            $('.aui-unfollow-'+travesImgList[i].fup_id).show();
          		}
          	}*/
          //	alert(userid);alert(travesImgList.user_id);
            var content = $api.byId('activity-content');
            var tpl = $api.byId('activity-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(jsonData));
            toUserid = jsonData['member_id'];
            hideLoading();
            echo.init({
                offset: 0,
                throttle: 250
            });
            api.parseTapmode();
        } else {
            if(err.code!=3){
                api.toast({
                    msg: err.msg,
                    duration:2000,
                    location: 'bottom'
                });
            }
        }
    })
}
function followMsg(msg){
    api.toast({
        msg: msg,
        duration:2000,
        location: 'bottom'
    });
}
function follow(uploadId){
	if($api.getStorage('key')){
	    var getActivityUrl = '/index.php?act=member_travels&op=follows_travels&upload_id='+uploadId+'&key='+key;
	    ajaxRequest(getActivityUrl, 'GET', '', function (ret, err) {
	        	var retd = ret.datas.msg;
	        if (retd.stats==1) {
	            $('.aui-follow-'+uploadId).hide();
	            $('.aui-unfollow-'+uploadId).show();
	           	
	            followMsg(retd.msg);
	            hideLoading();
	            api.parseTapmode();
	        } else {
	            followMsg(retd.msg);
	        }
	    });
	}else{
		api.openWin({
	        name: 'login_win',
	        url: 'login_win.html'
        });
	}
}
function unfollow(uploadId){
	    var getActivityUrl = '/index.php?act=member_travels&op=unfollows_travels&upload_id='+uploadId+'&key='+key;
	    ajaxRequest(getActivityUrl, 'GET', '', function (ret, err) {
	        	var retd = ret.datas.msg;
	        if (retd.stats==1) {
	            $('.aui-unfollow-'+uploadId).hide();
	            $('.aui-follow-'+uploadId).show();
	            followMsg(retd.msg);
	            hideLoading();
	            api.parseTapmode();
	        } else {
	            followMsg(retd.msg);
	        }
	    });
}
function message(uploadId,userId){

	if($api.getStorage('key')){
		api.openWin({
	        name: 'dynamic_tra_show_win',
	        url: 'dynamic_tra_show_win.html',
	        pageParam:{uploadId:uploadId,userId:userId}
        });
	}else{
		api.openWin({
	        name: 'login_win',
	        url: 'login_win.html'
        });
	}
}
apiready = function(){
    userid = $api.getStorage('userid');
    encrypt = $api.getStorage('encrypt');
    travelsId = api.pageParam['travelsId'];
    key = $api.getStorage('key');
    getData();
   // getAttendData();
    api.addEventListener({
        name:'swiperight'
    },function(ret,err){
        api.closeWin({
            name: 'activity_aa_show_win'
        });
    });
    api.parseTapmode();
};
