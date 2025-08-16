const mongoose = require('mongoose');

const docsSchema = new mongoose.Schema({
    file: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Docs = mongoose.model('Docs', docsSchema);

module.exports = Docs;
