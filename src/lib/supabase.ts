import { createClient } from "@supabase/supabase-js";
import config from "../config/env.js";
import { MissingConfigError } from "../errors.js";

if (!config.supabaseURL) {
  throw new MissingConfigError("Missing Supabase URL or Key in environment config.");
}

if (!config.supabaseKey) {
    throw new MissingConfigError("Missing Supabase URL or Key in environment config.")
}

const supabase = createClient(config.supabaseURL, config.supabaseKey);

export default supabase
