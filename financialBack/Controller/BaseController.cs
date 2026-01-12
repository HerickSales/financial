using Microsoft.AspNetCore.Mvc;
using FluentResults;

namespace Controller;

[ApiController]
[ApiConventionType(typeof(DefaultApiConventions))]
[Produces("application/json")]
public abstract class BaseController : ControllerBase
{
    protected ObjectResult ToActionResult(Result result)
    {
        if (result.IsSuccess)
        {
            var success = result.Successes[0];
            var statusCode = (int)success.Metadata["statusCode"];
            var data = success.Metadata["data"];
            return StatusCode(statusCode, data);
        }
        else
        {
            var error = result.Errors[0];
            var statusCode = (int)error.Metadata["statusCode"];
            var data = error.Metadata["data"];
            return StatusCode(statusCode, data);
        }
    }
}
