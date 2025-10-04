using SendGrid;
using SendGrid.Helpers.Mail;

namespace LaoShanghai.Tests
{
    public class CommonTests
    {
        // private readonly string _sendGridApiKey = "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";

        private readonly ITestOutputHelper _output;

        // ctor
        public CommonTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Theory]
        [InlineData("提篮桥")]
        [InlineData("提籃橋")]
        public void TestSimplifiedToTraditionalChinese(string str)
        {
            _output.WriteLine($"UTC now: {DateTime.UtcNow} ");
            var traditionalStr  = ChineseConverter.Convert(str, ChineseConversionDirection.SimplifiedToTraditional);
            _output.WriteLine(traditionalStr);
        }


        [Theory]
        [InlineData("https://laozaoshanghai.com")]
        [InlineData("https://www.laozaoshanghai.com")]
        public void Generate_Sitemap(string prefix)
        {
            //// https://laozaoshanghai.com/?pageIndex=2&keyword=

            //var str = "<url>" +
            //            "<loc>https://laozaoshanghai.com/?keyword=%E5%8D%97%E4%BA%AC%E8%B7%AF</loc>" +
            //            "<lastmod>2022-02-06T10:45:51+10:00</lastmod>" +
            //            "<priority>0.5</priority>" +
            //            "</url>";

            for(var i = 1; i < 44; i++)
            {
                var str = "<url>" +
                            $"<loc>{prefix}/?pageIndex={i}</loc>" +
                            "<lastmod>2022-02-08T10:45:51+11:00</lastmod>" +
                            "<priority>0.5</priority>" +
                            "</url>";

                _output.WriteLine(str);
            }
        }
    }
}
