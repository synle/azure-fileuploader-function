// internal
var fileResourceUtil = require('./fileResourceUtil');
var blobUtil = require('./blobUtil');

// config
var blobSvc = blobUtil.getBlobSrvc();


module.exports = function (context) {
    context.log('1 - azure starting');

    context.log('2 - azure connecting db');

    fileResourceUtil.getAllDeletedFiles().then(
        function(files){
            context.log('3 - total deleted files count');
            context.log(files.length);


            context.log('4 - ready to clean up');
            var promisesDeleteBlob = files.map(function(file){
                var fileId = file.id;
                var azureContainer = file.azureContainer;
                var azureFileName = file.azureName;

                context.log('Attempt to delete: ', fileId, azureContainer, azureFileName);

                return new Promise(function(resolve){
                    blobSvc.deleteBlob(
                        azureContainer,
                        azureFileName,
                        function(error, response){
                            if(!error){
                                // Blob has been deleted
                                context.log('SUCCESS Deleted Blob', azureContainer, azureFileName);
                            } else {
                                context.log('FAILED Deleted Blob', azureContainer, azureFileName);
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
                    context.log('Finished clean up data...');
                    context.done();
                })
        }
    );
};
