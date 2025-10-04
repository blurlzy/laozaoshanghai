namespace LaoShanghai.Host.Filters
{
    public class EnsurePaginationFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            base.OnActionExecuting(context);

            if (context.ActionArguments.ContainsKey("pageIndex"))
            {
                // validate page index value if it exists
                var pageIndex = (int?)context.ActionArguments["pageIndex"];

                if (pageIndex.HasValue && pageIndex.Value < 0)
                {
                    context.Result = new BadRequestObjectResult(new { Error = $"Invalid page index: {pageIndex}." });
                }
            }

            if (context.ActionArguments.ContainsKey("pageSize"))
            {
                // validate page size value if it exists
                var pageSize = (int?)context.ActionArguments["pageSize"];

                if (pageSize.HasValue && (pageSize.Value < 5 || pageSize > 100))
                {
                    context.Result = new BadRequestObjectResult(new { Error = $"Invalid page size: {pageSize}." });
                }
            }
        }
    }
}
