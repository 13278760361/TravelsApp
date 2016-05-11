var imageClip,lat,lon;
function postData(){
    var data = {};
    data['userid'] = userid;
    data['encrypt'] = encrypt;

    var logoDom = $api.byId('logo');
    var titleDom = $api.byId('title');
    var descriptionDom = $api.byId('description');
    data['logo'] = $api.val(logoDom);
    data['title'] = $api.val(titleDom);
    data['description'] = $api.val(descriptionDom);
    
    data['lat'] = lat;
    data['lon'] = lon;    
    var url = '&c=circle_app&a=circleGroupAdd';
    if(!data['logo'] || !data['title']){
        api.toast({
            msg: '请输入完整信息',
            duration:1000,
            location: 'top'
        });
    }else{
        //防止发布重复取消点击发布事件
        api.execScript({
            name:'circle_add_win',
            script:'addCancel();'
        })
        ajaxRequest(url,'post',data,function(ret,err){
            if(ret.status==1){
                //发出更新圈子事件，在圈子列表页有监听
                api.sendEvent({
                    name: 'refreshCircleGroup',
                    extra:{key:'true'}
                });
                updateLocation();
                api.toast({
                    msg: '创建成功',
                    duration:1000,
                    location: 'top'
                });
                setTimeout(function(){
                    api.execScript({
                        name:'circle_add_win',
                        script:'back();'
                    })
                },800)
            }else if(err){
                //发布失败恢复点击事件
                api.execScript({
                    name:'circle_add_win',
                    script:'addRecover();'
                })
            }
        })
    }

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
                var uploadPhotosUrl = '&c=upload&a=uploadPhotoIn';
                ajaxRequest(uploadPhotosUrl, 'post', upData, function (retIi, errIi) {
                    if(retIi){
                        if(retIi.id==0){
                            var logoDom = $api.byId("logo");
                            $api.val(logoDom,''+retIi.url+'');
                            api.hideProgress();
                        }
                    }
                }) 
            }
            var logoImgDom = $api.byId('logoImg');
            $api.attr(logoImgDom,'data-echo',''+ret.savePath+'');
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
function changeLogo(){
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
                destinationType: 'url'
            }, function(ret, err){ 
                if (ret.data) {
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
                        name: 'circleLogoClipClose',
                        extra:{key:'true'}
                    });
                }
            });
        }else if(ret.buttonIndex==2){
            //TAKE A PHOTO
            api.getPicture({
                sourceType: 'camera',
                encodingType: 'jpg',
                mediaValue: 'pic',
                destinationType: 'url'
            }, function(ret, err){ 
                if (ret.data) {
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
                        name: 'circleLogoClipClose',
                        extra:{key:'true'}
                    });
                }
            });
        }
    })
}

apiready = function(){
	imageClip = api.require('imageClip');
	//坐标
    var baiduLocation = api.require('baiduLocation');
        baiduLocation.startLocation({
            accuracy: '100m',
            filter:1,
            autoStop: true
        }, function(ret, err){
            var sta = ret.status;
            lat = ret.latitude;
            lon = ret.longitude;
        })
};