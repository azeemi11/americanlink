const mongoose = require("mongoose")

const walletSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount:{
        type:Number,
    
       },
       accountnumber:{
        type: String,
       
       },


       req_deposit:{
        type:Number,
        default: 0,
       },

},
{
    timestamps: true,
}
)
const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;