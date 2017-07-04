/*2016年7月14日17:02:15
 QQ: 452076103
 意外金喜
 mssql模块简单封装
*/
var mssql = require('mssql');
var db = {};
var config = {
  user: 'sa',
  password: 'sa',
  server: '61.164.208.174:33248',
  database: "qhtest",
  options: {
    encrypt: true // Use this if you're on Windows Azure
  },
  pool: {
    min: 0,
    max: 10,
    idleTimeoutMillis: 3000
  }
};

//执行sql,返回数据.
db.sql = function (sql, callBack) {
  var connection = new mssql.Connection(config, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    var ps = new mssql.PreparedStatement(connection);
    ps.prepare(sql, function (err) {
      if (err){
        console.log(err);
        return;
      }
      ps.execute('', function (err, result) {
      	if (err){
          console.log(err);
          return;
        }

        ps.unprepare(function (err) {
          if (err){
            console.log(err);
            callback(err,null);
            return;
          }
        	callBack(err, result);
        });
      });
    });
  });
};

module.exports = db;