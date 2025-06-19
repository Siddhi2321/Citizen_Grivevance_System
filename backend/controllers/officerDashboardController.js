const Complaint = require('../models/complaint');
const Officer = require('../models/officer');

exports.getOfficerGrievances = async (req, res) => {
  try {
    const officerEmail = req.session.officer?.email;

    if (!officerEmail) {
      return res.status(401).json({ message: "Unauthorized: Officer not logged in" });
    }

    const officer = await Officer.findOne({ email: officerEmail });

    if (!officer) {
      return res.status(404).json({ message: "Officer not found" });
    }

    const { department, location } = officer;

    const grievances = await Complaint.find({
      department,
      "location.city": location.city,
      "location.district": location.district,
      officerId: officer._id
    }).sort({ submittedAt: -1 });

    const formattedGrievances = grievances.map(c => ({
      grievanceId: c.grievanceId,
      title: c.title,
      description: c.description,
      category: c.category,
      assignedDate: c.updatedAt.toLocaleDateString(),
      status: c.status,
    }));

    res.status(200).json({ grievances: formattedGrievances });
  } catch (error) {
    console.error("Error fetching officer grievances:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getGrievanceDetails = async (req, res) => {
  try {
    const officerEmail = req.session.officer?.email;
    const grievanceId = req.params.grievanceId;

    if (!officerEmail) {
      return res.status(401).json({ message: "Unauthorized: Officer not logged in" });
    }

    const officer = await Officer.findOne({ email: officerEmail });

    if (!officer) {
      return res.status(404).json({ message: "Officer not found" });
    }

    const complaint = await Complaint.findOne({
      grievanceId: grievanceId,
      officerId: officer._id
    }).populate('citizenId', 'email');

    if (!complaint) {
      return res.status(404).json({ message: "Grievance not found or not assigned to you" });
    }

    const grievanceDetails = {
      grievanceId: complaint.grievanceId,
      title: complaint.title,
      category: complaint.category,
      description: complaint.description,
      location: complaint.location,
      status: complaint.status,
      submittedDate: complaint.submittedAt.toLocaleDateString(),
      assignedDate: complaint.updatedAt.toLocaleDateString(),
      citizen: complaint.citizenId ? {
        email: complaint.citizenId.email
      } : null
    };

    res.status(200).json({ grievance: grievanceDetails });

  } catch (error) {
    console.error("Error fetching grievance details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getOfficerComplaintStats = async (req, res) => {
  try {
    const officerEmail = req.session.officer?.email;

    if (!officerEmail) {
      return res.status(401).json({ message: "Unauthorized: Officer not logged in" });
    }

    const officer = await Officer.findOne({ email: officerEmail });

    if (!officer) {
      return res.status(404).json({ message: "Officer not found" });
    }

    const officerId = officer._id;

    const statuses = ['pending', 'in_progress', 'resolved', 'revert_back'];

    const stats = {};
    for (const status of statuses) {
      stats[status] = await Complaint.countDocuments({
        officerId,
        status
      });
    }

    const totalAssigned = Object.values(stats).reduce((acc, val) => acc + val, 0);

    res.status(200).json({
      totalAssigned,
      pending: stats.pending,
      in_progress: stats.in_progress,
      resolved: stats.resolved,
      revert_back: stats.revert_back
    });
  } catch (error) {
    console.error("Error fetching officer complaint stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

