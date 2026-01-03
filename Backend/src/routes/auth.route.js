import express from 'express';
import { signIn, loginUser, logout,updateProfile,checkAuth } from '../controller/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';


const router = express.Router();
 router.post('/signIn', signIn);

 router.post('/login', loginUser); 

router.get("/logout", logout);

router.put("/update-profile",protectedRoute,updateProfile);

router.get("/check",protectedRoute,checkAuth)



export default router;