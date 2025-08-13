// Import modules
const mysql = require("mysql2");
const express = require("express");
require("dotenv").config();

// Start app
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}))

// Connect to database
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD
});

// Listen for errors
connection.addListener("error", (error) => {
	console.log(error);
});

// Routing
// Startpage
app.get("/", async(req, res) => {
	// Run SQL query
	const sql = "SELECT * FROM `courses` ORDER BY `name`";
	connection.execute(sql, (error, rows, fields) => {
		if (error instanceof Error) {
			console.log(error);
			return;
		}
		// Render view
		res.render("index", {
			courses: rows
		});
	});
});

// Add course page
app.get("/add", async(req, res) => {
	res.render("addcourse");
});
app.post("/add", async(req, res) => {
	const newCourse = {
		code: req.body.code,
		name: req.body.name,
		syllabus: req.body.syllabus,
		progression: req.body.progression
	};
	if (isCourseValid(newCourse)) {
		const sql = "INSERT INTO `courses` (`code`, `name`, `syllabus`, `progression`) VALUES (?, ?, ?, ?)";
		const values = [newCourse.code, newCourse.name, newCourse.syllabus, newCourse.progression];
		connection.execute(sql, values, (error, result, fields) => {
			if (error instanceof Error) {
				console.log(error);
				return;
			}
			res.redirect("/");
		});
	}
});

// Validate
function isCourseValid(course) {
	return true;
}

// Start server
app.listen(process.env.PORT, () => {
	console.log("Server live on port", process.env.PORT);
});
