 const fs = require('fs');
 const path = require('path');
 const bcryptjs = require('bcryptjs');
 const { validationResult } = require ('express-validator');


 

 function getAllUsers() {
    const file = path.join(__dirname, '../database/users.json');
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
 }

 function generateNewId() {
     const users = getAllUsers();
     return users.pop().id + 1;
 }

 function writeUser(user) {
     
     const file = path.join(__dirname, '../database/users.json');
     const users = getAllUsers();
     const usersToSave = [...users, user];
     const userToJson = JSON.stringify(usersToSave, null, " ");
     fs.writeFileSync(file, userToJson);
 }
 
 const controller = {

    showRegister: (req, res) => {
        
        return res.render('user/user-register-form')

    },
    processRegister: (req, res) => {
        
        const results = validationResult(req);

        if(!results.isEmpty()){
            return res.render("user/user-register-form", {
                errors: results.errors,
                old: req.body
            });
        }

		const user = {
			id: generateNewId(),
			email: req.body.email,
            password: bcryptjs.hashSync(req.body.password, 10),
            avatar: req.files[0].filename
		}
		writeUser(user);
		res.redirect('/');
    },
    showLogin: (req, res) => {

        res.render('user/user-login-form')
    },
    processLogin: (req, res) => {

        const results = validationResult(req);
        const email = req.body.email;
        const password = req.body.password;
        const users = getAllUsers();

        if(!results.isEmpty()){
            return res.render("user/user-login-form", {
                errors: results.errors,
                old: req.body
            });
        }

        const userExist = users.find((user) => {
            return user.email === email;
        });
        req.session.userLog = userExist;

        if (userExist && bcryptjs.compareSync(password, userExist.password)) {
			if (req.body.remember) {
				res.cookie('user', userExist.id, { maxAge: 1000 * 60 * 60 });
			}

            req.session.email = email;

			return res.redirect('/');
        }

		res.redirect('/user/login');

    },
    showProfile: (req, res) => {

        const sessionUser = req.session.userLog;

        return res.render('user/profile', { sessionUser: sessionUser });
    },
    logout: (req, res) => {

        res.clearCookie('user')
        req.session.destroy();
        return res.redirect('/');
    }

};

module.exports = controller