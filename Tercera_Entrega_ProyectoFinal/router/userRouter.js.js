// ==== LIBRARIES ====
// Express
const express = require('express')
const app = express()

// Router
const { Router } = express
const userRouter = Router()

const { addUser, userLogin, loginView, userLogout, userInfo, createUser } = require('../controllers/userController')

// Storage
const getStorage = require('../db/daos')
const { users: storage } = getStorage()

// Flash
const flash = require('connect-flash')

// Logger
const { errorLogger } = require('../utils/log4jsConfig')

// Users Management
const { createHash, isValidPassword } = require('../utils/bycrypt')
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const validateSession = require('../utils/sessionValidator')

// ==== EXPRESS MIDLEWARES ====

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Flash
app.use(flash())

// ==== PASSPORT MIDLEWARES ====

// Serialize
passport.serializeUser((user, done) => {
    done(null, user._id)
})

// Deserialize
passport.deserializeUser((id, done) => {
    return storage.getById(id)
    .then(user => done(null, user))
    .catch(error => {
        errorLogger.error(error)
        done(error)
    })
})

// Signup Strategy
passport.use(
    'signup', 
    new LocalStrategy({
        passReqToCallback: true
    }, 
    (req, username, password, done) => {
        return storage.findUser({ username })
            .then(user => {
                if (user) {
                    throw new Error(`El usuario ${user.username} ya existe`)
                }
                req.body.password = createHash(password)
                return createUser(req.body)
                // return storage.save(req.body)
            })
            .then(user => {
                done(null, user)
            })
            .catch(err => {
                errorLogger.error(err)
                done(err)
            })
        }
    )
)

// Login Strategy
passport.use(
    'login', 
    new LocalStrategy(
        (username, password, done) => {
        return storage.findUser({ username })
        .then(user => {
            if (!user) {
                throw new Error(`No se encontro el usuario "${username}"`)
            }

            // console.log("(1)")

            if (!isValidPassword(user.password, password)) {
                throw new Error('Contraseña incorrecta')
            }

            // console.log("(2): ", user)

            return done(null, user)
        })
        .catch(err => {
            // console.log("(3)")

            errorLogger.error(err)
            done(err)
        })
    })
)

// RUTAS CRUD USUARIOS

// Crea nuevo usuario
userRouter.post('/create', 
    passport.authenticate('signup', {
        // successRedirect: '/users/login',
        failureRedirect: '/users/create',
        failureFlash: true
    }),
    addUser
)

// Login usuario
userRouter.post('/login',     
    passport.authenticate('login', {
        // successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }), 
    userLogin
)

// Login view
userRouter.get('/login', loginView)

// Logout usuario
userRouter.post('/logout', userLogout)

// Informacion usuario
userRouter.get('/info', validateSession, userInfo)

module.exports = userRouter