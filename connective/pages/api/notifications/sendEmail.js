import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const sendEmail = async (subject, template, email) => {
  return new Promise((resolve, reject) => {
    console.log("Sending an email to " + email);
    const msg = {
      to: email,
      from: "notifications@connective-app.xyz",
      subject: subject,
      text: template.replace(/<[^>]*>?/gm, ""),
      html: template,
    };
    sgMail
      .send(msg)
      .then((data) => {
        console.log(`Email sent successfully to ${email}`);
        resolve(true);
      })
      .catch((error) => {
        reject(error.message);
        console.error(error);
      });
  });
};

module.exports = { sendEmail };
