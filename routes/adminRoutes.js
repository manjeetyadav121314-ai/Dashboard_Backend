
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getAdminDashboard, getAllUsers, updateUserStatus, getAllProperties,
    getSingleProperty, deleteAdminProperty, getSingleUser,
    getAllBookings, getAllPayments, getAllComplaints, updateComplaintStatus
} = require("../controllers/adminController");

router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("admin"),
    getAdminDashboard
);

router.get(
    "/users",
    authMiddleware,
    roleMiddleware("admin"),
    getAllUsers
);

router.patch(
    "/users/:id/status",
    authMiddleware,
    roleMiddleware("admin"),
    updateUserStatus
);


router.get(
    "/properties",
    authMiddleware,
    roleMiddleware("admin"),
    getAllProperties
);
router.get(
    "/properties/:id",
    authMiddleware,
    roleMiddleware("admin"),
    getSingleProperty
);

router.delete(
    "/properties/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteAdminProperty
);

router.get(
    "/users/:id",
    authMiddleware,
    roleMiddleware("admin"),
    getSingleUser
);
router.get(
    "/bookings",
    authMiddleware,
    roleMiddleware("admin"),
    getAllBookings
);
router.get(
    "/payments",
    authMiddleware,
    roleMiddleware("admin"),
    getAllPayments
);
router.get(
    "/complaints",
    authMiddleware,
    roleMiddleware("admin"),
    getAllComplaints
);
router.patch(
    "/complaints/:id/status",
    authMiddleware,
    roleMiddleware("admin"),
    updateComplaintStatus
);
module.exports = router;
