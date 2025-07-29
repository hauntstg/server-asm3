const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketModule = require("./socket");
const socketHandlers = require("./sockets/socketHandlers");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const db = process.env.MONGODB_URI;
const app = express();
const store = new MongoDBStore({ uri: db, collection: "sessions" });

const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const authAdminRoutes = require("./routes/admin/authAdmin");
const dashboardRoutes = require("./routes/admin/dashboard");
const historyAdminRoutes = require("./routes/admin/historyAdmin");
const productAdminRoutes = require("./routes/admin/productAdmin");
const messageAdminRoutes = require("./routes/admin/messageAdmin");

app.set("trust proxy", 1);
const allowedOrigins = [
  "http://localhost:3000", // client
  "https://client-asm3-gli2gylv6-hau-nguyens-projects-2ebe7b1e.vercel.app",
  "https://client-asm3-pi.vercel.app",
  "http://localhost:3001", // admin
  "https://admin-asm3-theta.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Cho phép gửi cookie
  })
);

const server = http.createServer(app); // tạo server

const io = socketModule.init(server); // khởi tạo io
socketHandlers(io); // gắn các listener

bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: store,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(authRoutes);
app.use(homeRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(authAdminRoutes);
app.use(dashboardRoutes);
app.use(historyAdminRoutes);
app.use(productAdminRoutes);
app.use(messageAdminRoutes);

mongoose
  .connect(db)
  .then((result) => {
    server.listen(PORT, () => {
      console.log("🚀 Server is running at http://localhost:5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
