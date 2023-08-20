import fs from 'fs';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../constants.js';
import { v4 as uuidv4 } from 'uuid';

export const registerUser = (req, res) => {
    const user = req.body;
    const db = fs.readFileSync('./db.json', 'utf-8');
    const parsedDb = JSON.parse(db);
    bcrypt.hash(user.password, SALT_ROUNDS, function (err, hash) {
        if(err){
            res.status(500).send('Internal server error');
        }
        else {
            user.password=hash;
            user.id=uuidv4();
            parsedDb.users.push(user);

            try {
                fs.writeFileSync('./db.json', JSON.stringify(parsedDb));
                res.status(201).send(user);
            } catch(e) {
                console.error('Error:', e);
                res.status(500).send('something went wrong');
            }
           
        }


});
};