const Brevo = require('@getbrevo/brevo');
require('dotenv').config();

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API
);

const sendEmail = async ({ toEmail, subject, text }) => {
  const sender = { name: "Citizens Grievance System", email: "siddhi280921@gmail.com" };

  const receivers = [{ email: toEmail }];

  try {
    const response = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject,
      textContent: text,
    });

    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
