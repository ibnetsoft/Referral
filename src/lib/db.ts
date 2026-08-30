import postgres from "postgres";
import { env } from "@/lib/env";

declare global {
  var __referralSql: postgres.Sql | undefined;
}

const getSqlClient = () => {
  if (!env.databaseUrl) {
    throw new Error("Missing required environment variable: DATABASE_URL");
  }

  global.__referralSql ??= postgres(env.databaseUrl, {
    max: 5,
    idle_timeout: 20,
    prepare: false,
  });

  return global.__referralSql;
};

const sqlPlaceholder = (() => undefined) as unknown as postgres.Sql;

export const sql = new Proxy(sqlPlaceholder, {
  apply(_target, thisArg, argArray) {
    return Reflect.apply(getSqlClient(), thisArg, argArray);
  },
  get(_target, prop, receiver) {
    return Reflect.get(getSqlClient(), prop, receiver);
  },
}) as postgres.Sql;
