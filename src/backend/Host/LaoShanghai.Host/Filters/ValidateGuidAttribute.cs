namespace LaoShanghai.Host.Filters
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class ValidateGuidAttribute : ActionFilterAttribute
    {
        private readonly string _paramName;

        /// <summary>
        /// Specify which action parameter to validate as a GUID. Default is 'id'.
        /// </summary>
        /// <param name="paramName">The name of the parameter to validate.</param>
        public ValidateGuidAttribute(string paramName = "id")
        {
            _paramName = paramName;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // Check if the action arguments contain the specified parameter
            if (context.ActionArguments.TryGetValue(_paramName, out var rawValue))
            {
                // Convert to string (in many cases it's already string from route)
                var stringValue = rawValue as string;
                if (stringValue == null || !Guid.TryParse(stringValue, out _))
                {
                    // If invalid, short-circuit and return 400 Bad Request
                    context.Result = new BadRequestObjectResult(
                        new
                        {
                            error = $"Invalid id: '{ rawValue }'."
                        }
                    );
                }
            }

            base.OnActionExecuting(context);
        }
    }
}
