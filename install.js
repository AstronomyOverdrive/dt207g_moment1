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
	"CREATE DATABASE `"+dbName+"` CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_uca1400_ai_ci'",
	"USE `"+dbName+"`",
	// Create table
	"CREATE TABLE `courses` (`code` VARCHAR(6) NOT NULL, `name` VARCHAR(50), `syllabus` VARCHAR(100), `progression` VARCHAR(1))",
	// Create constraints
	"ALTER TABLE `courses` ADD CONSTRAINT COURSE_PK PRIMARY KEY (`code`)",
	// Insert data
	"INSERT INTO `courses` VALUES ('DT057G', 'Webbutveckling I', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT057G/', 'A')",
	"INSERT INTO `courses` VALUES ('DT084G', 'Introduktion till programmering i JavaScript', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT084G/', 'A')",
	"INSERT INTO `courses` VALUES ('DT200G', 'Grafisk teknik för webb', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT200G/', 'A')",
	"INSERT INTO `courses` VALUES ('DT068G', 'Webbanvändbarhet', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT068G/', 'B')",
	"INSERT INTO `courses` VALUES ('DT003G', 'Databaser', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT003G/', 'A')",
	"INSERT INTO `courses` VALUES ('DT211G', 'Frontend-baserad webbutveckling', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT211G/', 'B')",
	"INSERT INTO `courses` VALUES ('DT207G', 'Backend-baserad webbutveckling', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT207G/', 'B')",
	"INSERT INTO `courses` VALUES ('DT208G', 'Programmering i TypeScript', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT208G/', 'B')",
	"INSERT INTO `courses` VALUES ('IK060G', 'Projektledning', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/IK060G/', 'A')",
	"INSERT INTO `courses` VALUES ('DT071G', 'Programmering i C#.NET', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT071G/', 'A')",
	"INSERT INTO `courses` VALUES ('DT193G', 'Fullstack-utveckling med ramverk', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT193G/', 'B')",
	"INSERT INTO `courses` VALUES ('DT209G', 'Webbutveckling för WordPress', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT209G/', 'B')",
	"INSERT INTO `courses` VALUES ('DT191G', 'Webbutveckling med .NET', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT191G/', 'B')",
	"INSERT INTO `courses` VALUES ('DT210G', 'Fördjupad frontend-utveckling', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT210G/', 'B')",
	"INSERT INTO `courses` VALUES ('DT140G', 'Självständigt arbete', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT140G/', 'B')"
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
