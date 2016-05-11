function vipBuy(){
    api.openWin({
        name: 'my_vip_win',
        url: 'my_vip_win.html',
        delay:300,
    })
}
function changeAccount(){
	var key = $api.getStorage('key');
    $api.clearStorage();
    setTimeout(function(){
       api.openWin({
            name: 'login_win',
            url: 'login_win.html'
        });
    },300)
   	
}
function sign(){
    api.ajax({
	    url: ApiUrl + '/index.php?act=member_points&op=add_pointslog',
	    method: 'post',
	    dataType: 'json',
	    data: {values: {key: $api.getStorage('key')}}
    },function(ret,err){
    	//coding...
    	//alert(JSON.stringify(ret));
        if(ret.datas.status == 1){
            var signStatusDom = $api.byId('signStatus');
            var signEmoji = $api.byId('signEmoji');
            var signText = $api.byId('signText');
            $api.removeAttr(signStatusDom,'onclick');
            $api.text(signText,'今日已签');
        }else{
			api.toast({
			    msg: '今日已签',
			    duration:2000,
			    location: 'bottom'
			});
        }
    });
 
}
function getInfo(){	
    userid = $api.getStorage('userid');
    key = $api.getStorage('key');
  //  encrypt = $api.getStorage('encrypt');
    nickname = $api.getStorage('username');
    avatar = $api.getStorage('avatar');
	
	//本地缓存读取基本
	if(avatar && nickname){
		var avatarDom = $api.byId('avatar');
		var nicknameDom = $api.byId('nickname');
		$api.attr(avatarDom,'src',''+avatar+'');
		$api.text(nicknameDom,''+nickname+'');
	}
	//获取最新便签、作息表、签到状态、是否实名
	api.ajax({
	    url:ApiUrl + '/index.php?act=member_index&op=index',
	    method: 'post',
	    dataType: 'json',
	    data:{values:{key:$api.getStorage('key'),type:'app'}}
    },function(ret,err){
    	//coding...
    	if(ret.datas){
    	   
            //var signStatusDom = $api.byId('signStatus');
            var realNameStatusDom = $api.byId('realNameStatus');
            //实名认证
          //  alert(JSON.stringify(ret.datas));
        	if(ret.datas.member_info['real_status']==1){
        		$api.text(realNameStatusDom,'未认证');
        	}else if(ret.datas.member_info['real_status']==10){
        		$api.text(realNameStatusDom,'等待审核');
        	}else if(ret.datas.member_info['real_status']== 0){
        		$api.text(realNameStatusDom,'认证失败');
        	}else if(ret.datas.member_info['real_status']==20){
        	//alert(2222)
        		$api.addCls(realNameStatusDom,'aui-badge-warning');
        		$api.text(realNameStatusDom,'已认证');
        		//$api.(el, cls);
        	}
    	}
    });
}

function my(type){

    api.openWin({
        name: type,
        url: ''+type+'.html',
        delay: 300
    });
}
function spaceShow(){
    api.openWin({
        name:'space_win',
        url:'space_win.html',
        delay:300,
        pageParam:{toUserid:userid}
    })
}
function clearCache(){
	api.clearCache();
	api.toast({
	    msg: '清除成功',
	    duration:2000,
	    location: 'bottom'
	});
    //$api.rmStorage('showGuide');
}
function loginout(){
	$api.clearStorage();
	api.openWin({
	    name: 'login_win',
	    url: 'login_win.html'
    });
	 // api.closeWin();
}
var userid,encrypt,nickname,avatar;
apiready = function(){
	api.parseTapmode();
	getInfo();
    //重新登录
    api.addEventListener({
        name: 'reLogin'
    }, function(ret){
        if(ret && ret.value){
            getInfo();
        }
    });
	
};
