import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import {User,RefreshToken} from '../../models';
import bcrypt from 'bcrypt';
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";


const registercontroller = {
    async register(req,res,next){
        
        // CHECKLIST
        // [ ] validate the request
        // [ ] authorise the request
        // [ ] check if user is in the database already
        // [ ] prepare model
        // [ ] store in database
        // [ ] generate jwt token
        // [ ] send response

        //validation
        const registerSchema = Joi.object({
                name: Joi.string().min(3).max(30).required(),
                email:Joi.string().email().required(),
                password:Joi.string().min(3).max(30).required(),
                repeat_password:Joi.ref('password')
        });

        const {error} = registerSchema.validate(req.body);
   
        if(error){
            return next(error);
        }
        // check if uer is in the databse
        try{
            const exist = await User.exists({email: req.body.email});
            if(exist){
                return next(CustomErrorHandler.alreadyexist("this email already taken"));
            }
        }catch(err){
            console.log("user in database");
            console.log(err);
            return next(err);
        }
        const {name,email,password}=req.body;

        // hash password
        const hashedPassword = await bcrypt.hash(password,10);

        // prepare the model
        
        const user = new User({
            name:name,
            email:email,
            password:hashedPassword
        });

        let access_token;
        let refresh_token;
        try{
            const result = await user.save();
            console.log(result);
            //token create
            access_token = JwtService.sign({_id:result._id, role:result.role});
            refresh_token = JwtService.sign({_id:result._id, role:result.role},'1y',REFRESH_SECRET);

            //databse save refresh token
            await RefreshToken.create({token:refresh_token});

        }catch(err){
            return next(err);
        }

        res.json({access_token:access_token,refresh_token:refresh_token});
    }
} 

export default registercontroller;