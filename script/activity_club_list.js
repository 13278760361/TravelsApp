var page=1,isLock=false,lastId=0,headerHeight;
function getData(searchType){
    isLock = true;
    var activityUrl = '&c=activity_club_app&a=activityList&page='+page+'&userid='+userid+'&encrypt='+encrypt+'&searchType='+searchType;
    ajaxRequest(activityUrl, 'GET', '', function (ret, err) {
        if (ret) {
            //获得最后一条数据id
            if(ret.length>0){
                if(ret[0].id>lastId){
                    lastId = ret[0].id;
                }
            }
            var content = $api.byId('activity-content');
            var tpl = $api.byId('activity-template').text;
            var tempFn = doT.template(tpl);
            if(page>1){
                $api.append(content,tempFn(ret));
                isLock = false;
            }else{
                $api.html(content,tempFn(ret));
                isLock = false;
            }
            
            echo.init({
                offset: 0,
                throttle: 250
            });
            api.parseTapmode();
            hideLoading();
        }
        hideLoading();
    })
}
function getNewData(){
    var getNewActivityUrl = '&c=activity_club_app&a=newActivityList&lastId='+lastId;
    ajaxRequest(getNewActivityUrl, 'GET', '', function (ret, err) {
        if (ret) {
            //获得最后一条数据id
            if(ret[0].id>lastId){
                lastId = ret[0].id;
            }
            var content = $api.byId('activity-content');
            var tpl = $api.byId('activity-template').text;
            var tempFn = doT.template(tpl);
            $api.prepend(content,tempFn(ret));
            echo.init({
                offset: 0,
                throttle: 250
            });
            api.parseTapmode();
            hideLoading();
        }
    })
}
function updateLocation(){
    //更新位置信息
    var baiduLocation = api.require('baiduLocation');
    baiduLocation.startLocation({
        accuracy: '100m',
        filter:1,
        autoStop: true
    }, function(ret, err){
        var data = {};
        var lat = ret.latitude;
        var lon = ret.longitude;
        data['lat'] = lat;
        data['lon'] = lon;
        data['userid'] = $api.getStorage('userid');
        var url = 'http://www.qinghuwai.com/index.php?m=app&c=member_app&a=updateLocation';
        api.ajax({
            url: url,
            method: 'post',
            cache: false,
            timeout: 60,
            dataType: 'json',
            data: {
                values: data
            }
        }, function (ret, err) {
            //alert(JSON.stringify(err));
        });
    })
}
apiready = function(){
    api.parseTapmode();
    showLoading();
    headerHeight = api.pageParam.headerHeight;
    api.setRefreshHeaderInfo({
        visible: true,
        loadingImg: 'widget://image/ptr_pull.png',
        bgColor: '#efeff4',
        textColor: '#959595',
        textDown: '下拉刷新',
        textUp: '松开刷新',
        showTime: false
    }, function (ret, err) {
        updateLocation();
        page=1;
        getData('default');
        api.refreshHeaderLoadDone();
    });
    updateLocation();
    getData('default');
    //监听是否达到底部上拉加载
    api.addEventListener({
        name : 'scrolltobottom',
        extra:{
            threshold:360
        }
    }, function(ret, err) {
        page++;
        if(isLock==false){
            getData('default');
        }
    });
    //监听报名数
    api.addEventListener({
        name: 'attendActivityClub'
    }, function(ret){
        if(ret && ret.value){
            var value = ret.value;
            var attendTotalBox = $api.byId("attendTotal_"+value.activityId);
            $api.html(attendTotalBox,' '+value.attendTotal);
        }
    });
    //监听关闭
    api.addEventListener({
        name: 'closeType'
    }, function(ret){
        if(ret && ret.value){
            foldMore();
        }
    });
    //筛选
    var searchTypeList = $api.domAll(".activity-type-list");
    for(var i in searchTypeList){
        $api.addEvt(searchTypeList[i], 'click', function(){
            $api.removeCls($api.dom(".activity-type-list.active"),'active');
            $api.addCls(this,'active');
            var searchType = $api.attr(this,'data-id');
            showLoading();
            getData(searchType);
        });
    }
};
function show(activityId){
    api.openWin({
        name: 'activity_club_show_win',
        url: 'activity_club_show_win.html',
        pageParam: {activityId: activityId},
        delay: 300
    });
}