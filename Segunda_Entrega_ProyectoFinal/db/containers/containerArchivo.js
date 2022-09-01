const fs = require(`fs`)
const { parse } = require("path")

class containerArchivo {

    constructor(name){
        this.name = name
    }

    save(nuevoObjeto){
        return(fs.promises.readFile(`./public/${this.name}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                nuevoObjeto.id = parsedData.length + 1
                nuevoObjeto.timestamp = Date.now()
                parsedData.push(nuevoObjeto)
                const writeData = JSON.stringify(parsedData)
                return fs.promises.writeFile(`./public/${this.name}`,writeData)
            })
            .then(() => {
                return {message:`Se ha guardado el objeto en la BDD`}
            })
            .catch(error => {
                throw Error(`Error en lectura / escritura de archivo en funcion save. ${error.message}`)
            })
        )
    }

    getById(id){
        return(fs.promises.readFile(`./public/${this.name}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                const selectedElement = parsedData.find(element => Number(element.id) === id)
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

    getAll(cartId){
        return(fs.promises.readFile(`./public/${this.name}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                if(cartId === null){
                    return parsedData
                }
                const selectedElement = parsedData.find(element => element.id == cartId)
                
                if (selectedElement){
                    return selectedElement.productos
                }
                throw Error(`No existe el ID ${cartId}`)
            })
            .catch(error => {
                throw Error(`Error en lectura de archivo en funcion getAll. ${error.message}`)
            })
        )
    }

    modifyById(id, newData){
        return(fs.promises.readFile(`./public/${this.name}`,'utf-8')
        .then((data) => {

            const parsedData = JSON.parse(data)
            const objectToModify = parsedData.find(element => element.id === id)
            
            if(objectToModify){
                const index = parsedData.indexOf(objectToModify)
                if(this.name == './productos.json'){
                    parsedData[index].nombre = newData.nombre
                    parsedData[index].descripcion = newData.descripcion
                    parsedData[index].codigo = newData.codigo
                    parsedData[index].foto = newData.foto
                    parsedData[index].precio = newData.precio
                    parsedData[index].stock = newData.stock
                    parsedData[index].timestamp = Date.now()
                } else if (this.name == './carritos.json'){
                    parsedData[index].productos.push(newData)
                } else {
                    throw Error('Error en la ruta de la BDD')
                }
            } else {
                throw Error('No existe el ID')
            }
            const writeData = JSON.stringify(parsedData)
            return fs.promises.writeFile(`./public/${this.name}`,writeData)
        })
        .then(() => {
            return {message:`Se ha modificado el objeto con id ${id}`}
        })
        .catch(error => {
            throw Error(`Error en lectura/escritura de archivo en funcion modifyById. ${error}`)
        })
        )
    }

    deleteById(general_id, prod_id){
        return(fs.promises.readFile(`./public/${this.name}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                const selectedElement = parsedData.find(element => element.id === general_id)
                if(selectedElement){
                    const index = parsedData.indexOf(selectedElement)   // Selecciono el carrito o producto
                    if(prod_id){                                        // Si hay prod_id, implica que el selected element es el carrito y debo 'subseleccionar' el producto de dicho carrito
                        const subSelectedElement = parsedData[index].productos.find(element => element.id === prod_id)
                        if(subSelectedElement){
                            const subSelectedIndex = parsedData[index].productos.indexOf(subSelectedElement)
                            parsedData[index].productos.splice(subSelectedIndex, 1)
                        } else {
                            throw Error(`No existe el ID de Producto: ${prod_id}`)
                        }
                    } else {
                        parsedData.splice(index, 1)
                    }
                    const writeData = JSON.stringify(parsedData)
                    return fs.promises.writeFile(`./public/${this.name}`, writeData)
                } else {
                    throw Error(`No existe el ID general ${general_id}`)
                }
            })
            .then(() => {
                return {message: `Se ha eliminado el objeto con id ${general_id}`}
            })
            .catch(error => {
                throw Error(`Error en lectura/escritura de arvhivo en funcion deleteById. ${error.message}`)
            })
        )    
    }
}
module.exports = containerArchivo