/**
 *1.判断APP是否登陆
 *2.存取登陆后需存入本地数据
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		var authed = users.some(function(user) {
			return loginInfo.account == user.account && loginInfo.password == user.password;
		});
		if (authed) {
			return owner.createState(loginInfo.account, callback);
		} else {
			return callback('用户名或密码错误');
		}
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		phone = regInfo.phone || '';
		password = regInfo.password || '';
		auth_code = auth_code;
		confirm_password = regInfo.confirm_password;
		Invitation_code = regInfo.Invitation_code;
		if (phone.value.length < 11 || phone.value.length > 12) {
			return callback('请正确输入手机号');
		}
		if (password.value.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if(auth_code.value.length <= 0){
			return callback('请输入验证码');
		}
		if(confirm_password.value !== password.value){
			return callback('两次输入密码不相同！');
		}		
		return callback();
	};
	
	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};
	
	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};
	/**
	 * 删除当前状态
	 **/
	owner.removeState = function(state) {
		state = state || {};
		return localStorage.clear();
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};
	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
			var settingsText = localStorage.getItem('$settings') || "{}";
			return JSON.parse(settingsText);
	}
	
	
	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};
}(mui, window.app = {}));