var ajax = function(ajaxData,callback) {
	var dataJSON = ajaxData.data || '';
	var types = ajaxData.type || 'get';
	var url = ajaxData.url || '';
	var failData = '';
		mui.ajax('http://39.108.53.121:5555/api/' + url, {
		data: dataJSON,
		dataType: 'json', //服务器返回json格式数据
		type: types, //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		headers: {
			'Content-Type': 'application/json'
		},
		success: function(data) {
			 callback(data);
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			console.log(type)
			var errObj = {};
			errObj.success = 'err';
			errObj.err = type;
			callback(errObj);
		}
	});
};