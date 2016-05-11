var payment_code ="";
var password = "";
var rcb_pay ="";
var pd_pay ="";
var key = $api.getStorage('key');
var subject = "";
var payData = {};
var cart_id,spec_id,quantity;
var pay_sn;
function payOrder(){
	var key = $api.getStorage('key');
	pay_sn = api.pageParam['pay_sn'];
	
	api.ajax({
	    url: ApiUrl + '/index.php?act=line_order&op=line_step1',
	    method: 'post',
	    dataType: 'json',
	    data: {
		    values: {
		    	key: key,
		    	cart_id:cart_id,
		    	spec_id:spec_id,
		    	quantity:quantity
		    }
	    }
    },function(ret,err){
    	//coding...tringify
		
    	if(ret){
    		var retd = ret.datas.zb_info;
			payData['subject'] = retd.names;
			payData['body'] = retd.names;
			payData['amount'] = retd.price_sum;
			payData['tradeNO'] = pay_sn;
			var content = $api.byId('buyok-content');
			var tpl = $api.byId('buyok-template').text;
			var tempFn = doT.template(tpl);
			content.innerHTML = tempFn(retd);
			payList(key,pay_sn);
		}else{
			alert(ret.datas.data.msg);
		}
    });
}
function payList(key,pay_sn){
	api.ajax({
	    url:ApiUrl + '/index.php?act=member_tr_buy&op=linepay',
	    method: 'post',
	    dataType: 'json',
	    data: {
		    values: {
		    	key:key,
		    	pay_sn:pay_sn
		    }
	    }
    },function(ret,err){
    	//coding...
    	
    	if(ret.datas.payment_list.length>0){
    		for(var i =0;i<ret.datas.payment_list.length;i++){
    		var o = ret.datas.payment_list[i].payment_code;
    			if(o == "wxpay"){
    				$('#'+o).parents("li").show();
    				if (payment_code == "") {
    					payment_code = o;
						$("#" + o).find("span").eq(2).addClass("checked");
    				}
    			}
    			if(o == "alipay"){

    				$('#'+o).parents("li").show();
    				if (payment_code == "") {
    					payment_code = o;
    					$("#" + o).find("span").eq(2).addClass("checked");
    				}
    			}
    			if(o == "upop"){
    				$('#'+o).parents("li").show();
    				if (payment_code == "") {
    					payment_code = o;
    					$("#" + o).find("span").eq(2).addClass("checked");
    				}
    			}
    		}
			$("#chk-alipay").click(function() {
				
				payment_code = "alipay";
				
			});
			$("#chk-wxpay").click(function() {
				
				payment_code = "wxpay";
				
			});
			$("#chk-upop").click(function() {
				payment_code = "upop";
				
			});
			$(".pay").on("click", "li", function() {
				if ($(this).has('input[type="radio"]').length > 0) {
					$(this).addClass("checked").siblings().removeAttr("class").find('input[type="radio"]').removeAttr("checked")
				} else if ($(this).has('[type="checkbox"]')) {
					if ($(this).find('input[type="checkbox"]').prop("checked")) {
						$(this).addClass("checked")
					} else {
						$(this).removeClass("checked")
					}
				}
			});
    	}else{
    		alert('没有可用的支付方式');
    	}
    });
}
function reload(){
	  location.reload();
	  api.refreshHeaderLoadDone();
}
function ok(){
	var pay = payData;
	var a = api.pageParam['pay_sn'];
	var e = "pay_new";
	
	judgePay(pay, payment_code);
}
function judgePay(pay,type){
	switch(type){
		case 'alipay':
			alipay(pay);
		break;
		case 'wxpay':
			wxPay();
		break;
		default:
			
		break;
	}
}

