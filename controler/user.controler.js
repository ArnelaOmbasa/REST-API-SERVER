import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs'; // Import fs module
import { v4 as uuidv4 } from 'uuid';


export const getUsers=(req,res)=>{
    const db = fs.readFileSync('./db.json', 'utf-8');
    const {users}=JSON.parse(db)
    console.log(users);
    res.send(users);
}

export const getUserById=(req,res)=>{
    const id=req.params.id;
    const db = fs.readFileSync('./db.json', 'utf-8');
    const {users}=JSON.parse(db);
    const user=users?.find((user)=>user.id===id);
    if (user){
        res.send(user);
    }
    else{
        res.status(404).send('User not found');
    }
}
export const createUser = (req, res) => {
    const db = fs.readFileSync('./db.json', 'utf-8');
    const parsedDb = JSON.parse(db);
    const user = req.body;
    user.id = uuidv4(); // Generating a new ID for the user

    console.log('New user object:', user);

    if (parsedDb.users) {
        parsedDb.users.push(user);
    } else {
        parsedDb.users = [user];
    }

    console.log('Parsed DB after adding user:', parsedDb);

    try {
        fs.writeFileSync('./db.json', JSON.stringify(parsedDb));
        res.status(201).send(user);
    } catch(e) {
        console.error('Error:', e);
        res.status(500).send('something went wrong');
    }
};


export const updateUser=(req,res)=>{
    const user=req.body;
    const id=req.params.id;
    const db = fs.readFileSync('./db.json', 'utf-8');
    const parsedDb=JSON.parse(db);
    const index=parsedDb.users.findIndex((user)=>user.id===id);
    parsedDb.users[index]=user;
    try{
        fs.writeFileSync('./db.json',JSON.stringify(parsedDb));
        res.status(200).send(user);
    }
    catch(e){
        res.status(500).send('something went wrong')
    }
}
export const patchUser = (req, res) => {
    const user = req.body;
    const id = req.params.id;

    const db = fs.readFileSync("./db.json", "utf-8");
    const parsedDb = JSON.parse(db);

    const index = parsedDb.users.findIndex((user) => user.id === id);

    if (index !== -1) {
        for(const [key,value] of Object.entries(user)){
            parsedDb.users[index][key] = value;
        }

        try {
            fs.writeFileSync ('./db.json', JSON.stringify(parsedDb, null, '\t'));
            res.status(200).send(parsedDb.users[index]);
        } catch(e) {
            res.status(500).send('Something went wrong');
        }
    } else {
        res.status(404).send('User not found');
    }
};








export const deleteUser=(req,res)=>{
    const id=req.params.id;
    const db = fs.readFileSync('./db.json', 'utf-8');
    const parsedDb=JSON.parse(db);
    const index=parsedDb.users.findIndex((user)=>user.id===id);
    if(index!==-1){
        try{
            parsedDb.users.splice(index,1);
            fs.writeFileSync('./db.json',JSON.stringify(parsedDb));
            return res.status(204).send();
        }
        catch(e){
           return  res.status(500).send('something went wrong')
        }

    }
    else {
        res.status(404).send('User not found');
    }
}