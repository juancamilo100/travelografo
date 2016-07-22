'use strict';

var express = require('express');
var Marker = require('../models/marker');

var router = express.Router();

router.get('/markers', function(req, res) {
    Marker.find({}, function(err, markers) {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }
        res.json({
            markers: markers
        });
    });
});

router.post('/markers', function(req, res) {
    var marker = req.body;
    Marker.create({
        latLng: marker.latLng
    }, function(err, marker) {
        if (err) {
            return res.status(500).json({
                err: err.message
            });
        }
        res.json({
            'marker': marker,
            message: 'Marker Created'
        });
    });
});

router.put('/markers/:id', function(req, res) {
    var id = req.params.id;
    var marker = req.body;
    if (marker && marker._id !== id) {
        return res.status(500).json({
            err: "Ids don't match!"
        });
    }
    Marker.findByIdAndUpdate(id, marker, {
        new: true
    }, function(err, marker) {
        if (err) {
            return res.status(500).json({
                err: err.message
            });
        }
        res.json({
            'marker': marker,
            message: 'Marker Updated'
        });
    });
});

router.delete('/markers/:id', function(req, res) {
        var id = req.params.id;
        Marker.findByIdAndRemove(id, function(err, marker) {
            if (err) {
                return res.status(500).json({
                    err: err.message
                });
            }
            res.json({
                'marker': marker,
                message: 'Marker Deleted'
            });
        });
    });
    // TODO: Add DELETE route to remove existing entries

module.exports = router;
