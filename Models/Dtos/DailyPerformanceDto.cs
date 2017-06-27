namespace Dashboards.Models
{
    public class DailyPerformanceDto {
        public decimal TodaySales { get; set; }
        public decimal YesterdaySales { get; set; }
        public decimal LastWeekSales { get; set; }
    }
}