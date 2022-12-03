const normalizeUserData = (rawUser) => {
    let normalizedUser = {
        _id: rawUser._id,
        nombre: rawUser.nombre,
        apellido: rawUser.apellido,
        username: rawUser.username,
        password: rawUser.password,
        edad:rawUser.edad,
        direccion: rawUser.direccion,
        telefono: rawUser.telefono,
        foto: rawUser.foto
    }
    return normalizedUser
}

module.exports = { normalizeUserData }