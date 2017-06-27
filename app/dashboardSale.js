var DashboardSale = function (category) {

    var self = this,
        yearContainer = $("#year"),
        pieChartOptions = {
            onIncidentOccurred: null,
            palette: "SaleViewPalette",
            type: "doughnut",
            innerRadius: 0.62,
            loadingIndicator: {
                text: ""
            },
            dataSource: [],
            series: {
                argumentField: "group",
                valueField: "sale",
                label: {
                    visible: true,
                    backgroundColor: "transparent",
                    radialOffset: -15,
                    font: {
                        size: 12,
                        color: SaleViewer.lightColor
                    },
                    connector: {
                        visible: false,
                        width: 0
                    },
                    customizeText: function (arg) {
                        return arg.percentText;
                    }
                },
                hoverStyle: {
                    hatching: {
                        opacity: 0,
                        step: 6,
                        width: 2
                    }
                }
            },
            legend: {
                visible: false
            },
            tooltip: {
                enabled: true,
                color: "#fff",
                font: {
                    opacity: 1,
                    size: 22
                },
                paddingTopBottom: 8,
                customizeTooltip: function () {
                    return {
                        text: "<span style='font-size: 14px; color:" + SaleViewer.lightColor + "'>" + this.argument + "</span><br />"
                            + "<span style='color: " + SaleViewer.legend.getColorByField(this.argument) + ";'>(грн) " + (this.originalValue / 1000000).toFixed(2) + "M</span>"
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

        barChartOptions = {
            onIncidentOccurred: null,
            palette: "SaleViewPalette",
            rotated: true,
            dataSource: [],
            equalBarWidth: false,
            argumentAxis: {
                placeholderSize: 40,
                label: {
                    visible: false,
                }
            },
            valueAxis: {
                valueMarginsEnabled: false,
                placeholderSize: 30,
                axisDivisionFactor: 80,
                label: {
                    //format: "thousands",
                    indentFromAxis: 5,
                    font: {
                        color: SaleViewer.lightColor
                    }
                }
            },
            commonSeriesSettings: {
                argumentField: "group",
                valueField: "sale",
                type: "bar",
                hoverStyle: {
                    hatching: {
                        opacity: 0
                    }
                }
            },
            seriesTemplate: {
                nameField: "group",
            },
            legend: {
                visible: false
            },
            tooltip: {
                enabled: true,
                color: "#fff",
                font: {
                    opacity: 1,
                    size: 22
                },
                paddingTopBottom: 8,
                customizeTooltip: function () {
                    return {
                        text: "<span style='font-size: 14px; color:" + SaleViewer.lightColor + "'>" + this.argument + "</span><br />"
                            + "<span style='color: " + SaleViewer.legend.getColorByField(this.argument) + ";'>(грн) " + (this.originalValue / 1000000).toFixed(2) + "M</span>"
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
        }

    self.startDate = Globalize.format(getCurrentDayWeek(), "yyyy-01-01");
    self.endDate = Globalize.format(getCurrentDayWeek(), "yyyy-12-30");
    yearContainer.text(Globalize.format(getCurrentDate(), "yyyy"));
    var pieChart = SaleViewer.sharedWidgets.initChart(category, pieChartOptions, "pie"),
        barChart = SaleViewer.sharedWidgets.initChart(category, barChartOptions, "chart");
    self.init = function() {

        var first = true;

        function updateBar(data) {
            maxUnitsValue = SaleViewer.sharedWidgets.getMaxAxisValue(data, "balance");
            barChart.instance.option("valueAxis.max", maxUnitsValue);
            var pres = (maxUnitsValue <= 20000000) ? 1: 0;
            barChart.instance.option("valueAxis.label.precision", pres);
            barChart.instance.option("dataSource", data);
        }

        SaleViewer.sharedWidgets.initRange(function(e) {

            var startDate = Globalize.format(e.startValue, "yyyy-MM-dd"),
                endDate = Globalize.format(e.endValue, "yyyy-MM-dd");

            if(self.startDate != startDate || self.endDate != endDate || first) {

                first = false;

                self.startDate = startDate;
                self.endDate = endDate;
                yearContainer.text(Globalize.format(e.startValue, "yyyy"));

                pieChart.load({
                    day: endDate//Globalize.format(getCurrentDayWeek(), "yyyy-MM-dd")
                });

                SaleViewer.loadData({
                    day: endDate//Globalize.format(getCurrentDayWeek(), "yyyy-MM-dd")
                }, updateBar, category);
            }
        },
        {
            shutter: {
                color: '#f5f5f5',
                opacity: 0.75
            }
        });
    }
}