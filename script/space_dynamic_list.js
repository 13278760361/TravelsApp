var toUserid,page=1,isLock=false,lastId=0;
function deleteDynamic(id){
    var data = {};
    data['userid'] = userid;
    data['encrypt'] = encrypt;
    data['id'] = id;
    api.confirm({
        title: '删除',
        msg: '确定要删除该动态吗',
        buttons:['确定', '取消']
    },function(ret,err){
        if(ret.buttonIndex == 1){
            var url = '&c=dynamic_app&a=delete';
            ajaxRequest(url,'post',data,function(ret,err){
                if(ret.status==1){
                    $api.remove($api.byId('dynamic_'+id));
                }
            })
        }
    });
    
}
function show(id){
    api.openWin({
        name: 'dynamic_show_win',
        url: 'dynamic_show_win.html',
        pageParam: {dynamicId: id},
        reload:true,
        delay: 300
    });
}
function getData(dynamicType){
    isLock = true;
    var url = '&c=space_app&a=memberDynamicInfo&page='+page+'&userid='+userid+'&encrypt='+encrypt+'&toUserid='+toUserid+'&type='+dynamicType;
    ajaxRequest(url, 'GET', '', function (ret, err) {
        if (ret) {
            //获得最后一条数据id
            if(ret.length>0 && ret[0].id>lastId){
                lastId = ret[0].id;
            }
            var content = $api.byId('dynamic-content');
            var tpl = $api.byId('dynamic-template').text;
            var tempFn = doT.template(tpl);
            if(page>1){
                $api.append(content,tempFn(ret));
                isLock = false;
            }else{
                $api.html(content,tempFn(ret));
                isLock = false;
            }
            hideLoading();
            echo.init({
                offset: 0,
                throttle: 250
            });
            api.parseTapmode();//优化点击事件
        }
    })
}
apiready = function(){
    showLoading();
    toUserid = api.pageParam.toUserid;
    var dynamicType = api.pageParam.type;
    getData(dynamicType);
    //监听是否达到底部上拉加载
    api.addEventListener({
        name : 'scrolltobottom'
    }, function(ret, err) {
        page++;
        if(isLock==false){
            getData(''+dynamicType+'');
        }
    });
};

function back(){
	api.closeWin({
	    name: 'space_dynamic_list_win'
	});
}