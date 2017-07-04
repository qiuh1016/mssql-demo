
var mssql = require('mssql');
var user = "sa",
    password = "sa",
    server = "localhost",
    database = "qhtest";


var config = {
    user: 'sa',
    password: 'sa',
    server: '61.164.208.174:33248', // You can use 'localhost\\instance' to connect to named instance
    database: 'qhtest',
    options: {
        encrypt: true // Use this if you're on Windows Azure
    },
    pool: {
        min: 0,
        idleTimeoutMillis: 3000
    }
};

mssql.connect(config).then(function() {
    new mssql.Request()
        .query('select * from [dbo].[user]').then(function(recordset) {
            console.dir(recordset);
        }).catch(function(err) {
            console.log(err);
        })
})


