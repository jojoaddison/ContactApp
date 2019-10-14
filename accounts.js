var express         = require('express'),
    bodyParser      = require('body-parser'),
    session         = require('express-session'),
    Bourne          = require('bourne'),
    crypto          = require('crypto');

var router          = express.Router(),
    db              = new Bourne('users.json');

function hash(password){
    return crypto.createHash('sha256').update(password).digest('hex');
}

router
    .use(express.static('./public'))
    .use(bodyParser.urlencoded({ extended:true }))
    .use(bodyParser.json())
    .use(session({ secret:'adsahdalkdfla', saveUninitialized: true, resave: true}))
    .get('/login', function(req, res){
        res.sendFile('public/login.html', { root : __dirname });
    })
    .post('/login', function(req, res){
        var user = {
            username : req.body.username,
            password : hash(req.body.password)
        };
        db.findOne(user, function(err, data){
           // console.log(data);
           if(data){
               req.session.userId = data.id;
               res.redirect('/');
           }else{
               res.redirect('/login');
           }
        });
    })
    .post('/register', function(req, res){
        var user = {
            username : req.body.username,
            password : hash(req.body.password),
            options  : {}
        };
        db.find({username: user.username}, function(err, data){
            if(!data.length){
                console.log(user);
                db.insert(user, function(err, data){
                   req.session.userId = data.id;
                   res.redirect('/');
                });
            }else{
                res.redirect('/login');
            }
        });
    })
    .get('/logout', function(req, res){
        req.session.userId = null;
        res.redirect('/');
    })
    .use(function(req, res, next){
        if(req.session.userId){
            db.findOne({id: req.session.userId}, function(err, data){
                req.user = data;
            })
        }
        next();
    })
    .get('/options/displayed_fields', function(req, res){
        if(angular.isUndefined(req.user)){
            console.log("User undefined");
            res.json([]);
        }else{
            console.log('user defined');
            console.log(req.user.options);
            res.json(req.user.options.displayed_fields || []);
        }
    })
    .post('/options/displayed_fields', function(req, res){
        //console.log(req);
        req.user.options.displayed_fields = req.body.fields;
        db.update({ id: req.user.id}, req.user, function(err, data){
            res.json(data[0].options.displayed_fields);
        })
    })
;

module.exports = router;