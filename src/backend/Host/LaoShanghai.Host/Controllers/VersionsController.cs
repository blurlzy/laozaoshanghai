
namespace LaoShanghai.Host.Controllers
{
    // root endpoint
    [Route("")]
    [ApiController]
    public class VersionsController : BaseApiController
    {
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetVersion()
        {
            return Ok(new { version = "LaozaoShanghai Service v2.1.20251004" });
        }


        [Authorize]
        [HttpGet("Test")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Test()
        {
            var claims = User.Claims.ToString();
            
            return Ok(new { 
                Name = User.Identity.Name,
                Email = ClaimHelper.GetClaimValue(User, Auth0ClaimNames.EMAIL),
                //Roles = ClaimHelper.GetClaimValue(User, Auth0ClaimNames.ROLES),
            });
        }
    }
}
