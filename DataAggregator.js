const fs = require('fs');
const mongo = require('mongodb');

const MongoClient = mongo.MongoClient;

// TODO
const url = 'mongodb://localhost:27017';
const dbName = 'test';
const collectionName = 'videos';
const outputFilePath = 'Output.txt';

let firstPopulation = true;
let client = null;

async function insertEntries(entries) {

    if(firstPopulation === true) {
        console.log("First population");
        firstPopulation = false;
        await client.db(dbName).collection(collectionName).createIndex({ publishDateTime: -1}).then((err, res) => {
            if (err) throw err;
            console.log(res);
            // console.log("Index on publishDateTime created!");
        }).catch((err) => {console.log(err);});
        await client.db(dbName).collection(collectionName).createIndex({videoTitle: "text", description: "text"}).then((err, res) => {
            if (err) throw err;
            console.log(res);
            // console.log("Text index on videoTitle and description created!");
        }).catch((err) => {console.log(err);});
    }
    else {
        console.log("populated already");
    }
    const db = client.db(dbName);
    await db.collection(collectionName).insertMany(entries).then((err, res) => {
        if (err) throw err;
        console.log("collection populated!");
    }).catch((err) => {console.log(err);});
}

function readData()
{
    fs.readFile(outputFilePath, 'utf-8',async (err, data) => {
        if(data == "") {
            console.log("Empty " + outputFilePath + " File: no records to be inserted as of this moment");
        }
        else {
            // console.log(data);
            let items_arr = JSON.parse(data);
            let entries = [];
            for(let i=0;i<items_arr.length;i++) {
                let items = items_arr[i];
                for(let j=0;j<items.length;j++) {
                    let item = items[j];
                    let obj = {
                        videoTitle: item.snippet.title,
                        videoId: item.id.videoId,
                        description: item.snippet.description,
                        thumbnailURL: item.snippet.thumbnails.default.url,
                        channelTitle: item.snippet.channelTitle,
                        publishDateTime: item.snippet.publishTime
                    };
                    // console.log(JSON.stringify(obj) + " ADDED")
                    entries.push(obj);
                }
            }
            // TODO : insert all these obj into a database
            console.log(entries.length + " records to be inserted")
            await insertEntries(entries);
            emptyOutput();
        }
    });
}

function emptyOutput()
{
    fs.writeFile(outputFilePath, "", (err) => {
        if (err) throw err;
    });
}

async function initialSetup()
{
    client = await MongoClient.connect(url, { poolSize: 10, useUnifiedTopology: true, useNewUrlParser: true })
        .catch(err => { console.log(err); });
    await client.db(dbName).dropDatabase((err, res) => {
        if(err) throw err;
        console.log(res);
    });
    await client.db(dbName).createCollection("videos", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
    });
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

sleep(6000);
initialSetup();
sleep(2000);
setInterval(readData, 2300);