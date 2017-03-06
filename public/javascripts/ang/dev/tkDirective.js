/**
 * Created by dev-kevinvanrijmenant on 8/26/15.
 */
terminKalender.directive('kalender',function(){
    return{
        restrict : 'E',
        templateUrl : './parts/kalender.html',
        scope:{
            termine : "="
        },
        link:function(scope,elem,attr) {
            scope.$watch('termine', function (newVal, oldVal) {


                var d = new Date();
                var month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var month = d.getMonth();
                var year = d.getFullYear();
                var first_date = month_name[month+1] + " " + 1 + " " + year;

                var tmp = new Date(first_date).toDateString();

                var first_day = tmp.substring(0, 3);
                var day_name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                var day_no = day_name.indexOf(first_day);
                scope.firstDay = new Date(year,month,1).getDay();
                scope.days = new Date(year, month +1, 0).getDate();
                scope.date = new Date(year, month, 1);

                scope.calendar_month_year = month_name[month] + " " + year;
                scope.header = generateHeader();
                scope.matchdays = match(scope.days, newVal);

                function match(days, newVal) {
                    var rows = generateRows(days);
                    var rowsterm = getTerms(days, newVal);

                    var days = [];
                    if (typeof rowsterm != "undefined") {
                        if (rows.length === rowsterm.length) {
                            for (var i = 0; i < rows.length; i++) {
                                var days2 = [];
                                for (var j = 0; j < rows[i].length; j++) {
                                    var test = {
                                        day: rows[i][j],
                                        term: rowsterm[i][j] || false
                                    };
                                    days2.push(test);
                                }
                                days.push(days2);
                            }
                            
                            return days;
                        }
                    }
                }
                function generateHeader() {
                    var erg = [];
                    for (var c = 0; c <= 6; c++) {
                        erg.push("SMDMDFS"[c]);
                    }
                    return erg;
                }

                function generateRows(days) {
                    var rows = [];
                    var count = 1;

                        var row1 = [];
                        for (var i = 0; i <= 6; i++) {
                            if(i>=scope.firstDay){
                                row1.push(count);
                                count++;
                            }
                            else{
                                row1.push(null);
                            }
                        }
                        rows.push(row1);


                    if(scope.days == 31 && scope.firstDay > 4) {
                        for (var i = 0; i <= 4; i++) {
                            var row = [];
                            for (var j = 0; j <= 6; j++) {
                                if (count >= days) {
                                    row.push(count);
                                    break;
                                }
                                else {
                                    row.push(count);
                                    count++;
                                }


                            }
                            rows.push(row);
                        }
                    }else{
                            for (var i = 0; i <= 3; i++) {
                                var row = [];
                                for (var j = 0;  j <= 6; j++) {
                                    if (count >= days) {
                                        row.push(count);
                                        break;
                                    }
                                    else {
                                        row.push(count);
                                        count++;
                                    }


                                }
                                rows.push(row);
                        }

                    }
                    return rows;
                }
                function getTerms(days, terms) {
                    var days2 = [];
                    var count = 1;
                    var day = false;

                    if (terms != null) {

                        var rowfirst= [];

                        for (var k2 = 0; k2 <= 6; k2++) {
                                for (var i2 = 0;i2 < terms.length; i2++) {

                                    var termstart = new Date(terms[i2].User_Termine_Start),
                                        termend = new Date(terms[i2].User_Termine_Ende),
                                        thisday = new Date(scope.date.getFullYear(), scope.date.getMonth(), count);


                                    if (termstart.getFullYear() == scope.date.getFullYear() && termstart.getFullYear() == scope.date.getFullYear() ) {

                                        if (termstart.getMonth() < scope.date.getMonth()
                                            && termend.getMonth() > scope.date.getMonth()
                                            && scope.date.getMonth() != termstart.getMonth()
                                            && scope.date.getMonth() != termend.getMonth()) {
                                            day = true;
                                            break;
                                        }
                                        else if (termstart.getMonth() == scope.date.getMonth()
                                            && termstart.getMonth() != termend.getMonth()) {
                                            if (termstart.getDate() <= thisday.getDate()) {
                                                day = true;
                                                break;
                                            }
                                            else {
                                                day = false;
                                            }
                                        }
                                        else if (termend.getMonth() == scope.date.getMonth()
                                            && termstart.getMonth() != termend.getMonth()) {
                                            if (termend.getDate() >= thisday.getDate()) {
                                                day = true;
                                                break;
                                            }
                                            else {
                                                day = false;
                                            }
                                        }


                                        else if (termstart.getMonth() == termend.getMonth()
                                            && termend.getMonth() == scope.date.getMonth() && termstart.getMonth() == scope.date.getMonth()) {
                                            if (termend.getDate() >= thisday.getDate() && termstart.getDate() <= thisday.getDate()) {
                                                day = true;
                                                break;

                                            }
                                            else {
                                                day = false;
                                            }
                                        }
                                    }
                                }
                            if(k2>=scope.firstDay){
                                count++;
                                rowfirst.push(day);
                            }
                            else{
                                rowfirst.push(false);

                                }

                        }
                        days2.push(rowfirst);

                        if(scope.days == 31 && scope.firstDay > 4){
                            for (var j = 0; j <= 4; j++) {
                                var days3 = [];
                                for (var k = 0; k <= 6; k++) {
                                    for (var i = 0; i < terms.length; i++) {
                                        var termstart = new Date(terms[i].User_Termine_Start),
                                            termend = new Date(terms[i].User_Termine_Ende),
                                            thisday = new Date(scope.date.getFullYear(), scope.date.getMonth(), count);


                                        if (termstart.getFullYear() == scope.date.getFullYear() && termstart.getFullYear() == scope.date.getFullYear() ) {

                                            if (termstart.getMonth() < scope.date.getMonth()
                                                && termend.getMonth() > scope.date.getMonth()
                                                && scope.date.getMonth() != termstart.getMonth()
                                                && scope.date.getMonth() != termend.getMonth()) {
                                                day = true;
                                                break;
                                            }
                                            else if (termstart.getMonth() == scope.date.getMonth()
                                                && termstart.getMonth() != termend.getMonth()) {
                                                if (termstart.getDate() <= thisday.getDate()) {
                                                    day = true;
                                                    break;
                                                }
                                                else {
                                                    day = false;
                                                }
                                            }
                                            else if (termend.getMonth() == scope.date.getMonth()
                                                && termstart.getMonth() != termend.getMonth()) {
                                                if (termend.getDate() >= thisday.getDate()) {
                                                    day = true;
                                                    break;
                                                }
                                                else {
                                                    day = false;
                                                }
                                            }


                                            else if (termstart.getMonth() == termend.getMonth()
                                                && termend.getMonth() == scope.date.getMonth() && termstart.getMonth() == scope.date.getMonth()) {
                                                if (termend.getDate() >= thisday.getDate() && termstart.getDate() <= thisday.getDate()) {
                                                    day = true;
                                                    break;

                                                }
                                                else {
                                                    day = false;
                                                }
                                            }
                                        }
                                        /* Todo
                                         else if(termstart.getFullYear() != scope.date.getFullYear() && termend.getFullYear() != scope.date.getFullYear()
                                         && termstart.getFullYear() < scope.date.getFullYear()
                                         && termend.getFullYear() > scope.date.getFullYear(){
                                         day = true;
                                         break;
                                         }

                                         }*/
                                    }
                                    if (count >= days) {
                                        days3.push(day);
                                        break;
                                    } else {
                                        count++;
                                        days3.push(day);
                                    }
                                }

                                days2.push(days3);
                            }
                        }else{
                            for (var j = 0; j <= 3; j++) {
                                var days3 = [];
                                for (var k = 0; k <= 6; k++) {
                                    for (var i = 0; i < terms.length; i++) {
                                        var termstart = new Date(terms[i].User_Termine_Start),
                                            termend = new Date(terms[i].User_Termine_Ende),
                                            thisday = new Date(scope.date.getFullYear(), scope.date.getMonth(), count);


                                        if (termstart.getFullYear() == scope.date.getFullYear() && termstart.getFullYear() == scope.date.getFullYear() ) {

                                            if (termstart.getMonth() < scope.date.getMonth()
                                                && termend.getMonth() > scope.date.getMonth()
                                                && scope.date.getMonth() != termstart.getMonth()
                                                && scope.date.getMonth() != termend.getMonth()) {
                                                day = true;
                                                break;
                                            }
                                            else if (termstart.getMonth() == scope.date.getMonth()
                                                && termstart.getMonth() != termend.getMonth()) {
                                                if (termstart.getDate() <= thisday.getDate()) {
                                                    day = true;
                                                    break;
                                                }
                                                else {
                                                    day = false;
                                                }
                                            }
                                            else if (termend.getMonth() == scope.date.getMonth()
                                                && termstart.getMonth() != termend.getMonth()) {
                                                if (termend.getDate() >= thisday.getDate()) {
                                                    day = true;
                                                    break;
                                                }
                                                else {
                                                    day = false;
                                                }
                                            }


                                            else if (termstart.getMonth() == termend.getMonth()
                                                && termend.getMonth() == scope.date.getMonth() && termstart.getMonth() == scope.date.getMonth()) {
                                                if (termend.getDate() >= thisday.getDate() && termstart.getDate() <= thisday.getDate()) {
                                                    day = true;
                                                    break;

                                                }
                                                else {
                                                    day = false;
                                                }
                                            }
                                        }
                                        /* Todo
                                         else if(termstart.getFullYear() != scope.date.getFullYear() && termend.getFullYear() != scope.date.getFullYear()
                                         && termstart.getFullYear() < scope.date.getFullYear()
                                         && termend.getFullYear() > scope.date.getFullYear(){
                                         day = true;
                                         break;
                                         }

                                         }*/
                                    }
                                    if (count >= days) {
                                        days3.push(day);
                                        break;
                                    } else {
                                        count++;
                                        days3.push(day);
                                    }
                                }

                                days2.push(days3);
                            }
                        }
                        }

                        return days2;


                    }


                scope.next = function(){
                        scope.date = new Date(scope.date.getFullYear(), scope.date.getMonth()+1, 1);
                        scope.firstDay = scope.date.getDay();
                        scope.days = new Date(scope.date.getFullYear(),scope.date.getMonth()+1,0).getDate();
                        scope.calendar_month_year = month_name[scope.date.getMonth()] + " " + scope.date.getFullYear();
                        scope.matchdays = match(scope.days, newVal);


                };
                scope.prev = function(){
                        scope.date = new Date(scope.date.getFullYear(), scope.date.getMonth()-1, 1);
                        scope.firstDay = scope.date.getDay();
                        scope.days = new Date(scope.date.getFullYear(), scope.date.getMonth(), 0).getDate();
                        scope.calendar_month_year = month_name[scope.date.getMonth()] + " " + scope.date.getFullYear();
                        scope.matchdays = match(scope.days, newVal);
                };
            });
        }
    }
});

