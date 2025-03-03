import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import Contact from "../models/Contact.js";
import sendEmail from "../utils/emailService.js";

export const sendMessage = catchAsyncErrors(async (req, res) => {
  try {
    const { name, email, message } = req.body;
   
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Save message to the database
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // Send an email notification
    const emailSubject = `New Contact Message from ${name}`;
    const emailText = `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;

    await sendEmail(process.env.EMAIL_USER, emailSubject, emailText);

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Try again later." });
  }
});
