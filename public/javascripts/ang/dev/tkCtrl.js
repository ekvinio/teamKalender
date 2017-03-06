/**
 * Created by root on 8/24/15.
 */
terminKalender.controller('logout',function($scope,$rootScope,$sessionStorage,$location){
    $scope.userLogged = false;
    $scope.$on('isLogged',function(){
        $scope.userLogged = true;
    });
    $scope.$on('isntLogged',function(){
        $scope.userLogged = false;
    });
    $scope.logout = function(){
        $sessionStorage.$reset();
        $location.path('/login');
        $rootScope.$broadcast('isntLogged',null);
    };
});
terminKalender.controller('userCtrl',function($scope,$rootScope,$location,$routeParams,$sessionStorage,userService){
    $scope.userTermine = false;
    $scope.userMessages = false;
    $scope.userLogged = $rootScope.userLogged;


    userService.getUser($routeParams.id).success(function(res) {
        var data = res.data;
        $scope.successmessage = ''+res.data.pers[0].User_Name;
        $scope.successvis = true;
        if(res.acc == true){

            $scope.pers = data.pers || null;
            $scope.mess = data.mess || null;
            $scope.term = data.term || null;
            $scope.grpp = data.grpp || null;
            $scope.rech = data.rech || null;
            if(data.list != null){
                $scope.list = parseRightsUser(data.list);
            }


            $scope.acc = true;

            $rootScope.$broadcast('isLogged',null);
        }else{

            $scope.pers = res.data.pers;
            $scope.term = res.data.term;
            $scope.acc = false;
        }

    });

    $scope.switchUserTermine = function(){
        if($scope.userTermine){
            $scope.userTermine = false;
        }
        else{
            $scope.userTermine = true;
        }
    };
    $scope.switchUserMessages = function(){
        if($scope.userMessages){
            $scope.userMessages = false;
        }else{
            $scope.userMessages = true;
        }
    };
    $scope.switchUserCreate = function(){
        if($scope.switchUser){
            $scope.switchUser = false;
        }
        else{
            $scope.switchUser = true;
        }
    };
    $scope.switchGrpCreate = function(){
        if($scope.switchGrp){
            $scope.switchGrp = false;
        }else{
            $scope.switchGrp = true;
        }
    };


    $scope.updateUserRights = function(data){
        userService.updateUserRights(data).success(function(res){
            if(res.type == true){
                $scope.successvis = true;
                $scope.successmessage = "Rechte updaten funktioniert";
                userService.getUser($routeParams.id).success(function(res){
                    if(data.list != null){
                        $scope.list = parseRightsUser(res.data.list);
                    }

                })
            }
            else{
                $scope.errormessage = "Rechte updaten nicht funktioniert";
                $scope.successvis = false;
            }
        })
    };



    $scope.sendMess = function(){
        if($scope.newmess.empfaengerid != null) {
            $scope.newmess.absenderid = $scope.pers[0].User_Id;

            if ($scope.list.length != null) {
                for (var i = 0; i < $scope.list.length; i++) {
                    if ($scope.list[i].User_Name.indexOf($scope.newmess.empfaengerid) != -1) {
                        $scope.newmess.empfaengerid = $scope.list[i].User_Id;
                    }
                }
            }
        }


        if($scope.newmess.empfaengerid != null) {
            userService.sendMess($scope.newmess).success(function (res) {
                if (res.type == true) {
                    $scope.userMessages = false;
                    $scope.successmessage = "Nachricht senden hat Funtioniert!";
                    $scope.successvis = true;
                } else {
                    $scope.errormessage = "Nachricht senden hat nicht Funtioniert!";
                    $scope.successvis = false;
                }
            });
        }
    };

    $scope.deleteMess = function(id){
        userService.deleteMess(id).success(function(res){
            if(res.type == true){
                userService.getUser($routeParams.id).success(function(res){
                    $scope.mess = res.data.mess;
                    $scope.successmessage = "Nachricht löschen hat Funtioniert!";
                    $scope.successvis = true;
                });
            }else{
                $scope.errormessage = "Nachricht löschen hat nicht Funtioniert!";
                $scope.successvis = false;
            }
        });
    };



    $scope.createTermin = function(){
        var truedate = true;
        var arrstart = [],arrende = [];
        var strstart,strende;

        if($scope.newterm.start != null && $scope.newterm.ende != null){
                arrstart = $scope.newterm.start.split(" ");
                arrende = $scope.newterm.ende.split(" ");
                strstart = arrstart[0]+"T"+arrstart[1];
                strende = arrende[0]+"T"+arrende[1];

            if(strstart.match("/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/") == false ||
                strende.match("/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/") == false){
                $scope.errormessage = "Termin falsches Format!";
                $scope.successvis = false;
                truedate = false;
            }
            if(new Date() > new Date(strstart) || new Date() > new Date(strende)){
                $scope.errormessage = "Termin liegt in der Vergangenheit!";
                $scope.successvis = false;
                truedate = false;
            }
            else if(new Date(strstart) > new Date(strende)){
                $scope.errormessage = "Termin Ende ist aelter als der Start!";
                $scope.successvis = false;
                truedate = false
            }
        }
        else{
            $scope.errormessage = "Termin erstellen hat nicht Funtioniert!";
            $scope.successvis = false;
            truedate = false;
        }




        if(truedate){
                $scope.newterm.userid = $scope.pers[0].User_Id;
                userService.newTerm($scope.newterm).success(function(res){
                    if(res.type == true){
                        userService.getUser($routeParams.id).success(function(res){
                            $scope.term = res.data.term;
                            $scope.userTermine = false;
                            $scope.successmessage = "Termin erstellen hat Funtioniert!";
                            $scope.successvis = true;
                        });
                    }else{
                        $scope.errormessage = "Termin erstellen hat nicht Funtioniert!";
                        $scope.successvis = false;
                    }

                })
        }


    };

    $scope.deleteTermin = function(id){
        userService.deleteTerm(id).success(function(res){
            if(res.type == true){
                userService.getUser($routeParams.id).success(function(res){
                    $scope.term = res.data.term;
                    $scope.successmessage ="Termin löschen hat Funtioniert!";
                    $scope.successvis = true;
                });
            }else{
                $scope.errormessage = "Termin löschen hat nicht Funtioniert!";
                $scope.successvis = false;
            }
        });
    };

    $scope.createUser = function(){
        if($scope.newuser != null){
            userService.newUser($scope.newuser).success(function(res){
                if(res.type == true){
                    userService.getUser($routeParams.id).success(function(res){
                        if(res.data.list != null){
                            $scope.list = parseRightsUser(res.data.list);
                            $scope.successmessage = "User erstellen hat Funtioniert!";
                            $scope.successvis = true;
                        }

                    });
                }
                else{
                    $scope.errormessage = "User erstellen hat nicht Funtioniert!";
                    $scope.successvis = false;
                }

            })
        }
        else{
            $scope.errormessage = "User erstellen hat nicht Funtioniert!";
            $scope.successvis = false;
        }

    };
    $scope.deleteUser = function(id){
        userService.deleteUser(id).success(function(res){
            if(res.type == true){
                userService.getUser($routeParams.id).success(function(res){
                    if(res.data.list != null){
                        $scope.list = parseRightsUser(res.data.list);
                        $scope.successmessage = "User löschen hat Funtioniert!";
                        $scope.successvis = true;
                    }
                });
            }else{
                $scope.errormessage = "User löschen hat nicht Funtioniert!";
                $scope.successvis = false;
            }
        });
    };

    $scope.createGrp = function(){
        if($scope.newgrp != null){
            $scope.newgrp.ersteller = $routeParams.id;
            userService.newGrp($scope.newgrp).success(function(res){
                if(res.type == true){
                    userService.getUser($routeParams.id).success(function(res){
                        $scope.grpp = res.data.grpp;
                        $scope.successmessage = "Gruppen erstellen hat Funtioniert!";
                        $scope.successvis = true;
                    });
                }else{
                    $scope.errormessage = "Gruppen erstellen hat nicht Funtioniert!";
                    $scope.successvis = false;
                }

            })
        }else{
            $scope.errormessage = "Gruppen erstellen hat nicht Funtioniert!";
            $scope.successvis = false;
        }

    };
    $scope.deleteGrp = function(id){
        userService.deleteGrp(id).success(function(res){
            if(res.type == true){
                userService.getUser($routeParams.id).success(function(res){
                    $scope.grpp = res.data.grpp;
                    $scope.successmessage = "Gruppen löschen hat Funtioniert!";
                    $scope.successvis = true;
                });
            }else{
                $scope.errormessage = "Gruppen löschen hat nicht Funtioniert!";
                $scope.successvis = false;
            }
        });
    };

                    
});


