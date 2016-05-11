function getCode(){
	var tel = $api.byId('tel').value;
	var code = $api.byId('code').value;
	if(tel == ""){
		alert('电话号码不能为空');
		return false;
	}
	if(tel !='' && !/^[1][3-8]+\d{9}$/.test(tel)){
		alert('请填写正确的手机号');
		return false;
	}
	api.ajax({
		url:ApiUrl + '/index.php?act=common_member&op=get_phone',
		method: 'post',
		dataType: 'json',
		data:{
			values:{number:tel}
		}
	},function(ret,err){
		//coding...
		
		
		if(ret.datas.result['true']){
			setTime();
		}else{
			alert(ret.datas.result['msg']);
		}
	});
}
var i = 60;
function setTime(){
	if(i>0){
		i--;
		$('#get-code').hide();
		$('#settime').show();
		$('#settime').text(i+'秒后可以重发');
		setTimeout("setTime()", 1000);
	}else{
		$('#settime').hide();
		$('#get-code').show();
		i = 60;
		
		
	}
}

function next(){
	
	var code = $api.byId('code').value;
	if(code == ""){
		alert('验证码不能为空');
		return false;
	}
	api.ajax({
	    url:ApiUrl + '/index.php?act=common_member&op=check',
	    method: 'post',
	    dataType: 'json',
	    data:{
	    values:{code: code}
	    
	    }
    },function(ret,err){
    	//coding...
    	alert(ret.datas.data['code']);
    	if(ret.datas.data['true']){
    		$('.pwd-forget').hide();
    		$('.set-pwd').show();
    	}else{
    		alert(ret.datas.data['error']);
    	}
    });
}
function setpwd(){
	
	var getPwd = $api.byId('newpwd').value;
	var getPwd2 = $api.byId('ag-newpwd').value;
	if(getPwd == ""){
		alert('密码不能为空');
		return false;
	}
	if(getPwd2 == ""){
		alert('确认密码不能为空');
		return false;
	}
	
	if(getPwd2 != getPwd){
		alert('两次输入的密码不一样');
		return false;
	}
	api.ajax({
	    url:ApiUrl + '/index.php?act=common_index&op=modify_pwd',
	    method: 'post',
	    dataType: 'json',
	    data: {values:{number:'13278760361',pwd:getPwd}}
    },function(ret,err){
    	//coding...
    	var msg = ret.datas;
    	if(ret.datas.modify_info['true']){
    		alert(msg.modify_info['msg']);
    		api.closeWin();
    	}else{
    		alert(msg.modify_info['msg']);
    	}
    	
    });
}