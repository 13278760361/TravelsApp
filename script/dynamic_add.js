var imgId = 0;
function customAddress(){
    var vip = $api.getStorage('vip');
    
        api.openWin({
            name: 'dynamic_add_map',
            url: 'dynamic_add_map.html',
            delay: 300,
            vScrollBarEnabled: false,
            hScrollBarEnabled: false
        });
        
    
    
}
function uploadImage(item,img_id){
       // var item = list[length-1];
       
        var imgPath = item.path;
        var img_Name = new Date().getTime() + "_" + length;
        var imageCachePath = api.cacheDir;
     //   alert(api.fsDir);
        var imageFilter = api.require("imageFilter");
        imageFilter.compress({
                img : imgPath,
                quality : 0.5,
                scale : 0.5,
                save : {
                        album : true,
                        imgPath : imageCachePath,
                        imgName : img_Name + '.jpg'
                }
        }, function(ret, err) {
        	
        	var img_url = imageCachePath + '/' + img_Name + '.jpg';
        	
             api.ajax({
	            url: ApiUrl + '/index.php?act=upload&op=dynamic_upload',
	            method:'post',
	            dataType:'json',
	            data:{values:{key:$api.getStorage('key'),img_id:img_id},
	            	files:{upfile:img_url}
	            }
            },function(reta,erra){
           
                if(reta){
                //	alert(reta.datas.img_id);
                	imgId = reta.datas.data.file_id;
                	
                    $api.text($api.byId(''+item.path+''),'上传完成');
                    $api.attr($api.byId(''+item.path+''),'data-id',''+reta.datas.data.file_name+'');
					$api.attr($api.byId('dydes-'+reta.datas.img_id+''),'data-id',''+imgId+'');
                }else{
                	 alert("reta = " + JSON.stringify(reta) + JSON.stringify(erra));
                }
            });       
        });
   /* var img = new Image();
        img.src = item.path;//图片路径
        img.onload = function () {
            var that = this;
            //生成比例 
            var w = that.width,
                h = that.height,
                scale = w / h;
                w = 640 || w;
                h = w / scale;
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
                userid: $api.getStorage('userid'),
                base64: base64,
                key: $api.getStorage('key')
            }
        //    var uploadPhotosUrl = ApiUrl + '/index.php?act=upload&op=dynamic_upload';
       // alert(item.path);

           
        }*/
}
function deleteImage(imgPath){
	
    $api.remove($api.dom('.image-list[data-src="'+imgPath+'"]'));
    $api.remove($api.dom('.dy_describe[data-src="'+imgPath+'"]'));
	
    var getImg = $api.byId('dydes-'+imgPath+''); 
    var img_id = $api.attr(getImg,'data-id');

    api.ajax({
	    url:ApiUrl + '',
    },function(ret,err){
    	//coding...
    	
    });
}
function selectImage(){
    api.actionSheet({
        title: '请选择图片来源',
        cancelTitle: '取消',
        buttons: ['相册选取','魅力自拍']
    },function(ret,err){
        var winWidth = api.winWidth;
        var listHeight = winWidth/3-12;
        if(ret.buttonIndex==1){
            //ALBUM
            var album = api.require('UIMediaScanner');
            album.open({
                column: 4,
                sort: {
                    key: 'time',
                    order: 'desc'
                },
                texts: {
                    stateText: '*',
                    cancelText: '取消',
                    finishText: '完成'
                },
                styles: {
                    bg: '#fff',
                    mark: {
                        icon: '',
                        position: 'bottom_left',
                        size: 20
                    },
                    nav: {
                        bg: '#1abc9c',
                        stateColor: '#ffffff',
                        stateSize: 18,
                        cancleBg: 'rgba(0,0,0,0)',
                        cancelColor: '#ffffff',
                        cancelSize: 18,
                        finishBg: 'rgba(0,0,0,0)',
                        finishColor: '#ffffff',
                        finishSize: 18
                    }
                }
            }, function(ret){
            
                if(ret){
                    //alert(JSON.stringify(ret));
                    var photoList = $api.byId("photoList");
                    var photos = ret.list;
                    var list = ret.list;

                    api.toast({
                        msg: '正在加载图片',
                        duration:1000,
                        location: 'top'
                    });
                    for(var i in list){
                        var item = list[i];
                        var imgDom = $api.dom('.image-list[img-src="'+item.path+'"]');
                        if(!imgDom){
                            $api.prepend(photoList,'<li class="aui-list-view-cell aui-img image-list" style="height:'+listHeight+'px; margin-left:10px;" data-src="'+i+'"><p class="aui-col-xs-4" style="height:'+listHeight+'px;"><img class="aui-img-object aui-col-xs-4 uploadPhotos" src="'+item.thumbPath+'"style="height:'+listHeight+'px;"/><div class="uploading aui-col-xs-4" style="width:33.3333%;" id="'+item.path+'">上传中</div><span class="imgdelete aui-iconfont aui-icon-delete" tapmode onclick="deleteImage(\''+i+'\')"></span></span></p><textarea class="dy_describe" data-src="'+i+'" id="dydes-'+i+'" data-id="" style="border:1px solid #C0C0C0; width:65%; height:' + listHeight + 'px;" placeholder="为此图描述（最多不超过150字）"></textarea></li>');
                            api.parseTapmode();
                            uploadImage(item,i);
                            
                        }
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
                allowEdit: false,
                quality: 60,
                targetWidth:640,
                saveToPhotoAlbum: true
            }, function(ret, err){ 
                var photoList = $api.byId("photoList");
                if (ret.data) {
                    $api.prepend(photoList,'<li class="aui-col-xs-4 aui-list-view-cell aui-img image-list" style="height:'+listHeight+'px;" data-src="'+ret.data+'"><img class="aui-img-object uploadPhotos" src="'+ret.data+'"><div class="uploading" id="'+ret.data+'">上传中</div><span class="imgdelete aui-iconfont aui-icon-delete" tapmode onclick="deleteImage(\''+ret.data+'\')"></span></span></li>');
                    api.parseTapmode();
                    uploadImage(ret.data);
                }
            });
        }
    });
}
function add(){
    var data = {};
    var userid = $api.getStorage('userid');
    var key = $api.getStorage('key');
    var content = $api.byId('content').value;
    var address = $api.byId('address').value;
    var position = $api.byId('position').value;
    var addressStatus = $api.dom(".address-type.active");
    var showaddress = $api.attr(addressStatus,'type-id');

    //PHOTOS数组
    var photosIds = '';
    var photosList = $api.domAll(".uploading");
    for(var i=0;i<photosList.length;i++){
        photosIds += $api.attr(photosList[i],'data-id')+",";
    }
    photosIds = photosIds.substring(0,photosIds.length-1);
    var photosid = photosIds;
    
    
    var imgIds = '';
    var imgList = $api.domAll(".dy_describe");
    for(var i=0;i<imgList.length;i++){
        imgIds += $api.attr(imgList[i],'data-id')+",";
    }
    imgIds = imgIds.substring(0,imgIds.length-1);
    var uploadIds = imgIds;
    
    
    
   	
   	var describe = '';
   	var describeList = $api.domAll(".dy_describe");
   
   	for(var i=0;i<describeList.length;i++){
   		
   		//$api.text(photosList[i],'title',);
   		describe += $api.val(describeList[i])+'br';
   	}
   	
  	describe = describe.substring(0,describe.length-2);

   	var travel_img ='';
   	travel_img = photosIds.substring(0,21);
   	
    if(content.length < 15){
        api.toast({
            msg: '亲，故事描述有点少，再多写点吧',
            duration:2000,
            location: 'top'
        })
        return false;
    }
    if(photosList.length < 1){
        api.toast({
            msg: '至少有一张图片哦',
            duration:2000,
            location: 'top'
        })
        return false;
    }
    if(!userid || !content){
        api.toast({
            msg: '请输入完整信息',
            duration:2000,
            location: 'top'
        })
    }else{
        api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: '正在发布',
            text: '请稍候...',
            modal: false
        });
        //写入数据
        api.ajax({
	        url: ApiUrl + '/index.php?act=upload&op=dynamicAdd_new',
	        method: 'post',
	        dataType: 'json',
	        data:{values:{key:key,content:content,address:address,position:position,showaddress:showaddress,photosid:photosid,describe:describe,travel_img:travel_img,uploadIds:uploadIds}}
        },function(ret,err){
        	//coding...
            if(ret.datas.data['status'] == 200){
                api.hideProgress();
                api.sendEvent({
                    name:'reLoad',
                    extra: {key:'true'}
                })
                api.toast({
                    msg: '发布成功，等待小伙伴们审核',
                    duration:1000,
                    location: 'top'
                });
                setTimeout(function(){
                    api.closeWin({
                        name:'dynamic_add_win'
                    })
                },1000)
            }else{
                api.hideProgress();
                api.toast({
                    msg: '发布失败',
                    duration:1000,
                    location: 'top'
                });
            }
        });
        /*var addUrl = ApiUrl + '/index.php?act=upload&op=dynamicAdd_new';
        ajaxRequest(addUrl, 'post', data, function (ret, err) {

            if(ret.status==200){
                api.hideProgress();
                api.sendEvent({
                    name:'reLoad',
                    extra: {key:'true'}
                })
                api.toast({
                    msg: '发布成功，等待小伙伴们审核',
                    duration:1000,
                    location: 'top'
                });
                setTimeout(function(){
                    api.closeWin({
                        name:'dynamic_add_win'
                    })
                },1000)
            }else{
                api.hideProgress();
                api.toast({
                    msg: '发布失败',
                    duration:1000,
                    location: 'top'
                });
            }
        }) */
    }
}
function getLocation(){
    var baiduLocation = api.require('baiduLocation');
    baiduLocation.startLocation({
        accuracy: '3km',
        filter:1,
        autoStop: true
    },function(ret, err){
        var sta = ret.status;
        var lat = ret.latitude;//纬度
        var lon = ret.longitude;//经度
        var location = ''+lat+','+lon+'';
        var t = ret.timestamp;

	    
        var position = $api.byId('position');
        $api.val(position,''+location+'');
            var ak = 'sjRTDWG0b8uxsdGoCCVxGZfx';
			var mcode='5E:91:60:E0:31:B0:B7:05:20:3C:9B:9A:E5:AB:3F:4B:05:25:8E:F8;com.m13278760361.xku';
            api.ajax({
                url: 'http://api.map.baidu.com/geocoder/v2/?ak='+ak+'&mcode='+mcode+'&location='+location+'&output=json&pois=0',
                method: 'get',
                timeout: 60,
                dataType: 'json',
                data:{}
            },function(retd,errd){
              // alert(JSON.stringify(retd));
                var myaddress = $api.byId("myaddress");
                var address = $api.byId("address");
                if(retd.status==0){
                    $api.text(myaddress,ret.result.formatted_address);
                    $api.val(address,ret.result.formatted_address);
                }else{
                    $api.text(myaddress,'获取失败');
                    $api.val(address,'');
                }
                
            });
        
        
    })
}

apiready = function(){
    //POSITION
    setTimeout(function(){
        getLocation();
    },400);
    /*var myDate = new Date();
    if(myDate.getDay()==0 || myDate.getDay()==6){
        $api.css($api.byId('weekday'),'display:block');
    }*/
    //性别选择--单选
    var addressList = $api.domAll(".address-type");
    for(var i in addressList){
        $api.addEvt(addressList[i], 'click', function(){
            $api.removeCls($api.dom(".address-type.active"),'active');
            $api.addCls(this,'active');
        });
    }
    //监听地图返回地址事件
    api.addEventListener({
        name: 'dynamicReturnPlace'
    }, function(ret){
        if(ret && ret.value){
            var value = ret.value;
            var place = ret.value.name;
            var lat = ret.value.lat;
            var lon = ret.value.lon;
            var myaddress = $api.byId("myaddress");
            var address = $api.byId("address");
            $api.text(myaddress,place);
            $api.val(address,place);
            var location = ''+lat+','+lon+'';
            var position = $api.byId('position');
            $api.val(position,''+location+'');
        }
    });
}
