// internal
var fileResourceUtil = require('./fileResourceUtil');
var blobUtil = require('./blobUtil');

// config
var blobSvc = blobUtil.getBlobSrvc();


module.exports = function (context) {
    context.log('1 - Azure Starting - Connecting Azure SQL DB');

    fileResourceUtil.getAllDeletedFiles().then(
        function(files){
            context.log('2 - Deleted Files Count: ', files.length);

            const promisesDeleteBlob = files.map(function(file){
                const fileName = file.name;
                const fileId = file.id;
                const userId = file.userId;
                const azureContainer = file.azureContainer;
                const azureFileName = file.azureName;
                const stringFriendlyLog = ` fileName=${fileName} userId=${userId} fileId=${fileId}, azureContainer=${azureContainer}, azureFileName=${azureFileName}`;

                context.log(`3 - ATTEMPT to Delete: ${stringFriendlyLog}`);

                return new Promise(function(resolve){
                    blobSvc.deleteBlob(
                        azureContainer,
                        azureFileName,
                        function(error, response){
                            if(!error){
                                // Blob has been deleted
                                context.log(`4 - SUCCESS Deleted Blob: ${stringFriendlyLog}`);
                            } else {
                                context.log(`4 - FAILED Deleted Blob: ${stringFriendlyLog}`);
                            }

                            // doing hard delete for the file
                            fileResourceUtil.hardDeleteFile(fileId)


                            // resolve promises...
                            resolve();
                        }
                    );
                });
            });


            // finally
            Promise.all(promisesDeleteBlob)
                .then(function(){
                    context.log('DONE - Finished clean up data...');
                    context.done();
                })
        }
    );
};
