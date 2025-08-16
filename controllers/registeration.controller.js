const Cregisteration = require('../models/cregisteration.model.js');

 const AddRegisteration = async (req, res) => {
    const { name, email, phone, carmodel, registeraionnumber, userId } = req.body;
   

    // Validate input
    if (!name || !email || !phone || !carmodel || !registeraionnumber || !userId) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const registeration = await Cregisteration.create({ name, email, phone, carmodel, registeraionnumber, userId });
        if (!registeration) {
            return res.status(400).json({ message: "Registeration not created" });
        }
        return res.status(200).json({ message: "Registeration created successfully", registeration });
    } catch (error) {
        console.error("Error registering car:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

 const GetRegisterations = async (req, res) => {
   try {
    const registerations = await Cregisteration.find();
    if (!registerations) {
        return res.status(404).json({ message: "No registerations found." });
    }
    res.status(200).json(registerations);
   } catch (error) {
    console.error("Error fetching registerations:", error);
    return res.status(500).json({ message: "Internal server error." });
   }
}
 const DeleteRegisteration = async (req, res) => {
    try {
        const {id} = req.params;
        const registeration = await Cregisteration.findByIdAndDelete(id);
        if (!registeration) {
            return res.status(404).json({ message: "Registeration not found." });
        }
        return res.status(200).json({ message: "Registeration deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
}
 const GetRegisterationByuserId = async (req, res) => {
    try {
        const {id} = req.params;
        const registeration = await Cregisteration.find({userId:id});
        if (!registeration) {
            return res.status(404).json({ message: "Registeration not found." });
        }
        res.status(200).json(registeration);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
}   
module.exports = { AddRegisteration, GetRegisterations, DeleteRegisteration, GetRegisterationByuserId };
