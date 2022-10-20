const userSchema =require('../models/studentSchema')
const jwt = require('jsonwebtoken')
const secretKey = "8527dcdbdyuqcdfbvhjfb"

exports.authUser = async (req, res, next) => {
    try {

        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const verification = jwt.verify(token, secretKey)
            const user = await userSchema.findById(verification.id)
            console.log('user',user)
            if (user) {
                req.user = user
                next();
            } else {
                res.status(401).json({
                    status: "Unauthorized",
                    message: "Invalid Token"
                })
            }
        }
        else {
            res.status(401).json({
                status: "Unauthorized",
                message: "No token passed"
            })
        }
    }
    catch (e) {
        res.json({
            status: "Error",
            message: 'you are not authorised '
        })

    }
}