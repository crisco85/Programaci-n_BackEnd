const normalizeCartData = (rawCart) => {
    let normalizedCart = rawCart.map(cart => {
        let cartArray = {
            _id: cart._id,
            user: cart.user,
            productos: cart.productos.map(product => {
                let productArray = {
                    nombre: product.nombre,
                    precio: product.precio,
                    id: product.id
                }
                return productArray
            })
        }
        return cartArray
    }) 
    return normalizedCart
}

module.exports = { normalizeCartData }