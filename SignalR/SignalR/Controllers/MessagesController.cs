using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace SignalR.Controllers
{
        [Route("api/[controller]")]
        [ApiController]
        public class MessagesController : ControllerBase
        {
            private readonly string filePath = "C:\\Users\\staj\\source\\repos\\SignalR\\SignalR\\Controllers\\log.txt";

            [HttpPost("writeToFile")]
            public async Task<IActionResult> WriteToFile()
            {
            try
            {
                using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
                {
                    var jsonString = await reader.ReadToEndAsync();

                    // JSON veriyi dosyaya append etme işlemi
                    await AppendToFileAsync(jsonString);
                }

                return Ok("Data appended to file successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        private async Task AppendToFileAsync(string content)
        {
            using (var writer = new StreamWriter(filePath, append: true)) // append: true ile dosyayı append modunda aç
            {
                await writer.WriteLineAsync(content);
            }
        }

    }
        
    }

