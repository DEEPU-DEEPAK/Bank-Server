// Import jsonwebtoken
const jwt = require('jsonwebtoken')

// import db 
const db = require('./db')

userDetails = {
  1000: { acno: 1000, username: 'Appu', password: 1000, balance: 5000, transaction: [] },
  1001: { acno: 1001, username: 'Nelu', password: 1001, balance: 6000, transaction: [] },
  1002: { acno: 1002, username: 'Anju', password: 1002, balance: 4000, transaction: [] }

}

// Register
const register = (acno, password, username) => {
  // asynchronus
  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          statusCode: 401,
          status: false,
          message: 'User already exist... please LogIn'
        }
      }
      else {
        const newUser = new db.User({
          acno,
          username,
          password,
          balance: 0,
          transaction: []
        })
        newUser.save()
        return {
          statusCode: 200,
          status: true,
          message: 'Successfully Register'
        }
      }
    })
}


// LogIn
const login = (acno, pswd) => {
  return db.User.findOne({
    acno,
    password: pswd
  })
    .then(user => {
      if (user) {
        currentUsername = user.username
        currentacno = acno

        // token generation
        const token = jwt.sign({
          currentacno: acno
        }, "supersecretekey12345")
        return {
          statusCode: 200,
          status: true,
          message: 'LogIn Successfully',
          currentUsername,
          currentacno,
          token
        }
      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: 'Incorrect account number / Password'
        }
      }
    })
}


// Deposit
const deposit = (acno, pswd, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({
    acno,
    password: pswd
  })
    .then(user => {
      if (user) {
        user.balance += amount
        user['transaction'].push({
          type: 'credit',
          amount
        })
        user.save()
        return {
          statusCode: 200,
          status: true,
          message: `${amount} credited. New Balance is ${user.balance}`
        }
      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: 'Incorrect password or acno'
        }
      }
    })

}

// Withdraw
const withdraw = (acno, pswd, amt) => {
  var amount = Number(amt)
  return db.User.findOne({
    acno,
    password: pswd
  })
    .then(user => {
      if (user) {
        if (user.balance > amount) {
          user.balance -= amount
          user['transaction'].push({
            type: 'debit',
            amount
          })
          user.save()
          return {
            statusCode: 200,
            status: true,
            message: `${amount} credited. New Balance is ${user.balance}`
          }
        }
        else {
          return {
            statusCode: 401,
            status: false,
            message: 'Insufficient Balance'
          }
        }

      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: 'Incorrect password or acno'
        }
      }
    })
}


// Transaction
const getTransaction = (acno) => {
  return db.User.findOne({
    acno
  })
  .then(user=>{
    if(user){
      return {
        statusCode: 200,
        status: true,
        transaction: user['transaction']
      }
    }
    else{
      return {
        statusCode: 401,
        status: false,
        message: 'Incorrect Account number'
      }
    }
  })

}

// onDelete
const onDelete = (acno)=>{
  return db.User.deleteOne({acno})
  .then(result=>{
    if (result) {
      return {
        statusCode: 200,
        status: true,
        message:'Delete Sucessfully'
      }
      
    }
    else{
      return {
        statusCode: 401,
        status: false,
        message: 'Incorrect Account number'
      }

    }
  })
}

// to export 
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  onDelete
}