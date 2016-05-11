
function getData(){
	var url = '&c=member_app&a=getWalletInfo&userid='+userid+'&encrypt='+encrypt;
	ajaxRequest(url,'GET','',function(ret,err){
		if(ret){
			var content = $api.byId('wallet-content');
            var tpl = $api.byId('wallet-template').text;
            var tempFn = doT.template(tpl);
            $api.prepend(content,tempFn(ret));
		}
	})
}

apiready = function(){
	getData();
}