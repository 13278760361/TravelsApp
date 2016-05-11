apiready = function(){
    api.setRefreshHeaderInfo({
        visible: true,
        // loadingImgae: 'wgt://image/refresh-white.png',
        bgColor: '#efeff4',
        textColor: '#4d4d4d',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function (ret, err) {
        api.refreshHeaderLoadDone();
    });

    var list = $api.domAll(".circle-list");
    var startX,startY,x,y;
    for(var i=0;i<list.length;i++){
        $api.addEvt(list[i], 'touchstart', function(event){
            event.stopPropagation();
            event.returnValue = true;
            $api.removeCls(list[i], 'show');
            var touch = event.touches[0];
                startX = touch.pageX,
                startY = touch.pageY;
        });
        $api.addEvt(list[i], 'touchmove', function(event){
            var touch = event.touches[0];
                x = touch.pageX - startX;
                y = touch.pageY - startY;
            if (x < 0) {
                event.preventDefault();
                var circleList = $api.dom(this, '.circle-manager');
                setTranslate(circleList,x);
            }
            
        });
        $api.addEvt(list[i], 'touchend', function(event){
            event.stopPropagation();
            event.returnValue = true;
        });
        
    }
    var setTranslate = function(element, x) {
        if (element) {
            if(x < -50){
                $api.addCls(element, 'show');
                //element.style.webkitTransform = 'translate(-100px,0)';
            }
        }
    };
};

function showSpace(){
    api.openWin({
        name: 'space_frame',
        url: 'space_frame.html',
        delay: 300
    });
}
function circleManagerShow(obj){
    var $circle = $api.byId('circle');
    var $circleList = $api.next(obj, '.circle-manager');
    var $circleAll = $api.domAll($circle, 'div');
    for (var j = 0; j < $circleAll.length; j++) {
        $api.removeCls($circleAll[j], 'show');
    }
    $api.addCls($circleList, 'show');
}
function circleManagerHide(obj){
    var $circleList = $api.closest(obj, '.circle-manager');
    $api.removeCls($circleList, 'show');
}