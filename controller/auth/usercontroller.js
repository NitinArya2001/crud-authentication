import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import {User} from '../../models';
import bcrypt from 'bcrypt';
import JwtService from "../../services/JwtService";


const usercontroller = {
    async me(req,res,next){ 
        
        try {
            const user = await User.findOne({_id:req.user._id},{password:0,updatedAt:0,__v:0});
            console.log(user);
            if(!user){
                console.log("no user");
                return next(CustomErrorHandler.notfound());
            }
            res.json(user);
        } catch (error) {
            return next(error);
        }
    }
} 

export default usercontroller;