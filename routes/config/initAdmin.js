/**
 * Created by dev-kevinvanrijmenant on 8/25/15.
 * initadmin.js im Backend
 */
var bcrypt = require('bcrypt');
var passwords = require('./passwords');


module.exports = function(con){
    var superadimpw = bcrypt.hashSync(passwords.bcryptpw,10);
    con.query('SELECT * FROM Login WHERE Login_Name = "SUPERADMIN";',function(err,data){
        if(err){
            console.log(err);
        }
        else if(data.length ==  1){
            console.log("Superadmin in Login exists");
        }
        else{
            con.query('insert into Login values (1,"SUPERADMIN","'+superadimpw+'");',function(err,data){
            if(err){
                console.log(err);
            }else{
                console.log("SUPERADMIN in Login created!");
                con.query('SELECT * FROM User WHERE login_id ='+data.insertId+';',function(err,data){
                    if(err){
                        console.log(err);
                    }
                    else if(data.length ==  1){
                        console.log("Superadmin in User exists");
                    }
                    else{
                        con.query('insert into User values (1,"SUPERADMIN","SUPERADMIN",null,1);',function(err,data){
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log("SUPERADMIN in User created!");
                            }
                        });
                        con.query('insert into User_Rechte values (null,1,true,true,true,true,true,true,false);',function(err,data){
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log("SUPERADMIN in User_Rechte created!");
                                con.query('SET FOREIGN_KEY_CHECKS=0;',function(err,data){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log("Foreign Keys Disabled")
                                    }
                                })

                            }
                        })

                    }
                })
            }
            });

        }
    })
};