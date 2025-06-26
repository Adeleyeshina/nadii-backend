import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()


const transporter = nodemailer.createTransport({
    host:  process.env.HOST,
    port:  465,
    secure: true, 
    auth: {
        user : process.env.USER,
        pass : process.env.PASSWORD
    },
  });


export const accountActivationEmail = async (email, token, name, subject, type) => {
  const info = await transporter.sendMail({
    from: `Nadiitech ${process.env.USER}`,
    to: "adeleyeshina4@gmail.com",
    subject: `${subject}`,
    text: `Hello ${name}, please ${type === "signup" ? "activate your account" : "reset your account password"} here: ${process.env.FRONTEND_URI}/activate/${token}`,
    html : `<html>
              <head>
                  <style>
                      body {
                          background-color: #F5871F;
                          color: #fff;
                      }
                      h2{
                          font-size: 1.2rem;
                      }
                      p {
                          font-size: 1rem;
                      }
                  </style>
              </head>
              <body>
                  <h2>Hello ${name},</h2>
                  <p>Follow this link to ${type === "signup" ? "verify your email address" : "reset your password"} :</p>
                  <!-- Link -->
                <a href="${process.env.FRONTEND_URI}/${type === "signup" ? "activate" : "reset-password"}/${token}">
                    ${process.env.FRONTEND_URI}/${type === "signup" ? "activate" : "reset"}/${token}
                </a>
                  <p>if you didn't ask to verify this address, you can ignore this email.</p>
                  <p>Thanks,</p>
                  <p>Your NadiiTech team.</p>
              </body>
            </html>`

  });

  console.log("Message sent:", info.messageId);
};
export const adminMessage = async (subject, type, message) => {
    const parsed = JSON.parse(message)
    let refinedMessage = ''
    for (let key in parsed) {
        refinedMessage += `${key.toUpperCase()} : ${parsed[key] || 'N/A'}<br>`
    }
  const info = await transporter.sendMail({
    from: process.env.USER,
    to: process.env.USER,
    subject: subject,
    html : `<html>
              <head>
                  <style>
                      body {
                          background-color: #F5871F;
                          color: #fff;
                      }
                      h2{
                          font-size: 1.2rem;
                      }
                      p {
                          font-size: 1rem;
                      }
                  </style>
              </head>
              <body>
                  <h2>Someone ${type} on your website</h2>
                  <p>${refinedMessage}</p>
              </body>
            </html>`

  });

  console.log("Message sent:", info.messageId);
};

