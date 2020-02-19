const db = require('../models')
const Comment = db.Comment
const User = db.User
const Restaurant = db.Restaurant
const Category = db.Category
const pageLimit = 10
let restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit }).then(result => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50)
      }))

      Category.findAll().then(categories => {
        return res.render('restaurants', {
          restaurants: JSON.parse(JSON.stringify(data)),
          categories: JSON.parse(JSON.stringify(categories)),
          categoryId: JSON.parse(JSON.stringify(categoryId)),
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      // console.log(restaurant.Comments[0].dataValues)
      return res.render('restaurant', {
        restaurant: JSON.parse(JSON.stringify(restaurant))
      })
    })
  }
}
module.exports = restController