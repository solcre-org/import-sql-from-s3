Lambda function to import SQL files from Amazon S3 !

## Install
```
$ npm install --save-dev solcre-lambda-aws-import-sql-files-from-s3
```

## Usage
Define the following environment variables:

+ **DATABASE_HOST:** Database host
+ **DATABASE_NAME:** Database name
+ **DATABASE_PASSWORD:** Database password 
+ **DATABASE_USER:** Database user 
+ **S3_BUCKET_NAME:** S3 bucket name from where import the sql files 
+ **SQL_IMPORT_FILE_NAMES:** Names of the files to import separate by comma 

Upload the library to your Lambda AWS panel.