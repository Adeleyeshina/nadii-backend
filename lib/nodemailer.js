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
    to: email,
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

export const orderAdminNotificationEmail = async (order, user) => {
  const info = await transporter.sendMail({
    from: `Your Store <${process.env.USER}>`,
    to: process.env.USER,
    subject: `🚨 New Order from ${user.name}`,
    text: `Hello Admin,

A new order has been placed:

Customer Name: ${user.name}
Customer Email: ${user.email}
Total Amount: ₦${order.totalAmount}
Order ID: ${order._id}
Payment Reference: ${order.reference}

Check your admin dashboard to fulfill the order.`,

    html: `<html>
            <head>
              <style>
                body {
                  background-color: #333333;
                  color: #ffffff;
                  font-family: Arial, sans-serif;
                  padding: 20px;
                }
                h2 {
                  font-size: 1.2rem;
                }
                p {
                  font-size: 1rem;
                }
                table {
                  width: 100%;
                  margin-top: 10px;
                  border-collapse: collapse;
                }
                td {
                  padding: 8px;
                  border: 1px solid #555555;
                }
                .label {
                  background-color: #555555;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <h2>🚨 New Order Notification</h2>
              <p>A new order has been placed on your store. Here are the details:</p>
              <table>
                <tr>
                  <td class="label">Customer Name</td>
                  <td>${user.name}</td>
                </tr>
                <tr>
                  <td class="label">Customer Email</td>
                  <td>${user.email}</td>
                </tr>
                <tr>
                  <td class="label">Total Amount</td>
                  <td>₦${order.totalAmount}</td>
                </tr>
                <tr>
                  <td class="label">Order ID</td>
                  <td>${order._id}</td>
                </tr>
                <tr>
                  <td class="label">Payment Reference</td>
                  <td>${order.reference}</td>
                </tr>
              </table>
              <p>Please log into your dashboard to process this order.</p>
              <p>– Your NadiiTech Team</p>
            </body>
          </html>`
  });

  console.log("Admin notification sent:", info.messageId);
};

export const orderCustomerNotificationEmail = async (order, user) => {
  const info = await transporter.sendMail({
    from: `Nadiitech <${process.env.USER}>`,
    to: user.email,
    subject: `✅ Order Confirmation – Order #${order._id}`,
    text: `Hi ${user.name},

We’ve received your payment successfully!

Order ID: ${order._id}
Amount Paid: ₦${order.totalAmount}
Payment Reference: ${order.reference}

We’re now processing your order. You’ll be notified when it ships.`,

    html: `<html>
            <head>
              <style>
                body {
                  background-color: #f5f5f5;
                  color: #333333;
                  font-family: Arial, sans-serif;
                  padding: 20px;
                }
                h2 {
                  font-size: 1.2rem;
                  color: #4caf50;
                }
                p {
                  font-size: 1rem;
                }
                table {
                  width: 100%;
                  margin-top: 10px;
                  border-collapse: collapse;
                }
                td {
                  padding: 8px;
                  border: 1px solid #dddddd;
                }
                .label {
                  background-color: #e0e0e0;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <h2>✅ Order Confirmation</h2>
              <p>Hi ${user.name},</p>
              <p>We’ve received your payment successfully! Here’s your order summary:</p>
              <table>
                <tr>
                  <td class="label">Order ID</td>
                  <td>${order._id}</td>
                </tr>
                <tr>
                  <td class="label">Amount Paid</td>
                  <td>₦${order.totalAmount}</td>
                </tr>
                <tr>
                  <td class="label">Payment Reference</td>
                  <td>${order.reference}</td>
                </tr>
              </table>
              <p>Your order is now being processed. You’ll receive another email once it ships.</p>
              <p>If you have questions, reply to this email or contact support.</p>
              <p>Thanks,<br>Your NadiiTech Team</p>
            </body>
          </html>`
  });

  console.log("Customer notification sent:", info.messageId);
};