terminKalender.directive('kalendergrp',function(){
    return{
        restrict : 'E',
        templateUrl : './parts/kalender.html',
        scope:{
            termine : "="
        },
        link:function(scope,elem,attr){

            scope.$watch('termine',function(newVal,oldVal){


                var d = new Date();
                var month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var month = d.getMonth();
                var year = d.getFullYear();
                var first_date = month_name[month+1] + " " + 1 + " " + year;

                var tmp = new Date(first_date).toDateString();

                var first_day = tmp.substring(0, 3);
                var day_name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                var day_no = day_name.indexOf(first_day);
                scope.firstDay = new Date(year,month+1,0).getDay();
                scope.days = new Date(year, month +1, 0).getDate();
                scope.date = new Date(year, month +1, 0);

                scope.calendar_month_year = month_name[month] + " " + year;
                scope.header = generateHeader();
                scope.matchdays = match(scope.days, newVal);

                function match(days, newVal) {
                    var rows = generateRows(days);
                    var rowsterm = getTerms(days, newVal);

                    var days = [];
                    if (typeof rowsterm != "undefined") {
                        if (rows.length === rowsterm.length) {
                            for (var i = 0; i < rows.length; i++) {
                                var days2 = [];
                                for (var j = 0; j < rows[i].length; j++) {
                                    var test = {
                                        day: rows[i][j],
                                        term: rowsterm[i][j]
                                    };
                                    days2.push(test);
                                }
                                days.push(days2);
                            }
                            return days;
                        }
                    }


                }
                function generateHeader() {
                    var erg = [];
                    for (var c = 0; c <= 6; c++) {
                        erg.push("SMDMDFS"[c]);
                    }
                    return erg;
                }
                function generateRows(days) {
                    var rows = [];
                    var count = 1;

                    var row1 = [];
                    for (var i = 0; i <= 6; i++) {
                        if(i>=scope.firstDay){
                            row1.push(count);
                            count++;
                        }
                        else{
                            row1.push(null);
                        }
                    }
                    rows.push(row1);


                    if(scope.days == 31 && scope.firstDay > 4) {
                        for (var i = 0; i <= 4; i++) {
                            var row = [];
                            for (var j = 0; j <= 6; j++) {
                                if (count >= days) {
                                    row.push(count);
                                    break;
                                }
                                else {
                                    row.push(count);
                                    count++;
                                }


                            }
                            rows.push(row);
                        }
                    }else{
                        for (var i = 0; i <= 3; i++) {
                            var row = [];
                            for (var j = 0;  j <= 6; j++) {
                                if (count >= days) {
                                    row.push(count);
                                    break;
                                }
                                else {
                                    row.push(count);
                                    count++;
                                }


                            }
                            rows.push(row);
                        }

                    }
                    return rows;
                }
                function getTerms(days, terms) {
                    var days2 = [];
                    var count = 1;
                    var day = false;

                    if (terms != null) {

                        var rowfirst= [];

                        for (var k2 = 0; k2 <= 6; k2++) {
                            for (var i2 = 0;i2 < terms.length; i2++) {

                                var termstart = new Date(terms[i2].Gruppen_Termine_Start),
                                    termend = new Date(terms[i2].Gruppen_Termine_Ende),
                                    thisday = new Date(scope.date.getFullYear(), scope.date.getMonth(), count);
                                
                                

                                if (termstart.getFullYear() == scope.date.getFullYear() && termstart.getFullYear() == scope.date.getFullYear() ) {

                                    if (termstart.getMonth() < scope.date.getMonth()
                                        && termend.getMonth() > scope.date.getMonth()
                                        && scope.date.getMonth() != termstart.getMonth()
                                        && scope.date.getMonth() != termend.getMonth()) {
                                        day = true;
                                        break;
                                    }
                                    else if (termstart.getMonth() == scope.date.getMonth()
                                        && termstart.getMonth() != termend.getMonth()) {
                                        if (termstart.getDate() <= thisday.getDate()) {
                                            day = true;
                                            break;
                                        }
                                        else {
                                            day = false;
                                        }
                                    }
                                    else if (termend.getMonth() == scope.date.getMonth()
                                        && termstart.getMonth() != termend.getMonth()) {
                                        if (termend.getDate() >= thisday.getDate()) {
                                            day = true;
                                            break;
                                        }
                                        else {
                                            day = false;
                                        }
                                    }


                                    else if (termstart.getMonth() == termend.getMonth()
                                        && termend.getMonth() == scope.date.getMonth() && termstart.getMonth() == scope.date.getMonth()) {
                                        if (termend.getDate() >= thisday.getDate() && termstart.getDate() <= thisday.getDate()) {
                                            day = true;
                                            break;

                                        }
                                        else {
                                            day = false;
                                        }
                                    }
                                }
                            }
                            if(k2>=scope.firstDay){
                                count++;
                                rowfirst.push(day);
                            }
                            else{
                                rowfirst.push(false);

                            }

                        }
                        days2.push(rowfirst);

                        if(scope.days == 31 && scope.firstDay > 4){
                            for (var j = 0; j <= 4; j++) {
                                var days3 = [];
                                for (var k = 0; k <= 6; k++) {
                                    for (var i = 0; i < terms.length; i++) {
                                        var termstart = new Date(terms[i].Gruppen_Termine_Start),
                                            termend = new Date(terms[i].Gruppen_Termine_Ende),
                                            thisday = new Date(scope.date.getFullYear(), scope.date.getMonth(), count);


                                        if (termstart.getFullYear() == scope.date.getFullYear() && termstart.getFullYear() == scope.date.getFullYear() ) {

                                            if (termstart.getMonth() < scope.date.getMonth()
                                                && termend.getMonth() > scope.date.getMonth()
                                                && scope.date.getMonth() != termstart.getMonth()
                                                && scope.date.getMonth() != termend.getMonth()) {
                                                day = true;
                                                break;
                                            }
                                            else if (termstart.getMonth() == scope.date.getMonth()
                                                && termstart.getMonth() != termend.getMonth()) {
                                                if (termstart.getDate() <= thisday.getDate()) {
                                                    day = true;
                                                    break;
                                                }
                                                else {
                                                    day = false;
                                                }
                                            }
                                            else if (termend.getMonth() == scope.date.getMonth()
                                                && termstart.getMonth() != termend.getMonth()) {
                                                if (termend.getDate() >= thisday.getDate()) {
                                                    day = true;
                                                    break;
                                                }
                                                else {
                                                    day = false;
                                                }
                                            }


                                            else if (termstart.getMonth() == termend.getMonth()
                                                && termend.getMonth() == scope.date.getMonth() && termstart.getMonth() == scope.date.getMonth()) {
                                                if (termend.getDate() >= thisday.getDate() && termstart.getDate() <= thisday.getDate()) {
                                                    day = true;
                                                    break;

                                                }
                                                else {
                                                    day = false;
                                                }
                                            }
                                        }
                                        /* Todo
                                         else if(termstart.getFullYear() != scope.date.getFullYear() && termend.getFullYear() != scope.date.getFullYear()
                                         && termstart.getFullYear() < scope.date.getFullYear()
                                         && termend.getFullYear() > scope.date.getFullYear(){
                                         day = true;
                                         break;
                                         }

                                         }*/
                                    }
                                    if (count >= days) {
                                        days3.push(day);
                                        break;
                                    } else {
                                        count++;
                                        days3.push(day);
                                    }
                                }

                                days2.push(days3);
                            }
                        }else{
                            for (var j = 0; j <= 3; j++) {
                                var days3 = [];
                                for (var k = 0; k <= 6; k++) {
                                    for (var i = 0; i < terms.length; i++) {
                                        var termstart = new Date(terms[i].Gruppen_Termine_Start),
                                            termend = new Date(terms[i].Gruppen_Termine_Ende),
                                            thisday = new Date(scope.date.getFullYear(), scope.date.getMonth(), count);


                                        if (termstart.getFullYear() == scope.date.getFullYear() && termstart.getFullYear() == scope.date.getFullYear() ) {

                                            if (termstart.getMonth() < scope.date.getMonth()
                                                && termend.getMonth() > scope.date.getMonth()
                                                && scope.date.getMonth() != termstart.getMonth()
                                                && scope.date.getMonth() != termend.getMonth()) {
                                                day = true;
                                                break;
                                            }
                                            else if (termstart.getMonth() == scope.date.getMonth()
                                                && termstart.getMonth() != termend.getMonth()) {
                                                if (termstart.getDate() <= thisday.getDate()) {
                                                    day = true;
                                                    break;
                                                }
                                                else {
                                                    day = false;
                                                }
                                            }
                                            else if (termend.getMonth() == scope.date.getMonth()
                                                && termstart.getMonth() != termend.getMonth()) {
                                                if (termend.getDate() >= thisday.getDate()) {
                                                    day = true;
                                                    break;
                                                }
                                                else {
                                                    day = false;
                                                }
                                            }


                                            else if (termstart.getMonth() == termend.getMonth()
                                                && termend.getMonth() == scope.date.getMonth() && termstart.getMonth() == scope.date.getMonth()) {
                                                if (termend.getDate() >= thisday.getDate() && termstart.getDate() <= thisday.getDate()) {
                                                    day = true;
                                                    break;

                                                }
                                                else {
                                                    day = false;
                                                }
                                            }
                                        }
                                        /* Todo
                                         else if(termstart.getFullYear() != scope.date.getFullYear() && termend.getFullYear() != scope.date.getFullYear()
                                         && termstart.getFullYear() < scope.date.getFullYear()
                                         && termend.getFullYear() > scope.date.getFullYear(){
                                         day = true;
                                         break;
                                         }

                                         }*/
                                    }
                                    if (count >= days) {
                                        days3.push(day);
                                        break;
                                    } else {
                                        count++;
                                        days3.push(day);
                                    }
                                }

                                days2.push(days3);
                            }
                        }
                    }

                    return days2;


                }
                scope.next = function(){
                    scope.date = new Date(scope.date.getFullYear(), scope.date.getMonth()+1, 1);
                    scope.firstDay = scope.date.getDay();
                    scope.days = new Date(scope.date.getFullYear(),scope.date.getMonth()+1,0).getDate();
                    scope.calendar_month_year = month_name[scope.date.getMonth()] + " " + scope.date.getFullYear();
                    scope.matchdays = match(scope.days, newVal);


                };
                scope.prev = function(){
                    scope.date = new Date(scope.date.getFullYear(), scope.date.getMonth()-1, 1);
                    scope.firstDay = scope.date.getDay();
                    scope.days = new Date(scope.date.getFullYear(), scope.date.getMonth(), 0).getDate();
                    scope.calendar_month_year = month_name[scope.date.getMonth()] + " " + scope.date.getFullYear();
                    scope.matchdays = match(scope.days, newVal);
                };
            });

        }
    }
});