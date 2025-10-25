export default class ApiError extends Error {
  constructor(statusCode, errType, context = null) {
    super(errType);
    this.statusCode = statusCode;
    this.errType = errType;
    this.context = context;
  }


static notFound(context, errType) {
    return new ApiError(404, errType, context);
  }

  static validation(context, errType) {
    return new ApiError(400, errType, context);
  }

  static unauthorized(context, errType) {
    return new ApiError(401, errType, context);
  }

  static database(context, errType) {
    return new ApiError(500, errType, context);
  }

  static forbidden(context, errType) {
    return new ApiError(403, errType, context);
  }
  
  static duplicate(context, errType) {
    return new ApiError(409, errType, context);
  }
};