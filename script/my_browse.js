function getData(){
	var dataUrl = "/index.php?act=member_browse&op=browseList&key="+key;
	ajaxRequest(dataUrl,'GET','',function(ret,err){
		if(ret){
			var retd = ret.datas.browse_list;
			
			var content = $api.byId('browse-content');
            var tpl = $api.byId('browse-template').text;
            var tempFn = doT.template(tpl);
            $api.prepend(content,tempFn(retd));
            hideLoading();
		}
	});
}
function collectDelete(tripId){
	api.confirm({
        title: '删除操作',
        msg: '您确定要删除该活动吗',
        buttons:['确定', '取消']
    },function(ret,err){
			if(ret.buttonIndex == 1){
           
            var url = '/index.php?act=member_browse&op=browseDelete&trip_id='+tripId+'&key='+key;
            ajaxRequest(url,'GET','',function(ret,err){
                if(ret.datas.status==1){
                    api.toast({
                        msg: '删除成功',
                        duration:2000,
                        location: 'bottom'
                    });
                    $api.remove($api.byId('collect-'+tripId));
                }else if(ret.datas.status==0){
                    api.toast({
                        msg: '删除失败',
                        duration:2000,
                        location: 'top'
                    });
                }
            })
        }
    })
}
function collectShow(tripId){
	api.openWin({
	    name: 'tripDetail_window',
	    url: 'tripDetail_window.html',
	    pageParam:{dataId:tripId}
    });
}
apiready = function(){
	api.parseTapmode();
	getData();
    //重新登录
   /* api.addEventListener({
        name: 'reLogin'
    }, function(ret){
        if(ret && ret.value){
            getInfo();
        }
    });*/
	
};