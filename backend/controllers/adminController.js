const Admin = require("../models/admin");
const Complaint = require('../models/complaint');
const User = require('../models/user');
const Officer = require('../models/officer');
const bcrypt = require('bcrypt');

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // const isMatch = await bcrypt.compare(password, admin.password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    if(password !== admin.password){
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const now = new Date();
    admin.lastLogin = now;
    await admin.save();

    req.session.admin = {
      email: admin.email,
      department: admin.department,
      loginTime: now
    };

    res.status(200).json({
      message: "Login successful",
      admin: {
        admin_id: admin.admin_id,
        email: admin.email,
        role: admin.role,
        department: admin.department
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.dashboardStats = async (req, res) => {
  try {
    const department = req.session.admin?.department;

    if (!department) {
      return res.status(401).json({ message: "Unauthorized: Admin not logged in" });
    }

    const [total, pending, resolved, inProgress, revertBack] = await Promise.all([
      Complaint.countDocuments({ department }),
      Complaint.countDocuments({ department, status: 'pending' }),
      Complaint.countDocuments({ department, status: 'resolved' }),
      Complaint.countDocuments({ department, status: 'in_progress' }),
      Complaint.countDocuments({ department, status: 'revert_back' })
    ]);

    res.status(200).json({
      department,
      totalGrievances: total,
      pending,
      resolved,
      inProgress,
      revertBack
    });
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//assign complaints

exports.getDepartmentComplaints = async (req, res) => {
  try {
    const { department } = req.session.admin;

    if (!department) return res.status(401).json({ message: "Admin not logged in" });

    const complaints = await Complaint.find({
      department,
      officerId: null 
    }).sort({ submittedAt: -1 });

    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching department complaints:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getDepartmentOfficers = async (req, res) => {
  try {
    const { department } = req.session.admin;

    if (!department) return res.status(401).json({ message: "Admin not logged in" });

    const officers = await Officer.find({ department }, 'name email');

    res.status(200).json({ officers }); // use this for dropdown
  } catch (error) {
    console.error("Error fetching officers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.assignOfficerToComplaint = async (req, res) => {
  try {
    const { officerName, grievanceId } = req.body;
    console.log("Assigning complaint:", grievanceId, "to", officerName);


    if (!officerName || !grievanceId) {
      return res.status(400).json({ message: "Officer name and grievance ID are required" });
    }

    const officer = await Officer.findOne({ name: officerName });
    console.log("Officer found:", officer._id);

    if (!officer) {
      return res.status(404).json({ message: "Officer not found" });
    }

    const updatedComplaint = await Complaint.findOneAndUpdate(
      { grievanceId },
      { officerId: officer._id, status: 'in_progress', updatedAt: new Date() },
      { new: true }
    );
    console.log("Complaint updated:", updatedComplaint);

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      message: "Complaint assigned successfully",
      complaint: updatedComplaint
    });

  } catch (error) {
    console.error("Error assigning officer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// exports.getOfficerPerformance = async (req, res) => {
//   try {
//     const department = req.session.admin?.department;

//     if (!department) {
//       return res.status(401).json({ message: "Unauthorized: Admin not logged in" });
//     }

//     // Get all officers of this department
//     const officers = await Officer.find({ department });

//     // If no officers found
//     if (officers.length === 0) {
//       return res.status(200).json({ officerPerformance: [] });
//     }

//     // Get all complaints of this department
//     const complaints = await Complaint.find({ department });

//     // Prepare performance data
//     const performance = officers.map(officer => {
//       const assigned = complaints.filter(c => c.officerId?.toString() === officer._id.toString());
//       const resolved = assigned.filter(c => c.status === 'resolved');

//       const avgTime = resolved.length > 0
//         ? (
//             resolved.reduce((sum, comp) => {
//               const submitted = new Date(comp.submittedAt).getTime();
//               const updated = new Date(comp.updatedAt).getTime();
//               const duration = (updated - submitted) / (1000 * 60 * 60 * 24); // in days
//               return sum + duration;
//             }, 0) / resolved.length
//           ).toFixed(1)
//         : 0;

//       return {
//         name: officer.name,
//         assigned: assigned.length,
//         resolved: resolved.length,
//         avgTime: parseFloat(avgTime)
//       };
//     });

//     res.status(200).json({ officerPerformance: performance });
//   } catch (error) {
//     console.error("Error in getOfficerPerformance:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// //officer performance
exports.getOfficerPerformance = async (req, res) => {
  try {
    const department = req.session.admin?.department;

    if (!department) {
      return res.status(401).json({ message: "Unauthorized: Admin not logged in" });
    }
    const officers = await Officer.find({ department });

    const performanceData = await Promise.all(
      officers.map(async (officer) => {
        const assignedComplaints = await Complaint.find({ officerId: officer._id });

        const resolvedComplaints = assignedComplaints.filter(c => c.status === 'resolved');

        const resolutionRate = assignedComplaints.length > 0
          ? ((resolvedComplaints.length / assignedComplaints.length) * 100).toFixed(0)
          : '0';

        const avgResolutionTimeInMs = resolvedComplaints.reduce((sum, complaint) => {
          return sum + (new Date(complaint.updatedAt) - new Date(complaint.submittedAt));
        }, 0) / (resolvedComplaints.length || 1);

        const avgResolutionTime = (avgResolutionTimeInMs / (1000 * 60 * 60 * 24)).toFixed(1);

        return {
          officerName: officer.name,
          assigned: assignedComplaints.length,
          resolved: resolvedComplaints.length,
          resolutionRate: `${resolutionRate}%`,
          avgResolutionTime: `${avgResolutionTime} days`
        };
      })
    );

    res.status(200).json({ performance: performanceData });

  } catch (error) {
    console.error("Error fetching officer performance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};