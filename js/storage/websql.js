/**
*数据库操作辅助类,定义对象、数据操作方法都在这里定义
*/
var dbname='websql';/*数据库名*/
var version = '1.0'; /*数据库版本*/
var dbdesc = 'websql练习'; /*数据库描述*/
var dbsize = 2*1024*1024; /*数据库大小*/
var dataBase = null; /*暂存数据库对象*/
/*数据库中的表单名*/
var TableCacheMessage = "TableCacheMessage";
var TableListMessage = 'TableListMessage';

/**
 * 打开数据库
 * @returns  dataBase:打开成功   null:打开失败
 */
function websqlOpenDB(){
    /*数据库有就打开 没有就创建*/
    dataBase = window.openDatabase(dbname, version, dbdesc, dbsize,function() {});
    if (dataBase) {
        console.log("数据库创建/打开成功!");
    } else{
        console.log("数据库创建/打开失败！");
    }
    return dataBase;
}
/**
 * 新建数据库里面的表单
 * @param tableName:表单名
 */
function websqlCreatTable(tableName){
//  chinaAreaOpenDB();
    var creatTableSQL = 'CREATE TABLE IF  NOT EXISTS '+ tableName + ' (IMid text,IMtype text,IMfrom text,IMdata text,IMdelay text,IMnum int)';
    dataBase.transaction(function (ctx,result) {
        ctx.executeSql(creatTableSQL,[],function(ctx,result){
            console.log("表创建成功 " + tableName);
        },function(tx, error){ 
            console.log('创建表失败:' + tableName + error.message);
        });
    });
}
/**
 * 往表单里面插入数据
 * @param tableName:表单名
 * @param IMid:环信id
 * @param IMtype:类型
 * @param IMfrom:发送者
 * @param IMdata:消息内容
 * @param IMdelay:时间
 */
function websqlInsterDataToTable(tableName,IMid,IMtype,IMfrom,IMdata,IMdelay,callback){
	var IMnum = 0;
    var insterTableSQL = 'INSERT INTO ' + tableName + ' (IMid,IMtype,IMfrom,IMdata,IMdelay,IMnum) VALUES (?,?,?,?,?,?)';
    dataBase.transaction(function (ctx) {
        ctx.executeSql(insterTableSQL,[IMid,IMtype,IMfrom,IMdata,IMdelay,IMnum],function (ctx,result){
            console.log("插入" + tableName  + "成功");
             var state = {insert:true};
            return callback(state);
        },
        function (tx, error) {
            console.log('插入失败: ' + error.message);
             var state = {insert:false};
            return callback(state);
        });
    });
}
/**
 * 获取数据库一个表单里面的所有数据
 * @param tableName:表单名
 * 返回数据集合
 */
function websqlGetAllData(tableName,callback){
    var selectALLSQL = 'SELECT * FROM ' + tableName;
    dataBase.transaction(function (ctx) {
        ctx.executeSql(selectALLSQL,[],function (ctx,result){

            console.log('查询成功: ' + tableName + result.rows.length);
            var len = result.rows.length;
            var succArr = [];
            for(var i = 0;i < len;i++) {
            	succArr.push(result.rows.item(i));
//              console.log("IMid = "  ,JSON.stringify(result.rows.item(i)));
//              console.log("IMtype = "  + result.rows.item(i).IMtype);
//              console.log("IMfrom = "  + result.rows.item(i).IMfrom);
//              console.log("IMdata = "  + result.rows.item(i).IMdata);
//              console.log("IMdelay = "  + result.rows.item(i).IMdelay);
//                console.log("-------- 我是分割线 -------");
            }
            return callback(succArr);
        },
        function (tx, error) {
        	return callback(error);
            console.log('查询失败: ' + error.message);
        });
    });
}
/**
 * 获取数据库一个表单里面的部分数据
 * @param tableName:表单名
 * @param name:姓名
 */
