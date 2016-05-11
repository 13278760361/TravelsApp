//将列表数据写入缓存文件
function writeFile(json){
        //缓存目录
    var cacheDir = api.cacheDir;
    for(var i=0;i<json.length;i++) {
            //内容的ID
        var id = json.id;
        //内容的数据，内容的数据存储时就根据自己的需要来看存储哪些，可以循环过滤一下
        var dataJson = json;
        //写入文件
        api.writeFile({
                //保存路径
            path: cacheDir+'/'+id+'.json',
            //保存数据，记得转换格式
            data: JSON.stringify(dataJson)
        }, function(ret, err){
			
        })
    }
}

function getData(){
    var cacheDir = api.cacheDir;
    api.readFile({
        path: cacheDir+'/'+id+'.json'
    }, function(ret, err){
        if(ret.status){
                //如果成功，说明有本地存储，读取时转换下数据格式
            var jsonData = JSON.parse(ret.data);
            //自己写操作json的代码啦
        }else{
            //如果失败则从服务器读取，利用上面的那个ajaxRequest方法从服务器GET数据
        }
    });
}