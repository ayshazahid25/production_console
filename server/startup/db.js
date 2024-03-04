const mongoose = require("mongoose");
require("dotenv").config();

module.exports = function () {
  const db = process.env.MONGODB_URI;
  mongoose
    .connect(db, { useUnifiedTopology: true })
    .then(() => console.log(`Database connected......`));
};
