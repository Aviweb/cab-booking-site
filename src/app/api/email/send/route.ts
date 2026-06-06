/**
 * Email Send API Route (Protected)
 * Handles sending emails via EmailService - restricted to authenticated users
 */

import { NextRequest } from "next/server";
import { handleApiRequest, successResponse } from "@/lib/utils/response";
import { withAuth, withRateLimit, ApiRequest } from "@/lib/middleware/apiAuth";
import { serviceFactory } from "@/lib/factories/ServiceFactory";
import { logger } from "@/lib/services/LoggingService";
import { ValidationError } from "@/lib/errors";

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

// POST handler with authentication and rate limiting
const authenticatedPOST = withAuth(
  withRateLimit(
    async (req: ApiRequest) => {
      return handleApiRequest(async () => {
        const user = req.user!; // Guaranteed by withAuth
        const body: EmailRequest = await req.json();
        
        logger.logApiRequest("POST", "/api/email/send", user.userId, { 
          role: user.role,
          to: body.to 
        });

        const { to, subject, html } = body;

        if (!to || !subject || !html) {
          throw new ValidationError("Missing required fields: to, subject, html");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
          throw new ValidationError("Invalid email format");
        }

        const emailService = serviceFactory.createEmailService();
        
        // Use the EmailService's sendEmail method (need to add this method)
        try {
          await emailService.sendCustomEmail(to, subject, html);
          
          logger.info("Custom email sent successfully", { 
            userId: user.userId,
            to,
            subject 
          }, "EMAIL");

          return successResponse(
            { to, subject },
            "Email sent successfully"
          );
        } catch (error) {
          logger.error("Failed to send custom email", { 
            error: (error as Error).message,
            userId: user.userId,
            to,
            subject 
          }, "EMAIL");
          
          throw error;
        }
      });
    },
    { maxRequests: 3, windowMs: 300000 } // 3 emails per 5 minutes per user
  ),
  { 
    roles: ["driver", "passenger"] // Both roles can send emails, but authenticated only
  }
);

export { authenticatedPOST as POST };