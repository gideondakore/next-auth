import { MongoClient } from "mongodb";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production" | "test"
        }
    }
}

export {};