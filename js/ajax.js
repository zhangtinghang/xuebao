var ajax = function(ajaxData,callback) {
	var dataJSON = ajaxData.data || '';
	var types = ajaxData.type || 'get';
	var url = ajaxData.url || '';
	//http://120.77.245.43:8001/webapp/
		mui.ajax('http://120.77.245.43:8001/webapp/'+url,{
		data: dataJSON,
		dataType: 'json', //服务器返回json格式数据
		type: types, //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
//		headers: {
//			'Content-Type': 'application/json'
//		},
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

var ajaxUrl = 'http://120.77.245.43:8001/webapp/';
