//教师动态
var teacherData = function(){
	var ajaxData = {
	url: 'restful1/teacher/teachernews/getteachernews',
	data: {},
	type: 'post'
	}
	ajax(ajaxData, function(data) {					
		if(data.code == 200) {
			vm.imgUrl = ajaxUrl;
			vm.teacherMessage = data.data.news;
			console.log('这是教师动态===',JSON.stringify(data))
		} else if(data.code == 401) {
			plus.nativeUI.toast('登录失效，请重新登录！');
			openView.incView('login/login.html', 'login', '欢迎登陆');
		} else {
			console.log('获取教师动态失败！')
		}
	}, true);
}
//轮播图数据
var slider_box =function(){
	//轮播图相关数据处理（字符串拼接）
	var slider = mui("#slider");
	slider.slider({
		interval: 200
	});
	var ajaxData = {
		url: 'public/app/carousel',
		data: {
			type: 'student'
		},
		type: 'post'
	}
	ajax(ajaxData, function(data) {
		if(data.data) {
			creatSlider(data.data);
		} else {
			console.log('请求轮播失败', JSON.stringify(data))
		}
	});
}
//更新个推
var updateClient = function(){
	var info = plus.push.getClientInfo();
	var clientid = info.clientid;
	var ajaxData2 = {
	url:'restful1/users/updatePushClientId',
	data: { 
		clientId:clientid
	},
	type:'post'
	}								
	ajax(ajaxData2, function(data) {},true);
}
//个推推送消息
var push = function(){
	// 监听点击消息事件
	plus.push.addEventListener( "click", function( msg ) {
		// 判断是从本地创建还是离线推送的消息
//		switch( msg.payload ) {
//			case "LocalMSG":
//				mui.toast( "点击本地创建消息启动：" );
//			break;
//			default:
//				mui.toast( "点击离线推送消息启动：");
//			break;
//		}
		// 提示点击的内容
//		plus.nativeUI.alert( msg.content );
		// 处理其它数据
		logoutPushMsg( msg );
	}, false );
	// 监听在线消息事件
	plus.push.addEventListener( "receive", function( msg ) {
//		if ( msg.aps ) {  // Apple APNS message
//			alert( "接收到在线APNS消息：" );
//		} else {
//			alert( "接收到在线透传消息：" );
//		}
		logoutPushMsg( msg );
	}, false );
	/**
	 * 日志输入推送消息内容
	 */
	function logoutPushMsg( msg ) {
//		alert( "title: "+msg.title );
//		alert( "content: "+msg.content );
//		if ( msg.payload ) {
//			if ( typeof(msg.payload)=="string" ) {
//				alert( "payload(String): "+msg.payload );
//			} else {
//				alert( "payload(JSON): "+JSON.stringify(msg.payload) );
//			}
//		} else {
//			alert( "payload: undefined" );
//		}
//		if ( msg.aps ) {
//			alert( "aps: "+JSON.stringify(msg.aps) );
//		}
		getServerMess();
	}
}

function getServerMess(){
	var ajaxData = {
		url:'restful1/message/getServiceMessage',
		data: {
			pageNum:1,
			pageSize:'6'
		},
		type:'post'
	}
	ajax(ajaxData, function(data) {
		console.log('请求数据',JSON.stringify(data))
			if(data.code == 401){
				plus.nativeUI.toast('您还未登录哟！');
			}else if(data.code == 200){
				console.log(JSON.stringify(data.data))
				vm.serverArr = data.data.list; 
			}else{
				plus.nativeUI.toast('请求超时！');
			}
	},true);
}

