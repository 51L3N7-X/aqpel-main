import { constants } from ".";

export const common = {
  port: constants.port,
  database_uri: process.env.MONGO_DB_URL,
};
