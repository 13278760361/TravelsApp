function loginOut(){
	api.showProgress({
    	title: '正在注销...',
    	modal: false
    });
    $api.rmStorage('key');
    api.hideProgress();
}

function setpwd(){
	api.showProgress();
	api.openWin({
	    name: 'pwdForget_win',
	    url: 'pwdForget_win.html'
    });
    api.hideProgress();
}

function setphone(){
	
}

function setpaywd(){
	
}

function feedback(){
	api.openWin({
	    name: 'feedback_win',
	    url: 'feedback_win.html'
    });
}