import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";

export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const requestId = (request.headers['x-request-id'] as string) ?? crypto.randomUUID();
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        return next.handle().pipe(
            map((data: any) => {
                return {
                    success: true,
                    message: 'success',
                    data: data ?? [],
                    error: null,
                    meta: {
                        code: 1,
                        requestId,
                        timestamp: new Date().toISOString(),
                        path: request.url,
                        status: statusCode,
                    },
                };
            }),
        );
    }
}