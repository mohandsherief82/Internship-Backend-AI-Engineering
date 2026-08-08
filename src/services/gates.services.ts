import { AuthError } from "../errors.js";
import supabase from "../lib/supabase.js";

export function validateHeader(authHeader: string | undefined): asserts authHeader is string {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AuthError("Access token required");
    }
}

export async function validateToken(authToken: string) : Promise<[string, string, string]> {
    if (!authToken || authToken.length == 0) {
        throw new AuthError("Access token required");
    } 

    const { data, error } = await supabase.auth.getUser(authToken);

    if (error || !data.user) {
        throw new AuthError("Invalid or expired token");
    }

    return [data.user.id, data.user.email ?? "", data.user.created_at];
}
