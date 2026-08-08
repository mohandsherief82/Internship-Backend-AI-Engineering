
class ValidationError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "ValidationError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class NotFoundError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class MissingConfigError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class SignUpError extends Error {
    public readonly statusCode: number;
    public readonly code?: string;

    constructor(msg: string, statusCode: number = 400, code?: string) {
        super(msg);
        this.name = "SignUpError";
        this.statusCode = statusCode;
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class InvalidCredentialsError extends Error {
        public readonly statusCode: number;
    public readonly code?: string;

    constructor(msg: string, statusCode: number = 401, code?: string) {
        super(msg);
        this.name = "InvalidCredentialsError";
        this.statusCode = statusCode;
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class AuthError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "AuthError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export { 
    ValidationError, NotFoundError, MissingConfigError, 
    SignUpError, InvalidCredentialsError, AuthError 
};
