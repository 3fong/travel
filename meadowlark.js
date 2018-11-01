var express = require('express');

var app = express();

var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(express.static(__dirname+'/public'));

app.set('port',process.env.PORT || 3000);

app.use(function(req,res,next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    console.log(res.locals.partials.weather);
    next();
});

app.get('/',function(req,res){
    res.render('home');
});

app.get('/about',function(req,res){
    var randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)];
    res.render('about',{fortune:randomFortune});
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

app.listen(app.get('port'),function(){
    console.log('express started on http://localhost:'+
    app.get('port')+';press ctrl-c to terminate.')
});

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