var circleId;
function spaceShow(toUserid){
    api.openWin({
        name:'space_win',
        url:'space_win.html',
        delay:380,
        animation:{
            duration:380
        },
        pageParam:{toUserid:toUserid}
    })
}
//打开聊天窗口
function chat(toUserid){
     api.sendEvent({
        name:'chatFromOtherPage',
        extra:{
            targetId:toUserid,
            conversationType:'PRIVATE'
        }
     })
}
function getData(){
    //alert(circleId);
    var url = '&c=circle_app&a=circleGroupInfo&userid='+userid+'&encrypt='+encrypt+'&circleId='+circleId;
    ajaxRequest(url,'GET','',function(ret,err){
        //alert(JSON.stringify(ret));
        if(ret){
            var content = $api.byId('space-content');
            var tpl = $api.byId('space-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(ret));
        }
    })
}

apiready = function(){
    circleId = api.pageParam.circleId;
    getData();
};