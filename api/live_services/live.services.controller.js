const server_auth_token = process.env.server_auth_token;
const {createNewLiveService,readAllLiveServices,readOneLiveService,updateLiveService,removeOneService} = require('./live.services.services');
const {verifyJWT} = require('../auth/auth.services');

module.exports = {
    create : async(req, res)=>{
        const {auth_key,title,icon_link} = req.body;

        if(!(auth_key && title && icon_link)){
            res.status(400).json({code:400, message:'one or many data must be missing',res_time:new Date()});
        }else if(auth_key ===server_auth_token){
            //valid create service
            createNewLiveService(req.body,(err,info)=>{
                if(err){
                    res.status(500).json(err);
                }

                res.status(200).json(info);
            })

        }else{
            res.status(401).json({code:401, message:'only an authorised user can create a new service'});
        }

    },
    read : async(req, res)=>{
        
        const data = req.body;
        const authState = await verifyJWT(data.token);

        if(authState.code === 200){
            //user is authorized
            if(data.id === undefined){

                readAllLiveServices((err,info) =>{
                    if(err){
                        res.status(500).json({code: err.code,message: err.message,requestedfor : 'read all live services',issucceeded: false,token:data.token,isverified:true});
                    }else{
                        if(info.length === 0 || info === undefined || info === null){
                            res.status(404).json({code: 404,message: 'no services found',requestedfor : 'read all live services',issucceeded: true,token:data.token,isverified:true});
                        }else{
                            res.status(200).json({result:info,requestedfor:'read all live services',issucceeded:true,token:data.token,isverified:true});
                        }
                    }
                });

            }else{

                readOneLiveService(data.id,(err,info) =>{
                    if(err){
                        res.status(500).json({code: err.code,message: err.message,requestedfor : 'read one live services',issucceeded: false,token:data.token,isverified:true});
                    }else{
                        if(info.length === 0 || info === undefined || info === null){
                            res.status(404).json({code: 404,message: 'no service found',requestedfor : 'read one live services',issucceeded: true,token:data.token,isverified:true});
                        }else{
                            res.status(200).json({result:info[0],requestedfor:'read one live services',issucceeded:true,token:data.token,isverified:true});
                        }
                    }
                });

            }
        }else{
            //user is not authorized
            res.status(401).json({code:401, message:'user is not authorized',authState:authState});
        }

    },
    update: async(req, res)=>{
        const {auth_key} = req.body;

        if(!(auth_key)){
            res.status(400).json({code:400, message:'auth data is missing',res_time:new Date()});
        }else if(auth_key ===server_auth_token){
            //valid create service
            updateLiveService(req.body,(err,info)=>{
                if(err){
                    res.status(500).json(err);
                }

                res.status(200).json(info);
            })

        }else{
            res.status(401).json({code:401, message:'only an authorised user can create a new service'});
        }
    },
    remove: async(req, res)=>{
        
        const {auth_key} = req.body;

        if(!(auth_key)){
            res.status(400).json({code:400, message:'auth data is missing',res_time:new Date()});
        }else if(auth_key ===server_auth_token){
            //valid create service
            removeOneService(req.body.id,(err,info)=>{
                if(err){
                    res.status(500).json(err);
                }

                res.status(200).json(info);
            })

        }else{
            res.status(401).json({code:401, message:'only an authorised user can create a new service'});
        }

    }
}