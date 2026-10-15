const mongoose = require("mongoose");

const propetySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        propertyType: {
            type: String,
            enum: ["room", "flat", "house", "pg"],
            default: "room"
        },
        rent: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        bedrooms: {
            type: Number,
            default: 1
        },
        furnished: {
            type: String,
            enum: ["furniture", "mini-furniture", "unfurniture"],
            default: "unfurniture"
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        status: {
            type: String,
            enum: ["available", "rented"],
            default: "available"
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("property", propetySchema);