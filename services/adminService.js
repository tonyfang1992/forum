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
  getCategories: (req, res, callback) => {
    return Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            callback({ categories: JSON.parse(JSON.stringify(categories)), category: JSON.parse(JSON.stringify(category)) })
          })
      } else {
        return callback({ categories: JSON.parse(JSON.stringify(categories)) })
      }
    })
  }
}
module.exports = adminController