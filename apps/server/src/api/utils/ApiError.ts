export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  success: boolean;
  errors?: any[];

  constructor(
    statusCode: number,
    message: string,
    errors: any[] = [],
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.success = false;

    if (errors) {
      this.errors = errors;
    }
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ErrorObject {
  type: string;
  message: string;

  constructor(type : string , message : string) {
    this.type = type;
    this.message = message
  }
  
}
