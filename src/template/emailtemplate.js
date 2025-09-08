exports.registrationTemplate = (
  name,
  email,
  otp,
  expireTime,
  verifyEmailLink
) => {
  return `

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Verify Your Email</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #e9f7f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e9f7f6; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width: 600px;" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
              <td align="center" style="padding: 40px 30px 20px 30px;">
                <h2 style="margin: 0; font-size: 22px; color: #333;">Hi ${name},</h2>
                <p style="font-size: 16px; color: #555;">Please verify that your email address is <strong>${email}</strong>, and that you entered it when signing up.</p>
              </td>
            </tr>

            <!-- OTP Info -->
            <tr>
              <td align="center" style="padding: 0 30px 20px 30px;">
                <p style="font-size: 16px; color: #555;">Your OTP is:</p>
                <div style="font-size: 24px; font-weight: bold; color: #00d084; margin: 10px 0;">${otp}</div>
                <p style="font-size: 14px; color: #999;">This OTP will expire in ${new Date(
                  expireTime
                )} minutes.</p>
              </td>
            </tr>

            <!-- Verify Button -->
            <tr>
              <td align="center" style="padding: 0 30px 30px 30px;">
                <a href="${verifyEmailLink}" target="_blank" style="display: inline-block; padding: 14px 28px; background-color: #00d084; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">
                  Verify email
                </a>
                <p style="font-size: 14px; color: #777; margin-top: 15px;">
                  Other users may see your organization, but your email stays private.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding: 20px 30px; background-color: #f7fdfd;">
                <p style="margin: 0; font-size: 14px; color: #555;">Happy registering,</p>
                <p style="margin: 0; font-size: 14px; color: #555;"><strong>The YourAppName Team</strong></p>
              </td>
            </tr>
          </table>

          <!-- Bottom Illustration Section -->
          <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <img src="https://i.imgur.com/FDwTYEQ.png" alt="illustration" width="100%" style="max-width: 600px; display: block; border: 0;" />
              </td>
            </tr>
            <tr>
              <td align="center" style="font-size: 14px; color: #999;">
                <a href="#" style="color: #00b894; margin: 0 10px;">About us</a> |
                <a href="#" style="color: #00b894; margin: 0 10px;">Contact</a> |
                <a href="#" style="color: #00b894; margin: 0 10px;">Facebook</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

