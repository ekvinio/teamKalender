/**
 * Created by root on 8/24/15.
 */
terminKalender.factory('loginService',function($http){
    return{
        postLogin : function(data) {
            return $http.post('/api/login', data);
        }
    }
});

terminKalender.factory('userService',function($http){
    return{
        getUser : function(id){
            return $http.get('/api/spec/getUser/'+id);
        },

        newUser : function(data){
            return $http.post('/api/spec/newUser',data);
        },
        deleteUser : function(id){
            return $http.delete('/api/spec/delUser/'+id);
        },

        newGrp : function(data){
            return $http.post('/api/spec/newGrp',data);
        },
        deleteGrp : function(id){
            return $http.delete('/api/spec/delGrp/'+id);
        },

        newTerm : function(data){
            return $http.post('/api/spec/newTerm',data);
        },
        deleteTerm: function(id){
            return $http.delete('/api/spec/delTerm/'+id);
        },
        sendMess : function(data){
            return $http.post('/api/spec/sendMess',data);
        },
        deleteMess: function(id){
            return $http.delete('/api/spec/delMess/'+id);
        },
        updateUserRights: function(data){
            return $http.post('/api/spec/updateUserRights',data);
        }

    }
});

terminKalender.factory('gruppenService',function($http){
    return{
        getGruppe : function(id){
            return $http.get('/api/spec/getGruppe/'+id);
        },
        newGrpTermin : function(data){
            return $http.post('/api/spec/createGrpTermin',data);
        },
        delGrpTermin : function(id){
            return $http.delete('/api/spec/delGrpTerm/'+id);
        },
        inviteUser : function (data) {
            return $http.post('/api/spec/inviteUser',data);

        },
        removeUser : function(data){
            return $http.post('/api/spec/removeUser',data);
        },
        updateGroupRights  : function(data){
            return $http.post('/api/spec/updateGroupRights',data);
        }
    }
});

terminKalender.config(function ($httpProvider) {
    $httpProvider.interceptors.push(['$q', '$location', '$sessionStorage', function($q, $location, $sessionStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($sessionStorage.token) {
                    config.headers.Authorization = 'Token ' + $sessionStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $sessionStorage.$reset();
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    }]);
});

///helper
function parseRightsUser(paramlist){

    if( typeof paramlist != "undefined"){

        for(var i = 0; i< paramlist.length;i++){

            if(Object.getOwnPropertyNames(paramlist[i]).indexOf("read_user") != -1){
                if(paramlist[i].read_user == 0){
                    paramlist[i].read_user = false;
                }
                else{
                    paramlist[i].read_user = true;
                }
            }
            if(Object.getOwnPropertyNames(paramlist[i]).indexOf("create_user") != -1){
                if(paramlist[i].create_user == 0){
                    paramlist[i].create_user = false;
                }
                else{
                    paramlist[i].create_user = true;
                }
            }
            if(Object.getOwnPropertyNames(paramlist[i]).indexOf("delete_user") != -1){
                if(paramlist[i].delete_user == 0){
                    paramlist[i].delete_user  = false;
                }
                else{
                    paramlist[i].delete_user  = true;
                }
                if(Object.getOwnPropertyNames(paramlist[i]).indexOf("create_grp") != -1){
                    if(paramlist[i].create_grp == 0){
                        paramlist[i].create_grp = false;
                    }
                    else{
                        paramlist[i].create_grp = true;
                    }
                }
                if(Object.getOwnPropertyNames(paramlist[i]).indexOf("delete_grp") != -1){
                    if(paramlist[i].delete_grp == 0){
                        paramlist[i].delete_grp = false;
                    }
                    else{
                        paramlist[i].delete_grp = true;
                    }
                }
            }
            if(Object.getOwnPropertyNames(paramlist[i]).indexOf("grant_rights") != -1){
                if(paramlist[i].grant_rights == 0){
                    paramlist[i].grant_rights = false;
                }
                else{
                    paramlist[i].grant_rights = true;
                }
            }
        } return paramlist;
    }else{
        return null;
    }

}
function parseRightsGrp(paramlist){
    if( typeof paramlist != "undefined"){

        for(var i = 0; i< paramlist.length;i++){

            if(Object.getOwnPropertyNames(paramlist[i]).indexOf("read_grp") != -1){
                if(paramlist[i].read_grp == 0){
                    paramlist[i].read_grp = false;
                }
                else{
                    paramlist[i].read_grp = true;
                }
            }
            if(Object.getOwnPropertyNames(paramlist[i]).indexOf("invite_user") != -1){
                if(paramlist[i].invite_user == 0){
                    paramlist[i].invite_user = false;
                }
                else{
                    paramlist[i].invite_user = true;
                }
            }
            if(Object.getOwnPropertyNames(paramlist[i]).indexOf("remove_user") != -1){
                if(paramlist[i].remove_user == 0){
                    paramlist[i].remove_user = false;
                }
                else{
                    paramlist[i].remove_user = true;
                }
            }
            if(Object.getOwnPropertyNames(paramlist[i]).indexOf("grant_rights") != -1){
                if(paramlist[i].grant_rights == 0){
                    paramlist[i].grant_rights = false;
                }
                else{
                    paramlist[i].grant_rights = true;
                }
            }
        }
        return paramlist;
    }else{
        return null;
    }
}
