import express from "express";
import {
  addToGroup,
  createConversation,
  createGroupChat,
  deleteConversation,
  deleteConversationAsAdmin,
  findConversation,
  getConversation,
  getConversationDetailsForAdmin,
  getConversations,
  getAllConversationsForAdmin,
  removeFromGroup,
  updateConversation,
} from "../controllers/conversation.controller";
import authMiddleware from "../middleware/auth.middleware";
import adminMiddleware from "../middleware/admin.middleware";
import wrap from "./wrap";

const router = express.Router();

// Admin routes
router.get("/admin/all", adminMiddleware, wrap(getAllConversationsForAdmin));
router.get(
  "/admin/:conversationId",
  adminMiddleware,
  wrap(getConversationDetailsForAdmin)
);
router.delete(
  "/admin/:conversationId",
  adminMiddleware,
  wrap(deleteConversationAsAdmin)
);
// User routes
router.get("/user/:userId", wrap(getConversations));
router.get("/:conversationId", wrap(getConversation));
router.get("/find/:firstUserId/:secondUserId", wrap(findConversation));

router.use(authMiddleware);
router.post("/", wrap(createConversation));
router.post("/group", wrap(createGroupChat));
router.delete("/:conversationId", wrap(deleteConversation));
router.put("/addToGroup", wrap(addToGroup));
router.put("/removeFromGroup", wrap(removeFromGroup));
router.put("/:conversationId", wrap(updateConversation));

export default router;
