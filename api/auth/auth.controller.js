const {verifyJWT} = require('./auth.services');

module.exports.verify = async(req,res)=>{
    const {token} = req.body;
    
    try{

        const state = await verifyJWT(token);

        res.send(state);

    }catch(err){
        console.log(err);
        res.status(500).send('server internal error!');
    }
}