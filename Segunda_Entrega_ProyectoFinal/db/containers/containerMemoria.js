class containerMemoria {
    constructor(name) {
        this.name = name
        this.data = []
    }
  
    getAll(cartId) {

            if(cartId === null){
                return Promise.resolve(this.data)
            }
            const selectedElement = this.data.find(element => element.id === cartId)
            
            if (selectedElement){
                return Promise.resolve(selectedElement)
            }
            throw Error(`No existe el ID ${cartId}`)
    }
  
    getById(id) {
      const index = this.data.findIndex(item => item.id === id)
  
      if (index === -1) {
        throw new Error('Error al listar: elemento no encontrado')
      }
  
      return this.data[index]
    }
  
    save(data) {

        data.id = this.data.length + 1
        data.timestamp = Date.now()
        this.data.push(data)
  
      return Promise.resolve(data)
    }
  
    modifyById(id, newData) {
        
        const objectToModify = this.data.find(element => element.id === id)
        const index = this.data.indexOf(objectToModify)
            
        if(objectToModify){
            if(this.name == 'producto'){
                this.data[index].nombre = newData.nombre
                this.data[index].descripcion = newData.descripcion
                this.data[index].codigo = newData.codigo
                this.data[index].foto = newData.foto
                this.data[index].precio = newData.precio
                this.data[index].stock = newData.stock
                this.data[index].timestamp = Date.now()
            } else if (this.name == 'carrito'){
                this.data[index].productos.push(newData)
            } else {
                throw Error('Error en la ruta de la BDD')
            }
        } else {
            throw Error('No existe el ID')
        }  
      return this.data[index]
    }
  
    deleteById(general_id, prod_id) {

        const selectedElement = this.data.find(element => element.id === general_id)
        if(selectedElement){
            const index = this.data.indexOf(selectedElement)   // Selecciono el carrito o producto
            if(prod_id){                                        // Si hay prod_id, implica que el selected element es el carrito y debo 'subseleccionar' el producto de dicho carrito
                const subSelectedElement = this.data[index].productos.find(element => element.id === prod_id)
                if(subSelectedElement){
                    const subSelectedIndex = this.data[index].productos.indexOf(subSelectedElement)
                    this.data[index].productos.splice(subSelectedIndex, 1)
                } else {
                    throw Error(`No existe el ID de Producto: ${prod_id}`)
                }
            } else {
                this.data.splice(index, 1)
            }
        } else {
            throw Error(`No existe el ID general ${general_id}`)
        }
    }
  }
  
  module.exports =  containerMemoria