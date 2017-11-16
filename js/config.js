/**
 * 格式化时间的辅助类，将一个时间转换成x小时前、y天前等
 */
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		mui.each(this.UNITS, function(unit, value) {
			if(milliseconds >= value) {
				humanize = Math.floor(milliseconds / value) + unit + '前';
				return false;
			}
			return true;
		});
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if(diff < this.UNITS['天']) {
			return this.humanize(diff);
		}

		var _format = function(number) {
			return(number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' + _format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

/**
 * incView:打开带原生导航条的页面(无返回按钮)
 * usuView:打开新页面
 * NativeView：打开带原生导航条的页面(有返回按钮)
 * url：打开页面相对路径
 * id：页面id
 * title：导航条上显示的名称
 */
var openView = {
	incView: function(url, id, title, extras) {
		var extras = extras || '';
		mui.openWindow({
			url: url,
			id: id,
			extras: extras,
			waiting:{
				autoShow:false
			},
			styles: {
				bounce:"vertical",
				titleNView: {
					titleText: title,
					titleColor: "#fefefe",
					titleSize: "20px",
					backgroundColor: "rgb(77,169,239)",
					progress: {
						color: "#C1E4FF",
						height: "2px"
					}
				}
			}
		});
	},

	usuView: function(url, id, extras) {
		var extras = extras || '';
		mui.openWindow({
			url: url,
			id: id,
			waiting: {
				autoShow: false,
			},
			extras: extras,
			styles:{
				bounce:"vertical"
			}
		})
	},

	nativeView: function(url, id, title, extras) {
		var extras = extras || '';
		var title = title || null;
		mui.openWindow({
			url: url,
			id: id,
			extras:extras,
			waiting:{
				autoShow:false
			},
			styles: { // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
				bounce:"vertical",
				titleNView: { // 窗口的标题栏控件
					titleText: title, // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
					titleColor: "#fefefe", // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
					titleSize: "20px", // 字体大小,默认17px
					//		      autoBackButton:"true",
					backgroundColor: "rgb(77,169,239)", // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
					progress: { // 标题栏控件的进度条样式
						color: "#C1E4FF", // 进度条颜色,默认值为"#00FF00"  
						height: "2px" // 进度条高度,默认值为"2px"         
					},
					//		      splitLine:{                       // 标题栏控件的底部分割线，类似borderBottom
					//		        color:"#CCCCCC",                // 分割线颜色,默认值为"#CCCCCC"  
					//		        height:"1px"                    // 分割线高度,默认值为"2px"
					//		      }
					tags: ([{
						tag: 'img',
						id: 'return_' + id,
						src: '_www/images/index/return.png',
						position: {
							top: "10px",
							left: "15px",
							width: "12px",
							height: "23px"
						}
					}])
				}
			}
		});
	}
}

//监听事件
var listenReturn = function() {
	var ws = plus.webview.currentWebview();
	var view = ws.getTitleNView();
	/**
	 * 监听原生控件(返回按钮)click事件
	 */
	view.addEventListener("click", function(e) {
		if(e.clientX > 10 && e.clientX < 40) {
			mui.back();
		}
	}, false);
}
var listenNext = function(text, url, id, title) {
	var extras = extras || '';
	var title = title || null;
	var ws = plus.webview.currentWebview();
	var view = ws.getTitleNView();
	view.drawText(text, {
		top: '0px',
		right: '18px',
		height: '44px',
		width: '44px'
	}, {
		size: '15px',
		color: '#fefefe'
	}, 'next');
	view.addEventListener("click", function(e) {
		if(screen.width - e.clientX <= 60) {
			//打开明细页面
			openView.nativeView(url, id, title, extras);
		}
	}, false);
}