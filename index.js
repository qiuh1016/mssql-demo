var db = require('./db');  
console.log(123);
db.sql('select * from user',function(err,result){  
    if (err) {  
        console.log(err);  
        return;  
    }  
    console.log('用户总数为 :',result.length);  
}); 