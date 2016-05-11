
function getOtherData(){
    var userid = $api.getStorage('userid');
    var encrypt = $api.getStorage('encrypt');
    var url = '&c=member_care_app&a=caretToMeTotal&userid='+userid+'&encrypt='+encrypt;
    ajaxRequest(url, 'GET', '', function (ret, err) {
        //alert(JSON.stringify(err));
        if (ret) {
            var content = $api.byId('careme-content');
            var tpl = $api.byId('careme-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(ret));
            api.parseTapmode();
            echo.init({
                offset: 0,
                throttle: 250
            });
            hideLoading();
        }
    })
}
function getData(){
    var userid = $api.getStorage('userid');
    var encrypt = $api.getStorage('encrypt');
    var url = '&c=member_care_app&a=careList&userid='+userid+'&encrypt='+encrypt;
    ajaxRequest(url, 'GET', '', function (ret, err) {
        //alert(JSON.stringify(err));
        if (ret) {
            var content = $api.byId('circle-content');
            var tpl = $api.byId('circle-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(ret));
            api.parseTapmode();
            echo.init({
                offset: 0,
                throttle: 250
            });
            hideLoading();
        }
    })
}
apiready = function(){
    showLoading();
    getData();
    getOtherData();
    api.parseTapmode();
    api.setRefreshHeaderInfo({
        visible: true,
        loadingImg: 'widget://image/ptr_pull.png',
        bgColor: '#efeff4',
        textColor: '#959595',
        textDown: '下拉刷新',
        textUp: '松开刷新',
        showTime: false
    }, function (ret, err) {
        getData();
        getOtherData();
        api.refreshHeaderLoadDone();
    });
    //监听刷新圈子
    api.addEventListener({
        name: 'refreshCirclePerson'
    }, function(ret, err){
        var value = ret.value;
        if(value.key=='true'){
            getData();
        }
    });
    api.addEventListener({
        name: 'reLogin'
    }, function(ret){
        if(ret && ret.value){
            getData();
        }
    });
    
}
function careToMe(){
    api.openWin({
        name:'careme_win',
        url:'careme_win.html',
        delay:300
    })
}
function spaceShow(userid){
    api.openWin({
        name:'space_win',
        url:'space_win.html',
        delay:300,
        pageParam:{toUserid:userid}
    })
}