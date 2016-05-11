var serviceId,photosArr,sex,age,userid,key,nickname,avatar,attendTotal,attendBoyTotal,attendGirlTotal;
//购买
function buy(serviceId){
    api.openWin({
        name: 'activity_service_buy_win',
        url: 'activity_service_buy_win.html',
        pageParam: {serviceId: serviceId},
        delay: 300
    });
}
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
function attend(){
	if(key){
	    var data = {};
	   // data['userid'] = userid;
	   // data['encrypt'] = encrypt;
	  //  data['activityid'] = activityId;
	    var attendUrl = ApiUrl + '/index.php?act=trip&op=service_attend';
	    api.ajax({
		    url:attendUrl,
		    method:'post',
		    dataType:'json',
		    data:{values:{userid:userid,serviceId:serviceId,sex:sex}}
	    },function(ret,err){
	    	//coding...
			if(ret.datas.status==1){
				api.toast({
	                msg: '报名成功',
	                duration:2000,
	                location: 'top'
	            })
	            var attendBtn = $api.byId('attendBtn');
	            $api.text(attendBtn,'报名成功');
	            $api.addCls(attendBtn,'active');
	            //插入数据
	            var newData = [];
	            var newDataArr = [];
	            newDataArr[0] = newData;
	            newData['member_nickname'] = nickname;
	            newData['avatar'] = avatar;
	            newData['sex'] = sex;
	            newData['age'] = age;
	            insertAttend(newDataArr);
	        }else if(ret.datas.status==0){
	            api.toast({
	                msg: '已经参与过了',
	                duration:2000,
	                location: 'top'
	            })
	        }
	    });
	  /*  ajaxRequest(attendUrl, 'post', data, function (ret, err) {
	        
	    })*/
    }else{
    	api.openWin({
	        name: 'login',
	        url: 'login.html'
        });
    }
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
        extra:{serviceId:serviceId,attendTotal:attendTotal}
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
function getAttendData(){
    var url = '/index.php?act=trip&op=getServiceAttendData&serviceid='+serviceId;
    ajaxRequest(url, 'GET', '', function (ret, err) {
        if (ret) {
       // alert(JSON.stringify(ret));
            var jsonData = ret.datas.attend_list;
            var content = $api.byId('attend-content');
            var tpl = $api.byId('attend-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(jsonData));
            //hideLoading();

            //男女报名数量
          /*  attendTotal = ret.info.attendtotal;
            attendBoyTotal = ret.info.attendtotal_boy;
            attendGirlTotal = ret.info.attendtotal_girl;

            var boyTotalDom = $api.byId('boy-total');
            var girlTotalDom = $api.byId('girl-total');
            $api.html(boyTotalDom,''+ret.info.attendtotal_boy+'');
            $api.html(girlTotalDom,''+ret.info.attendtotal_girl+'');*/
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
function getData(){
    var getActivityUrl = '/index.php?act=trip&op=serviceShow&service_id='+serviceId;
    ajaxRequest(getActivityUrl, 'GET', '', function (ret, err) {
        if (ret) {
            var jsonData = ret.datas.service_info;
            if(jsonData.photosUrl){
                photosArr = jsonData.photosUrl;
            }
            var content = $api.byId('service-content');
            var tpl = $api.byId('service-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(jsonData));
            toUserid = jsonData.userid;
            hideLoading();
            echo.init({
                offset: 0,
                throttle: 250
            });
            api.parseTapmode();
          //  getAttendData();
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


apiready = function(){
    showLoading();
    api.parseTapmode();
    serviceId = api.pageParam.serviceId;
    userid = $api.getStorage('userid');
    sex = $api.getStorage('sex');
    age = $api.getStorage('age');
    key = $api.getStorage('key');
    nickname = $api.getStorage('username');
    avatar = $api.getStorage('avatar');
    getData();
    getAttendData();
    api.addEventListener({
        name:'swiperight'
    },function(ret,err){
        api.closeWin({
            name: 'activity_service_show_win'
        });
    });
    api.addEventListener({
        name: 'activityServicePaySuccess'
    }, function(ret){
        if(ret && ret.value){
            var value = ret.value;
            if(ret.value.status=='success'){
                getAttendData();
            }
        }
    });
};
