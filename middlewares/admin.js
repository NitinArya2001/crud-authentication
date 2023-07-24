import {User} from '../models';
import CustomErrorHandler from '../services/CustomErrorHandler';

const admin = async (req,res,next)=>{

    try {
        const user = await User.findOne({_id:req.user._id});
        console.log(user);
        if(user.role == "admin"){
            next();
        }else{
            console.log("not a admin");
            return next(CustomErrorHandler.unauthorized());
        }
    } catch (error) {
        console.log("database admin fetch error");
        return next(CustomErrorHandler.serverError());
    }
}

export default admin;