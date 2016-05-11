var userid,encrypt,toUserid,page=5,isLock=false,lastId=0,key,j=0;
function personDelete(){
    var data = {};
    data['userid'] = userid;
    data['encrypt'] = encrypt;
    data['toUserid'] = toUserid;
  //  alert(toUserid);
    api.confirm({
        title: '取消',
        msg: '确定要取消关注该好友吗',
        buttons:['确定', '取消']
    },function(ret,err){
        if(ret.buttonIndex == 1){
            var deleUrl = ApiUrl + '/index.php?act=member_follow&op=us_delete';
            api.ajax({
	            url:deleUrl,
			    method:'post',
			    dataType:'json',
	            data:{values:{key:key,touserid:toUserid}}
            },function(retI,errI){
         
            	//coding...
            	if(retI.datas.status==1){
                    $api.text($api.byId('care_status'),'关注');
                    $api.attr($api.byId('care_status'),'onclick','doCare()');
                    api.parseTapmode();
                    //发出更新圈子事件，在圈子列表页有监听
                    api.sendEvent({
                        name: 'refreshCirclePerson',
                        extra:{key:'true'}
                    });
                }else{
                    api.toast({
                        msg: '操作失败',
                        duration:2000,
                        location: 'top'
                    });
                }
            });
           /* ajaxRequest(url,'post',data,function(ret,err){
                
            })*/
        }
    });
}
function reward(dynamicId){
    api.openFrame({
        name: 'dynamic_reward_frm',
        url: 'dynamic_reward_frm.html',
        bgColor: 'rgba(0,0,0,0)',
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        pageParam: {dynamicId: dynamicId},
        bounces: false,
        vScrollBarEnabled: false,
        hScrollBarEnabled: false
    });
}
function show(id){
    api.openWin({
        name: 'travels_show_win',
        url: 'travels_show_win.html',
        pageParam: {travelsId: id},
        reload:true,
        delay: 300
    });
}
function deleteDynamic(id){
    var data = {};
    data['userid'] = userid;
    data['encrypt'] = encrypt;
    data['id'] = id;
    api.confirm({
        title: '删除',
        msg: '确定要删除该动态吗',
        buttons:['确定', '取消']
    },function(ret,err){
        if(ret.buttonIndex == 1){
            var url = '/index.php?act=member_travels&op=delete&key='+$api.getStorage('key')+'&travels_id='+id;
            ajaxRequest(url,'get','',function(retI,errI){
                if(retI.datas.status==1){
                    api.toast({
	                    msg:'删除成功',
	                    duration:2000,
	                    location:'top'
                    });
					$api.remove($api.byId('dynamic_'+id));
                }else{
 					api.toast({
	                    msg:'删除失败',
	                    duration:2000,
	                    location:'top'
                    });
                }
            })
        }
    });
    
}
//打开聊天窗口
function chat(){
     api.sendEvent({
        name:'chatFromOtherPage',
        extra:{
            targetId:toUserid,
            conversationType:'PRIVATE'
        }
     })
}
function doCare(){
    var data = {};
    data['userid'] = userid;
    data['encrypt'] = encrypt;
    data['touserid'] = toUserid;
    var ajaxUrl = ApiUrl + '/index.php?act=member_follow&op=us_follow';
    api.ajax({
	    url:ajaxUrl,
	    method:'post',
	    dataType:'json',
	    data:{values:{key:$api.getStorage('key'),touserid:toUserid}}
    },function(ret,err){
    	//coding...
    	if(ret.datas.status==1){
            api.toast({
                msg: '成功关注',
                duration:1000,
                location: 'top'
            });
            $api.text($api.byId('care_status'),'已关注');
            $api.attr($api.byId('care_status'),'onclick','personDelete()');
            api.parseTapmode();
            //发出更新圈子事件，在圈子列表页有监听
            api.sendEvent({
                name: 'refreshCirclePerson',
                extra:{key:'true'}
            });
        }else if(ret.datas.status==0){
            api.toast({
                msg: '已关注过了',
                duration:1000,
                location: 'top'
            });
        }
    });
  /*  ajaxRequest(url,'post',data,function(ret,err){
        
    })*/
}

