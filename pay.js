(function() {
				var container = document.getElementById("inputBoxContainer");
				boxInput = {
					maxLength: "",
					realInput: "",
					bogusInput: "",
					bogusInputArr: "",
					callback: "",
					//初始化
					init: function(fun) {
						var that = this;
						this.callback = fun;
						that.realInput = container.children[0];
						that.bogusInput = container.children[1];
						that.bogusInputArr = that.bogusInput.children;
						that.maxLength = that.bogusInputArr[0].getAttribute("maxlength");
						that.realInput.oninput = function() {
							that.setValue();
						}
						//兼容IE
						that.realInput.onpropertychange = function() {
							that.setValue();
						}
					},
					setValue: function() {
						//获取到值
						this.realInput.value = this.realInput.value.replace(/\D/g, "");
						var real_str = this.realInput.value;
						for(var i = 0; i < this.maxLength; i++) {
							this.bogusInputArr[i].value = real_str[i] ? real_str[i] : "";
						}
						if(real_str.length >= this.maxLength) {
							this.realInput.value = real_str.substring(0, 6);
							this.callback();
						}
					},
					getBoxInputValue: function() {
						var realValue = "";
						for(var i in this.bogusInputArr) {
							if(!this.bogusInputArr[i].value) {
								break;
							}
							realValue += this.bogusInputArr[i].value;
						}
						return realValue;
					}
				}
			})()