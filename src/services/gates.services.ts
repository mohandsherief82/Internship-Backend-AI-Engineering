import { AuthError } from "../errors.js";

export function validateHeader(authHeader: string | undefined) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AuthError("Access token required");
    }
}

export function validateToken(authToken: string) {
    if (!authToken || authToken.length) {
        throw new AuthError("Access token required");
    }
}
