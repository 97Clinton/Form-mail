// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Set up the POST route to handle form submission
app.post('/send-email', (req, res) => {

    console.log(req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('All fields are required');
    }

    // Create transporter for nodemailer
    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'atayeroclinton.ac@gmail.com', // Your email address
            pass: ''   // Your email password or app-specific password
        }
    });

    // Email options
    let mailOptions = {
        from: email, // User's email
        to: 'atayeroclinton.ac@gmail.com', // Recipient's email address
        subject: `Contact form submission from ${name}`,
        // Send the form data in JSON format
        text: JSON.stringify({
            name: name,
            email: email,
            message: message
        }, null, 2),
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent: ' + info.response);
        res.send('Email sent successfully');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
