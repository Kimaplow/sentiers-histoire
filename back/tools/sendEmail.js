const nodemailer = require("nodemailer");

module.exports.sendEmailContact = async (info) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: info.email,
            to: process.env.MAIL_USER,
            subject: info.subject,
            text: info.firstName + "\n" + info.lastName + "\n\n" + info.message,
            html: "<p>" + info.firstName + "<br />" + info.lastName + "</p>" + "<p style='white-space: pre-line'>" + info.message + "</p>",
        });
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports.sendEmailPassword = async (email, link) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Les sentiers de l'histoire -- Mot de passe oublié",
            text: "Bonjour,\n\nVoici le lien pour changer votre mot de passe : " + link,
            html: "<p>Bonjour,<br/><br/>Voici le lien pour modifier votre mot de passe : " + link + "</p>"
        });
    } catch (error) {
        console.log(error, "email not sent");
    }
};