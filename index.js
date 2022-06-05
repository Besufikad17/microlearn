const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const config = require('./config/default.json');
const routes = require('./routes/routes');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser')

mongoose.connect(config.localMongoURI, { useNewUrlParser: true });

mongoose.connection.on('error', (err) => {
    console.log('Error in the database:', err);
});

app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.use(helmet());
app.use(cors());
app.use(express.json())
app.use('/api', routes)

app.get('/', (req,res) => {
    res.send('<h1>Welcome to MicroLearn backend<h2>')
  })

app.listen(PORT);