export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error caught by middleware:", err);

  const statusCode = err.statusCode || 500;
  const context = err.context || "System";
  let message;
  let errType;

  switch (statusCode) {
    case 400:
      errType = "Bad Request";
      message = err.message || `Invalid ${context} input: ${err.message}`;
      break;

    case 401:
      errType = "Unauthorized";
      message =
        err.message || `Unauthorized access to ${context}. Please log in.`;
      break;

    case 403:
      errType = "Forbidden";
      message = err.message || `You do not have permission.`;
      break;

    case 404:
      errType = "Not Found";
      message = err.message || `${context} Not Found`;
      break;

    case 409:
      errType = "Duplicate";
      message = err.message || `${context} Is Already`;
      break;

    case 500:
      errType = "Internal Server Error";
      message =
        err.message ||
        `Database operation failed while processing ${context} data.`;
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
