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
	    url:ApiUrl + '/index.php?act=trip&op=leader_detail&leader_id='+dataId+'&type=wap',
	    method: 'get',
	    dataTpye: 'json',
    },function(ret,err){
    	//coding...
    	if(ret.datas.status==1){
    	var retd = ret.datas.line_detail;
    	//alert(JSON.stringify(retd.goods_content[0].slide.length));
    		api.hideProgress(); //显示加载进度框
            var content = $api.byId('act-content');
            var tpl = $api.byId('act-template').text;
            var tempFn = doT.template(tpl);
            content.innerHTML = tempFn(retd);
            initSlide();
			echo.init({
                offset: 100,
                throttle: 250,
                callback: function (element, op) {
                }
            });
    	}
    });
}
apiready = function() {  
	api.showProgress(); //显示加载进度框
    dataId = api.pageParam['dataId']; //activity id
    getData();
    api.parseTapmode();//优化点击事件
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
