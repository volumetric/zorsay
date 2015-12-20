// Copy in your particulars and rename this to mail.js
module.exports = {
  service: "MailGun",
  // host: "smtp.mailgun.net",
  port: 587,
  secureConnection: false,
  //name: "servername",
  auth: {
    // user: "vinit",
    // pass: "S3ndgridP@ss"
  },
  ignoreTLS: false,
  debug: false,
  maxConnections: 5 // Default is 5
}
