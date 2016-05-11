var obj,nickname,openId,sex,password,avatar,city,province,wx;
function delWord(el){
    var input = $api.prev(el,'.txt');
    input.value = '';
}
//注册
function register() {
        api.openWin({
            name: 'register_win',
            url: 'register_win.html',
            delay:300,
            bounces: false,
            vScrollBarEnabled:false,
            hScrollBarEnabled:false
        });
    }
//找回密码
function forget(){
        api.openWin({
            name: 'forget_password_win',
            url: 'forget_password_win.html',
            delay:300,
            bounces: false,
            vScrollBarEnabled:false,
            hScrollBarEnabled:false
        });
    }

//登录
function login(){
	var name = $api.byId('username').value;
	if(name == ""){
		api.toast({
	        msg:'用户名不能为空',
	        duration:2000,
	        location:'top'
        });
		
		return false;
	}
	var pwd = $api.byId('password').value;
	if(pwd == ""){
		api.toast({
			msg:'密码不能为空',
			duration:2000,
			location:'top'
		});
		return false;
	}
	var client = 'android';
	api.ajax({
		url: ApiUrl + '/index.php?act=login&op=tr_index', //如果地址访问不到会请求出错，请填写自己的接口地址
		          method: 'post',
		          cache: 'false',
		          timeout: 30,
		          dataTpye: 'json',
				  data:{
					  values:{username:name,password:pwd,client:client}
				  },
    },function(ret,err){

    	if(ret.datas.userid){

    		$api.setStorage('userid', ret.datas.userid);
    		$api.setStorage('username', ret.datas.username);
    		$api.setStorage('key', ret.datas.key);
    		$api.setStorage('avatar', ret.datas.avatar);
			$api.setStorage('sex', ret.datas.sex);
			$api.setStorage('age', ret.datas.age);
			getInfo();
			setTimeout(function(){
	             api.closeWin({            
				   name: 'login_win',
				  
				  });
            },100);
    	} else {
			api.alert({
				msg: ret.datas.msg
            });
            
	    }
    });


}
function getInfo(){
	api.execScript({
		name:'root',
		frameName:'my_fra',
        script: 'getInfo();'
    });
}
function checkQQ(){
	var qq = $api.dom('.qqlogin');
	obj.installed(function(ret,err){
	    if(ret.status){
	       $api.addCls(qq, 'show');
	    }
	});
}
function checkWx(){
	var wxlog = $api.dom('.wxlogin');
	wx.isInstalled(function(ret, err){
	    if(ret.installed){
	         $api.addCls(wxlog, 'show');
	    }
	});
}

function QQLogin(){
	var userInfo = {};
	obj.login(function(ret,err){
		
		if(ret.status){
		
			obj.getUserInfo(function(retd,errd){
				if(retd){
					nickname = retd.info.nickname;			
					openId = ret.openId;
					avatar = retd.info.figureurl_qq_2;
					sex = retd.info.gender;
					userInfo = retd.info;
					province = retd.info.province;
					city = retd.info.city;
					
					api.ajax({
	                    url:ApiUrl + '/index.php?act=login_app&op=login',
	                    method:'post',
	                    dataType:'json',
	                    data:{values:{username:nickname,openid:openId,avatar:avatar,password:password,qquser_info:userInfo,province:province,city:city}}
                    },function(retII,errII){
                    	//coding...
                    	//alert(JSON.stringify(retII))
                    	if(retII.datas.status == 1){
                    		$api.setStorage('userid', retII.datas.state_data.userid);
				    		$api.setStorage('username', retII.datas.state_data.username);
				    		$api.setStorage('key', retII.datas.state_data.key);
				    		$api.setStorage('avatar', retII.datas.state_data.avatar);
							$api.setStorage('sex', retII.datas.state_data.sex);
							$api.setStorage('age', retII.datas.state_data.age);
							getInfo();
							setTimeout(function(){
					             api.closeWin({            
								   name: 'login_win',
								  });
				            },100);
                    	}else{
                    		
                    	}
                    });
				}
			})
		}
	})
}
function WXLogin(){
		
	wx.auth({
	    apiKey: ''
	}, function(ret, err){

	    if(ret.status){
	        wx.getToken({
			    apiKey: '',
			    apiSecret: '',
			    code: ret.code
			},function(retd, errd){ 
			    if(retd.status){
			        wx.getUserInfo({
					    accessToken: retd.accessToken,
					    openId: retd.openId
					}, function(retii,errii){ 
					    if(retii.status){
					        alert(JSON.stringify(retii));
					    }else{
					        alert(errii.code);
					    }
					});
			    }else{
			        alert(errd.code);
			    }
			});
	    }else{
	        alert(err.code);
	    }
	});
}
apiready = function(){
    wx = api.require('wx');
	obj = api.require('qq');
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
    checkQQ();
   
};