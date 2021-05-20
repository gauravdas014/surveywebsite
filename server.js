const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const app = require('./app');

let DB;
// if (process.env.NODE_ENV === 'development') {
//   DB = process.env.DATABASE_URI_LOCAL;
// } else {
//   DB = process.env.DATABASE_URI;
// }

DB = process.env.DATABASE_URI;

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful');
  });
