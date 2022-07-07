const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler( async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        // get token from header
        // always looks like this:
        // Bearer <token>
        try 
        {
            // if we split by space then it will be 'Bearer' in index 0
            // of the array and the token in index 1 of the array
            token = req.headers.authorization.split(' ')[1]

            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // get user from the token
            req.user = await User.findById(decoded.id).select('-password')

            next()
        } 
        catch (error) 
        {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }
    }
    if (!token)
    {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})  

module.exports = { protect }