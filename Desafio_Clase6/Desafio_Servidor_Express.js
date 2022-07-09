//importamos los modulos a utilizar
const fs = require('fs');
const express = require('express');

const app = express(); 
const port = 8080;

const mServer = app.listen(port, () => {
    console.log(`Servidor Http escuchando en el puerto ${mServer.address().port}`);
})

mServer.on("error", error => console.log(`Error en servidor ${error}`))

app.get('/', (Peticion, pRespuesta) => {
    pRespuesta.send(`<h1 style="color:blue">Productos de la tienda</h1>
    <ul style='text-align:center;'>
      <li><h3><a href="/productos">Todos los productos</a></h3></li>
      <li><h3><a href="/productoRandom">Producto random</a></h3></li>
    </ul>`)
 })


let mObjetoProducto = {};
let mProductoArray = [];

class Contenedor{
    constructor(pNombreDeArchivo){
        this.nombreDelArchivo = "./" + pNombreDeArchivo;
    } 

   async save(mProducto){
        try
        {   

                let mFileExists = fs.existsSync(this.nombreDelArchivo);

                if(mFileExists){

                    mProductoArray = JSON.parse(await fs.promises.readFile(this.nombreDelArchivo, 'utf-8'));
                    mObjetoProducto = mProducto;         
                    mObjetoProducto.id = mProductoArray.length + 1
                    mProductoArray.push(mObjetoProducto);
           
                    await fs.promises.writeFile(this.nombreDelArchivo, JSON.stringify(mProductoArray, null, 2));
                    

                }else{

                    mObjetoProducto = mProducto;         
                    mObjetoProducto.id = mProductoArray.length + 1;
                    mProductoArray.push(mObjetoProducto);
           
                    await fs.promises.writeFile(this.nombreDelArchivo, JSON.stringify(mProductoArray, null, 2));
                }
            
   
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
            //console.log(mProductoArray);
            return mProductoArray;
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
            await fs.promises.unlink(this.nombreDelArchivo, JSON.stringify(mProductoArray, null, 2));
        }
        catch (error)
        {
            console.log('Error: ' + error);
        }

    }



}



const mContenedor = new Contenedor("productos.txt");

const random = (max) => {
    return Math.floor(Math.random() * (max));
 }
 

 //pPeticion = res, pRespuesta = req
 app.get('/productos', async (req, res) => {
    let mDatos = await mContenedor.getAll();
    res.json(mDatos);
 })
 
 app.get('/productoRandom', async (req, res) => {
     let mDatos = await mContenedor.getAll();
     res.json(mDatos[random(mDatos.length)])
  })
