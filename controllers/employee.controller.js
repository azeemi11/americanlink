const Employee = require("../models/employee.model.js");

// Create employee
const createEmployee = async (req, res) => {
  try {
    const data = req.body;

    const newEmployee = new Employee(data);
    await newEmployee.save();

    res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all employees
const allEmployee = async (req, res) => {
  try {
    const data = await Employee.find({});
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }
    return res.status(200).json({
      message: "Employees fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee updated successfully", data: updatedEmployee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single employee
const getEmployee = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  try {
    const data = await Employee.findById(id);

    if (!data) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      message: "Employee fetched successfully",
      data,
    });

  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add or update salary history
const updateSalaryHistory = async (req, res) => {
  const { id } = req.params;
  const { salaryHistory } = req.body;
  if (!Array.isArray(salaryHistory)) {
    return res.status(400).json({ message: "Salary history must be an array" });
  }
  try {
    const employee = await Employee.findByIdAndUpdate(
      id,
      { $set: { salaryHistory } },
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Salary history updated", data: employee });
  } catch (error) {
    console.error("Error updating salary history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createEmployee,
  allEmployee,
  updateEmployee,
  getEmployee,
  updateSalaryHistory,
  deleteEmployee
};