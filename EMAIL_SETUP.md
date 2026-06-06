# Email Notification Setup Guide

This guide explains how to configure SMTP environment variables for email notifications when booking requests are submitted.

## Environment Variables Required

Add these variables to your `.env` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_SECURE=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Instructions for Different Email Providers

### 1. Gmail Setup

1. **Enable 2-Step Verification**:

   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification
   - Enable it if not already enabled

2. **Generate App Password**:

   - Go to Google Account → Security
   - Under "2-Step Verification", click "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Enter "Cab Booking Site" as the name
   - Copy the 16-character password generated

3. **Configure `.env` file**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   SMTP_FROM=your-email@gmail.com
   SMTP_SECURE=false
   ```

### 2. Outlook/Hotmail Setup

1. **Enable App Password**:

   - Go to Microsoft Account Security
   - Enable 2-factor authentication
   - Go to Security → Advanced security options
   - Create a new app password

2. **Configure `.env` file**:
   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=your-email@outlook.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@outlook.com
   SMTP_SECURE=false
   ```

### 3. Yahoo Mail Setup

1. **Generate App Password**:

   - Go to Yahoo Account Security
   - Enable 2-factor authentication
   - Generate an app-specific password

2. **Configure `.env` file**:
   ```env
   SMTP_HOST=smtp.mail.yahoo.com
   SMTP_PORT=587
   SMTP_USER=your-email@yahoo.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@yahoo.com
   SMTP_SECURE=false
   ```

### 4. Custom SMTP Server Setup

If you're using a custom SMTP server (like SendGrid, Mailgun, AWS SES, etc.):

```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@yourdomain.com
SMTP_SECURE=false
```

**For SendGrid**:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
SMTP_SECURE=false
```

**For Mailgun**:

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
SMTP_FROM=noreply@yourdomain.com
SMTP_SECURE=false
```

**For AWS SES**:

```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-smtp-username
SMTP_PASS=your-aws-smtp-password
SMTP_FROM=noreply@yourdomain.com
SMTP_SECURE=false
```

## Port and Security Settings

- **Port 587**: Use with `SMTP_SECURE=false` (TLS/STARTTLS) - Recommended
- **Port 465**: Use with `SMTP_SECURE=true` (SSL/TLS)
- **Port 25**: Usually blocked by ISPs, not recommended

## Testing Email Configuration

1. Create a booking through the application
2. Check the server console logs for email sending status
3. If SMTP is not configured, you'll see: "Email service not configured. Email would be sent to: [email]"
4. If SMTP is configured, you'll see: "Email sent successfully: [messageId]"

## Troubleshooting

### Email not sending?

1. **Check environment variables**: Ensure all SMTP variables are set correctly
2. **Check app password**: Make sure you're using an app password, not your regular password
3. **Check firewall**: Ensure port 587 is not blocked
4. **Check logs**: Check server console for error messages
5. **Test connection**: Try using an email client with the same SMTP settings

### Common Errors

- **"Authentication failed"**: Check your username and app password
- **"Connection timeout"**: Check SMTP_HOST and SMTP_PORT
- **"Cannot find module nodemailer"**: Run `npm install nodemailer @types/nodemailer`

## Development Mode

If SMTP is not configured, the system will:

- Log email details to the console
- Not send actual emails
- Still allow bookings to be created successfully

This allows you to develop and test without email configuration.

## Production Mode

For production, ensure:

1. All SMTP environment variables are set
2. Use a reliable email service (SendGrid, Mailgun, AWS SES recommended)
3. Use your domain email for `SMTP_FROM`
4. Set `NEXT_PUBLIC_APP_URL` to your production URL