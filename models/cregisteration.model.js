const mongoose = require('mongoose');
const cregisterationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    phone:{
        type: Number,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    carmodel:{
        type: String,
        required: true,
    },
    registeraionnumber:{
        type: String,
        required: true,
    },
    
},
    {
        timestamps: true,
    }
)

const Cregisteration = mongoose.model('Cregistration', cregisterationSchema);

module.exports = Cregisteration;
