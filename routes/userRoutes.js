const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser)
router.get("/profile", authMiddleware, getProfile);

router.get(
    "/admin-test",
    authMiddleware,
    roleMiddleware("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome Admin!"
        });
    }
);

router.get(
    "/owner-test",
    authMiddleware,
    roleMiddleware("owner"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome Owner!"
        });
    }
);

module.exports = router;