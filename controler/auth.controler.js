import fs from 'fs';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS, SECRET,ROLES } from '../constants.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

export const registerUser = async(req, res) => {
    const {password,...user}=req.body;
    const db = fs.readFileSync('./db.json', 'utf-8');
    const parsedDb = JSON.parse(db);

    try{
        const hashedPassword= await bcrypt.hash(password, SALT_ROUNDS);
        
        const userToSave={
            ...user,
             password:hashedPassword,
             id:uuidv4(),
                role:ROLES.USER
            };
        parsedDb.users.push(userToSave);
       
        fs.writeFileSync('./db.json', JSON.stringify(parsedDb,null,'\t'));
        
        res.status(201).send({...user, id: userToSave.id});
    }
    catch(e){
        
        res.status(500).send('something went wrong');
    }
};

export const loginUser = async(req, res) => {
    const{email,password}=req.body;
   
    let db = fs.readFileSync('./db.json', 'utf-8');
    const parsedDb=JSON.parse(db);
    const user=parsedDb.users.find((user)=>user.email===email);
    const match=await bcrypt.compare(password,user.password);
    console.log(user);
    if (match) {
        const token = jwt.sign(
            {
                data: { id: user.id, role: user.role}
            },
            SECRET,
            { expiresIn: 60 * 60 }
        );
        console.log(token); // Just for debugging purposes
        res.status(200).json({ token: token, message: 'Logged in' });
    } else {
        res.status(401).send('Login failed');
    }
    
}

export const validate = (req, res) => {
    const {token}= req.body;
    try{
        const decoded=jwt.verify(token,SECRET);
        res.status(200).send(decoded);
    }
    catch(e){
        res.status(401).send('Invalid token');
    }


}