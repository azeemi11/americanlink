const express = require('express');
const {
  createEmployee,
  allEmployee,
  updateEmployee,
  getEmployee,
  updateSalaryHistory,
  deleteEmployee
} = require('../controllers/employee.controller.js');

const router = express.Router();

// Create new employee
router.post('/create', createEmployee);

// Get all employees
router.get('/', allEmployee);

// Update employee
router.put('/:id', updateEmployee);

// Get single employee
router.get('/:id', getEmployee);

// Update salary history for an employee
router.post('/:id/salaryHistory', updateSalaryHistory);

// Delete employee
router.delete('/:id', deleteEmployee);

module.exports = router;