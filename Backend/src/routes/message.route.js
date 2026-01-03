import express from "express"
import { getMessages, getUsersForSideBar,sendMessages,editMessages, deleteMessgaes } from "../controller/message.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

router.get("/users",protectedRoute,getUsersForSideBar)
router.get("/:id",protectedRoute,getMessages);
router.post("/send/:id",protectedRoute,sendMessages);
router.put("/send/:id",protectedRoute,editMessages);
router.delete("/delete/:messageid",protectedRoute,deleteMessgaes)
export default router;