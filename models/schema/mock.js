"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MockSchema = new Schema({
    name : { type:String},
    url  : { type:String},
    data : { type:String},
    date  : { type:String}
});

mongoose.model('Mock', MockSchema);