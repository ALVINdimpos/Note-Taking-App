const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const AuthRoute = require('./routes/Auth.routes');
const NoteRoute = require('./routes/Note.routes');
const RoleRoute = require('./routes/Role.router');
const cookieParser = require('cookie-parser');
const app = express();
// use cors and body parse
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Note-Taking  application.' });
});

// auth routes
app.use('/auth', AuthRoute);
// note routes
app.use('/notes', NoteRoute);
// role routes
app.use('/roles', RoleRoute);

// db connection instance
const dbCon = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected successfully');
  } catch (error) {
    console.log(`db: ${error.message}`);
  }
};

// port and host
const port = process.env.PORT;

// server and db
app.listen(port, () => {
  console.log(`Server listening on port : ${port}`);
  dbCon();
});
