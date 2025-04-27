// Contact Form Server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// API Endpoint for handling contact form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Simple validation
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide name, email, and message' 
    });
  }
  
  // Prepare email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'contact@devsquad.tech', // Replace with your contact email
    subject: `Portfolio Contact: ${subject || 'New message'}`,
    html: `
      <h3>New message from portfolio contact form</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };
  
  try {
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Return error response
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// API Endpoint for team contact form with service selection
app.post('/api/team-contact', async (req, res) => {
  const { name, email, service, message } = req.body;
  
  // Simple validation
  if (!name || !email || !service || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please fill all the required fields' 
    });
  }
  
  // Prepare email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'team@devsquad.tech', // Team email address
    subject: `Team Portfolio Contact: ${service} Service Request`,
    html: `
      <h3>New project inquiry from team portfolio</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service Requested:</strong> ${service}</p>
      <p><strong>Project Details:</strong></p>
      <p>${message}</p>
    `
  };
  
  try {
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Your project inquiry has been sent successfully!'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Return error response
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});