using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReportsWeb.Areas.Dashboards.Models
{
    public class SaleTotalModel
    {
        public decimal sum {get;set;}
        public decimal sumLast {get;set;} 
        public int count {get;set;}
        public int countLast { get; set; }
    }
}