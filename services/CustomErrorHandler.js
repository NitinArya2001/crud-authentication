class CustomErrorHandler extends Error{

    constructor(status,msg){
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyexist(message="already exists"){
        return new CustomErrorHandler(409, message);
    }

    static wrongcredential(message="Username or password is wrong"){
        return new CustomErrorHandler(401, message);
    }
    static unauthorized(message="unauthorized"){
        return new CustomErrorHandler(401, message);
    }
    static notfound(message="404 not found"){
        return new CustomErrorHandler(404, message);
    }
    static serverError(message="internal server error//"){
        return new CustomErrorHandler(500, message);
    }

}

export default CustomErrorHandler;