function serviceShow(serviceId){
    api.openWin({
        name: 'activity_service_show_win',
        url: 'activity_service_show_win.html',
        pageParam: {serviceId: serviceId},
        delay: 300
    });
}
function getData(){

    var url = '/index.php?act=trOrder&op=activityServiceOrderList&key='+key;
    ajaxRequest(url, 'GET', '', function (ret, err) {
        if (ret) {
  			var retd = ret.datas.service_order;
            var content = $api.byId('order-content');
            var tpl = $api.byId('order-template').text;
            var tempFn = doT.template(tpl);
            $api.prepend(content,tempFn(retd));
            hideLoading();
        }
    })
}
apiready = function(){
    showLoading();
	getData();
};