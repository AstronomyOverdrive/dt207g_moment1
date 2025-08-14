// Import modules
const mysql = require("mysql2");
const express = require("express");
require("dotenv").config();

// Start app
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

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
			res.render("dberror");
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
	res.render("addcourse", {
		errorMsg: "",
		fillForm: {
			code: "",
			name: "",
			progression: "",
			syllabus: ""
		}
	});
});
app.post("/add", async(req, res) => {
	const newCourse = {
		code: req.body.code,
		name: req.body.name,
		syllabus: req.body.syllabus,
		progression: req.body.progression
	};
	const errorMsg = isCourseValid(newCourse);
	if (errorMsg === "") {
		const sql = "INSERT INTO `courses` (`code`, `name`, `syllabus`, `progression`) VALUES (?, ?, ?, ?)";
		const values = [newCourse.code, newCourse.name, newCourse.syllabus, newCourse.progression];
		connection.execute(sql, values, (error, result, fields) => {
			if (error instanceof Error) {
				console.log(error);
				res.render("dberror");
				return;
			}
			getPrimaryKeys(); // Update PK array
			res.redirect("/");
		});
	} else {
		res.render("addcourse", {
			errorMsg: errorMsg,
			fillForm: {
				code: newCourse.code,
				name: newCourse.name,
				progression: newCourse.progression,
				syllabus: newCourse.syllabus
			}
		});
	}
});
// About page
app.get("/about", async(req, res) => {
	res.render("about");
});

// Delete course from database
app.post("/delete", async(req, res) => {
	const sql = "DELETE FROM `courses` WHERE `code` = ?";
	const values = [req.body.code];
	connection.execute(sql, values, (error, rows, fields) => {
		if (error instanceof Error) {
			console.log(error);
			res.render("dberror");
			return;
		}
		getPrimaryKeys(); // Update PK array
		res.redirect("/");
	});
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
			primaryKeys.push(row.code.toLowerCase());
		});
	});
}

// Validate
function isCourseValid(course) {
	let problems = "";
	// Check for empty entries
	Object.keys(course).forEach(key => {
		if (course[key].replaceAll(" ", "") === "") {
			problems += "Tomt fält.<br>";
		}
	});
	// Check for too long entries
	if (course.code.length > 6) {
		problems += `Kurskod "${course.code}" överstiger 6 karaktärer.<br>`;
	}
	if (course.name.length > 50) {
		problems += `Kursnamn "${course.name}" överstiger 50 karaktärer.<br>`;
	}
	if (course.progression.length > 1) {
		problems += `Progression "${course.progression}" överstiger 1 karaktär.<br>`;
	}
	if (course.syllabus.length > 100) {
		problems += `Kursplan "${course.syllabus}" överstiger 100 karaktärer.<br>`;
	}
	// Check if course code is unique
	if (primaryKeys.includes(course.code.toLowerCase())) {
		problems += `Kurskod "${course.code}" finns redan i databasen.<br>`;
	}
	return problems;
}

// Start server
app.listen(process.env.PORT, () => {
	console.log("Server live on port", process.env.PORT);
});
