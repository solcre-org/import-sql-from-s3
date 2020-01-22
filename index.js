const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');
const importer = require('./importer');
const file = '/tmp/test.sql';

exports.handler = async function(event) {
    let seeds = event.sql_import_file_names;
    if (!seeds instanceof Array) {
        return false;
    }

    await processSeeds(seeds);
    return true;
};

async function processSeeds(seeds) {
    try {
        await importSeeds(seeds);
        return true;
    }
    catch (e) {
        console.log(e);
    }
}

async function getDataAndImport(sqlName) {
    const data = await getDataFromS3(s3, sqlName);
    if (write(data)) {
        await importSQL(file);
        return true;
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


const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
const asyncForEach = async(array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
};

const importSeeds = async(seeds) => {
    await asyncForEach(seeds, async(element) => {
        await waitFor(50);
        await getDataAndImport(element);
    });
};
