const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const adminController = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ include: [Category] }).then(restaurants => {
      callback({ restaurants: JSON.parse(JSON.stringify(restaurants)) })
    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then(restaurant => {
      callback({ restaurant: JSON.parse(JSON.stringify(restaurant)) })
    })
  },

}
module.exports = adminController