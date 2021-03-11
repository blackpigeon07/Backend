const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const fast2sms = require('fast-two-sms');
const {storeOTP,readOTP,deleteOTP,createUser} = require('./phone.services');
const {createJWT,verifyJWT} = require('../../auth.services');

module.exports.sendOTP = async (req,res) => { 
    const {countryCode,mobileno} = req.body;
    const senderNo = countryCode.trim()+mobileno.trim();
    const saltRounds = parseInt(process.env.saltround);

    try{
        const otp = await otpGenerator.generate(6,{digits:true,alphabets:false,upperCase:false,specialChars:false});
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(otp, salt);
        const options = {authorization : process.env.smsapi , message : `Welcome! from Black Pigeon. Your OTP is ${otp}. Please do not share this otp with anyone. Thank you.` ,  numbers : [mobileno]};

        const smsResponce = await fast2sms.sendMessage(options);

        // console.log(smsResponce+'hi');

        const data = {
            mobile_no:senderNo,
            hash:hash
        };

        storeOTP(data,(err,info)=>{
            if(err){
                res.status(500).json({code:500,message:'We are sorry! We can not store the otp at the moment. If you get an sms with otp please ignore it'});
                console.log(err);
            }else{
                res.status(200).json({code:200,message:'otp sent!'});
            }
        });

        
    }catch(err){
        console.log(err);
        res.status(500).json({code:err.code,message:err.message});
    }
}

module.exports.verifyOTP = async (req,res)=>{
    const {otp,mobileno,countryCode} = req.body;
    const senderNo= countryCode+mobileno

    try{

        const curr_date = Date.now();
        const result = await readOTP(senderNo);
        const sentDate = new Date(result.sent_at).getTime();
        const diff = curr_date-sentDate;
        if(diff> parseInt(4*60*1000)){
            res.status(400).json({code:400,message:'timed out!'});
            // const state = await deleteOTP(senderNo);
        }else{
            //otp verification
            const hash = result.hash;
            const bcryptResult = await bcrypt.compare(otp, hash);
            if(bcryptResult){
                //user authenticated
                //create default account
                //send jwt
                
                const id = await createUser({
                    mobile:senderNo,
                    otp:hash
                });

                const token = await createJWT(id);

                res.json({
                    isverified:true,
                    token:token
                });

                // deleteOTP(senderNo);

            }else{
                res.status(401).json({code:401, message:'wrong otp'});
            }
        }

    }catch(err){
        console.log(err);
        res.status(500).json({code:err.code, message:err.message});
    }
}