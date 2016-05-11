function openWin(name){
	api.openWin({
		name: name,
		url: name+'.html',
		opaque: true,
		vScrollBarEnabled: false
		
	});
}

//user
function delWord(el){
	var input = $api.prev(el,'.txt');
	input.value = '';
}
function edit(el){
	var del = $api.next(el,'.del');
	if(el.value){
		$api.addCls(del,'show');
	}
	$api.addCls(el,'light');
}
function cancel(el){
	var del = $api.next(el,'.del');
	$api.removeCls(del,'show');
	$api.removeCls(el,'light');
}

function addData(data, str){
	if(!data){
		data = str;
	}else{
		if(data.indexOf(str) > -1){
			return;
		}else{
			data = data +','+ str;
		}
	}
	
	return data;
}
//加载框显示
function showLoading(time){
    var body = $api.dom("body");
    var loading = $api.byId("loading");
    if(!loading){
        $api.append(body,'<div class="aui-loading" id="loading"></div>');
        if(time && time>0){
            //如果有时间传进来就定时隐藏
            
            $api.remove(loading);
        }
    }
    
}
//ajax请求
function ajaxRequest(url, method, datas, callBack) {
    var serverUrl = 'http://www.ynypw.com/mobile';
    var now = Date.now();
    api.ajax({
        url: serverUrl + url,
        method: method,
        cache: false,
        timeout: 30,
        dataType: 'json',
        data: {
            values: datas
        }
    }, function (ret, err) {
        callBack(ret, err);
    });
}
//加载框隐藏
function hideLoading(){
    var loading = $api.byId("loading");
    setTimeout(function(){
        $api.remove(loading);
    },500);
    
}
 //更新位置信息
function updateLocation(){
   
    var baiduLocation = api.require('baiduLocation');
    baiduLocation.startLocation({
        accuracy: '100m',
        filter:1,
        autoStop: true
    }, function(ret, err){
        var data = {};
        var lat = ret.latitude;
        var lon = ret.longitude;
        data['lat'] = lat;
        data['lon'] = lon;
        data['userid'] = $api.getStorage('userid');
        var url = '&c=member_app&a=updateLocation';
        ajaxRequest(url, 'post', data, function (ret, err) {
            //alert(JSON.stringify(err));
        });
    })
}
//表单事件
function formatDate(time){
    var date = new Date(time*1000);   
    var hour=date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return hour+':'+minute;    
} 
//favorite
function collect(el){
	var uid = $api.getStorage('uid'); 
	//login
	if(!uid){
		api.openWin({
			name: 'userLogin',
			url: './userLogin.html',
			opaque: true,
			vScrollBarEnabled:false
		});
		return;
	}
	
	//news id, activity id, merchant id
	var thisId = $api.attr(el, 'news-id') || $api.attr(el, 'act-id') || $api.attr(el, 'mer-id');
	var model = api.require('model');
	
	//save previous favorites
	var actFav, merFav, newsFav;
	
	model.findById({
		class: 'user',
		id: uid
	},function(ret, err){
		if(ret){
//			alert(JSON.stringify(ret));
			
			actFav = ret.act_fav || '';
			merFav = ret.mer_fav || '';
			newsFav = ret.news_fav || '';
			
			//update data
			var jsonData = {};
			
			//news
			if($api.attr(el, 'news-id')){
				jsonData.news_fav = addData(newsFav, thisId);
			}
			//activity
			if($api.attr(el, 'act-id')){
				jsonData.act_fav = addData(actFav, thisId);
			}
			//merchant
			if($api.attr(el, 'mer-id')){
				jsonData.mer_fav = addData(merFav, thisId);
			}
			
			model.updateById({
				class: 'user',
				id: uid,
				value: jsonData
			}, function(ret, err){
				if(ret){
					api.execScript({
						name: 'root',
						frameName: 'user',
						script: 'updateInfo();'
					});
					setTimeout(function(){
						api.alert({
							msg: '收藏成功'
						});
					},200);
					
				}
				
			});
			
		}
	});
	
}
