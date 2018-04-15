 class DatabaseError extends Error {
    constructor(message){
        super(message);
    }
}
class UploadError extends Error{
    constructor(message){
        super(message);
    }
}

class SendMailError extends Error{
    constructor(message){
        super(message);
    }
}

module.exports={
    DatabaseError,
    UploadError,
    SendMailError
}