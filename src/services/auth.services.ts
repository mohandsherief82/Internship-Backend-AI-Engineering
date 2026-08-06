import { ValidationError } from "../errors.js";

export function validateEmail(email: string) {
    if (!email || email.length == 0) {
        throw new ValidationError("Missing email");
    }
}

export function validatePassword(password: string) {
    if (!password || password.length == 0) {
        throw new ValidationError("Missing email");
    }
}
