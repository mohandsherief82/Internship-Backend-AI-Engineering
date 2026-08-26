
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

export { 
    ValidationError, NotFoundError, MissingConfigError, 
};
