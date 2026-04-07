import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";


const UserRouter = Router();

UserRouter.post('/login', loginUser);
UserRouter.post('/register', registerUser);
// UserRouter.post('/add_to_activity');
// UserRouter.get('/get_all_activity');


export default UserRouter;