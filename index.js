const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');
const importer = require('./importer');
const file = '/tmp/test.sql';

exports.handler = async function(event) {
    let seeds = process.env.SQL_IMPORT_FILE_NAMES.split(",");
    if (!seeds instanceof Array) {
        return false;
    }

    return processSeeds(seeds);
};

function processSeeds(seeds) {
    let importPromises = [];

    seeds.forEach(element => importPromises.push(getDataAndImport(element)));

    return Promise.all(importPromises);
}

async function getDataAndImport(sqlName) {
    const data = await getDataFromS3(s3, sqlName);
    if (write(data)) {
        return importSQL(file);
    }

    return false;
}

async function importSQL(file) {
    await importer.importFile(file);
    return true;
}

function write(data) {
    try {
        if (fs.existsSync(file)) {
            fs.unlink(file, (err) => {
                if (err) throw err;
                console.log('file was deleted');
            });
        }
        fs.writeFileSync(file, data);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

async function getDataFromS3(s3, key) {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key + ".sql",
    };

    const data = await s3.getObject(params).promise();
    return data.Body.toString();
}
