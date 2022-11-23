const path = require('path');
const passwordController = require('../controllers/passwordController')

const middlewareAuthentication = require('../middleware/auth')

const express = require('express');


const router = express.Router();
/*
router.use('/forgot',middlewareAuthentication.authentication,passwordController.Forgotpassword)
// password/forgotpassword
router.get('/reset/:id',middlewareAuthentication.authentication,passwordController.resetPassword)
router.post('/update/:resetpassid',middlewareAuthentication.authentication,passwordController.updatePassword)
*/






router.get('/reset/:id',passwordController.resetPassword)


router.get('/update/:resetpassid',passwordController.updatePassword)

router.use('/forgot',passwordController.Forgotpassword)

module.exports = router;