var azure = require('azure-storage');

var blobSvc = azure.createBlobService(
    process.env.BLOB_NAME,
    process.env.BLOB_PASSWORD,
    process.env.BLOB_HOST
);


module.exports = {
    getBlobSrvc: function(){
        return blobSvc;
    },
    getFullPath: function(
        containerName, // container
        localFileName // file name
    ){
        return [
            process.env.BLOB_HOST,
            containerName,
            localFileName
        ].join('/')
    }
}
