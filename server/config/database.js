import pkg from '@datastax/astra-db-ts';
import dotenv from 'dotenv';
const { DataAPIClient } = pkg;

dotenv.config();

console.log("token", process.env.ASTRA_DB_TOKEN);

// Initialize tashe client
const client = new DataAPIClient(process.env.ASTRA_DB_TOKEN);
const db = client.db(process.env.ASTRA_DB_ENDPOINT);

(async () => {
  const colls = await db.listCollections();
  console.log('Connected to AstraDB:', colls);
})();

export { db };