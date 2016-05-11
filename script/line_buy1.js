var sum = 10;
var key = $api.getStorage('key');
var a = document.getElementById('buy-price');
var buyPrice = $api.text(a);
var spec = false;
function numJian(){
	if(spec == false){
		api.toast({
		    msg:'请选择日期',
		    location:'top'
	    });
		return false;
	}
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
	if(spec == false){
		api.toast({
		    msg:'请选择日期',
		    location:'top'
	    });
		return false;
	}
	var el = $api.dom('.buy-num');
	var e = parseInt(el.value);
	
	var txt = parseInt(buyPrice)*(parseInt(e)+1);
	if (e < sum) {
		$api.val(el,parseInt(e) + 1);
	//	var txt = parseInt(buyPrice)*e;
		$api.text(a, txt.toFixed(2));
	}else{
		api.toast({
		    msg:'最多不能超过'+sum+'个',
		    location:'top'
	    });
		
	}
}

function getTuanqi(){

	var trip_id = api.pageParam['cart_id'];
	
//	var key = key;
	api.ajax({
	    url:ApiUrl + '/index.php?act=trip&op=tuanqi&trip_id='+trip_id,
        method: 'get',
       
         
        dataTpye: 'json',

	    data:{
		  	
		  }
    },function(ret,err){
    	//coding...
    	//alert(JSON.stringify(ret));
    	if(ret.datas.status==1){
    		var retd = ret.datas.tuanqi;
			var content = $api.byId('line-buy-content');
			var tpl = $api.byId('line-buy-template').text;
			var tempFn = doT.template(tpl);
			content.innerHTML = tempFn(retd);
			
		}
    });
}
function change(lid){
	//屏蔽其他hover
	var choose = $api.domAll('.choose-time');
    //屏蔽其他hover
    $('.choose-time').siblings().each(function() {
        $('.choose-time').children('a').removeClass("hover");
    });
    if ($api.attr($api.byId('choose-time'+lid), 'class') == 'hover') {
    	$api.removeCls($api.byId('choose-time'+lid), 'hover');
    } else {
        $api.addCls($api.byId('choose-time'+lid), 'hover');
        $api.val($api.byId('spec_id'), $api.attr($api.byId('choose-time'+lid), 'spec_id'));
        spec = true;
    }
  
}
function buynew(){
	var buyNum = $api.dom('.buy-num').value;
	var key = $api.getStorage('key');
	var cart_id =  api.pageParam['cart_id'];
	var code_t ="";
	var spec_id = $api.byId('spec_id').value;
	var verify_code = "";
	if(spec == false){
		api.toast({
	        msg:'请选择日期',
	        location:'top'
        });
		return false;
	}
	if(key){
		api.openWin({
		    name: 'line_buy_win2',
		    url: 'line_buy_win2.html',
		    pageParam: {dataId:cart_id,quantity:buyNum,spec_id:spec_id}
    	});
	}else{
		api.openWin({
            name: 'login_win',
            url: 'login_win.html',
        });
	}
	
	/*api.ajax({
	    url:ApiUrl + '/index.php?act=line_order&op=line_step1',
	    method:'post',
	    dataType:'json',
	    data:{
		    values:{
		    	key: key,
		    	pay_name: pay_name,
		    	opera_type: 'app',
		    	cart_id: cart_id,
		    	code_t: code_t,
		    	verify_code: verify_code,
		    	quantity: buyNum,
		    	spec_id:spec_id
		    }
	    
	    }
	    
    },function(ret,err){
    	//coding...
    	
    	if(ret){
			api.openWin({
			    name: 'line_buy_win2',
			    url: 'line_buy_win2.html',
			    pageParam: {dataId:cart_id}
		    });  	
    	}else{
    		alert('生成订单失败');
    	}
    });*/
}
apiready = function(){
	getTuanqi();
 	
}
