var Balance = function(criteria) {
    var self = this,
        fields = ["ДикаловБ", "Жила", "Агысов", "Беломестная", "Верховодова", "Туманов", "Юхнович", "Семернин", "Киричук", "Копаницкий", "Крачко", "Шестопалов", "Тарасов", "Дяченко", "Уволен", "Головин", "Литвин", "Яковлев", "Кулаков", "Троц", "СеменовД"];
    SaleViewer.legend = new Legend(fields);
    var category = criteria,
        maxSalesValue = 0,
        maxUnitsValue = 0,
        chartOptions = {
            onIncidentOccurred: null,
            palette: "SaleViewPalette",
            dataSource: [],
            commonSeriesSettings: {
                argumentField: "super",
                type: "bar",
                hoverMode: "onlyPoint",
                selectionMode: "onlyPoint",
                minBarSize: 5
            },
            legend: {
                visible: false
            },
            argumentAxis: {
                label: {
                    customizeText: function () {
                        return SaleViewer.legend.getShortFieldName(this.value);
                    }
                }
            },
            customizePoint: function () {
                if (this.seriesName == "Week")
                    return {
                        color: SaleViewer.legend.getColorByField(this.argument),
                        hoverStyle: {
                            color: SaleViewer.legend.getColorByField(this.argument),
                            hatching: {
                                opacity: 0
                            }
                        }
                    }
            },
            tooltip: {
                enabled: true,
                font: {
                    opacity: 1,
                    size: 22
                },
                paddingTopBottom: 8,
                customizeTooltip: function () {
                    return {
                        text: "<span style='font-size: 14px; color: " + SaleViewer.lightColor + ";'>" + this.argumentText.toUpperCase() + "</span><br />"
                            + "<span style='color: " + SaleViewer.legend.getColorByField(this.argumentText) + ";'>" + Globalize.format(this.originalValue, getFormatBySeriesName(this.seriesName)) + "</span><br />"
                           // + "<span style='color: " + SaleViewer.legend.getColorByField(this.argument) + ";'>(грн) " + (this.originalValue / 1000000).toFixed(2) + "M</span><br />"
                            + "<span style='font-size: 14px; color: " + SaleViewer.lightColor + ";'>" + getDateName(this.seriesName) + "</span>"
                    };
                },
                shadow: {
                    opacity: 0.15,
                    blur: 0,
                    color: "#000000",
                    offsetX: 3,
                    offsetY: 3
                }
            }
        },

        salesOptions = {
            series: [
                {
                    valueField: "balanceLast",
                    name: "LastWeek",
                    color: "rgba(175, 175, 175, 0.45)",
                    hoverStyle: {
                        color: "rgba(175, 175, 175, 0.45)",
                        hatching: {
                            opacity: 0
                        }
                    }
                },
                {
                    valueField: "balance",
                    name: "Week"
                }
            ],
            valueAxis: {
                axisDivisionFactor: 40,
                placeholderSize: 45,
                label: {
                    format: "thousands",
                    customizeText: function () {
                        if (this.value != maxSalesValue) {
                            return this.valueText;
                        }
                        return "";
                    }
                }
            }

        },

        unitsOptions = {
            series: [
                {
                    valueField: "countLast",
                    name: "LastWeekCount",
                    color: "rgba(175, 175, 175, 0.45)",
                    hoverStyle: {
                        color: "rgba(175, 175, 175, 0.45)",
                        hatching: {
                            opacity: 0
                        }
                    }
                },
                {
                    valueField: "count",
                    name: "WeekCount"
                }
            ],
            valueAxis: {
                axisDivisionFactor: 40,
                placeholderSize: 40,
                label: {
                   // format: "thousands",
                    customizeText: function () {
                        if (this.value != maxUnitsValue) {
                            return this.valueText;
                        }
                        return "";
                    }
                }
            }
        },

        getDateName = function (seriesName) {
            var balanceDate = balanceSwitcher.getDate(),
                countDate = countSwitcher.getDate();
            switch (seriesName) {
                case "LastWeek":
                    return getCurrentDayWeek().getDate() == balanceDate.getDate() ?
                        "Прошлая неделя" :
                        Globalize.format(new Date(balanceDate.getFullYear(), balanceDate.getMonth(), balanceDate.getDate() - 7), "dd/MM/yyyy");
                    break;
                case "Week":
                    return (getCurrentDayWeek().getDate() == balanceDate.getDate()) ?
                        "Эта неделя" :
                        (getCurrentDayWeek().getDate() - 7 == balanceDate.getDate()) ?
                        "Прошлая неделя" :
                        Globalize.format(balanceDate, "dd/MM/yyyy");
                    break;
                case "LastWeekCount":
                    return getCurrentDayWeek().getDate() == countDate.getDate() ?
                        "Прошлая неделя" :
                        Globalize.format(new Date(countDate.getFullYear(), countDate.getMonth(), countDate.getDate() - 7), "dd/MM/yyyy");
                    break;
                case "WeekCount":
                    return (getCurrentDayWeek().getDate() == countDate.getDate()) ?
                        "Эта неделя" :
                        (getCurrentDayWeek().getDate() - 7 == countDate.getDate()) ?
                        "Прошлая неделя" :
                        Globalize.format(countDate, "dd/MM/yyyy");
                    break;
            }
        },

        getFormatBySeriesName = function (seriesName) {
            if (seriesName == "Week" || seriesName == "LastWeek") return "n0";
            else if (seriesName == "WeekCount" || seriesName == "LastWeekCount") return "n0";
        },

        balanceChart = SaleViewer.sharedWidgets.initChart(category, $.extend({}, chartOptions, salesOptions), "chart", "sum"),
        countChart = SaleViewer.sharedWidgets.initChart(category, $.extend({}, chartOptions, unitsOptions), "chart", "count"),



        updateBalance = function (date) {
            SaleViewer.loadData({
                day: Globalize.format(date, "yyyy-MM-dd")
            }, function (data) {
                maxSalesValue = SaleViewer.sharedWidgets.getMaxAxisValue(data);
                balanceChart.instance.option("valueAxis.max", maxSalesValue);
                balanceChart.instance.option("dataSource", data);
            }, category);
        },
        updateCount = function(date) {
            SaleViewer.loadData({
                dayCount: Globalize.format(date, "yyyy-MM-dd")
            }, function(data) {
                maxUnitsValue = SaleViewer.sharedWidgets.getMaxAxisValue(data);
                countChart.instance.option("valueAxis.max", maxUnitsValue);
                countChart.instance.option("dataSource", data);
            }, category);
        },

        countSwitcher = new SwitcherWeek({
            container: "#countSwitcher",
            type: "day",
            onChange: function(date) {
                updateCount(date);
            },
            date: getCurrentDayWeek()
        }),
        balanceSwitcher = new SwitcherWeek({
            container: "#balanceSwitcher",
            type: "day",
            onChange: function (date) {
                updateBalance(date);
            },
            date: getCurrentDayWeek()
        });

    self.init = function() {
        SaleViewer.loadData({
            dayTotal: Globalize.format(getCurrentDayWeek(), "yyyy-MM-dd")
        }, function (data) {
            $.each(data, function(index, value) {
                var object = $("#" + index);
                if((index.indexOf("count") != -1))
                    object.text(Globalize.format(value, "n0"));
                else
                    object.text('(грн) ' + Globalize.format(value / 1000, "n0") + "K");
            });
        }, category);
    }
};

$(function () {
    SaleViewer.criteriaModel = new Balance("balance");
    SaleViewer.criteriaModel.init();
    SaleViewer.dashboard = new DashboardBalance("balance");
    SaleViewer.dashboard.init();
});