import emailjs from "emailjs-com";

export async function POST(req) {
  const { to_email, subject, message } = await req.json(); // Get the request body

  try {
    // EmailJS service credentials (keep these secure)
    const serviceID = process.env.EMAILJS_SERVICE_ID;
    const templateID = process.env.EMAILJS_TEMPLATE_ID;
    const userID = process.env.EMAILJS_USER_ID;

    // Prepare the email parameters
    const emailParams = {
      to_email: to_email,
      subject: subject,
      message: message,
    };

    // Send the email through EmailJS
    const response = await emailjs.send(
      serviceID,      // Your Service ID
      templateID,     // Your Template ID
      emailParams,    // The email parameters (message, to_email, etc.)
      userID          // Your User ID
    );

    return new Response(JSON.stringify({ success: true, response }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
