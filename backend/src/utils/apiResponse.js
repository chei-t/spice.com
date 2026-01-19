// Success response
export const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Error response
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Pagination response
export const paginationResponse = (res, message, data, pagination) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

// Created response
export const createdResponse = (res, message, data = null) => {
  return successResponse(res, message, data, 201);
};

// No content response
export const noContentResponse = (res) => {
  return res.status(204).send();
};

// Bad request response
export const badRequestResponse = (res, message, errors = null) => {
  return errorResponse(res, message, 400, errors);
};

// Unauthorized response
export const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return errorResponse(res, message, 401);
};

// Forbidden response
export const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(res, message, 403);
};

// Not found response
export const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, message, 404);
};

// Conflict response
export const conflictResponse = (res, message) => {
  return errorResponse(res, message, 409);
};