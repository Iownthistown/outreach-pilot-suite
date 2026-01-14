import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[NOTIFY-NEW-SIGNUP] ${step}${detailsStr}`);
};

interface NewUserPayload {
  id: string;
  email?: string;
  created_at: string;
  full_name?: string;
  provider?: string;
}

async function sendEmailNotification(userData: NewUserPayload): Promise<void> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@costras.com";
  const fromEmail = Deno.env.get("FROM_EMAIL") || "onboarding@resend.dev";

  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  logStep("Preparing email notification", { adminEmail, fromEmail });

  // Extract user name from data
  const userName = userData.full_name || 
                   (userData.email ? userData.email.split('@')[0] : 'Unknown User');
  
  const signupTime = new Date(userData.created_at).toLocaleString('nl-NL', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Amsterdam'
  });

  const provider = userData.provider || 'email';

  // Beautiful HTML email template
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New User Signup</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-align: center;">
                🎉 New User Signup!
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; text-align: center;">
                A new user just joined Costras
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- User Info Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6c757d; font-size: 14px; font-weight: 500;">Name</span>
                          <p style="margin: 4px 0 0; color: #212529; font-size: 16px; font-weight: 600;">${userName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid #e9ecef;">
                          <span style="color: #6c757d; font-size: 14px; font-weight: 500;">Email</span>
                          <p style="margin: 4px 0 0; color: #212529; font-size: 16px; font-weight: 600;">${userData.email || 'Not provided'}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid #e9ecef;">
                          <span style="color: #6c757d; font-size: 14px; font-weight: 500;">User ID</span>
                          <p style="margin: 4px 0 0; color: #212529; font-size: 14px; font-family: monospace; word-break: break-all;">${userData.id}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid #e9ecef;">
                          <span style="color: #6c757d; font-size: 14px; font-weight: 500;">Signup Method</span>
                          <p style="margin: 4px 0 0; color: #212529; font-size: 16px; font-weight: 600; text-transform: capitalize;">${provider}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid #e9ecef;">
                          <span style="color: #6c757d; font-size: 14px; font-weight: 500;">Signup Time</span>
                          <p style="margin: 4px 0 0; color: #212529; font-size: 16px; font-weight: 600;">${signupTime}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://supabase.com/dashboard/project/sjsuwthvozuzabktkcxu/auth/users" 
                       style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      View in Supabase Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #6c757d; font-size: 14px; text-align: center;">
                This is an automated notification from Costras.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // Plain text version
  const textContent = `
🎉 New User Signup on Costras!

User Details:
- Name: ${userName}
- Email: ${userData.email || 'Not provided'}
- User ID: ${userData.id}
- Signup Method: ${provider}
- Signup Time: ${signupTime}

View in Supabase Dashboard:
https://supabase.com/dashboard/project/sjsuwthvozuzabktkcxu/auth/users

---
This is an automated notification from Costras.com
  `;

  logStep("Sending email via Resend API");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [adminEmail],
      subject: `🎉 New User Signup: ${userName}`,
      html: htmlContent,
      text: textContent,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    logStep("Resend API error", { status: response.status, error: errorData });
    throw new Error(`Resend API error: ${response.status} - ${errorData}`);
  }

  const result = await response.json();
  logStep("Email sent successfully", { emailId: result.id });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Parse user data from request body
    const userData: NewUserPayload = await req.json();

    // Validate user data
    if (!userData || !userData.id) {
      throw new Error("Invalid user data: missing id");
    }

    logStep("User data received", { 
      userId: userData.id, 
      email: userData.email,
      provider: userData.provider 
    });

    // Send email notification
    await sendEmailNotification(userData);

    logStep("Notification sent successfully");

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification sent successfully",
        userId: userData.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in notify-new-signup", { message: errorMessage });

    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
