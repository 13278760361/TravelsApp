var themeList ;
function openPicker(dateType){
    var dateType = $api.byId(''+dateType+'');
    
    if(api.systemType=='android'){
        api.openPicker({
            type: 'date',
            title:'选择时间'
        },function(ret,err){
            var year = ret.year;
            var month = ret.month;
            var day = ret.day;
            var value1 = year+'-'+month+'-'+day;
            $api.val(dateType,''+value1+'');
            //选择时间
            api.openPicker({
                type: 'time',
                title:'选择时间'
            },function(ret,err){
                var hour = ret.hour;
                var minute = ret.minute;
                var value2 = hour+':'+minute;
                $api.val(dateType,''+value1+' '+value2+'');
            });
        }); 
    }else if(api.systemType=='ios'){
        api.openPicker({
            type: 'date_time',
            title:'选择时间'
        },function(ret,err){
            var year = ret.year;
            var month = ret.month;
            var day = ret.day;
            var hour = ret.hour;
            var minute = ret.minute;
            var value1 = year+'-'+month+'-'+day+' '+hour+':'+minute;
            $api.val(dateType,''+value1+'');
            
        });
    }
}
function add(){
    var data = {};
    data['userid'] = userid;
    data['encrypt'] = encrypt;
    
    var title = $api.val($api.byId('title'));
    var content = $api.val($api.byId('content'));
    var startdate = $api.val($api.byId('startdate'));
    var enddate = $api.val($api.byId('enddate'));
    var count = $api.val($api.byId('count'));
    var address = $api.val($api.byId('address'));
    if(address==""){
        address = $api.val($api.byId('place'));
    }
    var lat = $api.val($api.byId('lat'));
    var lon = $api.val($api.byId('lon'));
    var money = $api.val($api.byId('money'));
    var thumb = $api.val($api.byId('thumb'));
    var thumbAct = $api.val($api.byId('thumbAct'));
    var photoval_1 = $api.val($api.byId('photoval-1'));
    var photoval_2 = $api.val($api.byId('photoval-2'));
    var photoval_3 = $api.val($api.byId('photoval-3'));

    
    var sex = $api.dom(".sex.active");
    sex = $api.attr(sex,'data-id');
    //年龄
    var age='';
    var ageList = $api.domAll(".age.active");
    
   
    for(var i=0;i<ageList.length;i++){
        age += $api.attr(ageList[i],'data-id')+",";
    }
    age = age.substring(0,age.length-1);
    age = age;
    //介绍图3张
    var imgLists = '';
    var imgList = $api.domAll(".photovals");
    var imgv = "";
    for(var i =1;i<imgList.length;i++){
    	 imgv =$api.val($api.byId('photoval-'+i));
    	if(imgv != ''){
    		imgLists+=imgv+",";
    	}
    }
    imgLists = imgLists.substring(0,imgLists.length-1);
   // alert(imgLists);
    //主题
    var theme='';
    var themeList = $api.domAll(".theme.active");
    for(var i=0;i<themeList.length;i++){
        theme += $api.attr(themeList[i],'data-id')+",";
    }
    theme = theme.substring(0,theme.length-1);

    theme = theme;
    if(title=="" || content=="" || startdate=="" || enddate=="" || count=="" || money=="" || thumb=="" || sex=="" || age=="" || theme==""){
        api.toast({
            msg: '请输入完整信息',
            duration:2000,
            location: 'top'
        })
        return;
    }else{
        //去掉发布事件，防止重复发布

        api.execScript({
            name: 'activity_add_aa_win',
            script: 'hideAdd();'
        });
		api.ajax({
			url: ApiUrl + '/index.php?act=member_activity&op=act_release',
			method: 'post',
			dataType: 'json',
			data:{values:{
				key:$api.getStorage('key'),
				title:title,
				content:content,
				startdate:startdate,
				enddate:enddate,
				count:count,
				address:address,
				money:money,
				age:age,
				sex:sex,
				theme:theme,
				lat:lat,
				lon:lon,
				count:count,
				address:address,
				imgLists:imgLists,
				thumb:thumb
			},
			
			}
		},function(ret,err){
			//coding...
			//alert(JSON.stringify(ret.datas.status));
			if(ret.datas.status==1){
                updateLocation();
                api.toast({
                    msg: '发布成功',
                    duration:1000,
                    location: 'top'
                });
                setTimeout(function(){
                    api.closeWin({
                        name:'activity_add_aa_win'
                    })
                },1000)
                
            }else{
                api.execScript({
                    name: 'activity_add_aa_win',
                    script: 'showAdd();'
                });
                api.toast({
                    msg: '发布失败',
                    duration:2000,
                    location: 'top'
                })
            }
		});
       /* var addUrl = '&c=activity_aa_app&a=add'; 
        ajaxRequest(addUrl, 'post', data, function (ret, err) {
            
        }) */
    }
}

