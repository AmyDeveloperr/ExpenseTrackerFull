const User = require('../models/user')
const Forgotpassword = require('../models/forgotPassword');
const sgMail = require('@sendgrid/mail');


const bcrypt = require('bcrypt');

const uuid = require('uuid');

const sib = require('sib-api-v3-sdk');


require('dotenv').config();
/*
const client = sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY
const tranEmailApi = new sib.TransactionalEmailsApi()
const {email} =req.body ;
const sender = {
    email : email
}
const reciever = [
    {
        email : 'shaikhiliyas343@gmail.com',
    }
]
tranEmailApi.sendTransacEmail({
    sender,
    to: reciever,
    subject: 'forgotpass',
    textContent: `
    let solve forgot  password`
}).then(console.log()).catch(err=>console.log(err))
*/
// exports.Forgotpassword = async(req,res,next)=>{
//     const {email} =req.body ;

//     const user = await User.findOne({where:{email}});

//     const id = uuid.v4();

//     console.log(id);

//     user.createForgotpassword({id,active:true}).catch(err=>{ throw new Error(err)})

//     console.log('into forgot');

//     console.log(email);

//     const client = sib.ApiClient.instance

//     const apiKey = client.authentications['api-key']

//     apiKey.apiKey = process.env.API_KEY


//     const tranEmailApi = new sib.TransactionalEmailsApi()


   

    
//     const sender = {
//         email : 'amar321dombe@gmail.com',
//         name : 'Admin_Amar'
//     }

//     //console.log(sender);
//    // const token = localStorage.getItem('token')

    
//     const recievers = [
//         {
//             email : email,
//         },
//     ]
//     console.log(recievers);

//     console.log('******************************');

//     tranEmailApi.sendTransacEmail({
//         sender,
//         to: recievers,
//         subject: 'forgotpass please reset',
//         textContent: `Follow the link and reset password`,
//         htmlContent: `Click on the link below to reset password <br> <a href="http://localhost:5000/pass/reset/${id}">Reset password</a>`,

//     }).then((response)=>{
//         //console.log('after transaction');
//         return res.status(202).json({sucess: true, message: "password mail sent Successful"});
//     }).catch(err=>console.log(err))
    

// }

exports.Forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })

            sgMail.setApiKey(process.env.SENGRID_API_KEY)

            const msg = {
                to: 'amar321dombe@gmail.com', // Change to your recipient
                from: 'amar321dombe@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:5000/pass/reset/${id}">Reset password</a>`,
            }

            sgMail  
            .send(msg)
            .then((response) => {

                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(202).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
                throw new Error(error);
            })

            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

// exports.resetPassword = async (req,res,next)=>{
//     console.log('into reset');
//     let  id = req.params.id ;

//     try {
//         let forgotpasswordrequest = await Forgotpassword.findOne({where:{id}})
//         if(!forgotpasswordrequest){
//             return res.status(404).json('User doesnt exist')
//         }
//         forgotpasswordrequest.update({ active:false });
//         /*res.status(200).send(`<html>
//                                     <script>
//                                         function update(event){
//                                             event.preventDefault();
                                            
//                                             const newpassword = event.target.newpassword.value;
//                                             const obj = {
//                                                 newpassword
//                                             }
//                                             axios.post("http://localhost:5000/pass/update/${id}", obj ).then(response=>console.log(response)).catch(err=>console.log(err))
//                                             console.log('called')
//                                         }
//                                     </script>
//                                     <form onSubmit="update(e)" method="POST">
//                                         <label for="newpassword">Enter New password</label>
//                                         <input name="newpassword" type="password" required></input>
//                                         <button type="submit">reset password</button>
//                                     </form>
//                                 </html>`
//                                 )
//             res.end();*/
//             res.status(200).send(`<html>
//                                     <script>
//                                         function formsubmitted(e){
//                                             e.preventDefault();
//                                             console.log('called')
//                                         }
//                                     </script>
//                                     <form action="/pass/update/${id}" method="POST">
//                                         <label for="newpassword">Enter New password</label>
//                                         <input name="newpassword" type="password" required></input>
//                                         <button>reset password</button>
//                                     </form>
//                                 </html>`
//                                 )
//             res.end();
//     } catch (err) {
//         return res.status(500).json({ message: err});
//     }


// }

exports.resetPassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/pass/update/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

// exports.updatePassword = async(req,res,next)=>{
//     console.log('into update');
//     const { newpassword } = req.query;
//     const id = req.params.resetpasswordid;

//    // const token = localStorage.getItem('token')

//     console.log(typeof(newpassword) ) 
//     try {
//         const resetpasswordrequest  = await Forgotpassword.findOne({where:{id}})
//         const user = await User.findOne({where:{id:resetpasswordrequest.userId }})
//         if(!user){
//             return res.status(404).json({ error: 'No user Exists', success: false})
//         }

//         const saltRounds = 10;
//         bcrypt.hash(newpassword, saltRounds, async(err, hash)=>{
//             if(err){
//                 throw new Error(err);
//             }
//             await user.update({ password:hash })
//             res.status(201).json({message: 'Successfuly update the new password'})
//         });
        

//     } catch (error) {
//         return res.status(403).json({ error, success: false } )
//     }
// }

exports.updatePassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly updated the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}