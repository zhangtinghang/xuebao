var updataMessage = function(dataObj,fileArr){
	var uploader = null;
	//加密
	var state = app.getState();
	var key = state.data.key;
	timestamp = Date.parse(new Date());
	dataObj.timestamp = JSON.stringify(timestamp);
	dataObj.userId = state.data.id;
	//取出key相加后返回
	var hashStr = encryptAdd(dataObj);
	//处理数据结束
	var sortStr = sortArr(hashStr);
	var hash = CryptoJS.HmacSHA1(sortStr,key);
	//前端使用HmacSHA1加密必须先将hash输出到input中才能获取正常值
	getPassword.value = hash;
	dataObj.token=getPassword.value;
	dataObj.city = JSON.stringify(dataObj.city);
	dataObj.studentClass = JSON.stringify(dataObj.studentClass);
	dataObj.userStatu = JSON.stringify(dataObj.userStatu);
	dataObj.createTime = JSON.stringify(dataObj.createTime);
	dataObj.file={};
	var studentImage = fileArr || [];
	var w=plus.nativeUI.showWaiting("资料上传中，请等待...",{modal:false});
	var url =ajaxUrl+'/restful1/users/updateStudentInfo';
		uploader = plus.uploader.createUpload(url, {
			method: 'POST'
		}, function(upload, status) {
			console.log("upload cb:"+upload.responseText);
			w.close();
			if(status==200){
				var data = JSON.parse(upload.responseText);
				if (data.code === 200) {
					plus.nativeUI.toast('信息修改成功！');
					mui.back();
				}else if(data.code === 1){
					plus.nativeUI.toast('请上传所有信息！');
				}else if(data.code == 2){
					plus.nativeUI.toast('上传出错！');
				}
			}else{
				console.log("upload fail");
				console.log(status);
				console.log(JSON.stringify(upload))
				plus.nativeUI.toast(JSON.stringify(status));
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
	
}
