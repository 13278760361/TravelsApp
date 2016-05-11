var dataId;
var data = {};
var conUrl = "";
var getDataUrl = "";
var type = "";
function shareWx(){
	var wx = api.require('wx');
	wx.isInstalled(function(ret, err){
	    if(ret.installed){
	        wx.shareWebpage({
			    apiKey: 'wx3eb37ad7c295118c',
				scene: 'session',
			    title: data.goods_name,
			    description: data.goods_jingle,
			    thumb: data.share_img,
			    contentUrl: conUrl+data.goods_id
			}, function(retd, errd){
			    if(retd.status){
			        alert('分享成功');
			    }
			});
	    }else{
	        alert('当前设备未安装微信客户端');
	    }
	});
}
function shareCof(){
	var wx = api.require('wx');
	wx.isInstalled(function(ret, err){
	    if(ret.installed){
	
	        wx.shareWebpage({
			    apiKey: 'wx3eb37ad7c295118c',
				scene: 'timeline',
			    title: data.goods_name,
			    description: data.goods_jingle,
			    thumb: data.share_img,
			    contentUrl: conUrl+data.goods_id
			}, function(retd, errd){
		
			    if(retd.status){
			        alert('分享成功');
			    }
			});
	    }else{
	        alert('当前设备未安装微信客户端');
	    }
	});
}
function shareQQ(){
	var dataId = api.pageParam.dataId;
	
	var obj = api.require('qq');
	obj.installed(function(ret,err){
	    if(ret.status){

      		obj.shareNews({
			    url:conUrl+data.goods_id,
			    title:data.goods_name,
			    description:data.goods_jingle,
			    imgUrl:data.trip_goods_image
			},function(retII,errII){
				if(retII.status){
					alert('分享成功');
				}else{
					alert('分享失败');
				}
			});

	    }else{
	        api.alert({msg: "没有安装QQ"});
	    } 
	});
	
}
function shareXlwb(){
	var sinaWeiBo = api.require('sinaWeiBo');
	sinaWeiBo.auth(function(ret,err){
	    if (ret.status) {
			sinaWeiBo.sendRequest({
			    contentType: 'web_page',
			    text: data.goods_jingle,
			  //  imageUrl: data.share_img,
			    media: {
			    	title:data.goods_name,
			    	description:data.goods_jingle,
    				thumbUrl:data.share_img,
			   	 	webpageUrl:conUrl+data.goods_id
			    }
			},function(reti,erri){
			    if (reti.status) {
			        api.alert({
			            title: '发表微博',
			            msg: '发表成功',
			            buttons: ['确定']
			        });
			    }else{
			        api.alert({
			            title: '发表失败',
			            msg: erri.msg,
			            buttons: ['确定']
			        });
			    }
			});
	    }else{
	        api.alert({msg:'授权失败'+err.msg});
	    }
	});
}
function shareTxwb(){
	api.toast({
	    msg:'正在开发中...',
	    duration:2000,
    	location: 'top'
    });
}

function shareRR(){
	api.toast({
	    msg:'正在开发中...',
	    duration:2000,
    	location: 'top'
    });
}

function shareEmail(){
	api.toast({
	    msg:'正在开发中...',
	    duration:2000,
    	location: 'top'
    });
}

function shareMesg(){
	api.toast({
	    msg:'正在开发中...',
	    duration:2000,
    	location: 'top'
    });
}
function closeMenu(){
	api.closeFrame({name: 'share_fra2'});
}
function getData(){
	var dataId = api.pageParam.dataId;
	var dataUrl = getDataUrl+dataId+'&type=wap';
	ajaxRequest(dataUrl,'GET','',function(ret,err){
		if(ret){
		var retd = "";
			if(type=="trip"){
				retd = ret.datas.zb_detail;
				data['goods_id'] = retd.goods_id;
				data['goods_name'] = retd.goods_name;
				data['goods_jingle'] = retd.goods_jingle;
				data['trip_goods_image'] = retd.trip_goods_image;
			}else{
				retd = ret.datas.line_detail;
				data['goods_id'] = retd.id;
				data['goods_name'] = retd.names;
				data['goods_jingle'] = retd.names;
				data['trip_goods_image'] = retd.wx_share_img;
			}
			
			api.imageCache({
			    url: retd.wx_share_img,
			    thumbnail:true,
			    policy:'cache_else_network'
			},function( reti, erri ){
			    if( reti ){
			         data['share_img'] = reti.url;
			    }else{
			         alert( JSON.stringify( erri ) );
			    }
			});
		}
	});
}
apiready = function(){
	type = api.pageParam.type;
	if(type == 'trip'){
		conUrl = "http://www.ynypw.com/wap/tmpl/trip_detail.html?trip_id=";
		getDataUrl = "/index.php?act=trip&op=trip_detail&trip_id=";
	}else{
		conUrl = "http://www.ynypw.com/wap/tmpl/line_detail.html?trip_id=";
		getDataUrl = "/index.php?act=trip&op=leader_detail&leader_id=";
	}
	var height=document.getElementById('x').offsetHeight;
    height=api.winHeight-height-api.pageParam.height;
    document.getElementById('shadow').style.height = height+'px';
    var menu = $api.dom('.x');
    $api.addCls(menu, 'x-click');
    getData();
};
    