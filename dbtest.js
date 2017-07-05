var sql = require('mssql');
var xlsx = require('node-xlsx');
var event = require('eventproxy');
var ep = new event();

var insertValueStrs = [];
start();

function start(){
	importExcel();
}

ep.on('insertOK', function(num) {
	if(num == insertValueStrs.length - 1) {
		console.log('insert all ok');
	} else {
		num++;
		connectDB(num);
	}
})


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


	// insert by page
	var pageCount = 1000;
	var page = Math.ceil(dataArr.length / pageCount); 
	for (var p = 0; p < page; p++) {
		var start = p * pageCount;
		var end;
		if (p == page - 1) {
			end = dataArr.length;
		} else {
			end = (p + 1) * pageCount;
		}
		var newArr = dataArr.slice(start, end);
		var newArrStr = newArr.join(',');
		insertValueStrs.push(newArrStr);
	}

	connectDB(0);
}

function connectDB(num) {
	sql.connect("mssql://qh:qh@127.0.0.1:1433/qhtest")
		.then(function() {
			var sqlStr = " insert into [dbo].[component] (id,name,model,quantity) values " + insertValueStrs[num];
			new sql.Request()
				.query(sqlStr)
				.then(function(recordset) {
					sql.close();
					console.log(num + ' ok');
					ep.emit('insertOK', num);
				})
				.catch(function(err) {
					sql.close();
					console.log(err);
				});

		})
		.catch(function(err) {
			console.log(err);
		});
}