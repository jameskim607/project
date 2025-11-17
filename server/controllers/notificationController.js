import Notification from "../models/notification.js";

// Get notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: "Notification not found" });

    if (notif.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notif.read = true;
    await notif.save();
    res.json({ message: "Marked as read", notification: notif });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
