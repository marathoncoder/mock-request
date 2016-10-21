"use strict";

var co = require('co');
var MockModel = require('../models').MockModel;
var ObjectId = require('mongodb').ObjectID;

module.exports = function(app){
    app.get('/',function(req,res){
        co(function *(){
            var list = yield MockModel.find().sort({date: -1}).exec();
            var first = yield MockModel.findOne().sort({date: -1}).exec();
            yield res.render('home',{
                list: list,
                first: first
            });
        });
    });

    app.get('/view/:id',function(req,res){
        var id = req.params.id;
        co(function *(){
            var list = yield MockModel.find().sort({date: -1}).exec();
            var first = yield MockModel.findOne({
                _id: new ObjectId(id)
            }).sort({date: -1}).exec();
            return yield res.render('home',{
                list: list,
                first: first
            });
        });
    });

    app.get('/*',function(req,res){
        console.log(req.originalUrl);
        var originalUrl = 'http://'+req.hostname+':3000'+req.originalUrl;
        co(function *(){
            var item = yield MockModel.findOne({
                "url": originalUrl
            }).exec();
            if(item == null){
                yield res.send('接口未定义')
            }else{
                yield res.send(item.data);
            }
        });
    });

    app.post('/saveMock',function(req,res){
        var body = req.body;
        var date = Date.now();
        body.date = date;

        co(function *(){
            var list = yield MockModel.find().exec();
            if(list.length < 1){
                yield MockModel.create(body);
                yield res.jsonp({
                    code:0,
                    msg:'success'
                });
            }else{
                var mock = yield MockModel.findOne({
                    url: body.url
                }).exec();
                if(mock == null){
                    yield MockModel.create(body);
                    yield res.jsonp({
                        code:0,
                        msg:'success'
                    });
                }else{
                    yield MockModel.update({_id: new ObjectId(body.id)},{$set:{
                        name: body.name,
                        url: body.url,
                        data: body.data
                    }});
                    yield res.jsonp({
                        code:0,
                        msg:'success'
                    });
                }
            }

        })
    });

    app.post('/delMock',function(req,res){
        co(function *(){
            var id = new ObjectId(req.body.id);
            yield  MockModel.findOne({_id:id}).remove();
            yield res.jsonp({
                code:0
            })
        });
    });


};