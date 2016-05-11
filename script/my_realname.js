var msg = "";
function postData(){
	var realnameDom = $api.byId('realname');
	var idcardDom = $api.byId('idcard');
	var realname = $api.val(realnameDom);
	var realphoto = $api.byId('realphoto').value;
	var idcard = $api.val(idcardDom);
	if(realname == ""){
		
		relmsg("真实姓名不能为空");
		return false;
	}
	if(idcard == ""){
		relmsg("身份证号码不能为空");
		return false;
	}
	if(realphoto == ""){
		relmsg('手持身份证不能为空');
		return false;
	}
	var cardid = $('#idcard').val();
	if(!/^(\d{15}$|^\d{14}(\d|X|x)$|^\d{18}$|^\d{17}(\d|X|x))$/.test(cardid)){
		relmsg("身份证号码不正确");
		return false;
	}
	api.ajax({
	    url: ApiUrl + '/index.php?act=member_index&op=aut_realname',
	    method: 'post',
	    dataType: 'json',
	    data: {values:{key:$api.getStorage('key'),realname:realname,idcard:idcard,realphoto:realphoto}}
    },function(ret,err){
    	//coding...
    	var retd = ret.datas.realnameinfo;
    	if(ret.datas.data.stats == 1){
			msg = "提交成功，等待审核";
			relmsg(msg);
			api.closeWin();
			//我的中心更新数据  
			api.execScript({
				name:'my',
	            script: 'getInfo();'
            });
            api.sendEvent({
                name: 'reGetMyInfo',
                extra:{key:'true'}
            });
		}else{
			if(retd.real_status == 0){
				msg = "认证失败";
				relmsg(msg);
			}
			if(retd.real_status == 1){
				msg = "等待审核";
				relmsg(msg);
			}
			if(retd.real_status == 10){
				msg = "正在审核中";
				relmsg(msg);
			}
			if(retd.real_status == 20){
				msg = "你已经认证";
				relmsg(msg);
			}
			
		}
    });
    
	/*var data = {};
	data['userid'] = userid;
	data['encrypt'] = encrypt;
	var realnameDom = $api.byId('realname');
	var idcardDom = $api.byId('idcard');
	var realphotoDom = $api.byId('realphoto');
	var takephotoDom = $api.dom('.takephoto');

	data['realname'] = $api.val(realnameDom);
	data['idcard'] = $api.val(idcardDom);
	data['realphoto'] = $api.val(realphotoDom);
	var url = '&c=member_app&a=postRealnameInfo';
	ajaxRequest(url,'post',data,function(ret,err){
		
	})*/
}
function relmsg(msg){
	api.toast({
	    msg: msg,
	    duration:2000,
	    location: 'top'
	});
}
function getData(){
	var url = '/index.php?act=member_index&op=getRealnameInfo&userid='+userid+'&key='+key;
	ajaxRequest(url,'GET','',function(ret,err){
		if(ret){
			var realnameDom = $api.byId('realname');
			var idcardDom = $api.byId('idcard');
			var realphotoDom = $api.byId('realphoto');
			var takephotoDom = $api.dom('.takephoto');

			$api.val(realnameDom,''+ret.realname+'');
			$api.val(idcardDom,''+ret.idcard+'');
			$api.val(realphotoDom,''+ret.realphoto+'');
			$api.html(takephotoDom,'<img src="'+ret.thumb+'">');
		}
	})
}
function getPicture(num){
    api.getPicture({
        sourceType: 'library',
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
        		var img_url = ret.data;
        		api.ajax({
	                url: ApiUrl + '/index.php?act=member_index&op=uploadRimg',
		            method:'post',
		            dataType:'json',
	                data:{values:{key:$api.getStorage('key'),type:'upfile'},
	                		files:{imgfile:img_url}
	                }
                },function(retd,errd){
                	//coding...
                        if(retd){
                                var takephotoDom = $api.dom(".takephoto");
                                var realphotoDom = $api.byId("realphoto");
                                $api.html(takephotoDom,'<img src="'+img_url+'">');
                                $api.val(realphotoDom,''+retd.datas.realname_info['pic']+'');
                                
                        }else{
                        	alert(JSON.stringify(errd));
                        }
                });
        	

           
              /*  var img = new Image();
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
           */
            
        }else{
        	alert('上传失败');
        }
    });
}
apiready = function(){
	getData();
}