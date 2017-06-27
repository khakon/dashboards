using System.Collections.Generic;

namespace Dashboards.Models
{
    public class SalesPerformanceDto {
        public DailyPerformanceDto DailyPerformance { get; set; }
        public MonthlyPerformanceDto MonthlyPerformance { get; set; }
        public AnnualPerformanceDto AnnualPerformance { get; set; }
        public List<CriteriaSalesDto> SalesBySector { get; set; }
    }
}