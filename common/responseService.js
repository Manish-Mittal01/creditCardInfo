const { Status } = require("./Constants");

class ResponseService {
  static success(res, message, data, { code = 200 } = {}) {
    res.status(code).send({
      status: Status.success,
      statusCode: code,
      message: message,
      data: data,
    });
  }

  static failed(res, message, code, data = {}) {
    res.status(code).send({
      status: Status.error,
      statusCode: code,
      message: message,
      data: data
    });
  }
}

module.exports.ResponseService = ResponseService;
