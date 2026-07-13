import express from "express";
import nodemailer from "nodemailer";
import Invoice from "../models/InvoicesModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:id/email", protect, async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const invoice = await Invoice.findOne({ _id: invoiceId, userId: req.user.id }).populate("customerDetails");

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    const customer = invoice.customerDetails;
    if (!customer || !customer.email) {
      return res.status(400).json({ success: false, message: "Customer email address is not registered." });
    }

    // Configure Ethereal Test Mail Service
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user, 
        pass: testAccount.pass, 
      },
    });

    const mailOptions = {
      from: '"BizPulse Billing Services" <billing@bizpulse.com>',
      to: customer.email,
      subject: `Invoice Summary #${invoice.InvoiceNumber} - BizPulse`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">BizPulse Portal</h1>
            <span style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em;">Billing Notification</span>
          </div>
          
          <p style="color: #374151; font-size: 16px;">Dear ${customer.BusinessName},</p>
          <p style="color: #4b5563; line-height: 1.6;">An invoice has been generated and posted to your account for your recent order details. Below is a brief summary of the amount outstanding:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
            <tr style="background-color: #f9fafb;">
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; font-weight: 600; color: #374151;">Invoice Reference</th>
              <td style="padding: 12px; border: 1px solid #e5e7eb; color: #4b5563;">#${invoice.InvoiceNumber}</td>
            </tr>
            <tr>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; font-weight: 600; color: #374151;">Date of Issue</th>
              <td style="padding: 12px; border: 1px solid #e5e7eb; color: #4b5563;">${invoice.DateofIssue || "N/A"}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; font-weight: 600; color: #374151;">Total Billed Amount</th>
              <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981; font-size: 16px;">
                $${(invoice.InvoiceAmount || 0).toFixed(2)}
              </td>
            </tr>
          </table>

          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">To view complete breakdown details, download PDFs, or process transaction logs, please log in to your central client workspace.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);">
              Access Account Dashboard
            </a>
          </div>

          <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 20px; line-height: 1.4;">
            This is an automated dispatch from the BizPulse accounting node. Please do not reply to this email thread.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log("Email dispatch completed. Ethereal URL:", previewUrl);

    return res.status(200).json({
      success: true,
      message: "Invoice email sent successfully via Ethereal test mailer!",
      previewUrl: previewUrl,
    });
  } catch (error) {
    console.error("Failed to email invoice:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to compile or dispatch invoice email.",
      error: error.message,
    });
  }
});

export default router;
