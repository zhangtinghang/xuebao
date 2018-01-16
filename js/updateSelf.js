
var sendFormData = function (dataObj,fileArr){
	var register = plus.webview.getWebviewById('register');
	var guide_1 = plus.webview.getWebviewById('guide_1');
	var uploader = null;
	//加密
	var state = app.getState();
	var key = state.data.key;
	timestamp = Date.parse(new Date());
	dataObj.timestamp = JSON.stringify(timestamp);
	dataObj.userId = state.data.id;
	//取出key相加后返回
	console.log('哇塞',JSON.stringify(dataObj))
	var hashStr = encryptAdd(dataObj);
	//处理数据结束
	var sortStr = sortArr(hashStr);
	console.log('这是加密前的值===',sortStr)
	console.log('这是key===',key)
	var hash = CryptoJS.HmacSHA1(sortStr,key);
	//前端使用HmacSHA1加密必须先将hash输出到input中才能获取正常值
	getPassword.value = hash;
	dataObj.token=getPassword.value;
	dataObj.file={};
	var studentImage = fileArr || [];
	var url =ajaxUrl+'/restful1/users/updateTeacherInfo';
		uploader = plus.uploader.createUpload(url, {
			method: 'POST'
		}, function(upload, status) {
			console.log("upload cb:"+upload.responseText);
			if(status==200){
				var data = JSON.parse(upload.responseText);
				if (data.code === 200) {
					console.log('提交成功！');
					register.close();
					guide_1.close();
					mui.back();
				}else if(data.code === 1){
					plus.nativeUI.toast('请上传所有信息！');
				}
			}else{
				console.log("upload fail");
				console.log(status);
				console.log(JSON.stringify(upload))
				plus.nativeUI.toast(JSON.stringify(upload));
			}
			
		});
		//添加上传数据
		mui.each(dataObj, function(index, element) {
				uploader.addData(index, element)
		});
		//添加上传文件
		mui.each(studentImage, function(index, element) {
			var f = studentImage[index];
			console.log("addFile:"+JSON.stringify(f.path));
			uploader.addFile(f.path, {
				key: "file"
			});
		});
		//开始上传任务
		uploader.start();
	};
	

//取出obj中的值，并且相加
var encryptAdd = function(dataObj){
	var dataStr = '';
	for(var key in dataObj){
		dataStr+=dataObj[key];
   } 
	return dataStr;
}
//对相加后的值排序
var sortArr = function(data){
	var len = data.length;
	var str = data;
	var tempArr = [];
	for (var i = 0; i < len; i++) {
	  tempArr.push(str.charAt(i));
	}
	tempArr = tempArr.sort();
	str = tempArr.join('');
	return str;
}