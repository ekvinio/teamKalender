/**
 * Created by dev-kevinvanrijmenant on 8/25/15.
 * gruppen.js im Backend
 */
var jwt = require('jsonwebtoken');
var password = require('./config/passwords');
var authorized = require('./config/authentifizierung');

module.exports = function(router,con){
    router.get('/api/spec/getGruppe/:id',authorized,function(req,res) {
        var grpid = req.params.id;
        var group = {};
        var decodetoken = jwt.verify(req.token,password.jwtpw);

        con.query('select * from Gruppen_User_Match WHERE User_id = '+parseInt(decodetoken.id)+';',function(err,data){
            if(err){
                console.log(err);
            }
            else if(data.length == 0){
                res.sendStatus(403);
            }
            else{
                con.query('select * from Gruppen Where Gruppen.Gruppen_Id = ' + grpid + ';', function (err, data) {
                    if (err) {
                        console.log(err);
                        res.json({type: false, error: "User not found"})
                    }
                    else {
                        group.pers = data;
                        con.query('select * from Gruppen_User_Match,User,Gruppen_Rechte WHERE  Gruppen_User_Match.gruppen_id = '+grpid+
                                                                                        ' AND Gruppen_User_Match.user_id = User.User_Id ' +
                                                                                        ' AND Gruppen_Rechte.gruppen_id = '+grpid+'' +
                                                                                        ' AND Gruppen_Rechte.user_id = User.User_Id;',function(err,data){
                            if (err) {
                                console.log(err);
                                res.json(group);
                            }else{
                                group.memb = data;
                                con.query('select * from Gruppen_Termine Where gruppen_id = '+ grpid+';',function(err,data){
                                    if (err) {
                                        console.log(err);
                                    }else{
                                        group.term = data;
                                        con.query('select * From Gruppen_Rechte,User WHERE Gruppen_Rechte.user_id = User.User_Id AND Gruppen_Rechte.gruppen_id = '+grpid+' AND Gruppen_Rechte.user_id = '+parseInt(decodetoken.id)+';',function(err,data){
                                            if (err) {
                                                console.log(err);
                                                res.json(group);
                                            }
                                            else{
                                                group.rech = data;
                                                res.json(group);
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
        });

    router.post('/api/spec/createGrpTermin',authorized,function(req,res){
        var id = req.body.grpid,
            start = req.body.start,
            ende = req.body.ende,
            titel = req.body.titel,
            text = req.body.text;

        con.query('insert into Gruppen_Termine values(null,'+id+',"'+start+'","'+ende+'","'+titel+'","'+text+'");',function(err,data){
            if(err){
                console.log(err);
                res.json({type:false});
            }else{
                res.send({type:true});
            }
        })
    });

    router.delete('/api/spec/delGrpTerm/:id',authorized,function(req,res){
        var id = parseInt(req.params.id);
        con.query('delete from Gruppen_Termine WHERE Gruppen_Termine.Gruppen_Termine_Id = '+id+';',function(err,data){
            if(err){
                console.log(err);
                res.json({type:false});
            }
            else{
                res.send({type:true});
            }
        })
    });
    router.post('/api/spec/inviteUser',authorized,function(req,res){
        var name = req.body.name.toLowerCase(),
            grp = req.body.grpid;
        con.query('SELECT * FROM User WHERE User_Name = "'+name+'";',function(err,data){
            if(err){
                console.log(err);
                res.json({type:false});
            }
            else{
                if(data.length != 0){
                    var id = data[0].User_Id;
                    con.query('INSERT INTO Gruppen_User_Match values (null,'+grp+','+id+');',function(err,data){
                        if(err){
                            console.log(err);
                            res.json({type:false});
                        }
                        else{
                            con.query('INSERT INTO Gruppen_Rechte values (null,'+grp+','+id+',false,false,false,false);',function(err,data){
                                if(err){
                                    console.log(err);
                                    res.json({type:false});
                                }
                                else{
                                    res.send({type:true});
                                }
                            })
                        }
                    })
                }
                else{
                    res.json({type:false});
                }
            }
        })

    });


    router.post('/api/spec/removeUser',authorized,function(req,res){
        var grpid = req.body.grpid,
            userid = req.body.userid;
        con.query('delete from Gruppen_User_Match,Gruppen_Rechte USING Gruppen_User_Match,Gruppen_Rechte WHERE Gruppen_User_Match.gruppen_id = ' +grpid+' ' +
                                                                                                            'AND Gruppen_User_Match.user_id = '+userid+' ' +
                                                                                                            'AND Gruppen_Rechte.gruppen_id = '+grpid+' ' +
                                                                                                            'AND Gruppen_Rechte.user_id = '+userid+';'
            ,function(err,data){
                if(err){
                    console.log(err);
                    res.json({type:false});
                }
                else{
                    console.log(data);
                    res.send({type:true});
                }
        });
    });

    router.post('/api/spec/updateGroupRights',authorized,function(req,res){
        var read = req.body.read_grp,
            invite = req.body.invite_user,
            remove = req.body.remove_user,
            giveR = req.body.grant_rights,
            uid = req.body.User_Id,
            gid  =req.body.gruppen_id;

        con.query('UPDATE Gruppen_Rechte SET read_grp = '+read+', invite_user = '+invite+',' +
            ' remove_user = '+remove+', grant_rights = '+giveR+' WHERE user_id = '+uid+' AND gruppen_id = '+gid+';',function(err,data){
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