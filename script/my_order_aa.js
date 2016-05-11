
function activityShow(activityId){
    api.openWin({
        name: 'activity_aa_show_win',
        url: 'activity_aa_show_win.html',
        pageParam: {activityId: activityId},
        delay: 300
    });
}
function getData(){
    var url = '/index.php?act=trOrder&op=activityAaOrderList&key='+key;
    ajaxRequest(url, 'GET', '', function (ret, err) {
        if (ret.datas.status==1) {
        	var retd =ret.datas.aa_list; 
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