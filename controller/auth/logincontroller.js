import Joi from "joi";
import {User,RefreshToken} from '../../models';
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from 'bcrypt';
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";

const logincontroller = {
    async login(req,res,next){
        //validation
        const loginSchema = Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().min(3).max(30).required(),
 
        });

        const {error} = loginSchema.validate(req.body);

        console.log(req.body);
        if(error){
            console.log(error);
            return next(error);
        }

        try{
            const user = await User.findOne({email: req.body.email});
            if(!user){
                return next(CustomErrorHandler.wrongcredential());
            }
            // compare the password
            const match = await bcrypt.compare(req.body.password,user.password);

            if(!match){
                return next(CustomErrorHandler.wrongcredential());
            }

            const access_token = JwtService.sign({_id:user._id, role:user.role});
            const refresh_token = JwtService.sign({_id:user._id, role:user.role},'1y',REFRESH_SECRET);
            console.log(access_token);
            console.log(refresh_token);
            //databse save refresh token
            await RefreshToken.create({token:refresh_token});
            
            res.json({access_token:access_token,refresh_token:refresh_token});

        }catch(err){
            console.log(err);
            return next(err);
        }

    },

    async logout(req,res,next){

        //validation
        const refreshSchema = Joi.object({
            refresh_token:Joi.string().required(),
 
        });

        const {error} = refreshSchema.validate(req.body);

        if(error){
            console.log('validation error');
            return next(error);
        }

        // database me se delete kar rahe refresh token
        try {
            await RefreshToken.deleteOne({token:req.body.refresh_token});
        } catch (error) {
            return next(error);
        }
        res.json({status:1});
    }
} 

export default logincontroller;