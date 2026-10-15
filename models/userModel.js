const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "owner", "tenant"],
        default: "tenant"
    },
    status: {
        type: String,
        enum: ["active", "suspended"],
        default: "active"
    }
})

module.exports = mongoose.model("users", userSchema);