//初期設定
const week = ["日", "月", "火", "水", "木", "金", "土"];
const today = new Date();//今日
//console.log(today);

//今月最初の日
var showDateFirstZero = new Date(today.getFullYear(), today.getMonth(), 0);
var showDateFirst = new Date(today.getFullYear(), today.getMonth(), 1);
var showDateLast = new Date(today.getFullYear(), today.getMonth() + 1, 0);

//var holidays = holiday_jp.between(showDateFirst, showDateLast);

//読み込み実行
window.onload = function () {
  holidays = holiday_jp.between(showDateFirst, showDateLast);
  showProcess(today);
};

//前月次月
function prev() {
  showDateFirst.setMonth(showDateFirst.getMonth() - 1);

  showDateFirst = new Date(showDateFirst.getFullYear(), showDateFirst.getMonth(), 1);
  showDateLast = new Date(showDateFirst.getFullYear(), showDateFirst.getMonth() + 1, 0);
  holidays = holiday_jp.between(showDateFirst, showDateLast);
  console.log(showDateFirst);
  console.log(showDateLast);

  showProcess(showDateFirst);
}
function next() {
  showDateFirst.setMonth(showDateFirst.getMonth() + 1);

  showDateFirst = new Date(showDateFirst.getFullYear(), showDateFirst.getMonth(), 1);
  showDateLast = new Date(showDateFirst.getFullYear(), showDateFirst.getMonth() + 1, 0);
  holidays = holiday_jp.between(showDateFirst, showDateLast);
  console.log(showDateFirst);
  console.log(showDateLast);

  showProcess(showDateFirst);
}

//カレンダー本体
function showProcess(date) {
  year = date.getFullYear();
  month = date.getMonth();
  calendar = createProcess(year, month);//カレンダー作成

  document.querySelector('.js-calendar_head').innerHTML = year + "年 " + (month + 1) + "月";
  document.querySelector('.js-calendar_main').innerHTML = calendar;
}

//カレンダー作成
function createProcess(year, month) {

  calendar = '<div>';

  calendar += '<ul class="dayOfWeek">';//各曜日
  for (var i = 0; i < week.length; i++) {
    calendar += "<li>" + week[i] + "</li>";
  }
  calendar += "</ul>";

  var count = 0;
  var startDayOfWeek = new Date(year, month, 1).getDay();//曜日
  var endDate = new Date(year, month + 1, 0).getDate();
  var lastMonthEndDate = new Date(year, month, 0).getDate();
  var row = Math.ceil((startDayOfWeek + endDate) / week.length);//たて

  calendar += '<ul class="dayOfItems">';
  for (var i = 0; i < row; i++) {//横
    for (var j = 0; j < week.length; j++) {
      var holidaysName = "";
      var holidaysClass = "";
      var tableToday = "";

      if (i == 0 && j < startDayOfWeek) {
        calendar += '<li class="disabled">' + (lastMonthEndDate - startDayOfWeek + j + 1) + '</li>';
      } else if (count >= endDate) {
        count++;
        calendar += '<li class="disabled">' + (count - endDate) + '</li>';
      } else {//実日
        tableToday = showDateFirstZero.setDate(showDateFirstZero.getDate() + 1);
        //console.log(tableToday);

        // 祝日かどうか
        holidays.forEach(function (element, index) {
          elementDate = new Date(
            element['date'].getFullYear(),
            element['date'].getMonth(),
            element['date'].getDate()
          );
          elementDate = elementDate.getTime();
          //console.log(elementDate);
          if (elementDate == tableToday) {
            console.log(element["name"]);
            holidaysName = '<p>' + element["name"] + '</p>';
            holidaysClass = ' class="holiday"';
          }
        });

        count++;
        var dateInfo = checkDate(year, month, count);
        if (dateInfo.isToday) {
          calendar += '<li class="today"' + holidaysClass + '>' + count + holidaysName + '</li>';
        } else {
          calendar += '<li' + holidaysClass + '>' + count + holidaysName + '</li>';
        }
      }
    }
  }
  calendar += '</ul>';

  calendar += '</div>';

  return calendar;
}

//
// 日付チェック
function checkDate(year, month, day) {
  if (isToday(year, month, day)) {
    return {
      isToday: true,
    };
  }

  return {
    isToday: false,
  };
}

// 当日かどうか
function isToday(year, month, day) {
  return (year == today.getFullYear()
    && month == (today.getMonth())
    && day == today.getDate());
}
