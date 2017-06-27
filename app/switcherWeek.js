var SwitcherWeek = function (customParams) {
    customParams = customParams || {};
    var self = this,
        DAY_TYPE = "day",
        containerSelector = customParams.container || "#switcher",
        switcherContainer = $(containerSelector),
        type = customParams.type || DAY_TYPE,
        date = customParams.date || new Date(),
        format = "MMM dd, yyyy",
        disabledClass = "disabled",
        onChange = customParams.onChange || function (date) {

        };

    var nextContainer = $('<span class="switcher-next"><span>'),
        prevContainer = $('<span class="switcher-prev"><span>'),
        dateContainer = $('<span class="date"><span>');

    var date = date,
        currentDate = new Date(),
        endDate = new Date(date.getFullYear() - 2, 0, 1);
    prevContainer.appendTo(switcherContainer);
    dateContainer.appendTo(switcherContainer);
    nextContainer.appendTo(switcherContainer);

    var updateDate = function (offset) {
        var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            newDate.setDate(newDate.getDate() + offset);
        nextContainer.removeClass(disabledClass);
        prevContainer.removeClass(disabledClass);
        if (newDate >= currentDate) {
            nextContainer.addClass(disabledClass);
            if (newDate > currentDate) {
                return;
            }
        }
        if (newDate <= endDate) {
            prevContainer.addClass(disabledClass);
            if (newDate < endDate) {
                return;
            }
        } 


        date = newDate;
        dateContainer.html(Globalize.format(date, format).toUpperCase());
        onChange(date);
    };

    nextContainer.click(function () {
        updateDate(7);
    });

    prevContainer.click(function () {
        updateDate(-7);
    });

    updateDate(0);

    self.reverse = function() {
        currentDate.setDate(date.getDate() - 7);
        updateDate(-1);
    }

    self.getDate = function () {
        return date;
    }
}