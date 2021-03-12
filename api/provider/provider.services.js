const pool = require('../../config/database');
const {createJWT} = require('../auth/auth.services');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.jwt_secret;
const {nanoid} = require('nanoid');

const createProvider = async (data,callback) => {

    const {user_id,aadhaar,pan,business_proof,business_location}=data;
    const provider_id = `bpprov${nanoid(16)}`;
    
    const sql = `INSERT INTO providers (provider_id,user_id,aadhaar,pan,business_proof,business_location) VALUES (?,?,?,?,?,?)`;

    try{

        pool.query(sql,[provider_id,user_id,aadhaar,pan,business_proof,business_location],async (err,result) => {
            if(err){
                console.log(err);
                return callback({code:err.code, message:err.message,err:err});
            }
            
            if(result === undefined || result.length === 0 || result === null){
                return callback({code:500, message:'unknown error occured! no data available!'});
            }

            const provider_jwt = await createJWT(provider_id);

            return callback(null,{code:200,provider_jwt:provider_jwt,result:result,message:'provider created',status: true});
        });
        
    }catch(e){
        console.log(e);
        callback(e);
    }

}

const verifyProviderJWT = async(token) => {

    return new Promise( async (resolve, reject)=>{

        try{

            const {id} = await jwt.verify(token,jwt_key,{ algorithms: ['HS256'] });
            // console.log(id);
            let sql = `SELECT * FROM providers WHERE provider_id = ?`;
            pool.query(sql,[id],async (err,result)=>{
                if(err) return reject(err);
                // console.log(result[0].user_id);
                if(result === undefined || result === null || result.length === 0 || result[0].user_id === undefined){
                    return resolve({code:401, message:'We can not authenticate you at the moment. Please sign in again!'})
                }else{
                    const token = await jwt.sign({id},jwt_key,{ algorithm: 'HS256'});
                    resolve({token:token,provider_id:id,code:200,message:'Verified'});
                }
            });

        }catch(err){
            console.log(err);
            return reject(err);
        }

    });

}

const getProviderById = async (id,callback) =>{

    try{

        const sql = `SELECT providers.aadhaar,providers.pan,providers.business_proof,providers.business_location FROM providers WHERE provider_id = ?`;

        pool.query(sql,[id],async (err,result)=>{

            if(err){
                console.log(err);
                return callback(err);
            }

            if(result === undefined || result.length === 0 || result === null){
                return callback({code:500, message:'unknown error occured! could not fetch data at the moment.'});
            }

            return callback (null,{code:200,message:'data fetched !',data:result,status:true,fetchid:id});
        });

    }catch(err){
        console.log(err);
        callback(err);
    }
}

const updateProvider = async (data,callback)=>{

    const {business_location,provider_id,business_proof} = data;

    try{

        const pre_sql = 'SELECT * FROM providers WHERE provider_id = ?';
        const sql = `UPDATE providers SET business_proof=?,business_location=?,registered_on=? WHERE provider_id=?`;

        pool.query(pre_sql,[provider_id],(err,pre_result)=>{
            if(err){
                console.log(err);
                return callback(err);
            }

            if(pre_result.length === 0 || pre_result === undefined || pre_result === null){
                return callback({code:500,message:'no such provider exists!'});
            }

            const new_business_proof = business_proof || pre_result[0].business_proof;
            const new_business_location = business_location || pre_result[0].business_location;

            pool.query(sql,[new_business_proof,new_business_location,new Date(),provider_id],async (err,result)=>{

                if(err){
                    return callback({code:err.code, message:err.message,err: err});
                }

                if(result === undefined || result.length === 0 || result === null){
                    return callback({code:500,message:'unable to update provider'});
                }

                return callback(null,{
                    code:200,
                    message:'updated provider',
                    update_id:provider_id,
                    status: true
                });
            });
        });

    }catch(err){
        console.log(err);
        return callback({code:err.code,message:err.message,err:err});
    }

}

const deleteProvider = async (provider_id,callback)=>{

    try{

        const pre_sql =`SELECT * FROM providers WHERE provider_id = ?`;
        const sql = `DELETE FROM providers WHERE provider_id=?`;

        pool.query(pre_sql,[provider_id],(pre_err,pre_result)=>{

            if(pre_err){
                console.log(pre_err);
                return callback({code:pre_err.code, message:pre_err.message,err: pre_err});
            }

            if(pre_result === undefined || pre_result.length === 0 || pre_result === null){
                return callback({code:404, message:'no such provider found to delete',status: false});
            }

            pool.query(sql,[provider_id],async (err,result)=>{
                if(err){
                    console.log(err);
                    return callback({code:err.code, message:err.message,err: err});
                }

                if(result === undefined || result.length === 0 || result === null){
                    return callback({code:500, message:'deletion unconfirmed!'});
                }

                return callback(null,{code:200,message:'deleted successfully',deletion_id:provider_id,status:true});
            });

        });

    }catch(err){
        console.log(err);
        return callback({code:err.code, message:err.message,err: err});
    }

}

module.exports = {createProvider,verifyProviderJWT,getProviderById,updateProvider,deleteProvider};