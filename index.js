const app = require("./app");
const { Config } = require("./config");
const { connectDatabase } = require("./db/config");

const main = async () => {
  await connectDatabase().then((db) => {
    db.on("error", function (err) {
      console.error("Failed to connect to database", err);
      process.exit(1);
    });

    db.once("open", function () {
      console.info("Connected to database");
      app.listen(Config.port, () => {
        console.log(`App is running on ${Config.port}`);
      });
    });
  });
};

main();
