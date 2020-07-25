using Microsoft.EntityFrameworkCore;
using RecruitmentApi.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class CustomLog
    {
        
        public async static Task<string> Log(Exception exception , DataContext context)
        {
            var changedEntriesCopy = context.ChangeTracker.Entries()
               .Where(e => e.State == EntityState.Added ||
                           e.State == EntityState.Modified ||
                           e.State == EntityState.Deleted)
               .ToList();

            foreach (var entry in changedEntriesCopy)
                entry.State = EntityState.Detached;
            StringBuilder sbExceptionMessage = new StringBuilder();

            do
            {
                sbExceptionMessage.Append("Exception Type" + Environment.NewLine);
                sbExceptionMessage.Append(exception.GetType().Name);
                sbExceptionMessage.Append(Environment.NewLine + Environment.NewLine);
                sbExceptionMessage.Append("Message" + Environment.NewLine);
                sbExceptionMessage.Append(exception.Message + Environment.NewLine + Environment.NewLine);
                sbExceptionMessage.Append("Stack Trace" + Environment.NewLine);
                sbExceptionMessage.Append(exception.StackTrace + Environment.NewLine + Environment.NewLine);

                exception = exception.InnerException;
            }
            while (exception != null);

            context.ExceptionLog.Add(new ExceptionLog()
            {
                Date = DateTime.UtcNow,
                ExceptionMessage = sbExceptionMessage.ToString()
            });

           await context.SaveChangesAsync();

            return sbExceptionMessage.ToString().ToLower().IndexOf("unique") > 0 ? "Entry already Exists with same combination , Please try different" : "An unhandled exception occured , Please contact admin ";
        }
    }
}
