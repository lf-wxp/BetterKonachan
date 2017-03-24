const fs = require('fs');
const deleteFolderRecursive = (path) => {
  if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach((file) => {
        let curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
          } else { // delete file
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(path);
    }
};
deleteFolderRecursive('dist/');