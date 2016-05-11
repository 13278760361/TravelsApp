var dataId;
function initSlide() {
	var slide = $api.byId('slide');
	var pointer = $api.domAll('#pointer a');
	window.mySlide = Swipe(slide, {
		// startSlide: 2,
		auto: 3000,
		continuous: true,
		disableScroll: true,
		stopPropagation: true,
		callback: function(index, element) {
			var actPoint = $api.dom('#pointer a.active');
			$api.removeCls(actPoint, 'active');
			$api.addCls(pointer[index], 'active');
		},
		transitionEnd: function(index, element) {

		}
	});
}
function getData(){
    api.ajax({
	    url:ApiUrl + '/index.php?act=trip&op=trip_detail&trip_id='+dataId+'&type=wap'+'&user_id='+userid,
	    method: 'get',
	    dataTpye: 'json',
    },function(ret,err){
    	//coding...
    	if(ret){
    	var retd = ret.datas.zb_detail;
    		api.hideProgress(); //显示加载进度框
            var content = $api.byId('act-content');
            var tpl = $api.byId('act-template').text;
            var tempFn = doT.template(tpl);
            content.innerHTML = tempFn(retd);
			echo.init({
                offset: 0,
                throttle: 250
            });
            var ede = $api.dom("#pointer");
            var eli = $api.domAll(ede,'a');
            for(var i = 0;i<eli.length;i++){
           	  if(i==0){
           	  	 $api.addCls(eli[i], 'active');
           	  }
            }
            initSlide();
    	}
    });
}
apiready = function() {  
	api.showProgress(); //显示加载进度框
    dataId = api.pageParam['dataId']; //activity id
    getData();
   /* api.ajax({
	    url:ApiUrl + '/index.php?act=trip&op=trip_detail&trip_id='+dataId+'&type=wap',
	    method: 'get',
	    dataTpye: 'json',
    },function(ret,err){
    	//coding...
    	if(ret){
    	var retd = ret.datas.zb_detail;
    		api.hideProgress(); //显示加载进度框
            var content = $api.byId('act-content');
            var tpl = $api.byId('act-template').text;
            var tempFn = doT.template(tpl);
            content.innerHTML = tempFn(retd);
            initSlide();
    	}else{
    		
    	}
    });*/

}