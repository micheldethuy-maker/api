import nodemailer from "nodemailer";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { name, email, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: "michel.dethuy@sensum-consulting.com",
        pass: process.env.GOOGLE_SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "contact@sensum-consulting.com",
      to: "michel.dethuy@sensum-consulting.com",
      subject: "Nouveau message via le site Sensum Consulting",
      text: `
Nom : ${name}
Email : ${email}
Entreprise : ${company}
Message :
${message}
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erreur sending mail:", error);
    return res.status(500).json({ error: "Erreur interne serveur" });
  }
}
