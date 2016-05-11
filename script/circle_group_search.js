var page=1,isLock=false,lat,lon;
function search(){
    
    var keyword = $api.val($api.byId('keyword'));
    if(keyword){
        showLoading();
        var url = '&c=circle_app&a=circleGroupSearchDo&userid='+userid+'&encrypt='+encrypt+'&keyword='+keyword;
        ajaxRequest(url, 'GET', '', function (ret, err) {
            if (ret) {
                var content = $api.byId('circle-content');
                var tpl = $api.byId('circle-template').text;
                var tempFn = doT.template(tpl);
                if(ret){
                    $api.html(content,tempFn(ret));
                    echo.init({
                        offset: 0,
                        throttle: 250
                    });
                }
                
                
            }
            hideLoading();
        })
    }
    
}
function showCircleSpace(circleId){
    api.openWin({
        name:'circle_group_space_win',
        url:'circle_group_space_win.html',
        pageParam: {circleId: circleId},
        delay:300
    })
}
function getData(){
    isLock = true;
    var url = '&c=circle_app&a=circleGroupSearch&userid='+userid+'&encrypt='+encrypt+'&page='+page+'&lat='+lat+'&lon='+lon;
    ajaxRequest(url, 'GET', '', function (ret, err) {
        var content = $api.byId('circle-content');
        if (ret) {
            var content = $api.byId('circle-content');
            var tpl = $api.byId('circle-template').text;
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
        }else{
            $api.append(content,'<p class="aui-text-center">好可惜，附近没有更多圈子</p>');
        }
        hideLoading();
    })
}

apiready = function(){
    showLoading();
    getData();
    //监听是否达到底部上拉加载
    api.addEventListener({
        name : 'scrolltobottom'
    }, function(ret, err) {
        page++;
        if(isLock==false){
            getData();
        }
    });
    var baiduLocation = api.require('baiduLocation');
        baiduLocation.startLocation({
            accuracy: '100m',
            filter:1,
            autoStop: true
        }, function(ret, err){
            var sta = ret.status;
            lat = ret.latitude;
            lon = ret.longitude;
        })
};