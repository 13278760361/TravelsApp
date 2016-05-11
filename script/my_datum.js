var imageClip;
function postData(){
    var data = {};
   // data['userid'] = userid;
  //  data['encrypt'] = encrypt;
    //data['avatar'] = $api.val($api.byId('avatar'));
    data['nickname'] = $api.val($api.byId('nickname'));
    data['company'] = $api.val($api.byId('company'));
    data['mate'] = $api.attr($api.dom(".mate.active"),'data-id');
    var tag='';
    var tagList = $api.domAll(".tag.active");
    for(var i=0;i<tagList.length;i++){
        tag += $api.attr(tagList[i],'data-id')+",";
    }
    data['tags'] = tag.substring(0,tag.length-1);
 //   var url = '&act=member_information&op=editMemberInfo';
    api.ajax({
	    url:ApiUrl + '/index.php?act=member_information&op=editMemberInfo',
	    method:'post',
	    dataType:'json',
	    data:{values:{key:key,nickname:data['nickname'],company:data['company'],mate:data['mate'],tags:data['tags']}}
    },function(ret,err){
    	//coding...
    	if(ret.datas.status==1){
            $api.setStorage('nickname',''+data['nickname']+'');
            $api.setStorage('avatar',''+data['avatar']+'');
            api.toast({
                msg: '修改成功',
                duration:1000,
                location: 'top'
            });
            //我的中心更新数据
            api.sendEvent({
                name: 'reGetMyInfo',
                extra:{key:'true'}
            });
        }
    });
  /*  ajaxRequest(url,'post',data,function(ret,err){

    })*/
}
function imageClipSave(){

    imageClip.save(function(ret, err){

        if(ret){
            api.showProgress({
                style: 'default',
                animationType: 'fade',
                title: '正在上传',
                text: '请稍候',
                modal: false
            });
         
            //头像上传处理
            var img = new Image();
                img.src = ret.savePath;//图片路径
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
                    id: 0,
                    base64: base64
                }
                api.ajax({
	                url:ApiUrl + '/index.php?act=member_information&op=upload',
	                method:'post',
	                dataType:'json',
	                data:{values:{key:$api.getStorage('key')},
	                	  files:{upAvatar:ret.savePath}
	                }
                },function(retIi,errIi){
                	//coding...
                    if(retIi){
                        
                            var avatarDom = $api.byId("avatar");
                            $api.val(avatarDom,''+retIi.datas.url+'');
                            api.hideProgress();
                        
                    }else{
                    	alert(retIi.datas.error);
                    }
                });
                /*var uploadPhotosUrl = '&c=upload&a=uploadPhotoIn';
                ajaxRequest(uploadPhotosUrl, 'post', upData, function (retIi, errIi) {
                    if(retIi){
                        if(retIi.id==0){
                            var avatarDom = $api.byId("avatar");
                            $api.val(avatarDom,''+retIi.url+'');
                            api.hideProgress();
                        }
                    }
                }) */
            }
            var avatarImgDom = $api.byId('avatarImg');
            var nicknameDom = $api.byId('nickname');
            $api.attr(avatarImgDom,'data-echo',''+ret.savePath+'');
            echo.init({
                offset: 0,
                throttle: 250
            });
            imageClipClose();
        }
    });
}
function imageClipClose(){
    imageClip.close();
    var toolDom = $api.byId('imageclipTool');
    $api.css(toolDom,'display:none');
}
function changeAvatar(){
    api.actionSheet({
        title: '请选择图片来源',
        cancelTitle: '取消',
        buttons: ['相册选取','魅力自拍']
    },function(ret,err){
        var winWidth = api.winWidth;
        var listHeight = winWidth/3-12;
        if(ret.buttonIndex==1){
            api.getPicture({
                sourceType: 'library',
                encodingType: 'jpg',
                mediaValue: 'pic',
                destinationType: 'url',
                allowEdit:true,
                quality:80,
                targetWidth: 360
            }, function(ret, err){ 
             
                if (ret.data) {
                    if(api.systemType=='android'){
                        var toolDom = $api.byId('imageclipTool');
                        $api.css(toolDom,'display:block');
                        var winWidth = api.winWidth;
                        var winHeight = api.winHeight;
                        imageClip.open({
                            path:ret.data,
                            h:winHeight-45,
                            clipRect:{
                                x:winWidth/2-100,
                                y:winHeight/2-100,
                                w:200,
                                h:200
                            }
                        },function(ret, err){
                        
                        });
                        api.sendEvent({
                            name: 'imageClipClose',
                            extra:{key:'true'}
                        });
                    }else{
                  
                        api.showProgress({
                            style: 'default',
                            animationType: 'fade',
                            title: '正在上传',
                            text: '请稍候',
                            modal: false
                        });
                        var avatarImgDom = $api.byId('avatarImg');
                        $api.attr(avatarImgDom,'data-echo',''+ret.data+'');
                        echo.init({
                            offset: 0,
                            throttle: 250
                        });
                       
                        auiCompress(ret.data,{
                                    width:200,
                                    quantity:1,
                            success: function (ret) {
                                var upData = {
                                        id: 0,
                                        base64: ret.base64
                                    }
                                    
                                var uploadPhotosUrl = '&c=upload&a=uploadPhotoIn';
                                ajaxRequest(uploadPhotosUrl, 'post', upData, function (retIi, errIi) {
                                    if(retIi){
                                        if(retIi.id==0){
                                            
                                            var avatarDom = $api.byId("avatar");
                                            $api.val(avatarDom,''+retIi.url+'');
                                            api.hideProgress();
                                        }
                                    }
                                })
                            }
                        }); 
                    }
                    
                }
            });
        }else if(ret.buttonIndex==2){
            //TAKE A PHOTO
            api.getPicture({
                sourceType: 'camera',
                encodingType: 'jpg',
                mediaValue: 'pic',
                destinationType: 'url',
                allowEdit:true,
                quality:80,
                targetWidth: 360
            }, function(ret, err){ 
                if (ret.data) {
                    if(api.systemType=='android'){
                        var toolDom = $api.byId('imageclipTool');
                        $api.css(toolDom,'display:block');
                        var winWidth = api.winWidth;
                        var winHeight = api.winHeight;
                        imageClip.open({
                            path:ret.data,
                            h:winHeight-45,
                            clipRect:{
                                x:winWidth/2-100,
                                y:winHeight/2-100,
                                w:200,
                                h:200
                            }
                        },function(ret, err){
                        });
                        api.sendEvent({
                            name: 'imageClipClose',
                            extra:{key:'true'}
                        });
                    }else{
                        api.showProgress({
                            style: 'default',
                            animationType: 'fade',
                            title: '正在上传',
                            text: '请稍候',
                            modal: false
                        });
                        var avatarImgDom = $api.byId('avatarImg');
                        $api.attr(avatarImgDom,'data-echo',''+ret.data+'');
                        echo.init({
                            offset: 0,
                            throttle: 250
                        });
                        auiCompress(ret.data,{
                                    width:200,
                                    quantity:1,
                            success: function (ret) {
                                var upData = {
                                        id: 0,
                                        base64: ret.base64
                                    };
                                var uploadPhotosUrl = '&c=upload&a=uploadPhotoIn';
                                ajaxRequest(uploadPhotosUrl, 'post', upData, function (retIi, errIi) {
                                    if(retIi){
                                        if(retIi.id==0){
                                            var avatarDom = $api.byId("avatar");
                                            $api.val(avatarDom,''+retIi.url+'');
                                            api.hideProgress();
                                        }
                                    }
                                })
                            }
                        });
                    }    
                }
            });
        }
    })
}
function getData(){
	api.ajax({
	    url:ApiUrl + '/index.php?act=member_index',
	    method: 'post',
	    dataType: 'json',
	    data: {values:{key:$api.getStorage('key'),type:'app'}}
    },function(ret,err){
    	//coding...
    	 if(ret){
            $api.attr($api.byId('avatarImg'),'data-echo',''+ret.datas.member_info['avatar']+'');
            $api.val($api.byId('avatar'),''+ret.datas.member_info['avatar']+'');
            $api.val($api.byId('nickname'),''+ret.datas.member_info.nickname+'');
            $api.val($api.byId('company'),''+ret.datas.member_info.company+'');
            $api.val($api.byId('age'),''+ret.datas.member_info.age+' 岁');
            if(ret.datas.member_info.sex==1){
                $api.addCls($api.dom('#sex .boy'),'active');
                $api.css($api.dom('#sex .girl'),'display:none');
                $api.css($api.byId('boytag'),'display:block');
            }else if(ret.datas.member_info.sex==2){
                $api.addCls($api.dom('#sex .girl'),'active');
                $api.css($api.dom('#sex .boy'),'display:none');
                $api.css($api.byId('griltag'),'display:block');
            }
            if(ret.datas.member_info.mate==2){
                $api.addCls($api.dom('#mate .feidanshen'),'active');
            }else{
                $api.addCls($api.dom('#mate .danshen'),'active');
            }
            //标签类判断
            var tagList = $api.domAll(".tag");
            var tagArr = new Array;
            tagArr = ret.datas.member_info.tags.split(",");
            for(var i in tagArr){
                var typeDom = $api.dom('div[data-id="'+tagArr[i]+'"]');
                $api.addCls(typeDom,'active');
                var isOn = $api.attr(typeDom,'isOn','1');
            } 
            echo.init({
                offset: 0,
                throttle: 250
            });
        }
    });
   /* var url = ApiUrl + "/index.php?act=member_index&a=getMyDatum&userid="+userid+'&encrypt='+encrypt;
    ajaxRequest(url,'GET','',function(ret,err){

    })*/
    
}
apiready = function(){
	imageClip = api.require('imageClip');
	getData();
    var mateList = $api.domAll(".mate");
    for(var i in mateList){
        $api.addEvt(mateList[i], 'click', function(){
            $api.removeCls($api.dom(".mate.active"),'active');
            $api.addCls(this,'active');
        });
    }
	//标签
    var tagList = $api.domAll(".tag");
    for(var i in tagList){
        $api.addEvt(tagList[i], 'click', function(){
            var themeActive = $api.domAll(".tag.active");
            var isOn = $api.attr(this,'isOn');
            if(isOn==1){
                $api.attr(this,'isOn','0');
                $api.removeCls(this,'active');
            }else{
                $api.attr(this,'isOn','1');
                if(themeActive.length>4){
                    api.toast({
                        msg: '最多选5个标签',
                        duration:2000,
                        location: 'top'
                    });
                    return;
                }
                $api.addCls(this,'active');
            }
        });
    }
};