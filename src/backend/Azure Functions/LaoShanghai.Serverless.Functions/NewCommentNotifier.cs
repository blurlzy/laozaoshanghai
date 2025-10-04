using System;
using System.Collections.Generic;
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace LaoShanghai.Serverless.Functions
{
    public static class NewCommentNotifier
    {
        // Azure Cosmos DB input binding
        // function is triggered when data is added to or changed in Azure Cosmos DB
        // ** If multiple functions are configured to use an Azure Cosmos DB trigger for the same collection,
        // each of the functions should use a dedicated lease collection or specify a different LeaseCollectionPrefix for each function.
        // Otherwise, only one of the functions is triggered.
        [FunctionName("SendNewCommentNotification")]
        public static void Run([CosmosDBTrigger(
            databaseName: "laoshanghai",
            containerName: "content-items",
            Connection = "CosmosDBConnection",
            LeaseContainerName = "leases",
            // add the lease collection prefix to make  it a shared lease container
            LeaseContainerPrefix = "comments")]IReadOnlyList<dynamic> input,
            ILogger log)
        {
            if (input != null && input.Count > 0)
            {
                log.LogInformation("Function: SendNewCommentNotification v1.0");
               
                foreach (var item in input)
                {
                    var contentType = item.GetPropertyValue<string>("contentType");
                    var dateModified = item.GetPropertyValue<DateTime?>("dateModified");
                    
                    // we only send notification for new comments
                    if(dateModified.HasValue)
                    {
                        continue;
                    }
                    
                    if(contentType == "Comment")
                    {
                        log.LogInformation($"A new comment was created with comment id: {item.Id}");
                        var name = item.GetPropertyValue<string>("name");

                        var emailMessage = $"新留言来自用户 - {name}.";

                        // get the auto review result
                        var containsProfanity = item.GetPropertyValue<bool?>("containsProfanity");
                        if (containsProfanity == true)
                        {
                            emailMessage += "该留言未通过系统审核. 可能包含敏感内容";
                            log.LogWarning("该留言未通过系统审核. 可能包含敏感内容");
                        }

                        log.LogInformation($"Sending an email to laozaoshanghai...");                        
                        // send email notification
                        EmailSender.SendMessageAsync(emailMessage).GetAwaiter().GetResult();
                    }
                }

                log.LogInformation("Function ends.");                
            }
        }
    }
}
