function opHeader(){
	var a = $api.getStorage('key');

	if(a){
		api.ajax({
	        url:ApiUrl + '/index.php?act=member_index',
	        method:'post',
	        dataType:'json',
	        data:{
	        	values:{key:a,type:'wap'}
	        }
        },function(ret,err){
		var i ='<div class="profile_top">	<i class="msg_icon" tapmode onclick=""></i>	<span class="config" tapmode onclick="setting()">设置</span><span class="member_pic" style="background-image:url('+ret.datas.member_info.avatar+')" tapmode "></span>	</div>	<div class="tabBar">';	
            i+='<div class="tabBar_inner" tapmode onclick="opOrderList(1)"><span class="num_top">'+ret.datas.member_info.tobepaid+'</span> <span class="text">待付款</span>	</div>	 <div class="tabBar_inner" tapmode onclick="opOrderList(2)">	<span class="num_top">'+ret.datas.member_info.paid+'</span>	<span class="text">已支付</span> </div>';	
            i+='<div class="tabBar_inner" tapmode><span class="num_top">'+ret.datas.member_info.canceled+'</span><span class="text">已取消</span>	</div>	 <div class="tabBar_inner" tapmode>	<span class="num_top">'+ret.datas.member_info.stocks+'</span>	<span class="text">待评价</span>	</div>';	
            i+='<div class="tabBar_inner last" tapmode>	 <span class="num_top">0</span>	<span class="text">退款/售后</span>	</div>	 </div>';
	        var el = $api.dom('.profile_box');
	        $api.html(el, i);
        });
	}else{
	
		var i ='<div class="profile_top">	<i class="msg_icon" tapmode onclick=""></i>	<span class="config" tapmode onclick="">设置</span><span class="login_btn" tapmode onclick="opLogin()">点击登录</span>	</div>	<div class="tabBar">';	
            i+='<div class="tabBar_inner" tapmode><span class="num_top">0</span> <span class="text">待付款</span>	</div>	 <div class="tabBar_inner" tapmode>	<span class="num_top">0</span>	<span class="text">已支付</span> </div>';	
            i+='<div class="tabBar_inner" tapmode><span class="num_top">0</span><span class="text">已取消</span>	</div>	 <div class="tabBar_inner" tapmode>	<span class="num_top">0</span>	<span class="text">待评价</span>	</div>';	
            i+='<div class="tabBar_inner last" tapmode>	 <span class="num_top">0</span>	<span class="text">退款/售后</span>	</div>	 </div>';
	        var el = $api.dom('.profile_box');
	        $api.html(el, i);
	}
}
function opLogin(){
	api.openWin({
	    name: 'login',
	    url: 'login.html'
    });
}
function opOrderList(orderType){

	switch(orderType){
		case 1:
			orderType = 'state_new';
		break;
		case 2:
			orderType = 'state_noeval';
		break;
	}

	api.openWin({
	    name: 'orderList_window',
	    url: 'orderList_window.html',
	    delay: 400,
	    pageParam:{dataType:orderType}
    });
}
function setting(){
	api.openWin({
	    name: 'set_win',
	    url: 'set_win.html'
    });
}
apiready = function(){
	opHeader();
}