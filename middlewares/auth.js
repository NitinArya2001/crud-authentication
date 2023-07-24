import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtService from "../services/JwtService";

const auth = async (req,res,next)=>{

    let authHeader = req.headers.authorization;
    console.log(authHeader);

    if(!authHeader){
        console.log("------- header h nahi hai -----");
        return next(CustomErrorHandler.unauthorized());
    }

    const token = authHeader.split(' ')[1];
    try {
        const {_id,role}= await JwtService.verify(token);
        const user = {
            _id,
            role
        }
        req.user=user;
        next();

    } catch (error) {
        console.log("------token not varified----");
        return next(CustomErrorHandler.unauthorized());
    }

}

export default auth;