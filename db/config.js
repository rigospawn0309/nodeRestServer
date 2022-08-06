const mongoose = require("mongoose");
const dbConnection = async () => {
  mongoose
    .connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((resp) => {
      console.log("Connected to Mongo!!");
    })
    .catch((error) => {
      console.log("Error connecting to Mongo", error);
    });
};

module.exports = {
  dbConnection,
};