//function websqlGetAData(tableName,name){    
//  var selectSQL = 'SELECT * FROM ' + tableName + ' WHERE NAME = ?'
//  dataBase.transaction(function (ctx) {
//      ctx.executeSql(selectSQL,[name],function (ctx,result){
//          alert('查询成功: ' + tableName + result.rows.length);
//          var len = result.rows.length;
//          for(var i = 0;i < len;i++) {
//              console.log("NAME = "  + result.rows.item(i).NAME);
//              console.log("AGE = "  + result.rows.item(i).AGE);
//              console.log("HEIGHT = "  + result.rows.item(i).HEIGHT);
//              console.log("WEIGTH = "  + result.rows.item(i).WEIGTH);
//          }
//      },
//      function (tx, error) {
//          alert('查询失败: ' + error.message);
//      });
//  });
//}
/**
 * 删除表单里的全部数据
 * @param tableName:表单名
 */
function websqlDeleteAllDataFromTable(tableName){
    var deleteTableSQL = 'DELETE FROM ' + tableName;
    localStorage.removeItem(tableName);
    dataBase.transaction(function (ctx,result) {
        ctx.executeSql(deleteTableSQL,[],function(ctx,result){
            alert("删除表成功 " + tableName);
        },function(tx, error){ 
            alert('删除表失败:' + tableName + error.message);
        });
    });
}
/**
 * 根据name删除数据
 * @param tableName:表单名
 * @param name:数据的姓名
 */
//function websqlDeleteADataFromTable(tableName,name){
//  var deleteDataSQL = 'DELETE FROM ' + tableName + ' WHERE NAME = ?';
//  localStorage.removeItem(tableName);
//  dataBase.transaction(function (ctx,result) {
//      ctx.executeSql(deleteDataSQL,[name],function(ctx,result){
//          alert("删除成功 " + tableName + name);
//      },function(tx, error){ 
//          alert('删除失败:' + tableName  + name + error.message);
//      });
//  });
//}
/**
 * 根据name修改数据
 * @param tableName:表单名
 * @param name:姓名
 */
function websqlUpdateAData(tableName,IMid,IMtype,IMdata,IMdelay,IMfrom,callback){
	//查询
	var selectSQL = 'SELECT * FROM ' + tableName + ' WHERE IMfrom = ?';
	  dataBase.transaction(function (ctx) {
        ctx.executeSql(selectSQL,[IMfrom],function (ctx,result){
            console.log('查询成功: ' + tableName + result.rows.length);
            if(result.rows.length != 0){
            	console.log('走的更新类型');
            	console.log(JSON.stringify(result.rows.item(0)))
            	var IMnum = result.rows.item(0).IMnum;
            	++IMnum;
            	upToData(tableName,IMid,IMtype,IMdata,IMdelay,IMnum,IMfrom,function(state){
            		console.log('这是更新后返回的状态',JSON.stringify(state))
            		return callback(state);
            	});
            }else{
            	websqlInsterDataToTable(tableName,IMid,IMtype,IMfrom,IMdata,IMdelay,function(state){
            		console.log('这是插入后返回的状态',JSON.stringify(state))
            		return callback(state);
            	});
            } 
        },
        function (tx, error) {
            console.log('查询失败: ' + error.message);
        });
      });	
}
//更新
function upToData(tableName,IMid,IMtype,IMdata,IMdelay,IMnum,IMfrom,callback){
    var updateDataSQL = 'UPDATE ' + tableName + ' SET IMid = ?, IMtype = ?,IMdata = ?, IMdelay = ?, IMnum = ? WHERE IMfrom = ?';
    dataBase.transaction(function (ctx,result) {
        ctx.executeSql(updateDataSQL,[IMid,IMtype,IMdata,IMdelay,IMnum,IMfrom],function(ctx,result){
            var state = {update:true};
            return callback(state);
        },function(tx, error){
            console.log('更新失败:' + tableName  + IMfrom + error.message);
            var state = {update:false};
            return callback(state);
        });
    });
}
