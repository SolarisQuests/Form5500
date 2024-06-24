
import { MongoClient, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import dotenv from 'dotenv';









dotenv.config();
const mongoUrl = process.env.MONGOURI;
const dbName = 'Form5500';
const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });





async function connectToMongo() {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
     
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  }
  
  connectToMongo();

//   const collections = [
//     'F_5500_2022_Latest', 'F_SCH_A_2022_Latest','F_SCH_A_2023_latest'
// ];


// const getSearchableFields = async (collection) => {
//   const sampleDoc = await collection.findOne();
//   if (!sampleDoc) return [];
//   return Object.keys(sampleDoc).filter(key => typeof sampleDoc[key] === 'string');
// };

// // Utility function to perform search on a collection
// const searchCollection = async (collection, query, fields) => {
//   const searchRegex = new RegExp(query, 'i'); // case-insensitive search
//   const searchConditions = fields.map(field => ({ [field]: searchRegex }));
//   const docs = await collection.find({ $or: searchConditions }).toArray();
//   return docs;
// };


async function searchInAllCollections(dbName, searchTerm) {
  const url = 'mongodb+srv://doadmin:o67C08s3keP45vM9@db-mongodb-nyc3-75708-9e7d3949.mongo.ondigitalocean.com'; // Update with your MongoDB URL
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
      await client.connect();
      console.log('Connected to the database');

      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      
      let results = [];

      for (const collection of collections) {
          const collectionName = collection.name;
          const col = db.collection(collectionName);

          // Fetch one document to get the field names
          const sampleDoc = await col.findOne();
          if (!sampleDoc) {
              console.log(`No documents found in the collection ${collectionName}`);
              continue;
          }

          // Construct a dynamic query
          const query = {
              $or: Object.keys(sampleDoc).map(key => ({
                  [key]: { $regex: searchTerm, $options: 'i' } // Using regex for partial, case-insensitive match
              }))
          };

          // Perform the search
          const colResults = await col.find(query).toArray();
        //   if (colResults.length > 0) {
        //     results[collectionName] = colResults;
        // }
         results = results.concat(colResults.map(doc => ({ collection: collectionName, document: doc })));
      
      
      
      
      
        }

        const groupedResult = results.reduce((acc, item) => {
          const { collection, document } = item;
          
          if (!acc[collection]) {
              acc[collection] = { collection, documents: [] };
          }
          
          acc[collection].documents.push(document);
          
          return acc;
      }, {});
      
      const finalResult = Object.values(groupedResult);
      
      console.log(finalResult);

      return finalResult ;
  } finally {
      await client.close();
  }
}

  
//   export const SearchUniversalresults = async (req, res) => {
//      let query=req.body;



//     try {
//     let results=[];
//       const db = client.db(dbName);
//       const collections = await db.listCollections().toArray();
//       const limitedCollections = collections.slice(0, 2); // limit to 2 collections

//  console.log(limitedCollections )
//  let count=0
// for (const collectionInfo of collections) {
  
  
//   const collectionName = collectionInfo.name;
//   const collection = db.collection(collectionName);
//   const fields = await getSearchableFields(collection);
//   if (fields.length > 0) {
//       const docs = await searchCollection(collection, query, fields);
//       results = results.concat(docs);
//   }

// //  console.log(fields)
// }
//  res.json(results);

   
       
        
//         // res.send(result);
//       } catch (error) {
//         console.error(error.message);
//         res.status(500).send('An error occurred');
//       }
  
  
//     }
  export const SearchUniversalresults = async (req, res) => {
     let query=req.query.search;
     console.log(typeof(query))


    try {
    
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      
      
      const result=await searchInAllCollections('Form5500', query)


   
       
        
       res.send(result);
      } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred');
      }
  
  
    }


    export const specificesearch2=async(req,res)=>{
      const { searchTerm } = req.body;

       if (!searchTerm) {
       return res.status(400).send('Invalid input');
       }

      try {
        const result = await focusedsearch(searchTerm);
        res.send(result);
      } catch (error) {
        console.log(error)
      }
    }


    async function focusedsearch(searchTerm) {
      const url = 'mongodb+srv://doadmin:o67C08s3keP45vM9@db-mongodb-nyc3-75708-9e7d3949.mongo.ondigitalocean.com'; // Update with your MongoDB URL
      const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    
    
      const collectionsToSearch = ['f_5500_2019_latest', 'f_5500_2020_latest', 'f_5500_2021_latest', 'f_5500_2023_latest', 'F_5500_2022_Latest'];
      const defaultFields = [
        'PLAN_NAME',
        'SPONSOR_DFE_NAME',
        'SPONS_DFE_MAIL_US_ADDRESS1',
        'SPONS_DFE_MAIL_US_CITY',
        'SPONS_DFE_MAIL_US_STATE',
        'SPONS_DFE_MAIL_US_ZIP'
      ];
    
      try {
     
        await client.connect();
        console.log('Connected to the database');
    
        const db = client.db(dbName);
        let results = [];
    
        for (const collectionName of collectionsToSearch) {
          const col = db.collection(collectionName);
    
          const sampleDoc = await col.findOne();
          if (!sampleDoc) {
            console.log(`No documents found in the collection ${collectionName}`);
            continue;
          }
    
          const relevantFields = defaultFields.filter(field => sampleDoc.hasOwnProperty(field));
          if (relevantFields.length === 0) {
            continue; // Skip this collection if none of the relevant fields are present
          }
    
          const query = {
            $or: relevantFields.map(field => {
              const fieldQuery = {};
              fieldQuery[field] = typeof searchTerm === 'number' ? searchTerm : { $regex: searchTerm, $options: 'i' };
              return fieldQuery;
            })
          };
    
          console.log("query:::", query, "collectionname:::", collectionName);
    
          const colResults = await col.find(query).toArray();
          results = results.concat(colResults.map(doc => ({ collection: collectionName, document: doc })));
        }
    
        const groupedResult = results.reduce((acc, item) => {
          const { collection, document } = item;
    
          if (!acc[collection]) {
            acc[collection] = { collection, documents: [] };
          }
    
          acc[collection].documents.push(document);
    
          return acc;
        }, {});
    
        const finalResult = Object.values(groupedResult);
    
        console.log(finalResult);
    
        return finalResult;
      }catch(error){
        console.log(error)
      }

     
    }

 
  















  

 