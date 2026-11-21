/**
 * Employee Controller
 * Business logic for the Employee CRUD API, backed by an in-memory array.
 * NOTE: data resets whenever the server restarts.
 */

let employees = [
  {
    id: 1,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    department: 'Engineering',
    position: 'Software Engineer',
    salary: 850000,
  },
  {
    id: 2,
    name: 'Priya Verma',
    email: 'priya.verma@example.com',
    department: 'Human Resources',
    position: 'HR Manager',
    salary: 720000,
  },
  {
    id: 3,
    name: 'Rohan Gupta',
    email: 'rohan.gupta@example.com',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 680000,
  },
];

let nextId = employees.length + 1;

// ---------- helpers ----------

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const parseId = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw createError('Employee ID must be a positive integer', 400);
  }
  return id;
};

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = ['name', 'email', 'department', 'position', 'salary'];

/**
 * Validates a payload. When `partial` is false (POST) every field must be
 * present. When true (PUT) only the supplied fields are checked, but at
 * least one must be provided.
 */
const validateEmployee = (body, { partial = false } = {}) => {
  const errors = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError('Request body must be a JSON object', 400);
  }

  if (!partial) {
    FIELDS.forEach((field) => {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        errors.push(`${field} is required`);
      }
    });
  }

  ['name', 'department', 'position'].forEach((field) => {
    if (body[field] !== undefined && !isNonEmptyString(body[field])) {
      errors.push(`${field} must be a non-empty string`);
    }
  });

  if (body.email !== undefined && !(typeof body.email === 'string' && EMAIL_REGEX.test(body.email.trim()))) {
    errors.push('email must be a valid email address');
  }

  if (body.salary !== undefined) {
    const salary = Number(body.salary);
    if (typeof body.salary === 'boolean' || body.salary === '' || !Number.isFinite(salary) || salary < 0) {
      errors.push('salary must be a non-negative number');
    }
  }

  if (partial && !FIELDS.some((f) => body[f] !== undefined)) {
    errors.push(`provide at least one field to update: ${FIELDS.join(', ')}`);
  }

  if (errors.length) {
    const error = createError('Validation failed', 400);
    error.details = errors;
    throw error;
  }
};

const emailExists = (email, ignoreId = null) =>
  employees.some(
    (e) => e.email.toLowerCase() === String(email).trim().toLowerCase() && e.id !== ignoreId
  );

// ---------- controllers ----------

// GET /employees
const getAllEmployees = (req, res) => {
  res.status(200).json({
    success: true,
    count: employees.length,
    data: employees,
  });
};

// GET /employees/:id
const getEmployeeById = (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const employee = employees.find((e) => e.id === id);
    if (!employee) throw createError(`Employee with ID ${id} not found`, 404);

    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

// POST /employees
const createEmployee = (req, res, next) => {
  try {
    validateEmployee(req.body);

    if (emailExists(req.body.email)) {
      throw createError('An employee with this email already exists', 409);
    }

    const { name, email, department, position, salary } = req.body;
    const employee = {
      id: nextId++,
      name: name.trim(),
      email: email.trim(),
      department: department.trim(),
      position: position.trim(),
      salary: Number(salary),
    };

    employees.push(employee);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /employees/:id
const updateEmployee = (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) throw createError(`Employee with ID ${id} not found`, 404);

    validateEmployee(req.body, { partial: true });

    if (req.body.email !== undefined && emailExists(req.body.email, id)) {
      throw createError('An employee with this email already exists', 409);
    }

    const current = employees[index];
    const updated = {
      ...current,
      ...(req.body.name !== undefined && { name: req.body.name.trim() }),
      ...(req.body.email !== undefined && { email: req.body.email.trim() }),
      ...(req.body.department !== undefined && { department: req.body.department.trim() }),
      ...(req.body.position !== undefined && { position: req.body.position.trim() }),
      ...(req.body.salary !== undefined && { salary: Number(req.body.salary) }),
      id: current.id, // ID can never be changed
    };

    employees[index] = updated;

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /employees/:id
const deleteEmployee = (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) throw createError(`Employee with ID ${id} not found`, 404);

    const [deleted] = employees.splice(index, 1);

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
