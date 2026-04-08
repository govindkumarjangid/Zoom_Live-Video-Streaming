import { Router } from "express";
import { addToHistory, getUserHistory, loginUser, registerUser } from "../controllers/user.controller.js";
import { protect } from "../middleware/protect.js";

const UserRouter = Router();

UserRouter.post('/login', loginUser);
UserRouter.post('/register', registerUser);
UserRouter.post('/add_to_activity', protect, addToHistory);
UserRouter.get('/get_all_activity', protect, getUserHistory);


export default UserRouter;