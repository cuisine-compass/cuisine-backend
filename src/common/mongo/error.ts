import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

interface Error {
  message: string | string[];
  name: string;
}
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    // let expectionResponse: Error | string | object
    const expectionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as Error).message;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    /**
     * @description Exception json response
     * @param message
     */
    const responseMessage = (type: string, message: string) => {
      response.status(status).json({
        statusCode: status,
        path: request.url,
        errorType: type,
        errorMessage: message,
        errors:
          expectionResponse instanceof Error
            ? expectionResponse.message
            : expectionResponse,
      });
    };

    // Throw an exceptions for either
    // MongoError, ValidationError, TypeError, CastError and Error
    if (exception.message) {
      responseMessage('error', exception.message);
    } else {
      responseMessage(exception.name, exception.message);
    }
  }
}
