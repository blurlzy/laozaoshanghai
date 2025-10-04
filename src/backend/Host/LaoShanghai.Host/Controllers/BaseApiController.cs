
namespace LaoShanghai.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        // ! (null-forgiving) operator
        // By using the null-forgiving operator, you inform the compiler that passing null is expected and shouldn't be warned about.
        private ISender _mediator = null!;

        // return the instance of MediatR
        protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();
    }
}
