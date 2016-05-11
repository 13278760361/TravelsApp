var page=1,isLock=false;
function getData(){
    isLock = true;
    var url = '&c=member_care_app&a=careToMe&userid='+userid+'&encrypt='+encrypt+'&page='+page;
    ajaxRequest(url, 'GET', '', function (ret, err) {
        //alert(JSON.stringify(err));
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
    api.parseTapmode();
    api.addEventListener({
        name : 'scrolltobottom'
    }, function(ret, err) {
        page++;
        if(isLock==false){
            getData();
        }
    });
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