const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      process.env.WHITELISTED_DOMAIN &&
        process.env.WHITELISTED_DOMAIN.split(","),
    ],
  })
);

const db = require("../src/models");
// db.sequelize.sync({ force: true });

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

//routes
const { authRouter, employeeRouter, adminRouter } = require("./routers");

app.use("/auth", authRouter);
app.use("/employee", employeeRouter);
app.use("/admin", adminRouter);

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
