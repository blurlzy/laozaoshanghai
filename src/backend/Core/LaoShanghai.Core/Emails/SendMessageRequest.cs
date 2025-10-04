namespace LaoShanghai.Core.Emails
{
    public class SendMessageRequest: IRequest<Unit>
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Content { get; set; }
    }

    public class SendMessageRequestHandler : IRequestHandler<SendMessageRequest, Unit>
    {
        private IEmailSender _emailSender;
        
        // ctor
        public SendMessageRequestHandler(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public async Task<Unit> Handle(SendMessageRequest request, CancellationToken cancellationToken)
        {
            await _emailSender.SendMessageAsync(request.Name, request.Email, request.Content);            
            return Unit.Value;
        }
    }

}
