class apiResponse {
  constructor(statusCode, message, data) {
    this.status = statusCode >= 200 && statusCode < 300 ? 'Ok' : 'Client Error';
    this.statusCode = statusCode || 500;
    this.message = message || 'Successfull';
    this.data = data || null;
  }
  static sendSuccess(res, statusCode, message, data) {
    return res
      .status(statusCode)
      .json(new apiResponse(statusCode, message, data));
  }
  static sendError(res, statusCode, message, error = null) {
    return res
      .status(statusCode)
      .json(new apiResponse(statusCode, message, error));
  }
}

module.exports = { apiResponse };
