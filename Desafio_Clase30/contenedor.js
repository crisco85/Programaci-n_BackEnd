const fs = require(`fs`);
const { default: knex } = require("knex");
const { parse } = require("path");

class Contenedor {
        constructor(dataArray, dbOptions, table){
        this.data = dataArray;
        this.dbOptions = dbOptions;
        this.table = table;
    }

    save(newObject){
        const knex = require('knex')(this.dbOptions)
        return knex(this.table).insert(newObject)
        .then((newObjectID) => {
            return newObjectID
        })
        .catch(error => {
            throw Error(`Error en lectura de archivo en funcion save. ${error.message}`)
        })      
    }

    getById(id, path){
        return(fs.promises.readFile(`./public/${path}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                const selectedElement = parsedData.find(element => element.id === id)
                if(selectedElement){
                    return selectedElement
                }
                throw Error(`No existe el ID ${id}`)
            })
            .catch(error => {
                throw Error(`Error en lectura de arvhivo en funcion getById. ${error.message}`)
            })
        )
    }

    getAll(){
        const knex = require('knex')(this.dbOptions);
        return knex
            .from(this.table)
            .select('*')
            .then((selection) => {
                return selection
            })
            .catch(error => {
                throw Error(`Error en lectura de archivo en funcion getAll. ${error.message}`)
            })
    }

    modifyById(path, id, newData){
        return(fs.promises.readFile(`./public/${path}`,'utf-8')
        .then((data) => {
            const parsedData = JSON.parse(data);
            const objectToModify = parsedData.find(element => element.id == id);
            if(objectToModify){
                const index = parsedData.indexOf(objectToModify);

                if(path == 'BDDproducts.txt'){
                    parsedData[index].nombre = newData.nombre;
                    parsedData[index].descripcion = newData.descripcion;
                    parsedData[index].codigo = newData.codigo;
                    parsedData[index].foto = newData.foto;
                    parsedData[index].precio = newData.precio;
                    parsedData[index].stock = newData.stock;
                    parsedData[index].timestamp = Date.now();
                } else if (path == 'BDDcart.txt'){
                    parsedData[index].productos.push(newData);
                } else {
                    throw Error('Error en la ruta de la BDD');
                }
            } else {
                throw Error('No existe el ID')
            }

            const writeData = JSON.stringify(parsedData);
            return fs.promises.writeFile(`./public/${path}`,writeData);
        })
        .then(() => {
            return {message:`Se ha modificado el objeto con id ${id}`}
        })
        .catch(error => {
            throw Error(`Error en lectura/escritura de archivo en funcion modifyById. ${error}`)
        })
        )
    }

    deleteById(path, general_id, prod_id){
        return(fs.promises.readFile(`./public/${path}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                const selectedElement = parsedData.find(element => element.id === general_id)
                if(selectedElement){
                    const index = parsedData.indexOf(selectedElement)   // Selecciono el carrito o producto
                    if(prod_id){                                        // Si hay prod_id, implica que el selected element es el carrito y debo 'subseleccionar' el producto de dicho carrito
                        const subSelectedElement = parsedData[index].productos.find(element => element.id === prod_id);

                        if(subSelectedElement){
                            const subSelectedIndex = parsedData[index].productos.indexOf(subSelectedElement);
                            parsedData[index].productos.splice(subSelectedIndex, 1);
                        } else {
                            throw Error(`No existe el ID de Producto: ${prod_id}`);
                        }
                    } else {
                        parsedData.splice(index, 1);
                    }
                    const writeData = JSON.stringify(parsedData);
                    return fs.promises.writeFile(`./public/${path}`, writeData);
                } else {
                    throw Error(`No existe el ID general ${general_id}`);
                }
            })
            .then(() => {
                return {message: `Se ha eliminado el objeto con id ${general_id}`};
            })
            .catch(error => {
                throw Error(`Error en lectura/escritura de arvhivo en funcion deleteById. ${error.message}`);
            })
        )    
    }
}

module.exports = Contenedor