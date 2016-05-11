var photosArr,dynamicId=0;
//举报
function report(){
    api.prompt({
        title:'举报',
        msg:'请输入举报理由',
        buttons:['确定', '取消']
    },function(ret,err){
        if(ret.buttonIndex == 1){
            var data = {};
            data['userid'] = userid;
            data['dynamicid'] = dynamicId;
            data['remarks'] = ret.text;
            var url = '&c=dynamic_app&a=report'; 
            ajaxRequest(url, 'post', data, function (ret, err) {
                if(ret.status==1){
                    api.toast({
                        msg: '举报成功',
                        duration:2000,
                        location: 'top'
                    });
                }
            })
        }
    });
}
function step(){
    //alert(dynamicId);
    var url = '&c=dynamic_app&a=step';
    var data = {};
    data['dynamicid'] = dynamicId;
    data['userid'] = userid;
    if(dynamicId>0){
        ajaxRequest(url, 'post', data, function (ret, err) {
            if(ret.status==1){
                getDataFromService(dynamicId);
            }
        })
    }
    
}
function laud(){
    //alert(dynamicId);
    var laudUrl = '&c=dynamic_app&a=laud';
    var data = {};
    data['dynamicid'] = dynamicId;
    data['userid'] = userid;
    if(dynamicId>0){
        ajaxRequest(laudUrl, 'post', data, function (ret, err) {
            if(ret.status==1){
                getDataFromService(dynamicId);
            }
        })
    }
    
}
//从服务器获得数据
function getDataFromService(){
    showLoading();
    var url = '/index.php?act=member_travels&op=travels_audit&key='+key;
    ajaxRequest(url, 'GET', '', function (ret, err) {
  //  alert(JSON.stringify(ret));
        if (ret) {
            dynamicId = ret.id;
            //alert(dynamicId);
            //alert(ret.managerData);
            var jsonData = ret.datas.travelsInfo;
          //  alert(JSON.stringify(jsonData.photosUrl[0].length));
            if(jsonData.photos){
                photosArr = jsonData.photos;
            }
          ///  jsonData['photos'] = jsonData.photosUrl[0];
            var content = $api.byId('dynamic-content');
            var tpl = $api.byId('dynamic-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(jsonData));
            echo.init({
                offset: 0,
                throttle: 250
            });
            hideLoading();
        } else {
            if(err.code!=3){
                api.toast({
                    msg: err.msg,
                    duration:2000,
                    location: 'bottom'
                });
            }
        }
    })
}
function imageBrowser(orderNum){
    var obj = api.require('imageBrowser');
    obj.openImages({
        imageUrls: photosArr,
        showList:false,
        activeIndex:orderNum
    });
}
apiready = function(){
    
    getDataFromService();
    api.parseTapmode();
};