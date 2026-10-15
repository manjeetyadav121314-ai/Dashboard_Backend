const propertyModel = require("../models/propertyModel");

const createProperty = async (req, res) => {
    try {
        const {
            title,
            description,
            propertyType,
            rent,
            address,
            city,
            bedrooms,
            furnished } = req.body;

        const property = await propertyModel.create({
            title,
            description,
            propertyType,
            rent,
            address,
            city,
            bedrooms,
            furnished,
            owner: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Property create successfully",
            property
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

const fetchProperty = async (req, res) => {
    try {
        const getProperties = await propertyModel.find();

        res.status(200).json({
            message: "Property fetch successfully",
            getProperties
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

const singleFetchProperty = async (req, res) => {
    try {

        const id = req.params.id;

        const singleFetch = await propertyModel.findById(id);

        if (!singleFetch) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        res.status(200).json({
            message: "Single Property Fetch Successfully",
            singleFetch
        })

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const
            {
                title,
                description,
                propertyType,
                rent,
                address,
                city,
                bedrooms,
                furnished,
                status
            } = req.body;

        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (propertyType !== undefined) updateData.propertyType = propertyType;
        if (rent !== undefined) updateData.rent = rent;
        if (address !== undefined) updateData.address = address;
        if (city !== undefined) updateData.city = city;
        if (bedrooms !== undefined) updateData.bedrooms = bedrooms;
        if (furnished !== undefined) updateData.furnished = furnished;
        if (status !== undefined) updateData.status = status;

        const update = await propertyModel.findOneAndUpdate(
            {
                _id: id,
                owner: req.user.id
            },
            updateData,
            {
                new: true,
                runValidators: true
            }
        );
        if (!update) {
            return res.status(404).json({
                success: false,
                message: "Property not found or you are not the owner"
            })
        }
        res.status(200).json({
            success: true,
            message: "Property update successfully",
            update
        })

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Invaild Property ID"
            })
        }
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteP = await propertyModel.findOneAndDelete(
            {
                _id: id,
                owner: req.user.id
            }
        );
        if (!deleteP) {
            return res.status(404).json({
                success: false,
                message: "Property not found or you are not owner"
            })
        };

        return res.status(200).json({
            success: true,
            message: "Property delete successfully",
            deleteP
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Invailid Property ID"
            })
        }
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
    }
}

const myProperties = async (req, res) => {
    try {
        const { id } = req.params;

        const singleProperties = await propertyModel.findById(
            {
                _id: id,
                owner: req.user.id
            }
        );
        if (!singleProperties) {
            return res.status(404).json({
                success: true,
                message: "Properties not found or you are not the owner."
            });
        }

        return res.status(200).json({
            success: true,
            message: "My property fetch successfully",
            singleProperties
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Invailid Property ID"
            })
        }
        return res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

module.exports = { createProperty, fetchProperty, singleFetchProperty, updateProperty, deleteProperty, myProperties };