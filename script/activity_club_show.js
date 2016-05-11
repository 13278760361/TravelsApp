var activityId;
function buy(){
    api.openWin({
        name: 'activity_club_buy_win',
        url: 'activity_club_buy_win.html',
        pageParam: {activityId: activityId},
        delay: 300
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
function chat(toUserid){
    api.sendEvent({
        name:'chatFromOtherPage',
        extra:{
            targetId:toUserid,
            conversationType:'PRIVATE'
        }
    })
}
//活动其他数据
function getOtherData(){
    var getActivityUrl = '&c=activity_club_app&a=activityInfo&activityid='+activityId;
    ajaxRequest(getActivityUrl, 'GET', '', function (ret, err) {
        if (ret) {
            //alert(JSON.stringify(ret));
            var jsonData = ret;
            var content = $api.byId('activityOther-content');
            var tpl = $api.byId('activityOther-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(jsonData));
            //切换
            var menuList = $api.domAll('.tab-menu');
            for(var i in menuList){
                $api.addEvt(menuList[i], 'click', function(){
                    var icon = $api.dom(this,'span');
                    $api.removeCls($api.dom(".activity-list-desc.show"),'show');
                    var dataId = $api.attr(this,'data-id');
                    $api.addCls($api.byId("activity-"+dataId),'show');
                    
                });
            }
            
            echo.init({
                offset: 0,
                throttle: 250
            });
        }
    })
    
}
function getData(){
    var getActivityUrl = '&c=activity_club_app&a=activityShow&activityid='+activityId;
    ajaxRequest(getActivityUrl, 'GET', '', function (ret, err) {
        if (ret) {
            var jsonData = ret;
            var content = $api.byId('activity-content');
            var tpl = $api.byId('activity-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(jsonData));
            hideLoading();
            echo.init({
                offset: 0,
                throttle: 250
            });
            api.parseTapmode();
            getOtherData();
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
    activityId = api.pageParam.activityId;
    getData();
    api.addEventListener({
        name:'swiperight'
    },function(ret,err){
        api.closeWin({
            name: 'activity_club_show_win'
        });
    });
    api.addEventListener({
        name: 'activityClubPaySuccess'
    }, function(ret){
        if(ret && ret.value){
            var value = ret.value;
            if(ret.value.status=='success'){
                getOtherData();
            }
        }
    });

};
