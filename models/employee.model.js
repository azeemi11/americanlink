const mongoose = require('mongoose');

const salaryHistorySchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    paidDate: { type: Date }
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, default: "employee" }, 
    salary: { type: Number, required: true },
    assigned_tasks: { type: String, required: true },
    designation: { type: String, required: true },
    isactive: { type: Boolean, default: false },
    salaryHistory: [salaryHistorySchema]
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;