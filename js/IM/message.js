function message(){
	var state = app.getState();
	var options = {
		apiUrl: WebIM.config.apiURL,
		user: state.phone,
		accessToken: state.IM_token,
		appKey: WebIM.config.appkey
	};
	var detailPage = null;
	var OPENDATABASE = null;
	var OPENDATACASE = null;
	var messRemind = document.getElementById("messRemind");
	//打开数据库
	websqlOpenDB();
//				websqlDeleteAllDataFromTable(OPENDATABASE);
//				websqlDeleteAllDataFromTable(OPENDATACASE);
	
	conn.open(options);
	//创建连接 监听连接事件
	conn.listen({
		onOpened: function(message) {
			console.log('连接成功回调' + JSON.stringify(message))
		}, //连接成功回调
		onClosed: function(message) {
			console.log('连接关闭回调' + JSON.stringify(message))
		}, //连接关闭回调
		onTextMessage: function(message) {
			console.log('收到文本消息', JSON.stringify(message))
			var friend_phone = JSON.stringify(message.from);
			var my_phone = JSON.stringify(state.data.mobilephone);
			sqlInsert(friend_phone,my_phone,function(callback){
				if(callback.creatTable==true){
					telMessage(message);
				}else{
					console.log('出现未知错误')
				}
			});
			
		}, //收到文本消息
		onPictureMessage: function(message) {
			console.log('收到图片消息', JSON.stringify(message))
			//telMessage(message);

		}, //收到图片消息
		onOnline: function(message) {
			console.log('本机网络连接成功' + JSON.stringify(message))
		}, //本机网络连接成功
		onOffline: function(message) {
			console.log('本机网络掉线' + JSON.stringify(message))
		}, //本机网络掉线
		onError: function(message) {
			console.log('连接失败回调' + JSON.stringify(message))
		}, //失败回调
		onBlacklistUpdate: function(list) { //黑名单变动
			// 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
			console.log('黑名单', list);
		},
	});
	
	function sqlInsert(friend_phone,my_phone,callback){
		console.log(friend_phone,my_phone)
		OPENDATABASE = friend_phone; //每位好友一个
		OPENDATACASE = my_phone; //每位用户一个
		websqlCreatTable(OPENDATABASE);
		websqlCreatTable(OPENDATACASE);
		return callback({creatTable:true});
	}
	//组合并存入数据库(消息和图片)
	function telMessage(message) {
		var fromName = message.from;
		var type = message.type;
		var id = message.id;
		var data = message.data || '';
		var delay = delay || ''; //时间为空 为当前时间
		//所有消息
		console.log('这是列表表格',OPENDATABASE);
		websqlInsterDataToTable(OPENDATABASE, id, type, fromName, data, delay, function(state) {
			console.log('存入成功')
		});
		//消息列表
		console.log('这是用户表格',OPENDATACASE);
		websqlUpdateAData(OPENDATACASE, id, type, data, delay, fromName, function(state) {
			if(state.update == true || state.insert == true) {
				console.log('查看页面情况',detailPage)
				if(!detailPage) {
					detailPage = plus.webview.getWebviewById('msg_list');
				}
				//触发详情页面的newsId事件
				mui.fire(detailPage, 'newsId', {
					newsId: 'news'
				});
			}
		});

		//若在消息列表页  则通知 当用户在聊天界面时，不触发消息提醒
		if(detailPage === null) {
			messRemind.style.display = 'block';
		} else {
			messRemind.style.display = 'none';
		}

	}
}
