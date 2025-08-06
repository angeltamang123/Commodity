const { Router } = require("express");
const router = Router();
const authMiddleware = require("../utils/authMiddleware");
const notifications = require("../models/notifications");

router.get("/notifications", authMiddleware.protect, async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    const notifs = await notifications
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    res.json(notifs);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
});

router.get(
  "/notifications/unseen-count",
  authMiddleware.protect,
  async (req, res) => {
    try {
      const count = await Notification.countDocuments({
        userId: req.user.id,
        seen: false,
      });
      res.json({ unseen: count });
    } catch (error) {
      res.status(500).json({ message: `${error.message}` });
    }
  }
);

router.post(
  "/notifications/:notifId/seen",
  authMiddleware.protect,
  async (req, res) => {
    try {
      const updated = await Notification.findByIdAndUpdate(
        req.params.notifId,
        { seen: true },
        { new: true }
      );
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: `${error.message}` });
    }
  }
);

router.post(
  "/notifications/mark-all-seen",
  authMiddleware.protect,
  async (req, res) => {
    try {
      await Notification.updateMany({ userId: req.user.id }, { seen: true });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: `${error.message}` });
    }
  }
);

module.exports = router;
