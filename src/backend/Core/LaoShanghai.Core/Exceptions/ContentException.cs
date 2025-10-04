
namespace LaoShanghai.Core.Exceptions
{
    public class BadRequestException: CustomException
    {
        public BadRequestException(string message): base(message, null, HttpStatusCode.BadRequest)
        {
            
        }
    }

    public class BadContentException: CustomException
    {
        public BadContentException(string message): base(message, null, HttpStatusCode.BadRequest)
        {

        }
    }
}
