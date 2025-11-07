export const successResponse = (
  res,
  data = null,
  message = "success",
  statusCode = 200
) => {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

export const createdResponse = (
  res,
  data = null,
  message = "Created successfully"
) => {
  successResponse(res, data, message, 201);
};

export const deletedResponse = (
  res,
  message = "Deleted successfully",
  deletedId = null
) => {
  res.status(200).json({
    status: "success",
    message,
    data: deletedId ? { deletedId } : null,
  });
};
