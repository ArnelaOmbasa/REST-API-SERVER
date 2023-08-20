import jwt from 'jsonwebtoken'
import { SECRET } from '../constants.js';
const authMiddleware = (req, res, next) => {
    console.log(req.headers);
    const token= req.headers['x-access-token'];
    try{

        const result=jwt.verify(token,SECRET);
        console.log(result);
        req.user=result.data;
        
        next();
    }
    catch(e){
        console.log(e);
        res.status(403).send('Forbidden');

    }


}
export default authMiddleware;