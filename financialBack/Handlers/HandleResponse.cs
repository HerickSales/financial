using FluentResults;

namespace financial.Handlers;

public static class HandleResponse
{
    public static Result SuccessResponse(string message, int statusCode, object? data = null)
    {
        var response = new
        {
            Message = message,    
            Data = data
        };

        return Result.Ok()
            .WithSuccess(new Success(message)
                .WithMetadata("statusCode", statusCode)
                .WithMetadata("data", response));
    }

    public static Result FailResponse(string message, int statusCode, object? data = null)
    {
        var response = new
        {
            Message = message,
            Data = data
        };

        return Result.Fail(new Error(message)
            .WithMetadata("statusCode", statusCode)
            .WithMetadata("data", response));
    }
}