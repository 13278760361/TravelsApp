function openTravelsDetail(did){
  api.openWin({
    name: 'travels_show_win',
    url: 'travels_show_win.html',
    delay: 400,
    pageParam:{travelsId:did}
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
var page = pagesize; // 页容量
var totalData=0;  //定义一个变量存储第一次加载返回来的总记录数
var totalPages=0;  // 定义一个变量存储第一次加载返回来的总页数
var currentPage = 1;
var j = 0;
var a = 0;
var s = 0;
$api.setStorage("currentPage", 1); // 默认设置为第一页
// 加载数据
// @currentPage:当前页码
// @isReload：是否为刷新操作
function loadData(ListType,isReload){
        api.ajax({
                url: ApiUrl + '/index.php?act=trip&op=travelsList&page='+page+"&curpage="+currentPage,
                method: 'get',
                timeout: 30,
                dataType: 'json',
                returnAll:false,
                data:{ }
        },function(ret,err){
        		api.hideProgress(); //隐藏加载进度框
                if (ret) {
                   // 渲染HTML
					var data = ret.datas.travels_list;
					var html = '';
					for(var i=0;i<data.length;i++){
	    				html+='<div class="item"><a tapmode="" onclick="openTravelsDetail('+data[i].travels_id+');"><div class="pic" data-echo-background="'+data[i].trip_images_url+'" style="background-image:url(../image/nophoto.png)"><div class="sale_tag">游记</div>';
						html+='<h3>'+data[i].tra_content+'</h3><div class="trip-time"><p><span>'+data[i].goods_addtime+'</span>&nbsp;&nbsp;<span>'+data[i].time+'天</span>&nbsp;&nbsp;<span>'+data[i].tra_count+'次浏览</span></p>';
						html+='<p><span>中国,云南</span></p></div></div><p class="p-head"><span class="head-pic" data-echo-background="'+data[i].member_avatar+'" style="background-image: url(../image/noavatar.gif)"></span><span>by.'+data[i].member_name+'</span></p></a></div>';
					}
					echo.init({
						offset: 0,
		                throttle: 250
					})
					if(data.length<5){
						j++;
					}
					if(j>=2){
						return false;
					}else{
						page++;
	                    var el = $api.byId('act-content');
						$api.after(el, html);
                   }
                }

        });
}
function activityData(){
	api.ajax({
                url: ApiUrl + '/index.php?act=trip&op=actList&page='+page,
                method: 'get',
                timeout: 30,
                dataType: 'json',
                returnAll:false,
                data:{ }
        },function(ret,err){
        		api.hideProgress(); //隐藏加载进度框
                if (ret) {
                   // 渲染HTML
					var data = ret.datas.act_list;
					
					var html = '';
					for(var i=0;i<data.length;i++){
	    				html+='<div class="item"><a tapmode="" onclick="actShow('+data[i].act_id+');"><div class="pic" data-echo-background="'+data[i].act_img+'" style="background-image:url(../image/nophoto.png)"><div class="sale_tag">活动</div>';
						html+='<h3>'+data[i].act_title+'</h3><div class="trip-time"><p><span>'+data[i].add_time+'</span>&nbsp;&nbsp;<span>'+data[i].time+'天</span>&nbsp;&nbsp;<span>'+data[i].act_count+'次浏览</span></p>';
						html+='<p><span>中国,云南</span></p></div></div><p class="p-head"><span class="head-pic" data-echo-background="'+data[i].member_avatar+'" style="background-image: url(../image/noavatar.gif)"></span><span>by.'+data[i].member_name+'</span></p></a></div>';
					}
				//	alert(html);
					echo.init({
						offset: 0,
		                throttle: 250
					})
					if(data.length<5){
						a++;
					}
					if(a>=2){
						return false;
					}else{
						page++;
	                    var el = $api.byId('act-content');
						$api.after(el, html);
                   }
                }
        });
}
function actShow(activityId){
   api.openWin({
        name: 'activity_aa_show_win',
        url: 'activity_aa_show_win.html',
        pageParam: {activityId: activityId},
        delay: 300
    });
}
function serviceData(){
	api.ajax({
            url: ApiUrl + '/index.php?act=trip&op=serList&page='+page,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll:false,
            data:{ }
        },function(ret,err){
    		api.hideProgress(); //隐藏加载进度框
            if (ret) {
               // 渲染HTML
				var data = ret.datas.service_list;
				
				var html = '';
				for(var i=0;i<data.length;i++){
    				html+='<div class="item"><a tapmode="" onclick="serviceShow('+data[i].service_id+');"><div class="pic" data-echo-background="'+data[i].thumb+'" style="background-image:url(../image/nophoto.png)"><div class="sale_tag">服务</div>';
					html+='<h3>'+data[i].service_title+'</h3><div class="trip-time"><p><span>'+data[i].add_time+'</span>&nbsp;&nbsp;<span>'+data[i].time+'天</span>&nbsp;&nbsp;<span>'+data[i].ser_count+'次浏览</span></p>';
					html+='<p><span>中国,云南</span></p></div></div><p class="p-head"><span class="head-pic" data-echo-background="'+data[i].member_avatar+'" style="background-image: url(../image/noavatar.gif)"></span><span>by.'+data[i].ser_user_name+'</span></p></a></div>';
				}
			//	alert(html);
				echo.init({
					offset: 0,
	                throttle: 250
				})
				if(data.length<5){
					s++;
				}
				if(s>=2){
					return false;
				}else{
					page++;
                    var el = $api.byId('act-content');
					$api.after(el, html);
               }
            }
        });
}
function serviceShow(serviceId){

    api.openWin({
        name: 'activity_service_show_win',
        url: 'activity_service_show_win.html',
        pageParam: {serviceId: serviceId},
        delay: 300
    });
}
apiready = function() {
	if(api.connectionType == 'none'){
        api.alert({
          title: '提示消息',
          msg: '当前网络不可用，请检查网络设置，联网后登录',
          buttons: ['确定']
        });
        
      }else{
      	api.showProgress(); //显示加载进度框
		loadData('after',true); // 第一次加载
		activityData();
		serviceData();
		api.setRefreshHeaderInfo({
	    },function(ret,err){
	    	//coding...
	    	loadData('after',true);
	    	activityData();
	    	serviceData();
	    	api.refreshHeaderLoadDone();
	    });
	    //getHoteList();
		//getBanner();
      }
      api.addEventListener({
        name:'offline'
      },function(ret,err){
        var connectionType = ret.connectionType;
        api.alert({
          title: '提示消息',
          msg: '当前网络不可用，请检查网络设置',
          buttons: ['确定']
        });
      });

};