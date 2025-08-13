// Import modules
const mysql = require("mysql2");
require("dotenv").config();

// Database to use
const dbName = process.env.DB_DATABASE;
// Connect to database
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	port: process.env.DB_PORT,
	password: process.env.DB_PASSWORD
});

// Listen for errors
connection.addListener("error", (error) => {
	console.log(error);
});

// SQL commands to run
const sqlCommands = [
	// Create database
	"DROP DATABASE IF EXISTS `"+dbName+"`",
	"CREATE DATABASE `"+dbName+"` CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_uca1400_ai_ci'"
];

// Run SQL commands
sqlCommands.forEach(command => {
	connection.execute(command, (error, result, fields) => {
		if (error instanceof Error) {
			console.log(error);
			return;
		}
		console.log(result);
		console.log(fields);
	});
});
