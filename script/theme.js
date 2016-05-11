function getData(){

    var url = '/index.php?act=trip&op=theme_list';
    ajaxRequest(url, 'GET', '', function (ret, err) {
    	var retd = ret.datas.theme_list;
        if (retd.length>0) {
            var content = $api.byId('leader-content');
            var tpl = $api.byId('leader-template').text;
            var tempFn = doT.template(tpl);
            $api.prepend(content,tempFn(retd));
            var hotelImgs = $api.domAll('.hotelImg');
            for(var i=0;i<hotelImgs.length;i++){
            	 $api.attr(hotelImgs[i], 'src',retd[i].hotel_image);
            }
           echo.init({
           		offset:0,
           		throttle: 250
           })
            api.hideProgress();
        }
    })
}

function showdetail(lineId){
  api.openWin({
    name: 'leader_detail_win',
    url: 'leader_detail_win.html',
    delay: 400,
    pageParam:{dataId:lineId}
  });
}
apiready = function(){
    getData();
};