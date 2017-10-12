// internal
var daoUtil = require('./daoUtil');

// def
var fileResourceUtil = {
  getAllDeletedFiles: function(){
    return daoUtil.File
      .findAll({
        where: { isDeleted: true }
      });
  },
  createNewFile: function(
    userId,
    fileName,
    fileDescription,
    filePath,
    azureContainerName,
    azureFileName
  ){
    return daoUtil.File.create({
      userId: userId,
      name: fileName,
      path: filePath,
      description: fileDescription,
      azureContainer: azureContainerName,
      azureName: azureFileName,
    });
  },
  updateOldFile: function(fileId, fileName, fileDescription){
    return daoUtil.File.update(
      {
        name: fileName,
        description: fileDescription
      },
      {
        where: { id: fileId }
      }
    );
  },
  softDeleteFile: function(fileId){
    return daoUtil.File.update(
      {
        isDeleted: true
      },
      {
        where: { id: fileId }
      }
    );
  },
  hardDeleteFile: function(fileId){
    return daoUtil.File.destroy({
      where: { id: fileId }
    });
  }
};

module.exports = fileResourceUtil;
