/**
 * Created by dev-kevinvanrijmenant on 8/25/15.
 * login.js im Backend
 */
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var password = require('./config/passwords');

module.exports = function(router,con){
    router.post('/api/login',function(req,res){
        var name = req.body.name;
        var passw = req.body.passw;

        con.query('SELECT * FROM Login,User WHERE Login.Login_Id = User.login_id AND Login.Login_Name = "'+name+'";',function(err,data){

            if(err){
                res.json({type:false,error:"wrong User or Password!"})
            }

            else if(data.length == 0){
                res.json({type:false,error:"wrong User or Password!"})
            }
            else if(data.length == 1){
                if(bcrypt.compareSync(passw,data[0].Login_Passw)){
                    con.query('SELECT * FROM User WHERE login_id = '+data[0].Login_Id+';',function(err,data){

                        if(err){
                            res.json({type:false,error:"wrong User or Password!"})
                        }
                        else{

                            var userData = {
                                name:data[0].User_Name,
                                id:data[0].User_Id
                            };
                            var token = jwt.sign(userData,password.jwtpw,{expiresInMinutes:60});
                            res.json({type:true,data:userData,token:token});
                        }
                    });
                }else{
                    res.json({type:false,error:"wrong User or Password!"})
                }
            }
        });
    });
};
