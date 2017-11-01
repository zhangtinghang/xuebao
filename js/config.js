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
	parse:function (str) {//将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date (a[0],a[1]-1,a[2],a[3],a[4],a[5] );
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
	incView:function(url,id,title,extras){
			var extras = extras || '';
			mui.openWindowWithTitle({
			    url:url,
			    id:id,
			    waiting:{
			      autoShow:false,
			    },
			    extras:extras
			},{
				 id:'title_'+id,
				 backgroundColor:"rgb(77,169,239)",
			    title:{//标题配置
			        text:title,//标题文字
		             styles:{
						color:"#fefefe"
					}
			    },
			    back:{}
			})
	},
	
	usuView : function(url,id,extras){
		var extras = extras || '';
		mui.openWindow({
			    url:url,
			    id:id,
			    waiting:{
			      autoShow:false,
			    },
			    extras:extras
			})
	},
	
	nativeView : function(url,id,title,extras){
		var extras = extras || '';
		mui.openWindowWithTitle({
		    url:url,
		    id:id,
		    waiting:{
		      autoShow:false,
		    },
		    extras:extras
		},{
			 id:'title_'+id,
			 backgroundColor:"rgb(77,169,239)",
		    title:{//标题配置
		        text:title,//标题文字
	             styles:{
					color:"#fefefe"
				}
		    },
		    back:{//左上角返回箭头
		    	image:{
		            base64Data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAbCAYAAAB1NA+iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdENkRFRTdGQjM0MTExRTdBQ0RFQ0FGMEVDREZGMUYxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjdENkRFRTgwQjM0MTExRTdBQ0RFQ0FGMEVDREZGMUYxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N0Q2REVFN0RCMzQxMTFFN0FDREVDQUYwRUNERkYxRjEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6N0Q2REVFN0VCMzQxMTFFN0FDREVDQUYwRUNERkYxRjEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6UxFOBAAABB0lEQVR42mL8//8/A5mAC4inMoAMIANrAPHl/2Rqjgbiz/+hgBSNHEA88z8quE2sZlUgPo+meTEQ8xGjORSIPyJpBDk/HiaPTyM7EE9Gs/UsEKshq8OlWRGITyNp/AfEE6CGMhAyIACI3yNpfgXEPrhcisxhBeI+qG0wsA+IpfCFEYwhB8THkTT+BuJqIGYiFMgwJ79D0vwQiK2ITR8MaE5eA8QCpCQwBiTNW8lJ2uguWAvEgqQa4A3Eb9DCwJoUA3DFQg0QMxNrAL50IE2sAbhS4msg9iXFAFx5YSKxeQFfbjwHxOrEGoCvPEggxQBcJdJSYkskfGXiHbqWyljrBUZKayaAAAMAzRgYGVr0LLIAAAAASUVORK5CYII=',
		            position:{//绘制图片的目标区域，参考：http://www.html5plus.org/doc/zh_cn/nativeobj.html#plus.nativeObj.Rect
		                top:"10px",
		                left:"15px",
		                width:"12px",
		                height:"23px"
		            }
		      }		        
		    }
		})
	}
}

