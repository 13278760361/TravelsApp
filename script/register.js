   var inputWrap = $api.domAll('.input-wrap');
   var i = 0, len = inputWrap.length;
   for(i; i<len; i++){
		var txt = $api.dom(inputWrap[i], '.txt');
		var del = $api.dom(inputWrap[i], '.del');
		(function(txt,del){
			$api.addEvt(txt,'focus',function(){
				if(txt.value){
					$api.addCls(del,'show');
				}
				$api.addCls(txt,'light');
			});
			$api.addEvt(txt,'blur',function(){
			$api.removeCls(del,'show');
			$api.removeCls(txt,'light');
			});
		})(txt,del);

   }

function delWord(el){
	var input = $api.prev(el,'.txt');
	input.value = '';
}

function ensure(){
	var user = api.require('user');
	var uname = $api.byId('userName').value;
	var pwd = $api.byId('userPwd').value;
	var pwd2 = $api.byId('userPwd2').value;
	var email = $api.byId('email').value;
	var client = "wap";
	if (pwd !== pwd2) {
		api.alert({
			msg: '两次密码不一致'
		},function(ret,err){
			//coding...
		});
		return;
	}
	api.ajax({
		url: ApiUrl + '/index.php?act=login&op=tr_register', //如果地址访问不到会请求出错，请填写自己的接口地址
		          method: 'post',
		          cache: 'false',
		          timeout: 30,
		          dataTpye: 'json',

				  data:{
				  		values:{username:uname,password:pwd,password_confirm:pwd2,email:email,client:client}
				  }
    },function(ret,err){
		if (ret.datas.key) {
			api.alert({
				msg: '注册成功！'
			},function(){
				api.closeWin();
			});
			
		} else {
			api.alert({
				msg: ret.datas.msg
			});
		}
    });


}

apiready = function(){
	var header = $api.byId('header');
	$api.fixIos7Bar(header);
};