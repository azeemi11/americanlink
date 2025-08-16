const nodemailer = require('nodemailer');

// Send estimate via email
exports.sendEstimate = async (req, res) => {
  try {
    const { email, subject, estimateNo, customerName, amount, pdfData } = req.body;

    if (!email || !pdfData) {
      return res.status(400).json({ message: "Email and PDF data are required" });
    }

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    // Extract base64 data from data URI
    const base64Data = pdfData.split('base64,')[1];
    
    // Email details
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #2c3e50; text-align: center;">Estimate #${estimateNo}</h2>
          <p>Dear ${customerName},</p>
          <p>Please find attached your estimate from American TradeLink Company.</p>
          <p>Estimate Amount: $${amount.toLocaleString()}</p>
          <p>Thank you for considering us!</p>
          <p>Best regards,<br>American TradeLink Company</p>
        </div>
      `,
      attachments: [
        {
          filename: `Estimate_${estimateNo}.pdf`,
          content: base64Data,
          encoding: 'base64'
        }
      ]
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: "Estimate sent successfully" });
  } catch (error) {
    console.error("Error sending estimate:", error);
    res.status(500).json({ message: "Failed to send estimate", error: error.message });
  }
};