terminKalender.controller('groupCtrl',function($scope,$rootScope,$location,$routeParams,$sessionStorage,gruppenService){
    $scope.userLogged = $rootScope.userLogged;
    gruppenService.getGruppe($routeParams.id).success(function(res){

        $scope.pers = res.pers || null;
        $scope.memb = parseRightsGrp(res.memb)|| null;
        $scope.term = res.term|| null;
        $scope.rech = res.rech || null;

        $scope.successmessage = ''+res.pers[0].Gruppen_Name;
        $scope.successvis = true;
        
        $rootScope.$broadcast('isLogged',null);
    });

    $scope.updateGroupRights = function(data){
        gruppenService.updateGroupRights(data).success(function(res){
            if(res.type == true){
                gruppenService.getGruppe($routeParams.id).success(function(res){
                    $scope.memb = parseRightsGrp(res.memb);
                    $scope.successmessage = "Updaten der Gruppenrechte hat Funtioniert!";
                    $scope.successvis = true;
                })
            }
            else{
                $scope.errormessage = "Updaten der Gruppenrechte hat nicht Funtioniert!";
                $scope.successvis = false;
            }
        })
    };


    $scope.switchGruppenTermine = function(){
        if($scope.gruppenTermine){
            $scope.gruppenTermine = false;
        }
        else{
            $scope.gruppenTermine = true;
        }
    };

    $scope.createGruppenTermin = function(){
        var truedate = true;
        var arrstart = [],arrende = [];
        var strstart,strende;

        if($scope.newterm.start != null && $scope.newterm.ende != null){
            arrstart = $scope.newterm.start.split(" ");
            arrende = $scope.newterm.ende.split(" ");
            strstart = arrstart[0]+"T"+arrstart[1];
            strende = arrende[0]+"T"+arrende[1];

            if(strstart.match("/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/") == false ||
                strende.match("/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/") == false){
                $scope.errormessage = "Termin falsches Format!";
                $scope.successvis = false;
                truedate = false;
            }
            if(new Date() > new Date(strstart) || new Date() > new Date(strende)){
                $scope.errormessage = "Termin liegt in der Vergangenheit!";
                $scope.successvis = false;
                truedate = false;
            }
            else if(new Date(strstart) > new Date(strende)){
                $scope.errormessage = "Termin Ende ist aelter als der Start!";
                $scope.successvis = false;
                truedate = false
            }
        }
        else{
            $scope.errormessage = "Termin erstellen hat nicht Funtioniert!";
            $scope.successvis = false;
            truedate = false;
        }

        if(truedate){
            $scope.newterm.grpid = $routeParams.id;
            gruppenService.newGrpTermin($scope.newterm).success(function(res){
                if(res.type == true){
                    gruppenService.getGruppe($routeParams.id).success(function(res){
                        $scope.term = res.term;
                        $scope.gruppenTermine = false;
                        $scope.successmessage = "Termin entfernen erstellen hat Funtioniert!;";
                        $scope.successvis = true;
                    });
                }else{
                    $scope.errormessage = "Termin erstellen hat nicht Funtioniert!";
                    $scope.successvis = false;
                }

            })
        }else{
            $scope.errormessage = "Termin erstellen hat nicht Funtioniert!";
            $scope.successvis = false;
        }

    };
    $scope.deleteGrpTermin = function(id){
        gruppenService.delGrpTermin(id).success(function(res){
            if(res.type == true){
                gruppenService.getGruppe($routeParams.id).success(function(res){
                    $scope.term = res.term;
                    $scope.successmessage = "Termin entfernen erstellen hat Funtioniert!";
                    $scope.successvis = true;
                });
            }else{
                $scope.errormessage = "Termin entfernen hat nicht Funtioniert!";
                $scope.successvis = false;
            }
        });
    };
    $scope.inviteUser  =  function() {
        if($scope.invuser != null){
            var newgrpuser = {
                grpid : $routeParams.id,
                name : $scope.invuser.name.toLowerCase()
            };
            gruppenService.inviteUser(newgrpuser).success(function (res) {
                if (res.type == true) {
                    gruppenService.getGruppe($routeParams.id).success(function (res) {
                        $scope.memb = parseRightsGrp(res.memb);
                        $scope.successmessage = "User in die Gruppe einladen hat Funtioniert!";
                        $scope.successvis = true;
                    });
                }
                else{
                    $scope.errormessage = "User in die Gruppe einladen hat nicht Funtioniert!";
                    $scope.successvis = false;
                }
            });
        }
        else{
            $scope.errormessage = "User in die Gruppe einladen hat nicht Funtioniert!";
            $scope.successvis = false;
        }

    };
    $scope.removeUser = function(id) {
        var deletegrp = {
            grpid : $routeParams.id,
            userid : id
        };
        gruppenService.removeUser(deletegrp).success(function (res) {
            if (res.type == true) {
                gruppenService.getGruppe($routeParams.id).success(function (res) {
                    $scope.memb = parseRightsGrp(res.memb);
                    $scope.successmessage = "User von der Gruppen entfernen hat Funtioniert!";
                    $scope.successvis = true;
                });
            }else{
                $scope.errormessage = "User von der Gruppen entfernen hat nicht Funtioniert!";
                $scope.successvis = false;
            }
        });
    }

    $scope.switchUserCreate = function(){
        if($scope.switchUser){
            $scope.switchUser = false;
        }
        else{
            $scope.switchUser = true;
        }
    };

});

terminKalender.controller('loginCtrl',function($scope,$rootScope,$location,$sessionStorage,loginService){

    $scope.tkLogin = function(){
        if($scope.login.name !== null && $scope.login.passw){
            loginService.postLogin($scope.login)
                .success(
                function(res){
                    
                    if(res.type == true){
                        $sessionStorage.token = res.token;
                        $location.path('/user/'+res.data.id);
                        $rootScope.userLogged = true;
                        $rootScope.$broadcast('isLogged',null);
                    }
                    else{
                        $scope.errmessage = res.error;
                        $scope.errorvis = true;
                        $location.path('/login');
                        $rootScope.userLogged = false;
                        $rootScope.$broadcast('isntLogged',null);

                    }

                })
        }else{
            $scope.errmessage = "Daten Unvollstaendig!";
        }

    };

});