function alipay(payData){
	    var iaf = api.require('aliPay');
	    var subject = payData['subject'];
	    var body = payData['body'];
	    var amount = payData['amount'];
	    var tradeNO = payData['tradeNO'];
	    var notifyURL = 'http://www.ynypw.com';
	    iaf.pay({
	        partner: '2088811906226065',
	        seller: 'lalakeji20015@163.com',
	        rsaPriKey: 'MIICXQIBAAKBgQCrA8EpF3Ppquu8dpjs94G6hJ7Kh7r/8/PayznVl9eqbpBIyL2m0IXvkdLlt3si/+b+qkk7L4qlun5cbiTB8gf0RqdzbzVQjX6cTF4mPt8wci/VFB+K025xR8QvGjpFI6G5ooUkBGB1vcCX5X5gg/kKi7U2RV+SfyHYIHlJ6rUYAwIDAQABAoGAOAT21VsVYUnYBthip9075bljurxTiVyEWPuRamJfBzlIkk8PsQFFnoCKMS21bHWfWXS2oGimZjt9ARIjgFSkPdtyaCNikfKSYWgQjanNsQVWTc93bLlZcAUeqNjUZPaQ9KBsVSwnObNIaRtkYb/cWlAs7eFlC5FYKdSivkAGlyECQQDXopne2vcOvFp0OoSFQYG+ApalgypHCq79c4sHveVozGfD/5maU5Shr8/FpLQmuuOzjODh1n2pGGlW6MCmExTXAkEAywbn5l6UMunlLxInQP49MSfpaVln1kwVfo+gsRHjfJA2tkzOwtAvKa6pEyUGIXN0A8+jA9EMLJDcGozso7wEtQJBAJLK6ECjgygO5OzWoTwtuerlzDPkNLWj+jgjnfOpPDC5ZbIxoBlE6JuhGaoMU29CLpwePUDASU8BhURasjrcJoUCQQDAr6ox2nt+oruv4+O7bE+5Mm71XDQPj6AqwLe6tgaYNuqmM9lbzWelgK3YjJ/36XInF85YFfQe69DppewFLbGtAkAjMJJmuozj1qMvvzlAo33TXPdfa0fYtsjiMP1/+hh6rKOsaEgOgZmDA7mcQBQ7WijO7sNuYL7zpMS6PjIpWLNj',
	        rsaPubKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrA8EpF3Ppquu8dpjs94G6hJ7Kh7r/8/PayznVl9eqbpBIyL2m0IXvkdLlt3si/+b+qkk7L4qlun5cbiTB8gf0RqdzbzVQjX6cTF4mPt8wci/VFB+K025xR8QvGjpFI6G5ooUkBGB1vcCX5X5gg/kKi7U2RV+SfyHYIHlJ6rUYAwIDAQAB',
	        subject: subject,
	        body: body,
	        amount: amount,
	        tradeNO: tradeNO,
	        notifyURL: notifyURL
	    }, function(ret, err) {
	       // document.getElementById("pay_message").value = ret.statusMessage;
	       // document.getElementById("pay_code").value = ret.statusCode;
	       alert(ret.code);
	        api.alert({
	            title: '支付结果',
	            msg: ret.statusMessage,
	            buttons: ['确定']
	        });
	    });
}
function wxPay(){
var wxPay = api.require('wxPay');
wxPay.payOrder({
    apiKey: '',
    orderId: '',
    mchId: '',
    nonceStr: '',
    timeStamp: '',
    package: '',
    sign: ''
}, function(ret, err){
     if(ret.status){
        //支付成功
     }else{
        alert(err.code);
     }
});
}
 apiready=function(){
	cart_id = api.pageParam['cart_id'];
	spec_id = api.pageParam['spec_id'];
	quantity = api.pageParam['quantity'];
 	payOrder();
 }
function goToPayment(a, e) {
	location.href = ApiUrl + "/index.php?act=member_payment&op=" + e + "&key=" + key + "&pay_sn=" + a + "&password=" + password + "&rcb_pay=" + rcb_pay + "&pd_pay=" + pd_pay + "&payment_code=" + payment_code + "&pay_type=trip";
}