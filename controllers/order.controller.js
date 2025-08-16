const Order = require("../models/order.model.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

/**
 * AddOrder allows anyone (user or guest) to place an order.
 * If userId is present, order is linked to the user; otherwise, identified by email.
 */
const AddOrder = async (req, res) => {
    try {
        const { userId, carId, price, name, email, phone, payment, country, address, city } = req.body;

        // Validate input (userId is optional)
        if (!carId || !price || !name || !email || !phone || !payment || !country) {
            return res.status(400).json({ message: "All fields except userId are required." });
        }

        // Check if the car is already ordered by the same user (by userId if exists, otherwise by email)
        let existingOrder;
        if (userId) {
            existingOrder = await Order.findOne({ userId, carId });
        } else {
            existingOrder = await Order.findOne({ email, carId });
        }
        if (existingOrder) {
            return res.status(400).json({ message: "Car already ordered." });
        }

        // Handle different payment types and send verification email
        let tokenPayload = { email, price, name, phone, country };
        let subject = "";
        let verifyUrl = "";

        if (payment === "paypal") {
            tokenPayload = { email, price, name, phone, country };
            subject = "Verify your PayPal payment";
            verifyUrl = `${process.env.FRONTENDURL}/payment/`;
        } else if (payment === "wire") {
            tokenPayload = { email, price, name, phone, country, address, city };
            subject = "Verify your Wire payment";
            verifyUrl = `${process.env.FRONTENDURL}/bank/`;
        } else if (payment === "wallet") {
            tokenPayload = { email, price, name, phone, country, address, city };
            subject = "Verify your Wallet payment";
            verifyUrl = `${process.env.FRONTENDURL}/wallet/`;
        }

        if (verifyUrl) {
            // Set token to expire in 1 week (7 days)
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "7d" });

            // Nodemailer configuration
            const transporter = nodemailer.createTransport({
                service: "gmail",
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            // Email details
            const receiver = {
                from: process.env.EMAIL,
                to: email,
                subject: subject,
                html: `
                    <p>To verify your payment, please click the link below:</p>
                    <a href="${verifyUrl}${token}" target="_blank">
                        Verify Payment
                    </a>
                    <p>This link will expire in <b>one week</b>.</p>
                `,
            };

            // Send the email
            await transporter.sendMail(receiver);
        }

        // Create a new order (userId optional)
        const orderData = { carId, price, name, email, phone, payment, country };
        if (userId) orderData.userId = userId;
        if (address) orderData.address = address;
        if (city) orderData.city = city;

        const order = await Order.create(orderData);
        return res.status(201).json({ message: "Order created successfully.", order });

    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const GetOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json({ message: "Orders fetched successfully.", orders });   
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};

const DeleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);
        return res.status(200).json({ message: "Order deleted successfully.", order });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};

const UpdateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, carId, price, name, email, phone, payment, status, country, address, city } = req.body;
        const updateData = { carId, price, name, email, phone, payment, status, country, address, city };
        if (userId) updateData.userId = userId;
        const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
        return res.status(200).json({ message: "Order updated successfully.", order });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};

const OrderByid = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        return res.status(200).json({ message: "Order fetched successfully.", order });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};

const OrderByuserid = async (req, res) => {
    try {
        const { id } = req.params;
        const orders = await Order.find({ userId: id });
        return res.status(200).json({ message: "Orders fetched successfully.", orders });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};

/**
 * Send Invoice email with PDF attachment
 */
const sendInvoice = async (req, res) => {
    try {
        const { email, subject, invoiceNo, customerName, amount, pdfData } = req.body;

        if (!email || !pdfData) {
            return res.status(400).json({ message: "Email and PDF data are required" });
        }

        // Nodemailer configuration
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Email details
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject || `Invoice #${invoiceNo}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #2c3e50; text-align: center;">Invoice #${invoiceNo}</h2>
                    <p>Dear ${customerName},</p>
                    <p>Please find attached your invoice from American TradeLink Company.</p>
                    <p>Invoice Amount: $${parseFloat(amount).toLocaleString()}</p>
                    <p>Thank you for your business!</p>
                    <p>Best regards,<br>American TradeLink Company</p>
                </div>
            `,
            attachments: [
                {
                    filename: `Invoice_${invoiceNo}.pdf`,
                    content: pdfData.split('base64,')[1],
                    encoding: 'base64'
                }
            ]
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Invoice sent successfully" });
    } catch (error) {
        console.error("Error sending invoice:", error);
        res.status(500).json({ message: "Failed to send invoice", error: error.message });
    }
};

module.exports = { AddOrder, GetOrders, DeleteOrder, UpdateOrder, OrderByid, OrderByuserid, sendInvoice };