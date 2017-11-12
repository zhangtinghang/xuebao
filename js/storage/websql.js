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
    var creatTableSQL = 'CREATE TABLE IF  NOT EXISTS '+ tableName + ' (IMid text,IMtype text,IMfrom text,IMdata text,IMdelay text)';
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
 * @param NAME:姓名
 * @param AGE:年龄
 * @param HEIGHT:身高
 * @param WEIGTH:体重
 */
function websqlInsterDataToTable(tableName,IMid,IMtype,IMfrom,IMdata,IMdelay){
	console.log(dataBase)
    var insterTableSQL = 'INSERT INTO ' + tableName + ' (IMid,IMtype,IMfrom,IMdata,IMdelay) VALUES (?,?,?,?,?)';
    dataBase.transaction(function (ctx) {
        ctx.executeSql(insterTableSQL,[IMid,IMtype,IMfrom,IMdata,IMdelay],function (ctx,result){
            console.log("插入" + tableName  + "成功");
        },
        function (tx, error) {
            console.log('插入失败: ' + error.message);
        });
    });
}
/**
 * 获取数据库一个表单里面的所有数据
 * @param tableName:表单名
 * 返回数据集合
 */
function websqlGetAllData(tableName){
    var selectALLSQL = 'SELECT * FROM ' + tableName;
    dataBase.transaction(function (ctx) {
        ctx.executeSql(selectALLSQL,[],function (ctx,result){
            console.log('查询成功: ' + tableName + result.rows.length);
            var len = result.rows.length;
            for(var i = 0;i < len;i++) {
                console.log("IMid = "  + result.rows.item(i).IMid);
                console.log("IMtype = "  + result.rows.item(i).IMtype);
                console.log("IMfrom = "  + result.rows.item(i).IMfrom);
                console.log("IMdata = "  + result.rows.item(i).IMdata);
                console.log("IMdelay = "  + result.rows.item(i).IMdelay);
                console.log("-------- 我是分割线 -------");
            }
        },
        function (tx, error) {
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
//function websqlDeleteAllDataFromTable(tableName){
//  var deleteTableSQL = 'DELETE FROM ' + tableName;
//  localStorage.removeItem(tableName);
//  dataBase.transaction(function (ctx,result) {
//      ctx.executeSql(deleteTableSQL,[],function(ctx,result){
//          alert("删除表成功 " + tableName);
//      },function(tx, error){ 
//          alert('删除表失败:' + tableName + error.message);
//      });
//  });
//}
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
 * @param age:年龄
 */
//function websqlUpdateAData(tableName,name,age){
//  var updateDataSQL = 'UPDATE ' + tableName + ' SET AGE = ? WHERE NAME = ?';
//  dataBase.transaction(function (ctx,result) {
//      ctx.executeSql(updateDataSQL,[age,name],function(ctx,result){
//          alert("更新成功 " + tableName + name);
//      },function(tx, error){ 
//          alert('更新失败:' + tableName  + name + error.message);
//      });
//  });
//}