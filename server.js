// Import modules
const mysql = require("mysql2");
const express = require("express");
require("dotenv").config();

// Start app
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}))

// Array with PKs, to minimize on queries
let primaryKeys = [];

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

// Populate array
getPrimaryKeys();

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
			getPrimaryKeys(); // Update PK array
			res.redirect("/");
		});
	}
});

// Get stored PKs
function getPrimaryKeys() {
	const sql = "SELECT `code` FROM `courses`";
	connection.execute(sql, (error, rows, fields) => {
		if (error instanceof Error) {
			console.log(error);
			return;
		}
		primaryKeys = [];
		rows.forEach(row => {
			primaryKeys.push(row.code);
		});
	});
}

// Validate
function isCourseValid(course) {
	let problems = "";
	// Check for empty entries
	Object.keys(course).forEach(key => {
		if (course[key].replaceAll(" ", "") === "") {
			problems += "\nTomt fält.";
		}
	});
	// Check for too long entries
	if (course.code.length > 6) {
		problems += `\n${course.code} överstiger 6 karaktärer.`;
	}
	if (course.name.length > 50) {
		problems += `\n${course.name} överstiger 50 karaktärer.`;
	}
	if (course.progression.length > 1) {
		problems += `\n${course.progression} överstiger 1 karaktärer.`;
	}
	if (course.syllabus.length > 100) {
		problems += `\n${course.syllabus} överstiger 100 karaktärer.`;
	}
	// Check if course code is unique
	if (primaryKeys.includes(course.code)) {
		problems += `\nKurskod "${course.code}" finns redan i databasen.`;
	}
	if (problems === "") {
		return true;
	} else {
		return false;
	}
}

// Start server
app.listen(process.env.PORT, () => {
	console.log("Server live on port", process.env.PORT);
});
