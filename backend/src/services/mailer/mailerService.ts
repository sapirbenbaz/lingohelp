import nodemailer, { Transporter } from "nodemailer";
import { Word } from "../../../../shared/interfaces/Word";
import { config } from "../../config";
import Handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";

export class MailerService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: config.smtpEmail,
        pass: config.smtpPassword,
      },
    });
  }

  async sendEmail(words: Array<Word>, language: string, story: string) {
    const templatePath = "./mailTemplate.hbs";
    const templateSource = await fs.readFile(
      path.resolve(__dirname, templatePath),
      "utf8"
    );
    const template = Handlebars.compile(templateSource);

    const data = {
      language,
      words: words.map((word) => word.word).join(", "),
      story: story.replace(/\n/g, "<br>"),
    };

    const htmlContent = template(data);

    const mailOptions = {
      to: config.smtpEmail,
      subject: `Your daily ${language} practice story!`,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

const mailerService = new MailerService();
export default mailerService;
