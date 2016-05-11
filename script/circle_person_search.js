var page=1,isLock=false,searchType='all';
function searchdo(){
    var keyword = $api.val($api.byId('keyword'));
    if(keyword){
        showLoading();
        var url = '&c=circle_app&a=circlePersonSearchDo&userid='+userid+'&encrypt='+encrypt+'&keyword='+keyword;
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
function spaceShow(userid){
    api.openWin({
        name:'space_win',
        url:'space_win.html',
        delay:380,
        animation:{
            duration:380
        },
        pageParam:{toUserid:userid}
    })
}
function search(type){
    searchType = type;
    showLoading();
    page = 1;
    getData(searchType);
}
function getData(){
    isLock = true;
    var url = '&c=circle_app&a=circlePersonSearch&userid='+userid+'&encrypt='+encrypt+'&page='+page+'&lat='+lat+'&lon='+lon+'&searchType='+searchType;
    ajaxRequest(url, 'GET', '', function (ret, err) {
        //alert(JSON.stringify(err));
        if (ret) {
            var content = $api.byId('circle-content');
            var tpl = $api.byId('circle-template').text;
            if(ret){
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
                if(page==1){
                    $api.html(content,'<p class="aui-text-center">好可惜，附近还没有好友</p>');
                }
                
            }
            hideLoading();
            
        }
    })
}

apiready = function(){
    showLoading();
    getData();
    //监听是否达到底部上拉加载
    api.addEventListener({
        name : 'scrolltobottom',
        extra:{
            threshold:360
        }
    }, function(ret, err) {
        page++;
        if(isLock==false){
            getData();
        }
    });
};