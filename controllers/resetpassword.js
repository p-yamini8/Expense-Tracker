const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/users');
const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        console.log("Email is",email)
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
            console.log("uuid",id)
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                                        console.log('forgot password error',err)
                    throw new Error(err)

                })

            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        
            const msg = {
                to: email,
                from: 'yaminifreez1@gmail.com', 
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
            }

            sgMail
            .send(msg)
            .then((response) => {

                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
                throw new Error(error);
            })
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

const resetpassword = async (req, res) => {
    const id = req.params.id;

    try {
        const forgotpasswordrequest = await Forgotpassword.findOne({ where: { id } });

        if (!forgotpasswordrequest || !forgotpasswordrequest.active) {
            return res.status(400).send(`<h2>Invalid or expired reset link</h2>`);
        }


        res.status(200).send(`
            <html>
                <body>
                    <form action="/password/updatepassword/${id}" method="POST">
                        <label for="newpassword">Enter New password</label>
                        <input name="newpassword" type="password" required />
                        <button type="submit">Reset Password</button>
                    </form>
                </body>
            </html>
        `);
    } catch (error) {
        console.error("Reset link error:", error);
        res.status(500).send("<h2>Something went wrong</h2>");
    }
};

const updatepassword = async (req, res) => {
    const { newpassword } = req.body;
    const id = req.params.resetpasswordid;
console.log("new password received:",newpassword)
    try {
        const resetpasswordrequest  = await Forgotpassword.findOne({where:{id}})
        const user = await User.findOne({where:{id:resetpasswordrequest.userId }})
        if(!user){
            return res.status(404).json({ error: 'No user Exists', success: false})
        }

        const saltRounds = 10;
        bcrypt.hash(newpassword, saltRounds, async(err, hash)=>{
            if(err){
                throw new Error(err);
            }
            await user.update({ password:hash })
            res.status(201).json({message: 'Successfuly update the new password'})
        });
    } catch (error) {
        return res.status(403).json({ error, success: false } )
    }
 }


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
 }