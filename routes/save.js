const express = require("express");
const router = express.Router();
const Save = require("../models/Save");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const doc = await Save.findOne({ userId });
    if (!doc) 
    {
      return res.json({ data: null });
    }

    return res.json({
      data: {
        version: doc.version ?? 1,
        save: doc.data ?? null
      },
    });
  } 
  catch (err) 
  {
    console.error("GetSave error:", err);
    return res.status(500).json({ message: "problem getting save" });
  }
});

router.put("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const payload = req.body || {};

    const version = typeof payload.version === "number" ? payload.version : 1;
    const save = payload.save || {};

    // Checks the format of the player save
    if (typeof save !== "object" || Array.isArray(save)) 
    {
      return res.status(400).json({ message: "save must be an object" });
    }

    // If save data is valid it will be saved to the players unique save via userId
    await Save.findOneAndUpdate(
      { userId },
      { $set: { userId, version, data: save } },
      { upsert: true, new: true }
    );

    return res.sendStatus(204);
  } 
  catch (err) 
  {
    console.error("PutSave error:", err);
    return res.status(500).json({ message: "problem saving data" });
  }
});

module.exports = router;