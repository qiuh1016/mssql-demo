var sql = require('mssql');
var xlsx = require('node-xlsx');

start();

function start(){
	importExcel();
}


function importExcel() {
	var obj = xlsx.parse('excel/testexcel.xlsx');
	var excelObj = obj[0].data;

	var dataArr = []
	for (var i = 0; i < excelObj.length; i++) {
		var valueArr = [];
		for (var j = 0; j < excelObj[i].length; j++) {

			if (!excelObj[i][j]) {
				valueArr.push("''");
			} else {
				valueArr.push("'" + excelObj[i][j] + "'");
			}
			
		}
		dataArr.push('(' + valueArr.join(',') + ')');
	}
	var dataStr = dataArr.join(',');
	connectDB(dataStr);
}

function connectDB(str) {
	sql.connect("mssql://qh:qh@127.0.0.1:1433/qhtest")
		.then(function() {
			var sqlStr = " insert into [dbo].[component] (id,name,model,quantity) values " + str;
			new sql.Request()
				.query(sqlStr)
				.then(function(recordset) {
					console.log(recordset);
				})
				.catch(function(err) {
					console.log(err);
				});

		})
		.catch(function(err) {
			console.log(err);
		});
}