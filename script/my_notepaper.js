function deleteData(id){
    var deleUrl = ApiUrl + '/index.php?act=member_notepaper&op=deleteNotepaterInfo';
    api.ajax({
	    url:deleUrl,
	    method:'post',
	    dataType:'json',
	    data:{values:{key:key,note_id:id}}
    },function(ret,err){
    	//coding...
        if(ret.datas.status==1){
            api.toast({
                msg: '删除成功',
                duration:1000,
                location: 'top'
            });
            $api.remove($api.byId('notepaper_'+id));
            //我的中心更新数据
            api.sendEvent({
                name: 'reGetMyInfo',
                extra:{key:'true'}
            });
        }else if(ret.datas.status==0){
            api.toast({
                msg: '删除失败',
                duration:1000,
                location: 'top'
            });
        }
    });
    
}
function postData(){
	var data = {};
	data['userid'] = userid;
	data['encrypt'] = encrypt;
	var contentDom = 
	$api.byId('content');

	data['content'] = $api.val(contentDom);
	var postUrl = ApiUrl + '/index.php?act=member_notepaper&op=postNotepaper';
	api.ajax({
	    url:postUrl,
	    method:'post',
	    dataType:'json',
	    data:{values:{key:key,content:data['content']}}
    },function(ret,err){
    	//coding...
		if(ret.datas.status>0){
			api.toast({
			    msg: '发布成功',
			    duration:1000,
			    location: 'top'
			});
            $api.val(contentDom,'');
            data['id'] = ret.datas.status;
            data['inputtime'] = '刚刚';
            var content = $api.byId('notepaper-content');
            var tpl = $api.byId('newNotepaper-template').text;
            var tempFn = doT.template(tpl);
            $api.prepend(content,tempFn(data));
			//我的中心更新数据
            api.sendEvent({
                name: 'reGetMyInfo',
                extra:{key:'true'}
            });
		}else if(ret.status==0){
			api.toast({
			    msg: '发布失败',
			    duration:1000,
			    location: 'top'
			});
		}
    });
	/*ajaxRequest(url,'post',data,function(ret,err){

	})*/
}
function getData(){
	var url = '/index.php?act=member_notepaper&op=getNotepaperInfo&key='+key;
	ajaxRequest(url,'GET','',function(ret,err){
	
		var retd = ret.datas.noteInfo;
	//	alert(JSON.stringify(retd));
		if(ret.datas.status==1){
		
			var content = $api.byId('notepaper-content');
            var tpl = $api.byId('notepaper-template').text;
            var tempFn = doT.template(tpl);
            $api.prepend(content,tempFn(retd));
		}
	})
}
function getPicture(num){
    api.getPicture({
        sourceType: 'camera',
        encodingType: 'jpg',
        mediaValue: 'pic',
        destinationType: 'url',
        allowEdit: true,
        quality: 50,
        targetWidth:360,
        //targetHeight:100,
        saveToPhotoAlbum: false
    }, function(ret, err){
        if(ret.data){
            if(num==0){
                var takephotoDom = $api.dom(".takephoto");
                $api.text(takephotoDom,'正在上传');

            }
            setTimeout(function(){
                var img = new Image();
                img.src = ret.data;//图片路径
                img.onload = function () {
                    var that = this;
                    //生成比例 
                    var w = that.width,
                        h = that.height;
                    //生成canvas
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    $api.attr(canvas,'width',''+w+'');
                    $api.attr(canvas,'height',''+h+'');
                    ctx.drawImage(that, 0, 0, w, h);
                    var base64 = canvas.toDataURL('image/jpeg');
                    //alert(base64);
                    //上传图片
                    var upData = {
                        id: num,
                        base64: base64
                    }
                    var uploadPhotosUrl = '&c=upload&a=uploadPhotoIn';
                    ajaxRequest(uploadPhotosUrl, 'post', upData, function (retIi, errIi) {
                        if(retIi){
                            if(retIi.id==0){
                                var takephotoDom = $api.dom(".takephoto");
                                var realphotoDom = $api.byId("realphoto");
                                $api.html(takephotoDom,'<img src="'+retIi.url+'">');
                                $api.val(realphotoDom,''+retIi.url+'');
                            }
                        }
                    }) 
                }
            },500)
            
        }
    });
}
apiready = function(){
	getData();
}