/**
 * Created by dev-kevinvanrijmenant on 8/25/15.
 *
 */
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var password = require('./config/passwords');
var authorized = require('./config/authentifizierung');

module.exports = function(router,con){
    router.get('/api/spec/getUser/:id',authorized,function(req,res){
        var id = parseInt(req.params.id);
        var decodetoken = jwt.verify(req.token,password.jwtpw);
        var userdata= {};

        con.query('select * from User_Rechte WHERE user_id = '+decodetoken.id+';', function (err,data) {
            console.log(data);
            if(err){
                console.log(err);
                res.json({type:false,error:"User not found"})
            }else if( data.length == null || data[0].islocked != 0){
                res.sendStatus(403);
            }
            else{
                if(decodetoken.id == id){
                    con.query('select * from User Where User.User_Id = '+id+';',function(err,data){
                        if(err){
                            console.log(err);
                            res.json({type:false,error:"User not found"})
                        }
                        else{
                            userdata.pers = data || null;
                            con.query('select * from User_Termine Where User_Termine.user_id = '+id+';',function(err,data){
                                if(err){
                                    console.log(err);
                                    res.json({data:userdata,acc:true});
                                }
                                else{
                                    userdata.term = data || null;
                                    con.query('select * from Nachrichten Where Nachrichten.Nachrichten_Empfaenger = '+id+';',function(err,data){
                                        if(err){
                                            console.log(err);
                                            res.json({data:userdata,acc:true});
                                        }else{
                                            userdata.mess = data || null;
                                            con.query('select * from Gruppen_User_Match,Gruppen Where Gruppen_User_Match.user_id = '+id+' AND Gruppen_User_Match.gruppen_id = Gruppen.Gruppen_Id;',function(err,data){
                                                if(err){
                                                    console.log(err);
                                                    res.json({data:userdata,acc:true});
                                                }
                                                else{
                                                    userdata.grpp = data;
                                                    con.query('select * from User_Rechte WHERE user_id = '+id+';', function (err,data) {
                                                        if(err){
                                                            console.log(err);
                                                            res.json({data:userdata,acc:true});
                                                        }
                                                        else{
                                                            userdata.rech = data;
                                                            con.query('select * from User,User_Rechte WHERE User.User_Id = User_Rechte.user_id AND User.User_Id != ' +id+' ;',function(err,data){
                                                                if(err){
                                                                    console.log(err);
                                                                    res.json({data:userdata,acc:true});
                                                                }
                                                                else{
                                                                    userdata.list = data;
                                                                    res.json({data:userdata,acc:true});
                                                                }
                                                            })


                                                        }
                                                    })
                                                }

                                            });
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
                else if(decodetoken.id != id) {
                    con.query('SELECT * FROM User_Rechte WHERE user_id = '+decodetoken.id+';',function(err,data){
                        if (err) {
                            console.log(err);
                            res.json({type: false, error: "User not found"})
                        }
                        else if( data.length == 0 || data[0].User_Rechte.read_user == 0){
                            res.sendStatus(403);
                        }
                        else{
                            con.query('select * from User Where User.User_Id = ' + id + ';', function (err, data) {
                                if (err) {
                                    console.log(err);
                                    res.json({type: false, error: "User not found"})
                                }
                                else {
                                    userdata.pers = data || null;
                                    con.query('select * from User_Termine Where User_Termine.user_id = ' + id + ';', function (err, data) {
                                        if (err) {
                                            console.log(err);
                                            res.json({data:userdata,acc:false});
                                        } else {
                                            userdata.term = data || null;
                                            res.json({data:userdata,acc:false});
                                        }
                                    });
                                }
                            });
                        }
                    });

                }
                else{
                    res.sendStatus(403);
                }
            }
        });


    });
    router.post('/api/spec/newUser',authorized,function(req,res){
        var name = req.body.name.toLowerCase(),
            passw = bcrypt.hashSync(req.body.passw,10),
            job = req.body.job;


        con.query('SELECT * FROM Login WHERE Login_Name = "'+name+'";', function (err,data) {
            if (err) {
                console.log(err);
                res.json({type: false});
            }
            else if(data.length >= 1){
                res.json({type: false});
            }else {
            con.query('insert into Login values (null,"' + name + '","' + passw + '");', function (err, data) {
                if (err) {
                    console.log(err);
                    res.json({type: false});
                }
                else {
                    con.query('insert into User values (null,"' + name + '","' + job + '",null,' + data.insertId + ');', function (err, data) {
                        if (err) {
                            console.log(err);
                            res.json({type: false});
                        }
                        else {
                            con.query('insert into User_Rechte values (null,' + data.insertId + ',false,false,false,false,false,false,false);', function (err, data) {
                                if (err) {
                                    console.log(err);
                                    res.json({type: false});
                                } else {
                                    res.json({type: true})
                                }
                            });


                        }

                    });

                }
            });
            }
        });
    });
    router.delete('/api/spec/delUser/:id',authorized,function(req,res){
        var id = parseInt(req.params.id);
        con.query('delete from User, Login USING User, Login WHERE User.login_id = '+id+';',function(err,data){
            if(err){
                console.log(err);
                res.json({type:false});
            }
            else{
                res.json({type:true});
            }
        })
    });

    router.post('/api/spec/newTerm',authorized,function(req,res){
        var userid = req.body.userid,
            titel = req.body.titel,
            text = req.body.text,
            start= req.body.start,
            ende = req.body.ende;

        con.query('insert into User_Termine values (null,'+userid+',"'+start+'","'+ende+'","'+titel+'","'+text+'");',
            function(err,data){
            if(err){
                console.log(err);
                res.json({type:false});
            }
            else {
                res.json({type:true});
            }

        })
    });
    router.delete('/api/spec/delTerm/:id',authorized,function(req,res){
        var id = parseInt(req.params.id);
        con.query('delete from User_Termine WHERE User_Termine.User_Termine_Id = '+id+';',function(err,data){
            if(err){
                console.log(err);
                res.json({type:false});
            }
            else{
                res.json({type:true});
            }
        })
    });

    router.post('/api/spec/sendMess',authorized,function(req,res){
        var absender = req.body.absenderid;
        var empf = req.body.empfaengerid,
            titel = req.body.titel,
            text = req.body.text;

            con.query('insert into Nachrichten values (null,'+absender+','+empf+',"'+titel+'","'+text+'",now());',function(err,data){
                if(err){
                    console.log(err);
                    res.json({type:false});
                }
                else{
                    res.json({type:true});
                }
            })


    });
    router.delete('/api/spec/delMess/:id',authorized,function(req,res){
        var id = parseInt(req.params.id);
        con.query('delete from Nachrichten WHERE Nachrichten.Nachrichten_Id = '+id+';',function(err,data){
            if(err){
                console.log(err);
                res.json({type:false});
            }
            else{
                res.json({type:true});
            }
        })
    });



    router.post('/api/spec/getTerminList/:id',authorized, function () {
        var id =  parseInt(req.params.id);

        con.query('select * from User_Termine WHERE user_id = '+id+';',function(err,data){
            if(err){
                console.log(err);
                res.json({type:false});
            }
            else{
                res.json(data);
            }
        })
    });

    router.post('/api/spec/newGrp',authorized,function(req,res){
        var name = req.body.name.toLowerCase(),
            ersteller = req.body.ersteller;


        con.query('insert into Gruppen values (null,"'+name+'","'+ersteller+'");',function(err,data){
            if(err){
                console.log(err);
                res.json({type:false});
            }
            else{
                var grpid = data.insertId;
                con.query('insert into Gruppen_User_Match values(null,'+grpid+','+ersteller+');',function(err,data){
                    if(err){
                        console.log(err);
                        res.json({type:false});
                    }else{
                        con.query('insert into Gruppen_Rechte values (null,'+grpid+','+ersteller+',true,true,true,true);',function(err,data){
                            if(err){
                                console.log(err);
                            }
                            else{
                                if(ersteller != 1){
                                    con.query('insert into Gruppen_Rechte values (null,'+grpid+',1,true,true,true,true);',function(err,data){
                                        if(err){
                                            console.log(err);
                                        }
                                        else{
                                            res.json({type:true});
                                        }
                                    })
                                }else{
                                    res.json({type:true});
                                }

                            }
                        });

                    }

                });

            }
        })
    });

    router.delete('/api/spec/delGrp/:id',authorized,function(req,res){
        var id = parseInt(req.params.id);
        con.query('delete from Gruppen,Gruppen_User_Match USING Gruppen,Gruppen_User_Match WHERE Gruppen.Gruppen_Id = '+id+' AND Gruppen_User_Match.gruppen_id = '+id+';',function(err,data){
            if(err){
                console.log(err);
                res.json({type:false});
            }
            else{
                res.send({type:true});
            }
        })
    });


    //////////////new////////////////7
    router.post('/api/spec/updateUserRights',authorized,function(req,res){
        var read = req.body.read_user,
            create = req.body.create_user,
            deleteU = req.body.delete_user,
            giveR = req.body.grant_rights,
            createg = req.body.create_grp,
            delg = req.body.delete_grp,
            uid = req.body.User_Id,
            lock = req.body.islocked;

        con.query('UPDATE User_Rechte SET read_user = '+read+', create_user = '+create+',' +
            ' delete_user = '+deleteU+', grant_rights = '+giveR+', create_grp = '+createg+', delete_grp = '+delg+', islocked = '+lock+' WHERE user_id = '+uid+';',function(err,data){
            if(err){
                console.log(err);
                res.json({type:false});
            }
            else{
                res.send({type:true});
            }
        })
    })


};