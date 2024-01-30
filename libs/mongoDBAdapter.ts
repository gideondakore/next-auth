import { MongoClient, MongoClientOptions } from "mongodb";

if(!process.env.MONGODB_URI){
    throw new Error("Invalid/Missing environment variable DB_URI")
}

const options: MongoClientOptions = {};
const uri:string = process.env.MONGODB_URI;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

let globalWithMongoClientPromise = global as typeof globalThis & {
    _mongoClientPromise: Promise<MongoClient>;
}

if(process.env.NODE_ENV === "development"){

    if(!globalWithMongoClientPromise._mongoClientPromise){
        client = new MongoClient(uri, options)
        globalWithMongoClientPromise._mongoClientPromise = client.connect();

    }
    clientPromise = globalWithMongoClientPromise._mongoClientPromise;
}else{
    client = new MongoClient(uri, options)
    clientPromise = client.connect();
}

export default clientPromise;