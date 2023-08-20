import express from 'express';

import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    patchUser, 
    deleteUser
    } 
    from '../controler/user.controler.js';

const router = express.Router()

router
    .route('/')
    .get(getUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .patch(patchUser)
    .delete(deleteUser);

export default router;
