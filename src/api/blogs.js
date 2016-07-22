'use strict';

var express = require('express');
var Blog = require('../models/blog');

var router = express.Router();

router.get('/blogs', function(req, res) {
  console.log("Saving blogs");
    Blog.find({}, function(err, blogs) {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }
        res.json({
            blogs: blogs
        });
    });
});

router.post('/blogs', function(req, res) {
    console.log("Saving blogs");
    var blog = req.body;
    Blog.create({
        city: blog.city,
        country: blog.country,
        title: blog.title,
        body: blog.body
    }, function(err, blog) {
        if (err) {
            return res.status(500).json({
                err: err.message
            });
        }
        res.json({
            'blog': blog,
            message: 'Blog Created'
        });
    });
});

router.put('/blogs/:id', function(req, res) {
    var id = req.params.id;
    var blog = req.body;
    if (blog && blog._id !== id) {
        return res.status(500).json({
            err: "Ids don't match!"
        });
    }
    Blog.findByIdAndUpdate(id, blog, {
        new: true
    }, function(err, blog) {
        if (err) {
            return res.status(500).json({
                err: err.message
            });
        }
        res.json({
            'blog': blog,
            message: 'Blog Updated'
        });
    });
});

router.delete('/blogs/:id', function(req, res) {
    var id = req.params.id;
    Blog.findByIdAndRemove(id, function(err, blog) {
        if (err) {
            return res.status(500).json({
                err: err.message
            });
        }
        res.json({
            'blog': blog,
            message: 'Blog Deleted'
        });
    });
});
// TODO: Add DELETE route to remove existing entries

module.exports = router;
