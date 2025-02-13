const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { Sequelize, DataTypes } = require("sequelize");

dotenv.config();
const app = express();

// Use the secret key from environment variables
const jwtSecret = process.env.JWT_SECRET || "your_fallback_secret";

// 🔹 Move CORS Middleware Before Routes
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, // Allow cookies
  methods: ["GET", "POST", "DELETE"], 
}));

app.use(express.json());
app.use(cookieParser());

// Routes for admin and appointments
const adminRoutes = require("./routes/adminRoutes");
app.use('/api/admin', adminRoutes);
const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api', appointmentRoutes);

// Database Connection
const sequelize = new Sequelize("appointment_system", "root", "imasha@2001", {
  host: "localhost",
  dialect: "mysql",
});

sequelize.authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// Define User model
const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: false,
});

sequelize.sync().then(() => console.log("✅ Database synced"));

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtSecret, { expiresIn: '1h' });
};

// Middleware to authenticate user using JWT
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("⛔ No token found in cookies!");
    return res.status(401).json({ error: "Not authenticated" });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.log("⛔ Invalid token!", err.message);
      return res.status(403).json({ error: "Invalid token" });
    }

    console.log("✅ User authenticated:", user);
    req.user = user;
    next();
  });
};

// 🔹 Get Logged-in User Info
app.get("/api/me", (req, res) => {
  console.log("✅ Authenticated User Data:", req.user);
  res.json(req.user);
});

// 🔹 Register Endpoint
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// 🔹 Login Endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // 🔹 Compare hashed password using bcrypt
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ message: "Invalid credentials" });

  // Generate Token
  const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1h" });

  // ✅ Set token in HTTP-only cookies
  res.cookie("token", token, {
    httpOnly: true,  // Prevent client-side access
    secure: false,   // Change to `true` in production (HTTPS)
    sameSite: "Lax", // Prevent CSRF attacks
  });

  res.json({ message: "Login successful", user: { id: user.id, email: user.email } });
});


// 🔹 Logout Endpoint
app.post("/api/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "None" })
    .json({ message: "Logged out successfully!" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
