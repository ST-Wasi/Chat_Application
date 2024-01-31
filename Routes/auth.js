const express = require('express');
const User = require('../models/User');
const router = express.Router();
const passport = require("passport");

router.post('/signup', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        await User.register(user, password);
        res.status(201).send({ msg: "User Created Successfully" });
    } catch (error) {
        res.status(500).send(`Internal Server Error ${error}`);
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({ message: 'Authentication successful', user });
        });
    })(req, res, next);
});

router.get('/logout',(req,res)=>{
    try {
        req.logout(()=>{
            res.status(201).send({msg: 'loged out sucesfully'})
        })
        res.redirect('/login')
    } catch (error) {
        res.status(500).send({msg: 'Internal Server Error While Logout'})
    }
    
})

router.post('/forgot-password',async (req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email});

    if(!user){
        req.flash('error','Email Is Not Registered With Us')
        return res.redirect('/login');
    }

    crypto.randomBytes(20, async (err,buf)=>{
        const token = buf.toString('hex');
        await User.updateOne({ email }, { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 });

            let transporter = nodemailer.createTransport({
                service: process.env.SERVICE,
                auth:{
                    user: process.env.EMAIL,
                    pass: process.env.PASS
                }
            });

            let mailOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Password Reset',
                html: `
                <p style="font-family: Arial, sans-serif; color: #333;">You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p style="font-family: Arial, sans-serif; color: #333;">Please click on the following link, or paste this into your browser to complete the process:</p>
                <p style="font-family: Arial, sans-serif; color: #007BFF;"><a href="http://${req.headers.host}/reset/${token}" style="color: #007BFF; text-decoration: none;">Reset Password</a></p>
                <p style="font-family: Arial, sans-serif; color: #333;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
            };

            transporter.sendMail(mailOptions, (error,info)=>{
                if(error){
                    req.flash('error','An error occurred while sending the email.')
                } else{
                    req.flash('success', 'Please check your email for further instructions.');
                }
                res.redirect('/forgot');
            })
        })
    })

    router.get('/reset/:token',async (req,res)=>{
        try {
            const {token} = req.params;
            if(!token){
                req.flash('error','Invalid Link Pleae Reset Again OR Contact Support')
                return res.redirect('/login')
            }
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            });
            if (!user) {
                req.flash('error', 'Password reset Link is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('auth/reset', { token });
        } catch (error) {
            req.flash('error','Internal Server Error')
            return res.redirect('/forgot')
        }
    });
    router.post('/reset/:token', async (req, res) => {
        const { token } = req.params;
        const { newPassword, confirmNewPassword } = req.body;
        const user = await User.findOne({resetPasswordToken:token})
        await user.setPassword(newPassword);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
    
        req.flash('success', 'Password has been reset successfully. Please log in with your new password.');
        res.redirect('/login');
    });
module.exports = router;
