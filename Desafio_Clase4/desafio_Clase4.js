//primero importamos fila system
const fs = require('fs');

let mObjetoProducto = {};
let mProductoArray = [];


class Contenedor{
    constructor(pNombreDeArchivo){
        this.nombreDelArchivo = "./" + pNombreDeArchivo;
    }

   async save(mProducto){
        try
        {
            mObjetoProducto = mProducto;


            mObjetoProducto.id = mProductoArray.length + 1;
         
            
            mProductoArray.push(mObjetoProducto);
            await fs.promises.writeFile(this.nombreDelArchivo, JSON.stringify(mProductoArray, null, 2));
        } 
        catch (error)
        {
            console.log('Error: ' + error);
        }
    }

    async getById(id){
        try
        {
            mProductoArray = JSON.parse(await fs.promises.readFile(this.nombreDelArchivo, 'utf-8'));
            let mProductoId = mProductoArray.find(producto => producto.id == id);
            
            if(mProductoId == null){
                console.log('Producto no encontrado');
            } else {
                console.log(mProductoId);
            }
        }
        catch (error)
        {
            console.log('Error: ' + error);
        }
    }

    async getAll(){
        try
        {
            mProductoArray = JSON.parse(await fs.promises.readFile(this.nombreDelArchivo, 'utf-8'));
            console.log(mProductoArray);
        }
        catch (error)
        {
            console.log('Error: ' + error);
        }
    }

    async deleteById(id){
        try
        {
            mProductoArray = JSON.parse(await fs.promises.readFile(this.nombreDelArchivo, 'utf-8'));
            mProductoArray = mProductoArray.filter((producto) => producto.id != id);
            //console.log(mProductoArray);  //prueba para ver que se devuelve
            
            await fs.promises.writeFile(this.nombreDelArchivo, JSON.stringify(mProductoArray, null, 2));
        }
        catch (error)
        {
            console.log('Error: ' + error);
        }
    }

    async deleteAll(){
        try
        {
            mProductoArray = [];
            await fs.promises.writeFile(this.nombreDelArchivo, JSON.stringify(mProductoArray, null, 2));
        }
        catch (error)
        {
            console.log('Error: ' + error);
        }

    }



}

const mProductos = new Contenedor("productos.txt");

//****Probando el método save */

// mProductos.save({
//     title: "Procesador",
//     price: 55000,
//     thumbail: "https://www.amd.com/es/products/cpu/amd-ryzen-7-1800x"
// })

// mProductos.save({
//     title: "Monitor",
//     price: 23500,
//     thumbail: "https://www.pngfind.com/mpng/mobhJ_monitor-definicion-de-monitor-de-computadora-hd-png/"
// })

// mProductos.save({
//     title: "Teclado",
//     price: 10000,
//     thumbail: "http://pngimg.es/download/101874"
// })



//****Probando el método getById */

// //1
// mProductos.getById(2); //Devuelve el producto 2
// //2
// mProductos.getById(5); //Devuelve "producto no encontrado"





//****Probando el método deleteById */

//mProductos.deleteById(1);




//****Probando el método deleteAll */
//mProductos.deleteAll();