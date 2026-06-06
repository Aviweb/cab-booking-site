/**
 * Email Service
 * Handles email notifications for bookings with enhanced configuration
 */

import { configService } from "@/lib/config/ConfigurationService";
import { logger } from "@/lib/services/LoggingService";

interface BookingEmailData {
  passengerName: string;
  passengerEmail: string;
  bookingId: string;
  car: string;
  startLoc: string;
  endLoc: string;
  dateTime: string;
  mobile: string;
}

export class EmailService {
  private async sendEmail(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {
    if (!configService.isEmailEnabled) {
      logger.warn("Email service not configured", { to, subject }, "EMAIL");
      return;
    }

    try {
      const nodemailer = await import("nodemailer");

      const transporter = nodemailer.default.createTransport({
        host: configService.getOptional("SMTP_HOST"),
        port: configService.getNumber("SMTP_PORT"),
        secure: configService.getBoolean("SMTP_SECURE"),
        auth: {
          user: configService.getOptional("SMTP_USER"),
          pass: configService.getOptional("SMTP_PASS"),
        },
      });

      const mailOptions = {
        from: configService.getOptional("SMTP_FROM") || configService.getOptional("SMTP_USER"),
        to,
        subject,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info("Email sent successfully", { 
        to, 
        subject, 
        messageId: info.messageId 
      }, "EMAIL");
    } catch (error) {
      logger.error("Email sending failed", { 
        error: (error as Error).message, 
        to, 
        subject 
      }, "EMAIL");
      
      if (
        error instanceof Error &&
        error.message.includes("Cannot find module")
      ) {
        logger.warn(
          "nodemailer not installed. Run: npm install nodemailer @types/nodemailer",
          {},
          "EMAIL"
        );
        return;
      }
      throw error;
    }
  }

  /**
   * Send custom email (public method for API use)
   */
  async sendCustomEmail(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {
    logger.info("Sending custom email", { to, subject }, "EMAIL");
    await this.sendEmail(to, subject, html);
  }

  private formatBookingConfirmationEmail(data: BookingEmailData): string {
    const formattedDate = new Date(data.dateTime).toLocaleString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #30cfd0, #8367ed); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Booking Confirmed!</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${data.passengerName},</p>
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thank you for booking with us! Your ride has been confirmed. Here are your booking details:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8367ed;">
              <h2 style="color: #8367ed; margin-top: 0; font-size: 20px;">Booking Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Booking ID:</td>
                  <td style="padding: 8px 0; color: #111827;">${data.bookingId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Vehicle:</td>
                  <td style="padding: 8px 0; color: #111827;">${data.car}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">From:</td>
                  <td style="padding: 8px 0; color: #111827;">${data.startLoc}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">To:</td>
                  <td style="padding: 8px 0; color: #111827;">${data.endLoc}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Date & Time:</td>
                  <td style="padding: 8px 0; color: #111827;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Mobile:</td>
                  <td style="padding: 8px 0; color: #111827;">${data.mobile}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Status:</td>
                  <td style="padding: 8px 0; color: #059669; font-weight: bold;">Pending</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 16px; margin-top: 20px; color: #6b7280;">
              We will contact you soon to confirm your ride. Please keep your phone available.
            </p>
            
            <p style="font-size: 14px; margin-top: 30px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              If you have any questions or need to modify your booking, please contact our support team.
            </p>
            
            <p style="font-size: 14px; margin-top: 10px; color: #9ca3af;">
              Best regards,<br>
              <strong>Cab Booking Team</strong>
            </p>
          </div>
        </body>
      </html>
    `;
  }

  async sendBookingConfirmation(data: BookingEmailData): Promise<void> {
    const subject = `Booking Confirmation - ${data.bookingId}`;
    const html = this.formatBookingConfirmationEmail(data);

    await this.sendEmail(data.passengerEmail, subject, html);
  }
}
