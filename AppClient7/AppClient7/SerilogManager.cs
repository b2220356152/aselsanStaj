using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Serilog;
using Serilog.Formatting.Json;
using Serilog.Sinks.SystemConsole.Themes;

namespace AppClient7
{
    internal class SerilogManager
    {
        
        public static void Configure( string textLogFilePath)
        {
            Log.Logger = new LoggerConfiguration()
                .WriteTo.Console(theme: AnsiConsoleTheme.Code)
                //.WriteTo.File(new JsonFormatter(), jsonLogFilePath, rollingInterval: RollingInterval.Day)
                .WriteTo.File(textLogFilePath, rollingInterval: RollingInterval.Day)
                .CreateLogger();
        }

        public static void CloseAndFlush()
        {
            Log.CloseAndFlush();
        }

        public static void LogInformation(string message)
        {
            Log.Information(message);
        }
        public static void LogInformationJson(string messageTemplate, params object[] propertyValues)
        {
            Log.Information(messageTemplate, propertyValues);
        }

        public static void LogError(Exception ex, string message)
        {
            Log.Error(ex, message);
        }
    }
}


//Log.Information("->{ " +
//                $"\"type10\": {aircraft.Lat}, " +
//                $"\"type12\": {aircraft.Lon}, " +
//                $" \"type22\":{aircraft.Spd}, " +
//                $"\"type32\": {aircraft.Hex} " + "}");