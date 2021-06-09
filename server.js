const mongo = require('mongodb');
var express = require('express');

const MongoClient = mongo.MongoClient;

// TODO
const url = 'mongodb://localhost:27017';
const dbName = 'test';
const collectionName = 'videos';

async function getResults(searchTerms, curPage=1, resPerPage=1) {

    const client = await MongoClient.connect(url, {poolSize: 10, useUnifiedTopology: true, useNewUrlParser: true })
        .catch(err => { console.log(err); });
    if(client == null) {
        return ;
    }
    try {
        const db = client.db(dbName);

        resPerPage = parseInt(resPerPage);
        curPage = parseInt(curPage);

        let query = "";
        for(let i=0;i<searchTerms.length;i++) {
            query += "\"" + searchTerms[i] + "\"";
            if(i < searchTerms.length-1) {
                query += " ";
            }
        }

        console.log("QUERY string = " + query);
        console.log("resPerPage, curPage = " + resPerPage + " " + curPage);

        let vids = await db.collection(collectionName).find({$text: {$search: query}}).sort({publishDateTime: -1}).
        skip((curPage-1)*(resPerPage)).limit(resPerPage).toArray();

        return vids;
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.close();
    }
}

const app = express();
const port = 7000;

app.get('/', async (req, res) => {
    let resPerPage = 1;
    resPerPage = req.query.resPerPage;

    let curPage = 1;
    curPage = req.query.curPage;

    let searchTerm = "";
    searchTerm = req.query.q;
    let searchTerms = searchTerm.split(" ");

    let results = await getResults(searchTerms, curPage, resPerPage);
    res.send(results);
});

app.listen(port, () => {
    console.log("Server running on: http://localhost:" + port);
});
