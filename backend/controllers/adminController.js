const Admin = require("../models/admin");
const Complaint = require('../models/complaint');
const User = require('../models/user');


exports.manageComplaints= async (req, res) => {

}

exports.manageOfficers = async (req, res) => {

}

exports.dashboardStats = async (req, res) => {
  try {
    const [resolvedCount, pendingCount, userCount] = await Promise.all([
      Complaint.countDocuments({ status: 'resolved' }),
      Complaint.countDocuments({ status: { $in: ['pending', 'revert_back'] } }),
      User.countDocuments()
    ]);

    res.status(200).json({
      resolvedCount,
      pendingCount,
      userCount
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
