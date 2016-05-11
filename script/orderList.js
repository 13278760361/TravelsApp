
function orderList(orderType){
	var key = $api.getStorage('key');
	
	api.ajax({
	      url:ApiUrl + '/index.php?act=trOrder&op=tr_order_list',
	          method: 'post',
	          cache: 'false',
	          timeout: 30,
	          dataTpye: 'json',
			  data:{
			  	values:{key:key,state_type:orderType}
			  	
			  	}
    },function(ret,err){
    	//coding...
		api.hideProgress(); //隐藏加载进度框
		     
		if (ret) {
			//alert(ret.datas.tr_order_list);
			var content = $api.byId('ord-content');
			var tpl = $api.byId('ord-template').text;
			var tempFn = doT.template(tpl);
			content.innerHTML = tempFn(ret);

			                          
		} else {          
			api.alert({
				msg: ('错误码：' + err.code + '；错误信息：' + err.msg + '网络状态码：' + err.statusCode)
			});       
		}
    });
}
function openTripDetail(did){
  api.openWin({
    name: 'tripDetail_window',
    url: 'tripDetail_window.html',
    delay: 400,
    pageParam:{dataId:did}
  });
}
apiready = function(){

	var orderType = api.pageParam['orderType'];
	
	orderList(orderType);
};