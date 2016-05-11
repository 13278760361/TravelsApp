var page=1,isLock=false,lastId=0;

//展开所有分类
function expandMore(){
    var category = $api.byId('category');
    $api.addCls(category,'category-show');

    var typeDom = $api.byId('activity-type');
    var typeHeight = $api.offset(typeDom).h;
    //console.log(headerHeight);
    api.openFrame({
        name: 'activity_aa_type_frm',
        url: 'activity_aa_type_frm.html',
        bounces: false,
        bgColor: 'rgba(0,0,0,0)',
        rect: {
            x: 0,
            y: 90+typeHeight,
            w: 'auto',
            h: 'auto'
        },
        vScrollBarEnabled: false,
        hScrollBarEnabled: false
    });
}
//收起所有分类
function foldMore(){
    var category = $api.byId('category');
    $api.addCls(category,'category-hide');
    setTimeout(function(){
       $api.removeCls(category,'category-show');
       $api.removeCls(category,'category-hide');
    },300);
    //收起所有分类frame
    api.execScript({
        frameName: 'activity_aa_type_frm',
        script: 'slideUp()'
    });
}
function getData(searchType){

    var userid = $api.getStorage('userid');
    var encrypt = $api.getStorage('encrypt');
    var key = $api.getStorage('key');
    isLock = true;
    api.ajax({
	    url: ApiUrl + '/index.php?act=member_activity&op=activity_list&key='+key+'&page='+page,
	    method: 'get',
	    dataType: 'json',
	    data:{}
    },function(ret,err){
    	//coding...
    	
    	if (ret) {
            //获得最后一条数据id
            var retd = ret.datas.activity_list
            if(retd.length>0){
                if(retd[0].act_id>lastId){
                    lastId = retd[0].act_id;
                }
                
            }
            var content = $api.byId('activity-content');
            var tpl = $api.byId('activity-template').text;
            var tempFn = doT.template(tpl);
            if(page>1){
                $api.append(content,tempFn(retd));
                isLock = false;
            }else{
                $api.html(content,tempFn(retd));
                isLock = false;
            }
            //hideLoading();
            echo.init({
                offset: 0,
                throttle: 250
            });
            api.parseTapmode();
            hideLoading();
            
        } else {
            if(err.code!=3){
                api.toast({
                    msg: err.msg,
                    duration:2000,
                    location: 'bottom'
                });
            }
        }
    	
    });
   /* var activityUrl = '/index.php?act=activity_aa_app&op=activityList&page='+page+'&userid='+userid+'&encrypt='+encrypt+'&searchType='+searchType;
    ajaxRequest(activityUrl, 'GET', '', function (ret, err) {
        
    })*/
}
function getNewData(){
    var getNewActivityUrl = '&c=activity_aa_app&a=newActivityList&lastId='+lastId;
    ajaxRequest(getNewActivityUrl, 'GET', '', function (ret, err) {
        if (ret) {
            //获得最后一条数据id
            if(ret[0].id>lastId){
                lastId = ret[0].id;
            }
            var content = $api.byId('activity-content');
            var tpl = $api.byId('activity-template').text;
            var tempFn = doT.template(tpl);
            $api.prepend(content,tempFn(ret));
            echo.init({
                offset: 0,
                throttle: 250
            });
            api.parseTapmode();
        }
    })
}

apiready = function(){
    api.parseTapmode();
    showLoading();
    api.setRefreshHeaderInfo({
        visible: true,
        loadingImg: 'widget://image/ptr_pull.png',
        bgColor: '#efeff4',
        textColor: '#959595',
        textDown: '下拉刷新',
        textUp: '松开刷新',
        showTime: false
    }, function (ret, err) {
        getNewData();
        api.refreshHeaderLoadDone();
    });
    getData('default');
    //监听是否达到底部上拉加载
    api.addEventListener({
        name : 'scrolltobottom',
        extra:{
            threshold:360
        }
    }, function(ret, err) {
        page++;
        if(isLock==false){
            getData();
        }
    });
    //监听报名数
    api.addEventListener({
        name: 'attendActivityAA'
    }, function(ret){
        if(ret && ret.value){
            var value = ret.value;
            var attendTotalBox = $api.byId("attendTotal_"+value.activityId);
            $api.html(attendTotalBox,' '+value.attendTotal);
        }
    });
    //监听关闭
    api.addEventListener({
        name: 'closeType'
    }, function(ret){
        if(ret && ret.value){
            foldMore();
        }
    });

    //筛选
    var searchTypeList = $api.domAll(".activity-type-list");
    for(var i in searchTypeList){
        $api.addEvt(searchTypeList[i], 'click', function(){
            $api.removeCls($api.dom(".activity-type-list.active"),'active');
            $api.addCls(this,'active');
            var searchType = $api.attr(this,'data-id');
            showLoading();
            getData(searchType);
        });
    }
    //接收筛选事件
    api.addEventListener({
        name:'activityAaSearch'
    },function(ret){
        if(ret && ret.value){
            foldMore();
            var searchType = ret.value.searchType;
            $api.removeCls($api.dom(".activity-type-list.active"),'active');
            showLoading();
            getData(searchType);
        }
    })
    ///监听摇一摇更新内容
    /*api.addEventListener({
        name:'shake'
    },function(ret,err){
        page = 1;
        getData('default');
    })*/
};
//切换按钮
function randomSwitchBtn(index) {
    api.setFrameGroupIndex({
        name: 'activityGroup',
        index: index
    });
    var $activityTab = $api.byId('activity-tab');
    var $activityTabBar = $api.domAll($activityTab, 'div');
    for (var j = 0; j < $activityTabBar.length; j++) {
        $api.removeCls($activityTabBar[j], 'active');
    }
    if(index==0){
        var $obj = $api.byId('activity-aa');
        $api.addCls($obj, 'active');
        
    }else if(index==1){
        var $obj = $api.byId('activity-service');
        $api.addCls($obj, 'active');
    }else if(index==2){
        var $obj = $api.byId('activity-club');
        $api.addCls($obj, 'active');
    } 
}
function show(activityId){
    api.openWin({
        name: 'activity_aa_show_win',
        url: 'activity_aa_show_win.html',
        pageParam: {activityId: activityId},
        delay: 300
    });
}