function report(){
    api.prompt({
        title:'举报',
        msg:'请输入举报理由',
        buttons:['确定', '取消']
    },function(ret,err){
        if(ret.buttonIndex == 1){
            var data = {};
            data['userid'] = userid;
            data['touserid'] = toUserid;
            data['remarks'] = ret.text;
            var spaceUrl = ApiUrl + '/index.php?act=member_space&op=report';
            api.ajax({
	            url:spaceUrl,
	            method:'post',
	            dataType:'json',
	            data:{values:{key:key,touserid:toUserid,remarks:data['remarks']}}
            },function(retI,errI){
            	//coding...
            	if(retI.datas.status==1){
                    api.toast({
                        msg: '举报成功',
                        duration:2000,
                        location: 'top'
                    });
                }
            }); 
            /*ajaxRequest(url, 'post', data, function (ret, err) {
                
            })*/
        }
    });
}
function getDynamicData(dynamicType){
    isLock = true;
      /* api.ajax({
	    url: ApiUrl + '/index.php?act=member_travels&op=travels_list',
	    method: 'post',
	    dataType: 'json',
	    data: {values:{key:$api.getStorage('key')}}
    },function(ret,err){
    	//coding...
        if (ret) {
       // alert(11212)
            var dynamicContent = $api.byId('dynamic-content');
            if(ret.datas.travels_list.length>0){
                //获得最后一条数据id
                if(ret.datas.travels_list.length>0 && ret.datas.travels_list[0].id>lastId){
                    lastId = ret.datas.travels_list[0].travels_id;
                }
                
                var dynamicTpl = $api.byId('dynamic-template').text;
                var tempFn = doT.template(dynamicTpl);
                if(page>1){
                    $api.append(dynamicContent,tempFn(ret));
                    isLock = false;
                }else{
                    $api.html(dynamicContent,tempFn(ret));
                    isLock = false;
                }
               hideLoading();
                echo.init({
                    offset: 0,
                    throttle: 250
                });
                $('.my-header').css('background-image','url('+ret.datas.travels_list[0].tra_mimg+')')
                api.parseTapmode();//优化点击事件
            }else{
                if(page==1){
                    var noData = '<p class="aui-text-center"><img src="../image/nodata.png" height="120" /></p>';
                    $api.html(dynamicContent,noData);
                }
                hideLoading();
            }
            
        }else{
        
        	alert(err);
        }
    });*/
 var url = '/index.php?act=member_travels&op=travels_list&page='+page+'&userid='+userid+'&key='+$api.getStorage('key')+'&toUserid='+toUserid;
    ajaxRequest(url, 'GET', '', function (ret, err) {
        if (ret) {
        	var retd = ret.datas.travels_list;
            var dynamicContent = $api.byId('dynamic-content');
            if(retd.length>0){
                //获得最后一条数据id
                if(retd.length>0 && retd[0].travelis_id>lastId){
                    lastId = retd[0].travelis_id;
                }

                var dynamicTpl = $api.byId('dynamic-template').text;
                var tempFn = doT.template(dynamicTpl);
                $api.attr($api.byId('space-content'), 'data-echo-background', retd[0].tra_mimg);
                if(page>1){
                    $api.append(dynamicContent,tempFn(retd));
                    isLock = false;
                }else {
                    $api.html(dynamicContent,tempFn(retd));
                    isLock = false;
                }
               
                if(retd.length<5){
                	j++;
                	
                }
                if(j>=2){
                	isLock = true;
                }
               
                hideLoading();
                echo.init({
                    offset: 0,
                    throttle: 250
                });
                
              //  $('.my-header').css('background-image','url('+retd[0].tra_mimg+')');
                api.parseTapmode();//优化点击事件
            }else{
                if(page==1){
                    var noData = '<p class="aui-text-center"><img src="../image/nodata.png" height="120" /></p>';
                    $api.html(dynamicContent,noData);
                }
                hideLoading();
            }
            
        }
    })
}
function getData(){

	api.ajax({
	    url: ApiUrl + '/index.php?&act=member_index',
	    method: 'post',
	    dataType: 'json',
	    data:{values:{key:$api.getStorage('key'),type:'app',toUserid:toUserid}}
    },function(ret,err){
    	//coding...
        if(ret){
        	var retd = ret.datas.member_info;
            var content = $api.byId('space-content');
            var tpl = $api.byId('space-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(retd));
            echo.init({
                offset: 0,
                throttle: 250
            });
            getDynamicData();
            //hideLoading();
            api.parseTapmode();
        }
    });
    /*var url = ApiUrl + '/index.php?&act=member_index';
    ajaxRequest(url,'GET','',function(ret,err){
        if(ret){
            var content = $api.byId('space-content');
            var tpl = $api.byId('space-template').text;
            var tempFn = doT.template(tpl);
            $api.html(content,tempFn(ret));
            echo.init({
                offset: 0,
                throttle: 250
            });
           // getDynamicData();
            //hideLoading();
            api.parseTapmode();
        }
    })*/
}

apiready = function(){
    api.parseTapmode();
    userid = $api.getStorage('userid');
    encrypt = $api.getStorage('encrypt');
    toUserid = api.pageParam['toUserid'];
    key = $api.getStorage('key');
    var header = $api.byId('header');
    $api.fixStatusBar(header);
    getData();
    showLoading();
    //监听是否达到底部上拉加载
    api.addEventListener({
        name : 'scrolltobottom',
        extra:{
            threshold:360
        }
    }, function(ret, err) {
        page++;
        if(isLock==false){
            getDynamicData();
        }
    });
};