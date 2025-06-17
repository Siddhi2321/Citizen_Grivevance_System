const Officer = require("../models/officer");
const { sendEmail } = require("../utils/sendEmail");
const bcrypt = require("bcrypt");

exports.sendOtpToOfficer = async (req, res, next) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  req.session.email = email;
  req.session.otpExpires = Date.now() + 10 * 60 * 1000;

  try {
    await Otp.create({ email, otp });


    const subject = "Your OTP for Citizens Grievance System";
    const text = `Your OTP is ${otp}. It is valid for 10 minutes.`;

    await sendEmail({ toEmail: email, subject, text });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};


// Step 2: Register Officer
exports.registerOfficer = async (req, res) => {
  const {
    name, email, mobile, password, designation,
    department, location, otp
  } = req.body;

  const record = await Otp.findOne({ email, otp });
  
      if (!record) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

  try {
    const existing = await Officer.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const officer = new Officer({
      officer_id: uuidv4(),
      name,
      email,
      mobile,
      password: hashedPassword,
      designation,
      department,
      location,
      isVerified: true
    });

    await officer.save();
    req.session.otp = null;

    res.status(201).json({ message: "Officer registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.loginOfficer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const officer = await Officer.findOne({ email });
    if (!officer) return res.status(404).json({ message: "Officer not found" });

    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    officer.lastLogin = new Date();
    await officer.save();

    req.session.user = {
      email: user.email,
      loginTime: now
    };

    res.status(200).json({
      message: "Login successful",
      officer: {
        id: officer._id,
        name: officer.name,
        role: officer.role,
        department: officer.department
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
