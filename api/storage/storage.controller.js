const {uploadWork,downloadWork,deleteWork} = require('./storage.services');
const {v4} = require('uuid');
const path = require('path');
const fs = require('fs');


module.exports.uploadFile = async (req,res)=>{
    
    const files = req.file;

    if(!files || files.length === 0){
        //error code for user
        res.status(406).json({code:406,message:'no files found'});
    }else{
        //files found start upload work
        // console.log(files);
        
        uploadWork(files,(err,info)=>{

            if(err){
                throw err;
            }else{
                if(!info || info.length === 0){
                    res.status(500).json({code:500,message:"unable to fetch upload data"});
                }else{
                    //success
                    res.json({code:200,message:info})
                    // console.log(info);
                }
            }

        });
    }
}


module.exports.downloadFile = async (req,res)=>{

    const name = req.query.url.split('/')[4];

        if(name == null || name === undefined){
            res.status(400).send('no file name found');
        }else{
            downloadWork(name,(err,info)=>{
                if(err){
                    console.log(err);
                    res.status(500).send(err.message);
                }else{
                    if(info == null){
                        res.status(500).send('unable to fetch data');
                    }else{
                        res.download(info.destination,`${v4()}.${info.extension}`,(err)=>{
                            if(err){
                                console.log(err);
                                res.status(500).send(err.message);
                            }
                            
                            fs.unlink(path.join(__dirname,`../../${info.destination}`),(err)=>{
                                if(err){
                                    console.log(err);
                                }
                            });

                        });
                    }
                }
            });
        }
}