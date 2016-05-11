function sarchAjax(user){
    api.ajax({
	    url:ApiUrl+'/index.php?act=trip&op=tr_zb_list',
	    method:'post',
	    dataType:'json',
	    data:{
	      values:{
	       goods_name: user
	      }
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
	var inval = api.pageParam['goods_name'];
   	sarchAjax(inval);
	api.setRefreshHeaderInfo({
    },function(ret,err){
    	//coding...
    	//loadData(5,true); // 第一次加载
    	api.refreshHeaderLoadDone();
    });
	};