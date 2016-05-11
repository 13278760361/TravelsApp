var cacheName = 'main';
function initSlide() {
	var slide = $api.byId('slide');
	var pointer = $api.domAll('#pointer a');
	window.mySlide = Swipe(slide, {
		// startSlide: 2,
		auto: 3000,
		continuous: true,
		disableScroll: true,
		stopPropagation: true,
		callback: function(index, element) {
			var actPoint = $api.dom('#pointer a.active');
			$api.removeCls(actPoint, 'active');
			$api.addCls(pointer[index], 'active');
		},
		transitionEnd: function(index, element) {

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
function getBanner() {          
	api.showProgress(); //显示加载进度框
	           //使用api.ajax请求数据，具体使用方法和参数请看官方文档，这里使用get方法演示
	          
	api.ajax({          
		url: ApiUrl + '/index.php?act=trip&op=index', //如果地址访问不到会请求出错，请填写自己的接口地址
		          method: 'get',
		          cache: 'false',
		          timeout: 30,
		          dataTpye: 'json',
		          
	}, function(ret, err) {
		if (ret) {
			
            var data = ret.datas.data;
          
            var html = '';
            $.each(data, function(k, v) {
        
                $.each(v, function(kk, vv) {
                	
                    switch (kk) {
                        
                        case 'tr_adv_list':
                        	break;
                        case 'tr_home4':
                            
                            break;
                    }
                    if (k == 0) {
						var content = $api.byId('slide');
						var tpl = $api.byId('banner-template').text;
						var tempFn = doT.template(tpl);
						content.innerHTML = tempFn(vv);
						var ede = $api.dom("#pointer");
			            var eli = $api.domAll(ede,'a');
			            for(var i = 0;i<eli.length;i++){
			           	  if(i==0){
			           	  	 $api.addCls(eli[i], 'active');
			           	  }
			            }
                    }else{
                    	
                    	
                    }
                    return false;
                });
            });
			
			initSlide();
		} else {
			api.alert({
				msg: ('错误码：' + err.code + '；错误信息：' + err.msg + '网络状态码：' + err.statusCode)
			});
		}
	});
}
function clickCheck(){
	var e = $api.getStorage('key');
	if (!e) {
		api.openWin({
	        name: 'login',
	        url: 'login.html'
        });
        return false;
	}
}
function outLogin(){

	$api.rmStorage('key');
	api.alert({msg:('注销成功')});
}
var page = pagesize; // 页容量
var totalData=0;  //定义一个变量存储第一次加载返回来的总记录数
var totalPages=0;  // 定义一个变量存储第一次加载返回来的总页数
var currentPage = 1;
var j = 0;
$api.setStorage("currentPage", 1); // 默认设置为第一页
// 加载数据
// @currentPage:当前页码
// @isReload：是否为刷新操作
function loadData(ListType,isReload){

        api.ajax({
                url: ApiUrl + '/index.php?act=trip&op=app_tr_zb_list&page='+page+"&curpage="+currentPage,
                method: 'get',
                timeout: 30,
                dataType: 'json',
                returnAll:false,
                data:{ }
        },function(ret,err){
        		api.hideProgress(); //隐藏加载进度框
                if (ret) {
                   // 渲染HTML
					var data = ret.datas.zb_list;
					var html = '';
					for(var i=0;i<data.length;i++){
						html+='	<li data-id="'+data[i].goods_id+'" class="m-city-hunter-product" tapmode="" onclick="openTripDetail('+data[i].goods_id+');">';
	  					html+='<div class="cover" data-echo-background ="'+data[i].trip_images_url+'" style="background-image: url(../image/nophoto.png);"></div><div class="info clearfix"><div class="avatar"> ';
	  					html+='<a tapmode="" onclick="openTripDetail('+data[i].goods_id+');"><span data-echo-background ="'+data[i].trip_images_url+'" style="background-image: url(../image/nophoto.png);"></span> </a> </div>';
	   					html+='<div class="head"><h2 class="title font-ios-bold">'+data[i].goods_name+'</h2><p class="summary"><span>'+data[i].goods_addtime+'</span> <span>'+data[i].time+'天</span> <span>'+data[i].follow_count+'人喜欢</span> </p>';
	    				html+='</div><p class="label"><span>聚会</span><span>经验分享</span></p><p class="price"> <span><i></i>'+data[i].goods_price+'</span> </p></div></li>';
					}
					echo.init({
		                offset: 0,
		                throttle: 250
		            });
					if(data.length<5){
						j++;
					}
					if(j>=2){
						return false;
					}else{
						currentPage++;
	                    var el = $api.byId('act-content');
						$api.after(el, html);
                   }
                }else {
                        api.alert({
                                msg:('错误码：'+err.code+'；错误信息：'+err.msg+'；网络状态码：'+err.statusCode)
                        });
                }
               
              /*  api.writeFile({
	                path:'../data/main.json',
	                data: JSON.stringify(ret)
                },function(ret,err){
                	//coding...
                	alert('缓存成功')
                });*/
                
        });
}
function getHoteList(){
	api.ajax({
	    url: ApiUrl + '/index.php?act=trip&op=hote_rec',
	    method: 'post',
	    dataType: 'json',
	    data:{}
    },function(ret,err){
    	//coding...
    	var retd = ret.datas.hote_list;
    	if(retd.length>0){
			var content = $api.byId('hote-content');
			var tpl = $api.byId('hote-template').text;
			var tempFn = doT.template(tpl);
			content.innerHTML = tempFn(retd);
			echo.init({
                offset: 0,
                throttle: 250
            });
    	}
    	
    });
}
function connectType(){
	loadData('after',true); // 第一次加载
	api.setRefreshHeaderInfo({
    },function(ret,err){
    	//coding...
    	loadData('after',true);
    	api.refreshHeaderLoadDone();
    });
    getHoteList();
	getBanner();
}
apiready = function() {
	  var connectT = api.connectionType;
	  if(connectT=='none'){
	  	  api.alert({
	          title: '提示消息',
	          msg: '当前网络不可用，请检查网络设置',
	          buttons: ['确定']
		  });
	  }else{
	  	  connectType();
	      api.addEventListener({
	        name:'online'
	      },function(ret,err){
	      if(ret){
	      		if(connectT == '2g' || connectT == '3g' || connectT == '4g'){
			      	api.confirm({
						title: '提示消息',
					    msg: '你当前的网络为你的移动网络，是否要继续',
					    buttons: ['确定', '取消']
			          },function(ret,err){
			          	//coding...
			          	if(ret){
			          		connectType();
			          	}else{
			          		api.toLauncher();
			          	}
			          });
			      }else{
			      		connectType();
			      }
	      }else{
		        var connectionType = ret.connectionType;
		        api.alert({
		          title: '提示消息',
		          msg: '当前网络不可用，请检查网络设置',
		          buttons: ['确定']
		        });
	      }
	   });
	}
};