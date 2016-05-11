function activityDelete(serviceId){
    api.confirm({
        title: '删除操作',
        msg: '您确定要删除该服务吗',
        buttons:['确定', '取消']
    },function(ret,err){
        if(ret.buttonIndex == 1){
            var data = {};
            data['userid'] = userid;
            data['encrypt'] = encrypt;
            data['serviceid'] = serviceId;
            var url = '/index.php?act=member_service&op=activityServiceDelete&key='+key+'&service_id='+serviceId;
            ajaxRequest(url,'post',data,function(ret,err){
                if(ret.datas.status==1){
                    api.toast({
                        msg: '删除成功',
                        duration:2000,
                        location: 'bottom'
                    });
                    $api.remove($api.byId('activity-'+serviceId));
                }else if(ret.datas.status==0){
                    api.toast({
                        msg: '删除失败',
                        duration:2000,
                        location: 'top'
                    });
                }else if(ret.datas.status==-1){
                    api.toast({
                        msg: '该服务存在订单，不允许删除',
                        duration:2000,
                        location: 'top'
                    });
                }
            })
        }
    });
    
}
function activityShow(serviceId){
    api.openWin({
        name: 'activity_service_show_win',
        url: 'activity_service_show_win.html',
        pageParam: {serviceId: serviceId},
        delay: 300
    });
}
function getData(){
    var url = '/index.php?act=member_service&op=activityServiceList&key='+$api.getStorage('key');
    ajaxRequest(url, 'GET', '', function (ret, err) {
        var retd = ret.datas.service_list;
        if (retd) {
            //alert(JSON.stringify(err));
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