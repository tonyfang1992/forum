const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Category = db.Category
const adminService = require('../services/adminService.js')
const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      return res.render('admin/create', {
        categories: JSON.parse(JSON.stringify(categories))
      })
    })
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      console.log(restaurant)
      Category.findAll().then(categories => {
        return res.render('admin/create', {
          categories: JSON.parse(JSON.stringify(categories)),
          restaurant: JSON.parse(JSON.stringify(restaurant))
        })
      })
    })
  },
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_message', data['message'])
        return res.redirect('back')
      }
      req.flash('success_message', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },
  getUsers: (req, res) => {
    return User.findAll().then(users => {

      return res.render('admin/users', { users: JSON.parse(JSON.stringify(users)) })
    })
  },
  putUsers: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        if (user.isAdmin == 0) {
          user.update({
            isAdmin: 1
          }).then((user) => {
            req.flash('success_messages', 'user was successfully to update')
            res.redirect('/admin/users')
          })
        }
        else {
          user.update({
            isAdmin: 0
          }).then((user) => {
            req.flash('success_messages', 'user was successfully to update')
            res.redirect('/admin/users')
          })
        }
      })
  }
}

module.exports = adminController