import { createParamDecorator, ExecutionContext } from "@nestjs/common";


// Allows us to use @currrentUser() in any controller to get the authenticated user's info from the request object

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
)