export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error caught by middleware:", err);

  const statusCode = err.statusCode || 500;
  const context = err.context || "System";
  const errType = err.errType || "internalServerError";
  let message;
  
  switch (statusCode) {
    case 400:
      message = `Invalid ${context} input: ${err.message}`;
      break;

    case 401:
      message = `Unauthorized access to ${context}. Please log in.`;
      break;

    case 403:
      message = `You do not have permission.`;
      break;

    case 404:
      message = `${context} not found`;
      break;

    case 409:
      message = `${context} Not Exist`;
      break;
      
    case 500:
      message = `Database operation failed while processing ${context} data.`;
      break;

    default:
      message = err.message || `Unexpected error in ${context}.`;
  }

  res.status(statusCode).json({
    status: "error",
    type: errType,
    context,
    message,
  });
};
