using Microsoft.Extensions.Configuration;
using RecruitmentApi.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class Email
    {
        public static bool SendEmail(List<string> emails, string subject ,string htmlString , DataContext context , IConfiguration configuration)
        {
            bool result = false;
            try
            {
                MailMessage message = new MailMessage();
                SmtpClient smtp = new SmtpClient();
                message.From = new MailAddress(configuration.GetValue<string>("EmailSettings:FromEmail"));
                foreach (var item in emails)
                {
                    message.To.Add(new MailAddress(item));
                }
                message.Subject = subject;
                message.IsBodyHtml = true; //to make message body as html  
                message.Body = htmlString;
               // smtp.Port = configuration.GetValue<int>("EmailSettings:SMTPPort"); ;
                smtp.Host = configuration.GetValue<string>("EmailSettings:SMTP"); //for gmail host  
                smtp.EnableSsl = true;
                //NetworkCredential NC = new NetworkCredential();
                //NC.UserName = configuration.GetValue<string>("EmailSettings:FromEmail");
                //NC.Password = configuration.GetValue<string>("EmailSettings:Password");
                //smtp.Credentials = NC;
                smtp.Send(message);
                result = true;
            }
            catch (Exception ex) {
               CustomLog.Log(ex, context);
                result = false;
            }
            return result;

        }
    }
}
