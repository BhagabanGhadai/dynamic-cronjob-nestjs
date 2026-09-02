import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger: Logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const requestId = (request.headers['x-request-id'] as string) ?? crypto.randomUUID();

        let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string = "internal server error"
        let code: 1 | 0 = 0
        let details: unknown = undefined

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus()
            const exceptionMessage: string | object = exception.getResponse()
            if (typeof exceptionMessage === 'string') {
                message = exceptionMessage
            } else if (typeof exceptionMessage === 'object' && exceptionMessage !== null) {
                const error = exceptionMessage as Record<string, unknown>
                if (Array.isArray(error.message)) {
                    message = 'validation failed'
                    details = error.message
                } else {
                    message = error.message as string ?? message
                }
                details = error.details as unknown ?? undefined
            } else if (typeof exception === 'object' && exception !== null && 'statusCode' in exception && 'error' in exception) {
                statusCode = exception.statusCode as number
                message = exception.error as string
            } else {
                this.logger.error(
                    `Unhandled exception on ${request.method} ${request.url}`,
                    exception instanceof Error ? exception.stack : String(exception),
                );
            }
        }

        return response.status(statusCode).send({
            success: false,
            message,
            error: {
                ...(details !== undefined && { details }),
            },
            meta: {
                code,
                requestId,
                timestamp: new Date().toISOString(),
                path: request.url,
            },
        });
    }
}