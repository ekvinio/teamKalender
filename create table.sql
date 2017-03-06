/* create\ table.sql */

DROP TABLE IF EXISTS Login;
create Table Login (Login_Id integer(10) primary key auto_increment,Login_Name Varchar (40), Login_Passw varchar(200));
DROP TABLE IF EXISTS User;
create Table User (User_Id integer(10) primary key auto_increment,User_Name Varchar (40), User_Job varchar(40), User_Gruppe Integer, login_id integer(10));
DROP TABLE IF EXISTS Nachrichten;
create Table Nachrichten (Nachrichten_Id integer(10) primary key auto_increment,Nachrichten_Absender integer(10), Nachrichten_Empfaenger integer(10),Nachrichten_Titel Varchar(80),Nachrichten_Text Varchar (400),Nachrichten_Date timestamp);
DROP TABLE IF EXISTS User_Rechte;
create Table User_Rechte (User_Rechte_Id Integer(10) auto_increment primary key, user_id Integer(10),grant_rights boolean, read_user boolean,create_user boolean,delete_user boolean,create_grp boolean,delete_grp boolean,islocked boolean);
DROP TABLE IF EXISTS User_termine;
create table User_Termine (User_Termine_Id Integer(10) auto_increment primary key, user_id Integer(10),User_Termine_Start timestamp, User_Termine_Ende timestamp,User_Termine_Titel varchar(100), User_Termine_Text varchar(1000));
DROP TABLE IF EXISTS Gruppen;
create Table Gruppen (Gruppen_Id integer(10) primary key auto_increment, Gruppen_Name Varchar (40),Gruppen_Ersteller Integer(10));
DROP TABLE IF EXISTS Gruppen_Rechte;
create Table Gruppen_Rechte (Gruppen_Rechte_Id Integer(10) auto_increment primary key,gruppen_id Integer(10),user_id Integer(10),grant_rights boolean, read_grp boolean,invite_user boolean,remove_user boolean);
DROP TABLE IF EXISTS Gruppen_Termine;
create Table Gruppen_Termine (Gruppen_Termine_Id Integer(10) auto_increment primary key,gruppen_id Integer(10), Gruppen_Termine_Start timestamp,Gruppen_Termine_Ende timestamp,Gruppen_Termine_Titel varchar(100), Gruppen_Termine_Text Varchar(1000));
DROP TABLE IF EXISTS Gruppen_User_Match;
create table Gruppen_User_Match (Gruppen_User_Match_Id Integer(10) auto_increment primary key, gruppen_id Integer(10),user_id Integer(10));