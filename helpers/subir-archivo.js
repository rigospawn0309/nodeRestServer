const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas  = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) =>{

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length-1];
        
        //validar la extensión
        if(!extensionesValidas.includes( extension )){
           return reject(`La extension ${extension} no es permitida, las extensiones validas son ${extensionesValidas}`);
        }
        
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '/../uploads/',carpeta, nombreTemp);
        console.log(uploadPath);
    
      
        archivo.mv(uploadPath, (err) => {
          if (err) {
            return reject(err)
          }

          resolve(nombreTemp);
        });
    })
}

module.exports = {
    subirArchivo
}