import { config } from "dotenv";

import { join } from "path";

config({ path: join(__dirname, "../../.env") });

import { common } from "./common";

export const constants: any = Object.assign(common, process.env);
