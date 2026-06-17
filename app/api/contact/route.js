import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, business, mobile, email, requirement } = await req.json();

    // Basic server-side validation
    if (!name || !email || !requirement) {
      return NextResponse.json(
        { error: "Missing required fields. Name, Email, and Requirement are mandatory." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey.includes("your_api_key_here")) {
      return NextResponse.json(
        { error: "Resend API Key is not configured in environment variables." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";
    const adminEmail = process.env.ADMIN_EMAIL || "ashwanibaghel837@gmail.com";

    const { data, error } = await resend.emails.send({
      from: `BizzVector Leads <${fromEmail}>`,
      to: adminEmail,
      subject: `🚀 New Project Lead: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #f4f6f9;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .card {
              background-color: #ffffff;
              border-radius: 12px;
              padding: 32px;
              max-width: 600px;
              margin: 0 auto;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
              border: 1px solid #eef2f6;
            }
            .header {
              border-bottom: 2px solid #0057ff;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .header h2 {
              margin: 0;
              color: #0057ff;
              font-size: 24px;
              font-weight: 700;
            }
            .header p {
              margin: 4px 0 0 0;
              color: #666;
              font-size: 14px;
            }
            .field {
              margin-bottom: 18px;
            }
            .label {
              font-weight: 600;
              font-size: 12px;
              color: #888;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin-bottom: 4px;
            }
            .value {
              font-size: 16px;
              color: #111;
              line-height: 1.5;
            }
            .value-box {
              background-color: #f8fafc;
              border-left: 3px solid #0057ff;
              padding: 12px 16px;
              border-radius: 4px;
              font-style: italic;
              color: #334155;
              white-space: pre-line;
            }
            .footer {
              margin-top: 32px;
              border-top: 1px solid #eef2f6;
              padding-top: 16px;
              font-size: 12px;
              color: #999;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h2>New Lead Alert 🚀</h2>
              <p>Someone dropped a project requirement on BizzVector</p>
            </div>
            
            <div class="field">
              <div class="label">Name</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            
            <div class="field">
              <div class="label">Mobile Number</div>
              <div class="value">${mobile ? `<a href="tel:${mobile}">${mobile}</a>` : "Not provided"}</div>
            </div>
            
            <div class="field">
              <div class="label">Business / Company</div>
              <div class="value">${business || "Not provided"}</div>
            </div>
            
            <div class="field">
              <div class="label">Project Requirement</div>
              <div class="value-box">${requirement}</div>
            </div>
            
            <div class="footer">
              This email was automatically sent from the BizzVector contact form lead engine.
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Contact Form Server Error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
