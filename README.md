# DT207G Moment 1
By William Pettersson
## About
A webpage that lets you interact with a MariaDB/MySQL database.<br>
The install script will create a database with a table for courses as well as fill it with data.<br>
The server script will start a webserver where you can then view, add and remove courses from the database.
## Implementation
**Tools used:**
- [Express](https://www.npmjs.com/package/express) is used as a webserver
- [EJS](https://www.npmjs.com/package/ejs) is used as a view engine
- [MySQL2](https://www.npmjs.com/package/mysql2) is used to communicate with database server
The database uses the course code as a primary key.
![](https://raw.githubusercontent.com/AstronomyOverdrive/dt207g_moment1/refs/heads/main/relations.drawio.png)
