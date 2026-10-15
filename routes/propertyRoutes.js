const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { createProperty, fetchProperty, singleFetchProperty, updateProperty, deleteProperty, myProperties } = require("../controllers/propertyController");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("owner"),
    createProperty
);

router.get("/getProperty", fetchProperty);
router.get("/singleFetch/:id", singleFetchProperty)

router.put(
    "/updateProperty/:id",
    authMiddleware,
    roleMiddleware("owner"),
    updateProperty
);

router.delete(
    "/deleteProperty/:id",
    authMiddleware,
    roleMiddleware("owner"),
    deleteProperty
);

router.get(
    "/myProperty/:id",
    authMiddleware,
    roleMiddleware("Owner"),
    myProperties
)

module.exports = router;