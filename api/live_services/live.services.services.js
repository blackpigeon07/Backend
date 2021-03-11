const pool = require('../../config/database');
const {nanoid} = require('nanoid');

const createNewLiveService = async ({title,icon_link},callback) =>{

    try{

        const sql = `INSERT INTO live_services (service_id,title,icon_link) VALUES (?,?,?)`;
        const id ='bpserid' + nanoid(10);
        
        pool.query(sql,[id,title,icon_link],(err,result)=>{
            if(err){
                return callback({code:err.code,message:err.message,err:err});
            }

            if(result === undefined || result.length === 0){
                return callback({code:500,message:'unknown error occured'});
            }

            return callback({code:200,message:'successfully created'});
        });


    }catch(e){
        console.log(e);
        return callback({code:e.code,message:e.message,err:e})
    }

}

const readAllLiveServices = async (callback) =>{

    try{

        const sql = `SELECT live_services.service_id,live_services.title,live_services.icon_link FROM live_services`;

        pool.query(sql,(err, result)=>{
            if(err){
                console.log(err);
                return callback({code: err.code, message: err.message,err: err});
            }

            if(result === undefined || result.length === 0){
                return callback({code: 500, message:'unknown error occured! No results available'});
            }

            return callback (null, result);
        });

    }catch(e){
        console.log(e);
        return callback({code:e.code,message:e.message,err:e});
    }
}

const readOneLiveService = async (id, callback) =>{
    try{

        const sql = `SELECT live_services.service_id,live_services.title,live_services.icon_link FROM live_services WHERE service_id = ?`;

        pool.query(sql,[id],(err, result)=>{
            if(err){
                console.log(err);
                return callback({code: err.code, message: err.message,err: err});
            }

            if(result === undefined || result.length === 0){
                return callback({code: 500, message:'unknown error occured! No results available'});
            }

            return callback (null, result);
        });

    }catch(e){
        console.log(e);
        return callback({code:e.code,message:e.message,err:e});
    }
}

const updateLiveService = async (data,callback)=>{

    try{

        const pre_sql = "SELECT * FROM live_services WHERE service_id = ?";
        const sql = `UPDATE live_services SET title=? , icon_link = ?, updated_at=? WHERE service_id = ?`;

        pool.query(pre_sql,[data.id],(err, result)=>{
            if(err){
                console.log(err);
                return callback({code: err.code, message: err.message,err: err});
            }

            if(result === undefined || result.length === 0){
                return callback({code: 404, message:'no such service exists!'});
            }

            // so we have the results with us

            const new_title = data.title || result[0].title;
            const new_icon = data.icon_link || result[0].icon_link;
            const updated = new Date();

            // console.log(new_title, new_icon, updated);

            pool.query(sql,[new_title,new_icon,updated,data.id],(err,update_result) =>{
                if(err){
                    console.log(err);
                    return callback({code:err.code, message:err.message,err: err});
                }

                if(update_result === undefined || update_result === null || update_result.length === 0){
                    return callback({code:500, message:'Sorry! cannot update at the moment.'});
                }

                return callback (null,{code:200, message:'updated successfully',update_result:update_result,updated_at:updated});
            });
        });


    }catch(e){
        console.log(e);
        return callback({code:e.code,message:e.message,err:e});
    }
}

const removeOneService = async (id,callback)=>{

    try{

        const pre_sql = `SELECT * FROM live_services WHERE service_id = ?`;
        const sql = `DELETE FROM live_services WHERE service_id = ?`;

        pool.query(pre_sql,[id],(err, result)=>{
            if(err){
                console.log(err);
                return callback({code:err.code, message:err.message,err: err});
            }
            if(result.length === 0 || result === null || result === undefined){
                return callback({code:404, message:'no such service to delete'});
            }

            pool.query(sql,[id],(err, delete_result)=>{
                if(err){
                    console.log(err);
                    return callback({code:err.code, message:err.message,err:err});
                }

                // console.log(delete_result);
                
                return callback(null, {service:result[0],status:(delete_result.affectedRows >0)});

            })
        });

    }catch(e){

        console.log(e);
        return callback({code:e.code,message:e.message,err:e});

    }

}

module.exports = {createNewLiveService,readAllLiveServices,readOneLiveService,updateLiveService,removeOneService};