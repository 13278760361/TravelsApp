var key = $api.getStorage('key');
var trip_id,spec_id,quantity;
function getData(){
	trip_id = api.pageParam['cart_id'];
	spec_id = api.pageParam['spec_id'];
	quantity = api.pageParam['quantity'];
    key = key;
	api.ajax({
	    url:ApiUrl + '/index.php?act=line_order&op=line_step1',
        method: 'post',
        dataTpye: 'json',
	    data:{
		  	values:{
		  		key:key,cart_id:trip_id,spec_id:spec_id,quantity:quantity
		  	}
		  }
    },function(ret,err){
    	//coding...
    	
    	if(ret){
    		var retd = ret.datas.zb_info;
			var content = $api.byId('buy-content');
			var tpl = $api.byId('buy-template').text;
			var tempFn = doT.template(tpl);
			content.innerHTML = tempFn(retd);
		}else{
			api.alert({
				msg: ('错误码：' + err.code + '；错误信息：' + err.msg + '网络状态码：' + err.statusCode)
			}); 
		}
    });
}
function getMsg(msg){
	api.toast({
	    msg:msg,
    	location:'top'
    });
}
function buynew(){
	var buyName = $api.byId('buyName').value;
	var buyTelp = $api.byId('buyTelp').value;
	var pay_name = "online";
	var code_t ="";
	var verify_code = "";
	if(buyName == ''){

		getMsg('真实姓名不能为空');
		return false;
	}
	if(buyTelp == ''){
		
		getMsg('电话号码不能为空');
		return false;
	}
	if(buyTelp !='' && !/^[1][3-8]+\d{9}$/.test(buyTelp)){
		getMsg('电话号码不正确');
		return false;
	}
	api.ajax({
	    url:ApiUrl + '/index.php?act=line_order&op=line_step2',
	    method:'post',
	    dataType:'json',
	    data:{
		    values:{
		    	key: key,
		    	contacts_name: pay_name,
		    	opera_type: 'app',
		    	cart_id: trip_id,
		    	trip_type: 'trip_zb',
		    	code_t: code_t,
		    	verify_code: verify_code,
		    	quantity: quantity,
		    	contacts_mobile:buyTelp,
		    	spec_id:spec_id
		    }
	    
	    }
	    
    },function(ret,err){
    	//coding...
    	
    	if(ret){
			api.openWin({
			    name: 'line_buy_win3',
			    url: 'line_buy_win3.html',
			    pageParam: {pay_sn:ret.datas['pay_sn'],cart_id:trip_id,quantity:quantity,spec_id:spec_id}
		    });  	
    	}else{
    		
    		getMsg('生成订单失败');
    	}
    });

}
apiready = function(){
	getData();
}