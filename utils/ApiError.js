export default class ApiError extends Error {
  constructor(statusCode, context = null, message = null) {
    super(context || "API Error");
    this.statusCode = statusCode;
    this.context = context;
    this.message = message;
  }

  static notFound(context, message) {
    return new ApiError(404, context, message);
  }

  static validation(context, message) {
    return new ApiError(400, context, message);
  }

  static unauthorized(context, message) {
    return new ApiError(401, context, message);
  }

  static database(context, message) {
    return new ApiError(500, context, message);
  }

  static forbidden(context, message) {
    return new ApiError(403, context, message);
  }

  static duplicate(context, message) {
    return new ApiError(409, context, message);
  }
}
