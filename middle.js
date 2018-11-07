var app = require('express')();
var cartValidation = require('./lib/cartValidation.js');

// app.use(cartValidation.checkWaivers);
// app.use(cartValidation.checkGuestCounts);

app.use(function(req,res,next){
    console.log('\n\n总是');
    next();
});

app.get('/a',function(req,res){
    console.log('/a: 路由终止');
    res.send('a');
});

app.get('/a',function(req,res){
    console.log('/a: 不调用');
});

app.get('/b',function(req,res,next){
    console.log('/b: 路由未终止');
    next();
});

app.use(function(req,res,next){
    console.log('sometimes');
    next();
});

app.get('/b',function(req,res,next){
    console.log('/b: 跑出错误');
    throw new Error('b error');
});

app.use('/b',function(err,req,res,next){
    console.log('/b: 检测到错误并传递');
    next(err);
});

app.get('/c',function(err,req){
    console.log('/c: 抛出错误');
    throw new Error('c error');
});

app.use('/c',function(err,req,res,next){
    console.log('/c: 检测到错误并不传递');
    next();
});

app.use(function(err,req,res,next){
    console.log('检测到未处理错误: '+err.message);
    res.send('500 服务器错误');
});

app.use(function(req,res){
    console.log('未处理的路由');
    res.send('404 未找到');
});

app.use(app.static); 
console.log(app.static);

app.listen(3000,function(){
    console.log('监听3000接口');
});
