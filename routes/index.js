"use strict";

var co = require('co');
var MockModel = require('../models').MockModel;
var ObjectId = require('mongodb').ObjectID;

//const Mocklist = MockModel.find().sort({date: -1}).exec();
//console.log(Mocklist);

const routesConf = [
    //{
    //    url:'/',
    //    data:{
    //        test:'test11111'
    //    }
    //
    //},
    {
        url: '/getList',
        data:[
            {
                adasd:'asdasd'
            },
            {
                asdasd:'asdasd'
            }
        ]
    }
];

module.exports = function(app){
    app.get('/',function(req,res){
        co(function *(){
            var list = yield MockModel.find().sort({date: -1}).exec();
            var first = yield MockModel.findOne().sort({date: -1}).exec();
            yield res.render('home',{
                list: list,
                first: first
            });
        })
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
                    name: body.name
                }).exec();
                if(mock == null){
                    yield MockModel.create(body);
                    yield res.jsonp({
                        code:0,
                        msg:'success'
                    });
                }else{
                    yield res.jsonp({
                        code:1000,
                        msg:'己有相同的名称api存在'
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
        })
    });

    co(function *(){
    const list = yield MockModel.find().sort({date: -1}).exec();
        for(var i = 0; i < list.length; i++){
            (function(i){
                app.all(list[i].url,function(req,res){
                    res.jsonp(list[i].data);
                });
            })(i);
        }
    });
};