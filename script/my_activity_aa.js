function activityDelete(activityId){
    api.confirm({
        title: '删除操作',
        msg: '您确定要删除该活动吗',
        buttons:['确定', '取消']
    },function(ret,err){
        if(ret.buttonIndex == 1){
            var data = {};
            data['userid'] = userid;
            data['encrypt'] = encrypt;
            data['activityid'] = activityId;
            var url = '/index.php?act=member_activity&op=activityDelete&act_id='+activityId+'&key='+key;
            ajaxRequest(url,'GET','',function(ret,err){
                if(ret.datas.status==1){
                    api.toast({
                        msg: '删除成功',
                        duration:2000,
                        location: 'bottom'
                    });
                    $api.remove($api.byId('activity-'+activityId));
                }else if(ret.datas.status==0){
                    api.toast({
                        msg: '删除失败',
                        duration:2000,
                        location: 'top'
                    });
                }else if(ret.datas.status==-1){
                    api.toast({
                        msg: '该活动存在订单，不允许删除',
                        duration:2000,
                        location: 'top'
                    });
                }
            })
        }
    });
    
}
function activityShow(activityId){
    api.openWin({
        name: 'activity_aa_show_win',
        url: 'activity_aa_show_win.html',
        pageParam: {activityId: activityId},
        delay: 300
    });
}
function getData(){
    var url = '/index.php?act=member_activity&op=activity_list&key='+$api.getStorage('key');
    ajaxRequest(url, 'GET', '', function (ret, err) {
        if (ret) {
        	var retd = ret.datas.activity_list;
            var content = $api.byId('activity-content');
            var tpl = $api.byId('activity-template').text;
            var tempFn = doT.template(tpl);
            $api.prepend(content,tempFn(retd));
            hideLoading();
        }
    })
}
apiready = function(){
    showLoading();
	getData();
};