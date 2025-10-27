import express from "express";
import {createUser, loginUser} from '../Controllers/user-controller.js';


const router = express.Router();

router.post('/sign-in', loginUser);

router.post('/sign-up', createUser);


export default router;
