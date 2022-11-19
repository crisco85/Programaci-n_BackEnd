//#region Emailing
const { notifyNewUser } = require('../utils/ethereal');
const adminUser = {nombre:process.env.ADMIN_NOMBRE, username: process.env.ADMIN_EMAIL, telefono:process.env.ADMIN_TELEFONO};
//#endregion

//#region Storage
const mongoose = require('mongoose');
const { getItemById, createItem } = require('../services/userServices');
//#endregion

//#region Logger
const { errorLogger, warningLogger } = require('../utils/log4jsConfig');

const addUser = async(req, res) => { 
    const newUser = req.body;
    notifyNewUser(newUser, adminUser);
    res.redirect('/users/login');
}

const createUser = async(req, res) => {
    return await createItem(req);
}

const userLogin = async(req, res) => { res.status(202).json({ message: 'Sesion iniciada con exito' })};

const loginView = async(req, res) => {
    warningLogger.warn(`Ruta /login en construccion`);
    return res.status(200).json({message: `Aca se debe cargar la pantalla de login`});
}

const userLogout = async(req, res) => {
    req.session.destroy(err =>  {
        if(err){ return next(err) }
        res.json({message:'Session destroyed'});
    })
}

const userInfo = async(req, res) => {
    try{
        const user = await getItemById(mongoose.Types.ObjectId(req.session.passport.user));
        return res.status(200).json({url: req.originalUrl, method: req.method, status: 200, error: null, message: {user}});
    } catch (error) {
        errorLogger.error(error);
        return res.status(500).json(error.message);
    }
}
//#endregion

module.exports = { addUser, userLogin, loginView, userLogout, userInfo, createUser }