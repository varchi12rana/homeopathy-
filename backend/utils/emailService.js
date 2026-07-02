const nodemailer = require('nodemailer');

const sendOrderConfirmationEmail = async (order, userDetails, pdfBuffer) => {
  try {
    // Create a transporter using environment variables or a fallback ethereal test account
    // In production, configure EMAIL_USER and EMAIL_PASS in your .env
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Homeovia Care" <${process.env.EMAIL_USER || 'noreply@homeovia.in'}>`,
      to: userDetails.email,
      subject: `Order Confirmation - ${order._id}`,
      text: `Dear ${userDetails.name},\n\nThank you for shopping with Homeovia! Your order (ID: ${order._id}) has been confirmed and payment was successful.\n\nPlease find your invoice attached.\n\nBest regards,\nHomeovia Team`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #047857;">Order Confirmation</h2>
          <p>Dear <strong>${userDetails.name}</strong>,</p>
          <p>Thank you for shopping with Homeovia! Your order (ID: <strong>${order._id}</strong>) has been confirmed and payment was successful.</p>
          <p>We are processing your order and will ship it shortly.</p>
          <p>Please find your invoice attached as a PDF to this email.</p>
          <br/>
          <p>Best regards,<br/><strong>Homeovia Team</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice_${order.invoiceNumber || order._id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};

module.exports = { sendOrderConfirmationEmail };
