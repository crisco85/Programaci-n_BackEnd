// import ContenedorFirebase from  '../../containers/firebase/containerFirebase.js'

const ContenedorFirebase = require('../../containers/firebase/containerFirebase.js')
class ProductosFirebase extends ContenedorFirebase {
    constructor(collectionName) {
        super(collectionName)
    }

    async modifyById(modProduct, id) {
        try {
            const doc = this.query.doc(id)
            let item = await doc.update(modProduct);
            console.log("se actualizo", item)
        }catch(e) {
            console.log(e)
        }
    } 
}

module.exports = ProductosFirebase