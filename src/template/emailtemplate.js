exports.registrationTemplate = () => {
  return `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f7fb;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
      .header {
        background: #2563eb;
        padding: 20px;
        text-align: center;
        color: white;
        font-size: 20px;
        font-weight: bold;
      }
      .content {
        padding: 24px 28px;
        color: #374151;
      }
      .content h2 {
        margin-top: 0;
        font-size: 22px;
        color: #111827;
      }
      .info {
        margin: 12px 0;
        font-size: 15px;
        color: #555;
      }
      .otp {
        font-family: monospace;
        font-size: 20px;
        font-weight: bold;
        background: #f3f4f6;
        padding: 10px 16px;
        border-radius: 8px;
        display: inline-block;
        letter-spacing: 2px;
      }
      .btn {
        display: inline-block;
        margin-top: 20px;
        background: #2563eb;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
      }
      .btn:hover {
        background: #1e4bb8;
      }
      .footer {
        padding: 16px;
        text-align: center;
        font-size: 12px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Verify Your Email</div>
      <div class="content">
        <h2>Hello, ${name}</h2>
        <p class="info">We received a request to create an account with the email:</p>
        <p><strong>${email}</strong></p>
        
        <p class="info">Please verify your email by entering the OTP below or clicking the button:</p>
        <div class="otp">${otp}</div>

        <p class="info">This code will expire on <strong>${new Date(
          formattedExpire
        )}</strong>.</p>

        <a class="btn" href="${verifyEmailLink}" target="_blank">Verify Email</a>
        
        <p class="info" style="margin-top:20px;">If you didn’t request this, please ignore this email.</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </div>
  </body>
  </html>
`;
}
