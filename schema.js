const joi = require("joi");
module.exports.listingSchema = joi.object({
    listing: joi.object({   //listing is a object
        title: joi.string().required(), // title is a field
        description: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country: joi.string().required(),
        image: joi.string().allow("", null),

    }).required()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required()
})
