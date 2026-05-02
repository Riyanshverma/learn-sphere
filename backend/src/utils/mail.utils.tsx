import { Resend } from "resend";
import React from "react";

export const resend = new Resend(Bun.env.RESEND_API_KEY);

export const TeacherInvitationMailTemplate = ({ token }: { token: string }): React.JSX.Element => {
    
  return (
    <div style={{ backgroundColor: "#0a0a0a", color: "#ffffff", fontFamily: "'Inter', -apple-system, sans-serif", margin: 0, padding: 0}}>
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "40px", backgroundColor: "#121212", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "24px", fontWeight: 200, marginBottom: "32px", color: "#008235" }}>LEARN SPHERE</div>

        <h1 style={{ fontSize: "28px", fontWeight: 200, marginBottom: "16px", color: "#ffffff" }}>Teacher Invitation</h1>

        <p style={{ fontSize: "16px", fontWeight: 200, lineHeight: "1.6", color: "#a1a1aa", marginBottom: "32px" }}>
          You have been invited to join Learn Sphere as a teacher. Since you already have an account on our platform, you can simply click the button below to link your existing account and complete your teacher profile.
        </p>

        <div style={{ marginBottom: "32px" }}>
          <a href={`${Bun.env.FRONTEND_URL}/teacher-signup?invite=resend#access_token=${token}`} style={{ display: "inline-block", padding: "16px 36px", backgroundColor: "#008235", color: "#ffffff", textDecoration: "none", fontSize: "16px", fontWeight: 500, borderRadius: "12px" }}>Accept Invitation</a>
        </div>

        <p style={{ fontSize: "14px", color: "#71717a", marginBottom: "32px" }}>If you didn't request this invitation, you can safely ignore this email.</p>

        <div style={{ fontSize: "12px", color: "#52525b", marginTop: "40px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "20px" }}>&copy; 2026 Learn Sphere. All rights reserved.</div>
      </div>
    </div>
  );
};
