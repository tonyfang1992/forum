const db = require('../models')
const Category = db.Category

let categoryService = {
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
module.exports = categoryService