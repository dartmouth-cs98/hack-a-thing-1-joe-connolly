var express = require('express'); 
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var mongojs = require('mongojs')
var db = mongojs('customerapp', ['users'])
var ObjectId = mongojs.ObjectId;

//  View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', function function_name(req, res) { 

	// find everything
	db.users.find(function (err, docs) {
		console.log(docs);
		res.render("index", {
			title: "Customers",
			users: docs
		}); 
	});

	
});

app.post('/users/add', function(req, res) {
	console.log('Form submitted');
	var newUser = {
		first_name:req.body.first_name,
		time: getDateTime()
	};
	db.users.insert(newUser, function(err, result) {
		if (err) {
			console.log(err);
		}
		else {
			res.redirect("/");
		}
	}); 
	console.log(newUser);
});

app.delete('/users/delete/:id', function(req, res) {
	console.log(req.params.id)
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result) {
		if (err) {
			console.log(err);	
		}
		res.redirect("/");
	});
})

app.listen("3000", function () {
	console.log("server started on port 3000");
});

//courtesy of https://stackoverflow.com/questions/7357734/how-do-i-get-the-time-of-day-in-javascript-node-js
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    return hour + ":" + min;

}

