var express = require('express');
var app = express();
var geoRouter = express.Router();
var GeolocateModel = require('../db/models/geolocateModel');

geoRouter.route('/').get((req, res) => {
	GeolocateModel.find((err, items) => {
		if(err) console.log(err);
		else res.json(items);
	});
});

module.exports = geoRouter;