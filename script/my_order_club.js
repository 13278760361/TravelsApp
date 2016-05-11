var page = 5,isLock=false,j=0;
function activityShow(activityId){
    api.openWin({
      //  name: 'activity_club_show_win',
      //  url: 'activity_club_show_win.html',
      //  pageParam: {activityId: activityId},
      	name: 'tripDetail_window',
      	url: 'tripDetail_window.html',
      	pageParam: {dataId: activityId},
        delay: 300
    });
}
function getData(){
	api.ajax({
	    url:ApiUrl + '/index.php?act=trOrder&op=tr_order_list&page='+page+'&key='+$api.getStorage('key'),
	    method: 'get',
	    dataType: 'json',
	    data:{}
    },function(ret,err){
    	//coding...
    	var retd = ret.datas.order_list;
    //	alert(JSON.stringify(retd));
        if (retd.length>0) {
            var content = $api.byId('order-content');
            var tpl = $api.byId('order-template').text;
            var tempFn = doT.template(tpl);
 			if(page>1){
                    $api.append(content,tempFn(retd));
                    isLock = false;
                }else {
                    $api.html(content,tempFn(retd));
                    isLock = false;
                }
               
                if(retd.length<5){
                	j++;
                	
                }
                if(j>=2){
                	isLock = true;
                }
               
                hideLoading();
                
                
             
                api.parseTapmode();//优化点击事件
           
        }    	
    	
    });
    /*var url = '&c=member_activity_order_app&a=activityClubOrderList&userid='+userid+'&encrypt='+encrypt;
    ajaxRequest(url, 'GET', '', function (ret, err) {
		
    })*/
}
function byNow(paySn){

	api.openWin({
	    name: 'buyok_window',
	    url: 'buyok_window.html',
	    pageParam: {pay_sn:paySn}
    });
   
    
}

apiready = function(){
    showLoading();
	getData();
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