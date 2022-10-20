const studentSchema = require("../models/studentSchema")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secretKey = "8527dcdbdyuqcdfbvhjfb"
exports.signup = async (req, res, next) => {
    try {
        const { StudentName, StudentEmail, password  , StudentNumber} = req.body
        const emailExists = await studentSchema.exists({ StudentEmail: StudentEmail });
        const phoneExists = await studentSchema.exists({ StudentNumber: StudentNumber });
        const phoneNo = /^[6-9]\d{9}$/.test(StudentNumber)
        const emailAddr = /^\S+@\S+\.\S+$/.test(StudentEmail)
        console.log(req.body)
        // console.log(emailAddr)
        if (emailExists) {
          return res.status(409).json({
            status: "error",
            message: "User already exists with the same email."
          })
        }
        else if (phoneExists) {
          res.status(409).json({
            status: "error",
            message: "User already exists with the same phone number."
          })
        }

        else if (!phoneNo) {
          return res.status(400).json({
            status: "Error",
            message: "Invalid Phone Number"
          })
        }
        // Email validation
        else if (!emailAddr) {    
          return res.status(400).json({
            status: "Error",
            message: "Invalid Email Address"
          })
        }
        else {

            let encryptedPassword = await bcrypt.hash(password, 10)
            let finalUser = new studentSchema({
                StudentName: StudentName,
                StudentEmail: StudentEmail,
                StudentNumber:StudentNumber,
                password: encryptedPassword
            })
            finalUser.save()
            res.json({
                "msg": "User singed up",
                StudentName: finalUser.StudentName,
                StudentNumber: finalUser.StudentNumber,
                StudentEmail: finalUser.StudentEmail,
                id: finalUser._id
            })
        }


    }
    catch (e) {
        next(e)
    }
}
exports.signin = async (req, res, next) => {
    const { StudentEmail, password } = req.body
    try {

        const user = await studentSchema.findOne({ StudentEmail: StudentEmail })
        if (!user) {
            res.status(404).json({
                "status": "error",
                "msg": "email not exist"
            })
        }
        else {
            await bcrypt.compare(password, user.password, async function (err, isMatch) {
                if (err) {
                    res.json({
                        "error": err
                    })
                } else {
                    if (!isMatch) {
                        res.status(400).json({
                            "msg": "please check your password"
                        })
                    }
                    else if (isMatch) {
                        const token = jwt.sign(
                            {
                                id: user._id,
                            },
                            secretKey
                        );
                        await studentSchema.findOneAndUpdate({ id: user._id }, { $set: { jwtToken: token } })
                        const loggedInUserDetails = {
                            id: user._id,
                            StudentName: user.StudentName,
                            StudentEmail: user.StudentEmail,
                            StudentNumber: user.StudentNumber,
                        }
                        return res.status(200).json({
                            msg: "logged in",
                            status: 'ok',
                            loggedInUserDetails,
                            token: token
                        })
                    }
                }
            })
        }
    } catch (e) {
        next(e)
    }
}


exports.updateStudent = async (req, res ,next) => {
    try {
        const { id } = req.body
        await studentSchema.findByIdAndUpdate(id, req.body)
        res.json({
            "msg": "Profile updated",
        })

    }
    catch (e) {
        next(e)
    }

}

exports.deleteStudent = async (req, res ,next) => {
    try {
        const { id } = req.body
        await studentSchema.findByIdAndDelete(id, req.body)
        res.json({
            "msg": "Profile Deleted",
        })

    }
    catch (e) {
        next(e)
    }
}

