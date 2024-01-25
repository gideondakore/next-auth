import { MongoClient, MongoClientOptions } from "mongodb";

declare const global: {
    _mongoClientPromise?: Promise<MongoClient>;
}

if(!process.env.DB_URI){
  throw new Error("Invalid/Missing environment variables: 'DB_URI'");
}

const uri: string = process.env.DB_URI;
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if(process.env.NODE_ENV === "development"){

    if(!global._mongoClientPromise){
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
}else{
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;


