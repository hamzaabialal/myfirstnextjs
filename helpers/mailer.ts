import { Resend } from 'resend';
import User from "@/models/userModels";
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");

    let updateFields: any = {};
    if (emailType === "VERIFY") {
      updateFields = {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      };
    } else if (emailType === "RESET") {
      updateFields = {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      };
    }

    await User.findByIdAndUpdate(userId, updateFields, { new: true });

    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev", // this must be your verified sender
      to: email,
      subject: emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
      html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${token}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</p>`
    });

    console.log("✅ Email sent via Resend:", emailResponse);
    return emailResponse;
  } catch (error: any) {
    console.error("❌ Resend email error:", error);
    throw new Error(error.message);
  }
};
