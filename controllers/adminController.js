
const userModel = require("../models/userModel");
const propertyModel = require("../models/propertyModel");
const Booking = require("../models/bookingModel");
const Payment = require("../models/paymentModel");
const Complaint = require("../models/complainModel");

const getAdminDashboard = async (req, res) => {
    try {
        const [
            totalUsers,
            totalOwners,
            totalTenants,
            activeUsers,
            suspendedUsers,
            totalProperties,
            availableProperties,
            rentedProperties,
            recentUsers,
            recentProperties
        ] = await Promise.all([
            userModel.countDocuments(),
            userModel.countDocuments({ role: "owner" }),
            userModel.countDocuments({ role: "tenant" }),
            userModel.countDocuments({ status: "active" }),
            userModel.countDocuments({ status: "suspended" }),
            propertyModel.countDocuments(),
            propertyModel.countDocuments({ status: "available" }),
            propertyModel.countDocuments({ status: "rented" }),

            userModel.find()
                .select("-password")
                .sort({ createdAt: -1 })
                .limit(5),

            propertyModel.find()
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        return res.status(200).json({
            success: true,
            message: "Admin dashboard fetched successfully",
            stats: {
                totalUsers,
                totalOwners,
                totalTenants,
                activeUsers,
                suspendedUsers,
                totalProperties,
                availableProperties,
                rentedProperties
            },
            recentUsers,
            recentProperties
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalUsers: users.length,
            users
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["active", "suspended"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be active or suspended"
            });
        }

        const user = await userModel.findByIdAndUpdate(
            id,
            { status },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User status updated successfully",
            user
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getAllProperties = async (req, res) => {
    try {
        const properties = await propertyModel.find()
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalProperties: properties.length,
            properties
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getSingleProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await propertyModel.findById(id)
            .populate("owner", "name email phone");

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Property fetched successfully",
            property
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid property ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const deleteAdminProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await propertyModel.findByIdAndDelete(id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Property deleted successfully",
            property
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid property ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getSingleUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("property", "title address city rent")
            .populate("tenant", "name email")
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalBookings: bookings.length,
            bookings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
            error: error.message,
        });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("booking")
            .populate("tenant", "name email")
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalPayments: payments.length,
            payments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch payments",
            error: error.message,
        });
    }
};


const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("user", "name email role")
            .populate("property", "title address city")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalComplaints: complaints.length,
            complaints,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch complaints",
            error: error.message,
        });
    }
};


const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemark } = req.body;

    const allowedStatuses = [
      "open",
      "in_progress",
      "resolved",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status",
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      {
        status,
        ...(adminRemark !== undefined && { adminRemark }),
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update complaint",
      error: error.message,
    });
  }
};

module.exports.updateComplaintStatus = updateComplaintStatus;


module.exports = {
    getAdminDashboard, getAllUsers,
    updateUserStatus, getAllProperties, getSingleProperty,
    deleteAdminProperty, getSingleUser, getAllBookings,
    getAllPayments, getAllComplaints,updateComplaintStatus
};
