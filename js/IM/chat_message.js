var state = app.getState();
//获取历史信息
function message(OPENDATABASE,callback){
	var OPENDATABASE = OPENDATABASE;
	//打开数据库
	websqlOpenDB();
	websqlCreatTable(OPENDATABASE);
	websqlGetAllData(OPENDATABASE,function(data){
    	return callback({data:data});
    });
}

//获取最新信息
function newMessage(callback){
	var options = {
		apiUrl: WebIM.config.apiURL,
		user: state.phone,
		accessToken: state.IM_token,
		appKey: WebIM.config.appkey
	};
	var OPENDATABASE = null;
	var OPENDATACASE = null;
	//打开数据库
	websqlOpenDB();
	conn.open(options);
	//创建连接 监听连接事件
	conn.listen({
		onOpened: function(message) {
			console.log('连接成功回调' + JSON.stringify(message))
		}, //连接成功回调
		onTextMessage: function(message) {
			var friend_phone = JSON.stringify(message.from);
			var my_phone = JSON.stringify(state.data.mobilephone);
			sqlInsert(friend_phone,my_phone);
			telMessage(message,function(status){
				return callback({newMessage:true});
			});
			
		}, //收到文本消息
		onPictureMessage: function(message) {
			//telMessage(message);

		} //收到图片消息
	});
	
	function sqlInsert(friend_phone,my_phone){
		console.log(friend_phone,my_phone)
		OPENDATABASE = friend_phone; //每位好友一个
		OPENDATACASE = my_phone; //每位用户一个
		websqlCreatTable(OPENDATABASE);
		websqlCreatTable(OPENDATACASE);
	}
	//组合并存入数据库(消息和图片)
	function telMessage(message,callback) {
		var fromName = message.from;
		var type = message.type;
		var id = message.id;
		var data = message.data || '';
		var to = message.to||'';
		var delay = delay || ''; //时间为空 为当前时间
		//所有消息
		websqlInsterDataToTable(OPENDATABASE, id, type, fromName, to, data, delay, function(state){
			console.log('存入所有成功')
			return callback({newMessage:true});
		});
		//消息列表
		websqlUpdateAData(OPENDATACASE, id, type, data, delay, fromName, to, function(state){
			if(state.update == true || state.insert == true) {
				console.log('存入消息列表成功')
			}
		});
	}
}

//存入消息
var sendMessage = function(message,callback){
	var OPENDATABASE = null;
	var OPENDATACASE = null;
	//打开数据库
	websqlOpenDB();
	var friend_phone = JSON.stringify(message.to);
	var my_phone = JSON.stringify(state.data.mobilephone);
	sqlInsert(friend_phone,my_phone);
	telMessage(message,function(status){
		return callback({newMessage:true});
	});	
	function sqlInsert(friend_phone,my_phone){
		console.log(friend_phone,my_phone)
		OPENDATABASE = friend_phone; //每位好友一个
		OPENDATACASE = my_phone; //每位用户一个
		websqlCreatTable(OPENDATABASE);
		websqlCreatTable(OPENDATACASE);
	}
	//组合并存入数据库(消息和图片)
	function telMessage(message,callback) {
		var fromName = message.from||null;
		var to = message.to||null;
		var type = message.type;
		var id = message.id;
		var data = message.msg || null;
		var delay = delay || null; //时间为空 为当前时间
		//所有消息
		websqlInsterDataToTable(OPENDATABASE, id, type, fromName, to, data, delay, function(state){
			console.log('存入所有聊天消息成功',OPENDATABASE)
			return callback({newMessage:true});
		});
		//消息列表
		websqlUpdateAData(OPENDATACASE, id, type, data, delay, fromName, to, function(state){
			if(state.update == true || state.insert == true) {
				console.log('发送存入消息列表成功',OPENDATACASE)
			}
		});
	}
}
