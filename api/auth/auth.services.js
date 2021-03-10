const jwt = require('jsonwebtoken');
const jwt_key = process.env.jwt_secret;
const pool = require('../../config/database');

module.exports.createJWT = async (id)=>{
    return new Promise(async (resolve, reject)=>{

        try{

            const token = await jwt.sign({id},jwt_key,{ algorithm: 'HS256'});
            return resolve(token);

        }catch(err){
            console.log(err);
            return reject(err);
        }

    })
};

module.exports.verifyJWT = async (token)=>{
    
    return new Promise( async (resolve, reject)=>{

        try{

            const {id} = await jwt.verify(token,jwt_key,{ algorithms: ['HS256'] });
            // console.log(id);
            let sql = `SELECT * FROM users WHERE user_id = ?`;
            pool.query(sql,[id],async (err,result)=>{
                if(err) return reject(err);
                // console.log(result[0].user_id);
                if(result === undefined || result === null || result.length === 0 || result[0].user_id === undefined){
                    return resolve({code:401, message:'We can not authenticate you at the moment. Please sign in again!'})
                }else{
                    const token = await jwt.sign({id},jwt_key,{ algorithm: 'HS256'});
                    resolve({token:token,code:200,message:'Verified'});
                }
            });

        }catch(err){
            console.log(err);
            return reject(err);
        }

    })

}