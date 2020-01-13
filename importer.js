const importFile = (file) => {
    const mysqlImport = require('mysql-import');

    var mysqlImportConfigured = mysqlImport.config({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        onerror: err => console.log(err.message)
    });

    return mysqlImportConfigured.import(file);
};

exports.importFile = importFile;