function submit(){
var content = $api.byId('feedback').value;
var key = $api.getStorage('key');
	if(content==""){
		alert('反馈内容不能为空');
		return false;
	}
	api.ajax({
	    url:ApiUrl + '/index.php?act=member_feedback&op=feedback_add',
	    method: 'post',
	    dataType: 'json',
	    data:{values:{key:key,feedback:content}}
    },function(ret,err){
    	//coding...
    	if(ret){
	    	alert(ret.datas.result);
	    	api.closeWin();
    	}else{
    		alert(ret.err);
    	}
    	
    });
}