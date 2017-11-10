var messageDB={
	    name:'messageDB',
	    version:1,
	    db:null
	};
var indexDB = {
	//打开数据库
	openDB:function(name,version){
		var version=version || 1;
	   	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		var request,database;
		request = indexedDB.open(name);
	    request.onerror=function(e){
	        console.log(e.currentTarget.error.message)
	    };
	    request.onsuccess=function(e){
	    	console.log('打开数据库成功')
	        messageDB.db=e.target.result;
	    };
	    request.onupgradeneeded=function(e){
	    	var db=e.target.result;
	    	 if(!db.objectStoreNames.contains('newMessage')){
                    db.createObjectStore('newMessage',{keyPath:"fromName"});
                    console.log('创建数据库')
                }
	        console.log('DB version changed to '+version);
	    };
	},
	//关闭数据库
	closeDB:function(){
		
	},
	//删除数据库
	deleteDB:function(name){
		indexedDB.deleteDatabase(name);
	},
	//添加数据
	addData:function(db,storeName,datas){
        var transaction=db.transaction(storeName,'readwrite'); 
        var store=transaction.objectStore(storeName); 
		request = store.add(datas);
   },
   //更新数据
   updateDataByKey:function(db,storeName,data){
	    var transaction=db.transaction(storeName,'readwrite'); 
	    var store=transaction.objectStore(storeName); 
	    store.put(data);
	},
   
   //查找数据
   getDataByKey:function(db,storeName,key){
    var transaction=db.transaction(storeName,'readwrite'); 
    var store=transaction.objectStore(storeName); 
    var dataRequest=store.get(key); 
    dataRequest.onsuccess=function(e){//异步的
        var data=e.target.result; 
        console.log('这是查找到的数据'+data); 
    	};
	}
}
