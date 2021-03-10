const pool =  require('../../../../config/database');
const {v4} = require('uuid');
const { uniqueNamesGenerator, Config, colors,Adjectives,Names } = require('unique-names-generator');

const nameConfig = {
    dictionaries:[colors,Adjectives,Names],
    style: 'capital'
}

module.exports.storeOTP = (data,callback) => {
    const sql = `INSERT INTO otp (mobile_no,hash) VALUES (?,?)`;
    const {mobile_no,hash} = data; 

    const pre_sql = `SELECT * FROM otp WHERE mobile_no = ?`;
    const post_sql = `UPDATE otp SET hash = ? , sent_at= ? WHERE mobile_no = ?`;

    pool.query(pre_sql,[mobile_no],(pre_err,pre_result) => {
        if(pre_err) return callback(pre_err);

        if(pre_result == null || pre_result.length === 0){
            //no otp from the user begin storage
            pool.query(sql,[mobile_no,hash],(err,result) => {
                if(err) return callback(err);
                if(result == null) return callback({code:500,message:"no result available"});
                return callback(null,result);
            });
        }else{
            //otp existe from the user update storage
            const date = new Date();
            pool.query(post_sql,[hash,date,mobile_no],(post_err,post_result) => {
            
                if(post_err) return callback(post_err);
                if(post_result == null) return callback({code:500,message:"no result available"});
                return callback(null,post_result);
            })
        }
    })
}

module.exports.readOTP = (mobileno)=>{

    const sql = `SELECT * FROM otp WHERE mobile_no = ?`;

    return new Promise((resolve,reject)=>{
        pool.query(sql,[mobileno],(err,result) => {
            if(err) return reject(err);
             return resolve(result[0]);

        });
    });
}

module.exports.deleteOTP = async (mobileno)=>{
    const sql = `DELETE FROM otp WHERE mobile_no = ?`;
     return new Promise ((resolve,reject)=>{
         pool.query(sql,[mobileno],(err,result)=>{
             if(err) return reject(err);
             return resolve('deleted');
         });
     });
}

module.exports.createUser = (data)=>{
    return new Promise((resolve, reject)=>{
        const {mobile,otp} = data;
        let sql = `SELECT * FROM users WHERE mobile_no = ?`;
        pool.query(sql,[mobile],(err, results)=>{
            if(err) return reject(err);
            // console.log(results);
            if(results === undefined || results.length == 0){
                //no users found
                //create user
                const id = v4();
                const name ='Black pegion user';
                const address = `Dhanbad,Jharkhand,India`;

                sql = `INSERT INTO users (user_id,mobile_no,password,name,home_address) VALUES (?,?,?,?,?)`;
                pool.query(sql,[id,mobile,otp,name,address],(err,result)=>{
                    if(err) return reject(err);
                    return resolve(id);
                });


            }else{
                //user exists
                //update password
                sql = `UPDATE users SET password = ? WHERE mobile_no = ?`;
                const uid = results[0].user_id;
                pool.query(sql,[otp,mobile],(err, info )=>{
                    if(err) return reject(err);
                    return resolve(uid);
                });
            }
        })
    });
}