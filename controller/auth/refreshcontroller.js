import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import {RefreshToken, User} from '../../models';
import bcrypt from 'bcrypt';
import JwtService from "../../services/JwtService";
import { Error } from "mongoose";
import { REFRESH_SECRET } from "../../config";

const refreshcontroller = {
    async refresh(req,res,next){ 

         //validation
         const refreshSchema = Joi.object({
            refresh_token:Joi.string().required(),
 
        });

        const {error} = refreshSchema.validate(req.body);

        if(error){
            console.log('validation error');
            return next(error);
        }
        
        // database me hai ya nahi token

        try {
            console.log("data no data");
            const refreshtoken=await RefreshToken.findOne({token:req.body.refresh_token});
            
            if(!refreshtoken){
                return next(CustomErrorHandler.unauthorized('Invalid refresh token'));

            }
            let userId;
            try {
                const {_id}=await JwtService.verify(refreshtoken.token,REFRESH_SECRET);
                userId=_id;
            } catch (error) {
                return next(CustomErrorHandler.unauthorized('Invalid refresh token'));
            }

            const user =User.findOne({_id:userId});
            if(!user){
                return next(CustomErrorHandler.unauthorized('no such user found'));
            }

            //tokens again genearte kiye hai access and refresh
            const access_token = JwtService.sign({_id:user._id, role:user.role});
            const refresh_token = JwtService.sign({_id:user._id, role:user.role},'1y',REFRESH_SECRET);

            //databse save refresh token
            await RefreshToken.create({token:refresh_token});
            res.json({access_token:access_token,refresh_token:refresh_token});

        } catch (err) {
            console.log("data findone errp");
            console.log(err);
            return next(err);
        }

    }
} 

export default refreshcontroller;