import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config.dev';
import router from './src/routes';

const webpackHotMiddleware = require('webpack-hot-middleware');

// Set up the express application
const app = express();
const compiler = webpack(webpackConfig);

dotenv.config();
// Log requests to the console
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'client/public/images')));

// Parse incoming request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'production') {
  app.use(webpackMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler));
}

router(app);
app.get('/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/bundle.js'));
});
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/style.css'));
});
// set up a default catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});


const port = parseInt(process.env.PORT, 10) || 3000;

app.listen(port, () => {
  console.log(`Server starting on port: ${port}`);
});

export default app;
