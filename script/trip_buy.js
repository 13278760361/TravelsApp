var sum = 10;
var key = $api.getStorage('key');
var a,buyPrice;
function numJian(){
	var b = document.getElementById('buy-price');
	var buyPrice2 = $api.text(b);
	var el = $api.dom('.buy-num');
	var e = parseInt(el.value);
	if (e > 1) {
		$api.val(el,parseInt(e - 1));
		var txt = parseInt(buyPrice2)-parseInt(buyPrice);
		$api.text(a, txt.toFixed(2));
	}
}
function numJia(){
	var el = $api.dom('.buy-num');
	var e = parseInt(el.value);
	var txt = parseInt(buyPrice)*(parseInt(e)+1);
	if (e < sum) {
		$api.val(el,parseInt(e) + 1);
		var txt = parseInt(buyPrice)*(e+1);
		//alert(a);
		$api.text(a, txt.toFixed(2));
	}else{
		getMsg('最多不能超过'+sum+'个');
	}
}
function opBuyContent(){
	var trip_id = api.pageParam['cart_id'];
	var key = key;
	api.ajax({
	    url:ApiUrl + '/index.php?act=trip&op=trip_detail&trip_id='+trip_id,
        method: 'get',
        dataTpye: 'json',
	    data:{
		  	
		  }
    },function(ret,err){
    	//coding...
    	if(ret){
			var content = $api.byId('buy-content');
			var tpl = $api.byId('buy-template').text;
			var tempFn = doT.template(tpl);
			buyPrice = ret.datas.zb_detail.goods_price;
			content.innerHTML = tempFn(ret);
			a = $api.byId('buy-price');
		}else{
			api.alert({
				msg: ('错误码：' + err.code + '；错误信息：' + err.msg + '网络状态码：' + err.statusCode)
			}); 
		}
    });
}
function buynew(){
	var buyName = $api.byId('buyName').value;
	var buyTelp = $api.byId('buyTelp').value;
	var buyNum = $api.dom('.buy-num').value;
	var key = $api.getStorage('key');
	var pay_name = "online";
	var cart_id =  api.pageParam['cart_id'];
	var code_t ="";
	var verify_code = "";
	if(buyName == ''){
		getMsg('真实姓名不能为空！！');
		return false;
	}
	if(buyTelp == ''){
		getMsg('电话号码不能为空！！');
		return false;
	}
	if(buyTelp !='' && !/^[1][3-8]+\d{9}$/.test(buyTelp)){
		getMsg('请填写正确的手机号');
		return false;
	}
	api.ajax({
	    url:ApiUrl + '/index.php?act=member_tr_buy&op=buy_step2',
	    method:'post',
	    dataType:'json',
	    data:{
		    values:{
		    	key: key,
		    	pay_name: pay_name,
		    	opera_type: 'app',
		    	cart_id: cart_id,
		    	trip_type: 'trip_zb',
		    	code_t: code_t,
		    	verify_code: verify_code,
		    	quantity: buyNum
		    }
	    
	    }
	    
    },function(ret,err){
    	//coding...
    	if(ret){
			api.openWin({
			    name: 'buyok_window',
			    url: 'buyok_window.html',
			    pageParam: {pay_sn:ret.datas['pay_sn']}
		    });  	
    	}else{
    		getMsg('生成订单失败');
    	}
    });
}
function getMsg(msg){
	api.toast({
	    msg:msg,
	    duration:2000,
	    location:'top'
    });
}
apiready = function(){
	
	opBuyContent();
}