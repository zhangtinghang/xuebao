	(function() {
	var feedback = {
		text: document.getElementById('feedback_text'), 
		Img: document.getElementById('feedback_Img'), 
		phone: document.getElementById('feedback_phone'),
		questionBtn: document.getElementById('questionBtn')
	};
	feedback.files = [];
	feedback.uploader = null;  
	feedback.deviceInfo = null; 
	var url =ajaxUrl+ '/public/help/feedback';
	mui.plusReady(function() {
		//设备信息，无需修改
		feedback.deviceInfo = {
			appid: plus.runtime.appid, 
			imei: plus.device.imei, //设备标识
			p: mui.os.android ? 'a' : 'i', //平台类型，i表示iOS平台，a表示Android平台。
			md: plus.device.model, //设备型号
			app_version: plus.runtime.version,
			plus_version: plus.runtime.innerVersion, //基座版本号
			os:  mui.os.version,
			net: ''+plus.networkinfo.getCurrentType()
		}
	});
	
	/**
	 *提交成功之后，恢复表单项 
	 */
	feedback.clearForm = function() {
		feedback.text.value = '';
		feedback.phone.value = '';
		feedback.files = [];
	};
	
	feedback.addFile = function(path) {
		feedback.files.push({path:path});
	};
	
	feedback.Img.addEventListener('tap', function(event) {
		var btnArray = [{
			title: "拍照"
		}, {
			title: "从相册选择"
		}];
		plus.nativeUI.actionSheet({
			title: "选择照片",
			cancel: "取消",
			buttons: btnArray
		}, function(e) {
			var index = e.index;
			switch (index) {
				case 0:
					break;
				case 1:
					var cmr = plus.camera.getCamera();
					cmr.captureImage(function(path) {
						send({
							sender: 'self',
							type: 'image',
							content: "file://" + plus.io.convertLocalFileSystemURL(path)
						});
					}, function(err) {});
				break;
				case 2:
					plus.gallery.pick(function(path) {
						
						for(var i in path.files){
								lfs=path.files[i];
						    	feedback.addFile(lfs);
					    	}
					}, function(err) {}, {filter:"image",multiple:true,maximum:3,system:false});
				break;
			}
		});
	})
	
	//提交问题
	feedback.questionBtn.addEventListener('tap', function(event) {
		//事件逻辑处理					
		if (feedback.text.value == '') {
			return mui.toast('信息填写不符合规范');
		}
		if (feedback.text.value.length > 200) {
			return mui.toast('信息超长,请重新填写~')
		}
		//判断网络连接
		if(plus.networkinfo.getCurrentType()==plus.networkinfo.CONNECTION_NONE){
			return mui.toast("连接网络失败，请稍后再试");
		}
		feedback.send(mui.extend({}, {}, {
			feedbackDesc: feedback.text.value,
			contact: feedback.phone.value,
			device: JSON.stringify(feedback.deviceInfo),
//			file: feedback.files
		}));
//		mui.back();	
	})
	
	
	feedback.send = function(content) {
		feedback.uploader = plus.uploader.createUpload(url, {
			method: 'POST'
		}, function(upload, status) {
//			plus.nativeUI.closeWaiting()
			console.log("upload cb:"+upload.responseText);
			if(status==200){
				var data = JSON.parse(upload.responseText);
				//上传成功，重置表单
				if (data.code === 200) {
					mui.toast('反馈成功~')
					mui.back();
					feedback.clearForm();
				}
			}else{
				console.log("upload fail");
				console.log(status);
				console.log(JSON.stringify(upload))
			}
			
		});
		//添加上传数据
		mui.each(content, function(index, element) {
			if (index !== 'images') {
				console.log("addData:"+index+","+element);
//				console.log(index);
				feedback.uploader.addData(index, element)
			} 
		});
		//添加上传文件
		mui.each(feedback.files, function(index, element) {
			var f = feedback.files[index];
			console.log("addFile:"+JSON.stringify(f.path));
			feedback.uploader.addFile(f.path, {
				key: "file"
			});
		});
		//开始上传任务
		feedback.uploader.start();
//		mui.alert("感谢反馈，点击确定关闭","问题反馈","确定",function () {
//			feedback.clearForm();
//			mui.back();
//		});
//		plus.nativeUI.showWaiting();
	};
})();