function getPicture(num){
    api.getPicture({
        sourceType: 'library',
        encodingType: 'jpg',
        mediaValue: 'pic',
        destinationType: 'url',
        allowEdit: true,
        quality: 50,
        saveToPhotoAlbum: false
    }, function(ret, err){
        if(ret.data){
            if(num==0){
                var thumb = $api.dom(".activity-add-thumb");
               // var thumbAct = $api.byId('thumbAct');
              //  $api.val(thumb, ''+ret.data+'');
                $api.css(thumb,'background:url('+ret.data+') no-repeat center; background-size:cover;');
                
                $api.text(thumb,'正在上传');

            }else{
                var list = $api.byId("photos-"+num);
                $api.attr(list,'src',''+ret.data+'');
                var status = $api.byId("status-"+num);
                if(status){
                    $api.text(status,'上传中');
                }else{
                    $api.after(list,'<div class="status" id="status-'+num+'">上传中</div>');
                }
                //上传图片
            }
           
            setTimeout(function(){
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
                    }*/
                    
                    api.ajax({
	                    url:ApiUrl + '/index.php?act=member_activity&op=uploadPhotoIn',
	                    method: 'post',
	                    dataType: 'json',
	                    data:{values:{key:$api.getStorage('key'),img_id: num},
	                    	files:{actfile:ret.data}
	                    }
                    },function(retIi,errIi){
                    	//coding...
                    	
                    	var retd = retIi.datas.img_list;
                    //	alert(JSON.stringify(retd.length));
                    //	alert(JSON.stringify(retd[0]['img_id']));
                        if(retd){
                            if(retd['img_id']==0){
                                var thumbDom = $api.byId("thumb");
                                var thumb = $api.dom(".activity-add-thumb");
                                $api.val(thumbDom,''+retd['file_name']+'');
                                $api.text(thumb,'上传成功');
                            }else{
                                var imgDom = $api.byId("photoval-"+retd['img_id']);
                                $api.val(imgDom,''+retd['file_name']+'');
                                var list = $api.byId("photos-"+retd['img_id']);
                                $api.attr(list,'src','' + retd['file_path']+'');

                                var status = $api.byId("status-"+retd['img_id']);
                                $api.text(status,'上传成功');
                            }
                        }                    	
                    });
                
            },500)
            
        }
    });
}
function getData(){
	var ajaxUrl = '/index.php?act=trip&op=activityTypeList';
	ajaxRequest(ajaxUrl,'GET','',function(ret,err){
		var retd = ret.datas.type_list;
		if(ret.datas.status==1){
			var content = $api.byId('type-content');
            var tpl = $api.byId('type-template').text;
            var tempFn = doT.template(tpl);
            $api.prepend(content,tempFn(retd));
            themeList = $api.domAll(".theme");
		}
		
	})
}
apiready = function(){
    api.parseTapmode();
    getData();
    //性别选择--单选
    var sexList = $api.domAll(".sex");
    for(var i in sexList){
        $api.addEvt(sexList[i], 'click', function(){
            $api.removeCls($api.dom(".sex.active"),'active');
            $api.addCls(this,'active');
        });
    }
    //年龄--多选
    var ageList = $api.domAll(".age");
    for(var i in ageList){
        $api.addEvt(ageList[i], 'click', function(){
            var dataId = $api.attr(this,'data-id');
            var ageActive = $api.domAll(".age.active");
            //var isActive = $api.hasCls(this,'active');
            var isOn = $api.attr(this,'isOn');
            if(isOn==1){
                $api.attr(this,'isOn','0');
                $api.removeCls(this,'active');
            }else{
                $api.attr(this,'isOn','1');
                $api.addCls(this,'active');
            }
            
        });
    }

	getThemeList()
    //监听地图返回地址事件
    api.addEventListener({
        name: 'returnPlace'
    }, function(ret){
        if(ret && ret.value){
            var value = ret.value;
            var place = ret.value.name;
            var address = ret.value.address;
            var lat = ret.value.lat;
            var lon = ret.value.lon;
            var $place = $api.byId('place');
            var $address = $api.byId('address');
            var $lat = $api.byId('lat');
            var $lon = $api.byId('lon');
            $api.val($place,place);
            $api.val($address,address);
            $api.val($lat,lat);
            $api.val($lon,lon);
        }
    });
}
function getThemeList(){
    //THEME
    for(var i in themeList){
        $api.addEvt(themeList[i], 'click', function(){
            var themeActive = $api.domAll(".theme.active");
            //var isActive = $api.hasCls(this,'active');
            var isOn = $api.attr(this,'isOn');
            if(isOn==1){
                $api.attr(this,'isOn','0');
                $api.removeCls(this,'active');
            }else{
                $api.attr(this,'isOn','1');
                if(themeActive.length>2){
                    api.toast({
                        msg: '最多选3个标签',
                        duration:2000,
                        location: 'top'
                    });
                    return;
                }
                $api.addCls(this,'active');
            }
        });
    } 
}
function showMap(){
    api.openWin({
        name: 'activity_add_map_win',
        url: 'activity_add_map_win.html',
        delay: 300,
        vScrollBarEnabled: false,
        hScrollBarEnabled: false
    });
}
