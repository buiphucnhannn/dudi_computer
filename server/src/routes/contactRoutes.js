import { Router } from "express";
import {
  createContact,
  getContacts,
  getContactStats,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";

const router = Router();

// Public route to send contact message or feedback
router.post("/", createContact);

// Admin routes (accessible for dashboard)
router.get("/stats", getContactStats);
router.get("/", getContacts);
router.patch("/:id/status", updateContactStatus);
router.delete("/:id", deleteContact);

export default router;
