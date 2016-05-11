//获取分类
function getType(){
	var url = '/index.php?act=service_type&op=get_type';
	 ajaxRequest(url, 'GET', '', function (ret, err) {
	 	var retd = ret.datas.type_list;
	 	
	 	if(retd.length>0){
		 //	var typeArr = JSON.parse(ret.data);
	            var content = $api.byId('type-content');
	            var tpl = $api.byId('type-template').text;
	            var tempFn = doT.template(tpl);
	            $api.prepend(content,tempFn(retd));
	            api.parseTapmode();
	            //THEME
	            var themeList = $api.domAll(".theme");
	            for(var i in themeList){
	                $api.addEvt(themeList[i], 'click', function(){
	                    $api.removeCls($api.dom(".theme.active"),'active');
	                    $api.addCls(this,'active');
	                });
	            }
	 	}
	 });
   /* var jsonPath = "widget://script/config/activity_service.json";
    api.readFile({
        path: jsonPath
    },function(ret,err){
        if(ret.status){
             
        }
    });*/
}
function add(){
    var data = {};
    data['userid'] = userid;
    data['encrypt'] = encrypt;
    data['title'] = $api.val($api.byId('title'));
    data['content'] = $api.val($api.byId('content'));
    data['address'] = $api.val($api.byId('address'));
    if(!data['address']){
        data['address'] = $api.val($api.byId('place'));
    }
    data['lat'] = $api.val($api.byId('lat'));
    data['lon'] = $api.val($api.byId('lon'));
    data['money'] = $api.val($api.byId('money'));
    data['thumb'] = $api.val($api.byId('thumb'));
    data['photoval-1'] = $api.val($api.byId('photoval-1'));
    data['photoval-2'] = $api.val($api.byId('photoval-2'));
    data['photoval-3'] = $api.val($api.byId('photoval-3'));
    data['key'] = $api.getStorage('key');
    //单位
    var unit = $api.dom(".unit.active");
    data['unit'] = $api.attr(unit,'data-id');
    //目的地类型
    var addresstype = $api.dom(".addresstype.active");
    data['addresstype'] = $api.attr(addresstype,'data-id');
    //服务时间
    var servicedate='';
    var dateList = $api.domAll(".date.active");
    for(var i=0;i<dateList.length;i++){
        servicedate += $api.attr(dateList[i],'data-id')+",";
    }
    servicedate = servicedate.substring(0,servicedate.length-1);
    data['servicedate'] = servicedate;
    //性别
    var sex = $api.dom(".sex.active");
    data['servicesex'] = $api.attr(sex,'data-id');
    //年龄
    var serviceage='';
    var ageList = $api.domAll(".age.active");
    for(var i=0;i<ageList.length;i++){
        serviceage += $api.attr(ageList[i],'data-id')+",";
    }
    serviceage = serviceage.substring(0,serviceage.length-1);
    data['serviceage'] = serviceage;
    //主题
    var theme = $api.dom(".theme.active");
    data['servicetheme'] = $api.attr(sex,'data-id');
    
    //服务图片
    var phontLists='';
    var phontList = $api.domAll(".photovals");
 //  	alert(phonts);
    for(var i=1;i<phontList.length;i++){
		if($api.val($api.byId('photoval-'+i))!=""){
			phontLists+=$api.val($api.byId('photoval-'+i))+",";
		}
    	
    }
       
    phontLists = phontLists.substring(0,phontLists.length-1);
	data['photovals'] = phontLists;
    /*var servicetheme='';
    var themeList = $api.domAll(".theme.active");
    for(var i=0;i<themeList.length;i++){
        servicetheme += $api.attr(themeList[i],'data-id')+",";ß
    }
    servicetheme = servicetheme.substring(0,servicetheme.length-1);
    data['servicetheme'] = servicetheme;*/

	
    if(!data['title'] || !data['content']  || !data['money'] || !data['thumb'] || !data['servicedate'] || !data['servicetheme']){
        api.toast({
            msg: '请输入完整信息',
            duration:2000,
            location: 'top'
        })
    }else{
        //去掉发布事件，防止重复发布
        api.execScript({
            name: 'activity_add_service_win',
            script: 'hideAdd();'
        });
     
        api.ajax({
	        url:ApiUrl + '/index.php?act=member_service&op=add',
	        method:'post',
	        dataType:'json',
	        data:{values:{	
					 key:data['key'],
			         phontLists:data['photovals'],
			         title:data['title'],
			         content:data['content'],
			         address:data['address'],
			         money:data['money'],
			         thumb:data['thumb'],
			         addresstype:data['addresstype'],
			         servicedate:data['servicedate'],
			         servicesexz:data['servicesex'],
			         serviceage:data['serviceage'],
			         servicetheme:data['servicetheme'],
			         unit:data['unit']
			         }
			  }
	        
        },function(ret,err){
        	//coding...
        	 var retd = ret.datas.data;
        	 if(retd.status==1){
                api.toast({
                    msg: '发布成功',
                    duration:1000,
                    location: 'top'
                })
                setTimeout(function(){
                    api.closeWin({
                        name:'activity_add_service_win'
                    })
                },1000)
                
            }else{
                api.execScript({
                    name: 'activity_add_service_win',
                    script: 'showAdd();'
                });
                api.toast({
                    msg: '发布失败',
                    duration:2000,
                    location: 'top'
                })
            }
        });
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
                $api.css(thumb,'background:url('+ret.data+') no-repeat center; background-size:cover;color:#ffffff;');
                
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
                   api.ajax({
	                   url:ApiUrl + '/index.php?act=member_service&op=uploadPhotoIn',
	                   method:'post',
	                   dataType: 'json',
	                   data:{values:{key:$api.getStorage('key'),img_id: num},
	                   		files:{serfile:ret.data}
	                   }
                   },function(retd,errd){
                   	//coding...
                   		var retIi=retd.datas.img_list;
                   		
                   		if(retIi){
                            if(retIi.img_id==0){
                                var thumbDom = $api.byId("thumb");
                                var thumb = $api.dom(".activity-add-thumb");
                                $api.val(thumbDom,''+retIi.file_name+'');
                                $api.text(thumb,'上传成功');
                            }else{
                                var imgDom = $api.byId("photoval-"+retIi.img_id);
                                $api.val(imgDom,''+retIi.file_name+'');
                                $api.attr(imgDom, 'data-src', ''+retIi.file_name+'');
                                var list = $api.byId("photos-"+retIi.img_id);
                                $api.attr(list,'src',''+ret.data+'');
                                var status = $api.byId("status-"+retIi.img_id);
                                $api.text(status,'上传成功');
                                $api.attr(imgDom, 'class', 'photovals');
                            }
                        }else{
                        	alert('上传失败');
                        }
                        
                   });
            },500)
            
        }
    });
}
apiready = function(){
    api.parseTapmode();
    getType();
    //价格单位--单选
    var unitList = $api.domAll(".unit");
    for(var i in unitList){
        $api.addEvt(unitList[i], 'click', function(){
            $api.removeCls($api.dom(".unit.active"),'active');
            $api.addCls(this,'active');
        });
    }
    //目的地类型
    var addressTypeList = $api.domAll(".addresstype");
    for(var i in addressTypeList){
        $api.addEvt(addressTypeList[i], 'click', function(){
            $api.removeCls($api.dom(".addresstype.active"),'active');
            $api.addCls(this,'active');
            var dataId = $api.attr(this,'data-id');
            var customDom = $api.byId("address-custom");

            if(dataId==2){
                $api.css(customDom,'display:block');
            }else{
                $api.css(customDom,'display:none');
            }
        });
    }
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
            if(dataId!=1){
                //去掉不限
                var d = $api.dom('div.age[data-id="1"]');
                $api.removeCls(d,'active');
                $api.attr(d,'isOn','0');
            }else if(dataId==1){
                //当为不限时去掉其他
                var ageListActive = $api.domAll(".age.active");
                for(var ii in ageListActive){
                    $api.attr($api.dom(".age.active"),'isOn','0');
                    $api.removeCls($api.dom(".age.active"),'active'); 
                }
            }
            var ageActive = $api.domAll(".age.active");
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
    //时间--多选
    var dateList = $api.domAll(".date");
    for(var i in dateList){
        $api.addEvt(dateList[i], 'click', function(){
            var dataId = $api.attr(this,'data-id');

            var ageActive = $api.domAll(".date.active");
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
function showMap(){
    api.openWin({
        name: 'activity_add_map_win',
        url: 'activity_add_map_win.html',
        delay: 300,
        vScrollBarEnabled: false,
        hScrollBarEnabled: false
    });
}
