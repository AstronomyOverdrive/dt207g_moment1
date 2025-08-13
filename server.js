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

// Start server
app.listen(process.env.PORT, () => {
	console.log("Server live on port", process.env.PORT);
});
