var express = require('express');
var credentials = require('./credentials.js');

var app = express();

var handlebars = require('express3-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function(name,options) {
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
var formidable = require('formidable');
app.get('/contest/vacation-photo',function(req,res){
    var now = new Date();
    res.render('contest/vacation-photo',{
        year: now.getFullYear(),month: now.getMonth()
    });
});

app.post('/contest/vacation-photo/:year/:month',function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        if(err) return res.redirect(303,'/error');
        res.redirect(303,'/thank-you');
    });
});

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(express.static(__dirname+'/public'));

app.set('port',process.env.PORT || 3000);
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

app.use(function(req,res,next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    console.log(res.locals.partials.weather);
    next();
});
app.use(require('body-parser')());

// 回话
app.use(function(req,res,next){
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

app.get('/',function(req,res){
    res.render('home');
});

app.get('/newsletter',function(req,res){
    res.render('newsletter',{csrf:'CSRF token goes here'});
});

app.post('/process',function(req,res){
    var name = req.body.name || '', email = req.body.email || '';
    var match = email.match('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+$');
    console.log('name: '+name);
    console.log('email: '+email + 'match: '+ match);
    if(!match){
        if(req.xhr) return res.json({error: '邮箱无效'});
        req.session.flash = {
            type: 'danger',
            intro: '校验错误',
            message: '邮箱名无效'
        };
        return res.redirect(303,'/newsletter/archive');
    }
    new NewsletterSignup({name:name,email:email}).save(function(err){
        if(err){
            if(req.xhr) return res.json({error: '邮箱3无效'});
            req.session.flash = {
                type: 'danger3',
                intro: '校验错误3',
                message: '邮箱名无效3'
            };
            return res.redirect(303,'/newsletter/archive');
        }
        if(req.xhr) return res.json({success: true});
            req.session.flash = {
                type: 'success',
                intro: 'welcome',
                message: 'welcome to handan'
            };
            return res.redirect(303,'/newsletter/archive');
    });
});

app.get('/about',function(req,res){
    var randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)];
    res.render('about',{fortune:randomFortune});
});

app.use('/upload',function(req,res,next){
    var now = Date.now();
    jqupload.fileHandler({
        uploadDir: function(){
            return __dirname + '/public/uploads' + now;
        },
        uploadUrl: function(){
            return '/uploads/' + now;
        }
    })(req,res,next);
});

app.use(function(req,res,next){
    res.status(404);
    res.render('404');
});

app.use(function(err,req,res,next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

// app.listen(app.get('port'),function(){
//     console.log('express started on http://localhost:'+
//     app.get('port')+';press ctrl-c to terminate.')
// });

var fortunes = ["a","b","c","d","e","f"];

function getWeatherData() {
    return {
        locations:[
            {
                name:'Portland',
                forecastUrl: 'http://www.liu.com/1.html',
                iconUrl: "/icon/airplace.png",
                weather: "overcast",
                temp: "20",
            },
            {
                name:'Bend',
                forecastUrl: 'http://www.liu.com/1.html',
                iconUrl: "/icon/diamond.png",
                weather: "partly cloudy",
                temp: "25",
            },
            {
                name:'Manzanita',
                forecastUrl: 'http://www.liu.com/1.html',
                iconUrl: "/icon/phone.png",
                weather: "light rain",
                temp: "15",
            },
        ]
    };
}