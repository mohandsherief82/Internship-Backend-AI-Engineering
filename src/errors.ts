
class ValidationError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "ValidationError";
    }
}

class NotFoundError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "NotFoundError";
    }
}

export { ValidationError, NotFoundError };
