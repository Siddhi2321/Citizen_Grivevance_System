const Complaint = require('../models/complaint');
const User = require('../models/user');
const Officer = require('../models/officer');
const { v4: uuidv4 } = require('uuid');

// exports.submitComplaint = async (req, res) => {
//   try {
//     const {
//       title,
//       category,
//       description,
//       location,
//       attachments,
//       email
//     } = req.body;

//     const categoryToDepartment = {
//       'Municipal Issues': 'Municipal Corporation',
//       'Utility Services': 'Electricity & Water Department',
//       'Public Safety & Law Enforcement': 'Police Department',
//       'Government Schemes & Services': 'Administration',
//       'Healthcare & Sanitation': 'Health Department',
//       'Education & Youth Services': 'Education Department',
//       'Transport & Infrastructure': 'Transport Department',
//       'Digital and Online Services': 'IT Department',
//       'Others (General Complaints)': 'General Affairs'
//     };

//     const department = categoryToDepartment[category] || 'General Affairs';

//     const citizen = await User.findOne({ email });
//     if (!citizen) return res.status(404).json({ message: 'Citizen not found' });

//     const officer = await Officer.findOne({
//       department,
//       "location.district": district,
//       "location.city": city,
//     });

//     if (!officer) {
//      officer = await Officer.findOne({ department });
//     } 

//     const grievanceId = uuidv4();

//     const complaint = new Complaint({
//       grievanceId,
//       title,
//       category,
//       description,
//       location,
//       department,
//       citizenId: citizen._id,
//       officerId: officer ? officer._id : null,
//       contactInfo: { email },
//       attachments
//     });

//     await complaint.save();

//     // Update complaint ID in user (optional - if multiple allowed, use array)
//     User.complaint_ids.push(grievanceId);
//     await User.save();

//     res.status(201).json({
//       message: 'Complaint submitted successfully',
//       grievanceId,
//       complaint
//     });
//   } catch (error) {
//     console.error('Error submitting complaint:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.submitComplaint = async (req, res) => {
  try {
    const {
      email,
      category,
      title,
      description,
      location,
      attachments = []
    } = req.body;

    if (!email || !category || !description || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Destructure location safely
    const { district, city, pincode, addressLine } = location;

     const categoryToDepartment = {
      'Municipal Issues': 'Municipal Corporation',
      'Utility Services': 'Electricity & Water Department',
      'Public Safety & Law Enforcement': 'Police Department',
      'Government Schemes & Services': 'Administration',
      'Healthcare & Sanitation': 'Health Department',
      'Education & Youth Services': 'Education Department',
      'Transport & Infrastructure': 'Transport Department',
      'Digital and Online Services': 'IT Department',
      'Others (General Complaints)': 'General Affairs'
    };

    const department = categoryToDepartment[category] || 'General Affairs';
    // Get or create citizen
    let citizen = await User.findOne({ email });
    if (!citizen) {
      citizen = await User.create({ email });
    }

    // Find matching officer
    let assignedOfficer = await Officer.findOne({
      department,
      'location.district': district,
      'location.city': city
    });

    if (!assignedOfficer) {
      assignedOfficer = await Officer.findOne({ department });
    } 
    const grievanceId = uuidv4();
    // Create complaint
    const newComplaint = new Complaint({
      grievanceId,  
      title,
      category,
      description,
      department,
      location: {
        state: 'Maharashtra',
        district,
        city,
        pincode,
        addressLine
      },
      citizenId: citizen._id,
      contactInfo: { email },
      officerId: assignedOfficer ? assignedOfficer._id : null,
      attachments
    });

    await newComplaint.save();

    // Add complaint to user's list
    citizen.complaint_ids = citizen.complaint_ids || [];
citizen.complaint_ids.push(newComplaint._id);
await citizen.save();


    return res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: newComplaint
    });

  } catch (error) {
    console.error("Error submitting complaint:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
