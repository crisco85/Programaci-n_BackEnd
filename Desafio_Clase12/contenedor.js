const fs = require(`fs`)


class Contenedor {

    constructor(productArray){
        this.data = productArray
    }

    save(newObject, path){
        return(fs.promises.readFile(`./public/${path}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                if(path == 'BDDproducts.txt'){
                    newObject.id = parsedData.length + 1
                }
                parsedData.push(newObject)
                const writeData = JSON.stringify(parsedData)
                return fs.promises.writeFile(`./public/${path}`,writeData)
            })
            .then(() => console.log(`Se ha guardado el objeto en la BDD`))
            .catch(error => {
                console.log(`error: ${error}`)
            })
        )
        // nuevoProducto.id = this.data.length + 1
        // this.data.push(nuevoProducto)
        // return nuevoProducto
    }

    getById(id){
        const data = this.data
        const found = data.find(obj => obj.id == id)
        if(found){
            return found
        } else {
            return {error: `No se encuentra el ID ${id}`}
        }
    }
    getAll(path){
        return(fs.promises.readFile(`./public/${path}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                // return JSON.stringify(parsedData)
                return parsedData
            })
            .catch(error => {
                console.log(`error: ${error}`)
            })
        )

        // return this.data
    }

    modifyById(id, newData){
        const data = this.data
        const found = data.find(obj => obj.id == id)
        if(found){
            const index = data.indexOf(found)
            data[index].title = newData.title
            data[index].price = newData.price
            data[index].thumbnail = newData.thumbnail
            return {message: `Producto con ID ${id} fue modificado exitosamente`}
        } else {
            return {error: `No se encuentra el ID ${id}`}
        }
    }

    deleteById(id){
        const data = this.data
        const found = data.find(obj => obj.id == id)
        if(found){
            const index = data.indexOf(found)
            data.splice(index,1)
            return {message: `Producto con ID ${id} fue eliminado exitosamente`}
        } else {
            return {error: `No se encuentra el ID ${id}`}
        }      
    }
}
module.exports = Contenedor;
