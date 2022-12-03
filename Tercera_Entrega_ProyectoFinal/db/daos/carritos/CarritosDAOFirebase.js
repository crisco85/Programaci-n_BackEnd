const ContenedorFirebase = require('../../containers/firebase/containerFirebase.js')
const {FieldValue} = require('firebase-admin/firestore')

class CarritosFirebase extends ContenedorFirebase {
    constructor(collectionName){
       super(collectionName)
    }

     async deleteById(cartID, prodID){
        try {
            const doc = this.query.doc(cartID)
            const getDoc = await this.query.doc(cartID).get()
            let item = await doc.update({
                products: getDoc.data().products.filter(products => products.id !== prodID)
            });
            console.log("se elimino el producto", item)
            return item
        }catch(e) {
            throw new Error(`Error al listar por id: ${e}`)

        }
     }


    async modifyById(id, product) {
        try {
            const doc = this.query.doc(id)
            let item = await doc.update({
                products: FieldValue.arrayUnion(product)
            });
            console.log("se agrego el producto", item)
        }catch(e) {
            console.log(e)
        }
    } 
}

module.exports = CarritosFirebase