// server creation

// 1. import express
const { response, application, Router } = require('express')
const express = require('express')

// Import jsonwebtoken

const jwt = require('jsonwebtoken')

// import cors 
const cors = require('cors')

const dataService = require('./service/data.service')

// 2. create server app
const app = express()

// to parse JSON
app.use(express.json())

// to use cors to share data with others
app.use(cors({
    origin:['http://localhost:4200','http://192.168.0.188:8080','http://127.0.0.1:8080']
})) 

// Application specific Middleware 

const appMiddleware = (req, res, next) => {
    next()
}

app.use(appMiddleware)

// Router specific Middleware - token Validation
const jwtMiddleware = (req, res, next) => {

    try {
        console.log("Router specific Middleware");
        const token = req.headers['x-access-token']
        const data = jwt.verify(token, "supersecretekey12345")
        console.log(data);
        next()
    }
    catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: 'Please LogIn'
        })
    }
}

// 3. HTTP request resolver

// // GET Request - to read data 
// app.get('/', (req, res) => {
//     res.send('GET METHORD')
// })

// // PUT Request - to update data completly 
// app.put('/', (req, res) => {
//     res.send('PUT METHORD')
// })

// // POST Request - to update data completly 
// app.post('/', (req, res) => {
//     res.send('POST METHORD')
// })

// // PATCH Request - to update data partially 
// app.patch('/', (req, res) => {
//     res.send('PATCH METHORD')
// })

// // DELETE Request - to remove data  
// app.delete('/', (req, res) => {
//     res.send('DELETE METHORD')
// })

// Bank App Request Resolver

// register api
app.post('/register', (req, res) => {
    console.log(req.body);
    dataService.register(req.body.acno, req.body.password, req.body.username)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

})

// login api
app.post('/login', (req, res) => {
    console.log(req.body);
    const result = dataService.login(req.body.acno, req.body.pswd)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})


// deposit api
app.post('/deposit', jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataService.deposit(req.body.acno, req.body.pswd, req.body.amt)
    .then(result => {
        res.status(result.statusCode).json(result)
    })
})


// 
// withdraw api
app.post('/withdraw', jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataService.withdraw(req.body.acno, req.body.pswd, req.body.amt)
    .then(result => {
        res.status(result.statusCode).json(result)
    })
})


// getTransaction api
app.post('/getTransaction',jwtMiddleware, (req, res) => {
    console.log(req.body);
    
    try {
        const result = dataService.getTransaction(req.body.acno)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
        }
    catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: 'NO transaction has been done'
        })
    }
})

// onDelete api 
app.delete('/onDelete/:acno',(req,res)=>{
    dataService.onDelete(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

// 4. set up port number
app.listen(3000, () => {
    console.log('Server started at port 3000');
})