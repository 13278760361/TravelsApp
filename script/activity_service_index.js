var page=1,isLock=false,lastId=0;
window.mySwipe = new Swipe(document.getElementById('slide'), {
    auto: 5000,
    continuous: true,
    disableScroll: true,
    stopPropagation: true,
    callback: function(index, elem) {
        var pointer = $api.dom('#slide .pointer');
        var left = 33.33333333*index;
        $api.css(pointer,'left:'+left+'%');
    },
    transitionEnd: function(index, elem) {
        
    }
});
function serviceList(themeId,themeName){
    api.openWin({
        name: 'activity_service_list_win',
        url: 'activity_service_list_win.html',
        pageParam: {themeId: themeId,themeName:''+themeName+''},
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
function getData(){
    var url = '&c=activity_service_app&a=serviceSuperMember&userid='+userid+'&encrypt='+encrypt;
    ajaxRequest(url,'GET','',function(ret,err){
        if (ret) {
            var content = $api.byId('service-content');
            var tpl = $api.byId('service-template').text;
            var tempFn = doT.template(tpl);
            $api.prepend(content,tempFn(ret));
            api.parseTapmode();
            //hideLoading();
        }
    })
}
apiready = function(){
    //showLoading();
    api.parseTapmode();
    getData();
};