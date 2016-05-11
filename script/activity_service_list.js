var page=1,isLock=false,lastId=0;
function getData(themeId){
    isLock = true;
    var serviceUrl = '&c=activity_service_app&a=serviceList&page='+page+'&userid='+userid+'&encrypt='+encrypt+'&themeId='+themeId;
    ajaxRequest(serviceUrl, 'GET', '', function (ret, err) {
        if (ret) {
            //获得最后一条数据id
            if(ret.length>0){
                if(ret[0].id>lastId){
                    lastId = ret[0].id;
                }
            }
            
            var content = $api.byId('service-content');
            var tpl = $api.byId('service-template').text;
            var tempFn = doT.template(tpl);
            if(page>1){
                $api.append(content,tempFn(ret));
                isLock = false;
            }else{
                $api.html(content,tempFn(ret));
                isLock = false;
            }
            //hideLoading();
            echo.init({
                offset: 0,
                throttle: 250
            });
            api.parseTapmode();
            
        } else {
            if(page==1){
                var content = $api.byId('service-content');
                $api.html(content,'<p class="aui-text-center">暂无相关达人服务</p>');
            }
        }
        hideLoading();
    })
}
function getNewData(themeId){
    var getNewActivityUrl = '&c=activity_service_app&a=newServiceList&lastId='+lastId+'&themeId='+themeId;
    ajaxRequest(getNewActivityUrl, 'GET', '', function (ret, err) {
        if (ret) {
            //获得最后一条数据id
            if(ret[0].id>lastId){
                lastId = ret[0].id;
            }
            var content = $api.byId('service-content');
            var tpl = $api.byId('service-template').text;
            var tempFn = doT.template(tpl);
            $api.prepend(content,tempFn(ret));
            echo.init({
                offset: 0,
                throttle: 250
            });
            api.parseTapmode();
        }
    })
}

apiready = function(){
    var themeId = api.pageParam.themeId;
    
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
        getNewData(themeId);
        api.refreshHeaderLoadDone();
    });
    getData(themeId);
    api.parseTapmode();
    //监听是否达到底部上拉加载
    api.addEventListener({
        name : 'scrolltobottom',
        extra:{
            threshold:200
        }
    }, function(ret, err) {
        page++;
        if(isLock==false){
            getData(themeId);
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
    //监听摇一摇更新内容
    /*api.addEventListener({
        name:'shake'
    },function(ret,err){
        page = 1;
        getData('default');
    })*/
};
function show(serviceId){
    api.openWin({
        name: 'activity_service_show_win',
        url: 'activity_service_show_win.html',
        pageParam: {serviceId: serviceId},
        delay: 300
    });
}