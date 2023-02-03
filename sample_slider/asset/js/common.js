window.onload = function () {
  //-------設定部分-------
  time = 7000;
  //---------------------

  //-------各変数-------
  var parent = document.querySelector(".js-slider");
  var elem = document.querySelectorAll(".js-slider .js-slider__item");
  var elem_count =  elem.length;

  count = 0;
  max = elem_count;
  next = count + 1;
  next = next > max ? 0 : next;
  prev = count - 1;
  prev = prev < 0 ? max - 1 : prev;

  set_delay1 = 1500;
  set_delay2 = time - 500 - set_delay1;
  set_delay3 = time - 10 - set_delay2 - set_delay1;

  elem[count].classList.add("active");//表示クラス
  elem[count].classList.add("active_move");//アニメクラス
  //---------------------

  //-------繰り返し動作-------
  const IntervalItem = () => {

    var parent = document.querySelector(".js-slider");
    var elem = document.querySelectorAll(".js-slider .js-slider__item");

    //max−１以内に収める
    count = count == max ? 0 : count;
    next = next == max ? 0 : next;
    prev = prev == max ? 0 : prev;

    console.log(count);

    elem[count].classList.add("active");
    elem[count].classList.add("active_move");

    elem[prev].style.removeProperty("z-index");
    elem[prev].classList.remove("active");

    const asyncFunc = async () => {

      let x, y, z;

      x = await new Promise(resolve => {
        console.log("set_delay1");
        setTimeout(() => {
          elem[prev].classList.remove("active_move");
          resolve("x");
        }, set_delay1)
      })

      y = await new Promise(resolve => {
        console.log("set_delay2");
        setTimeout(() => {
          elem[next].classList.add("active");
          elem[next].classList.add("active_move");
          resolve("y");
        }, set_delay2)
      })

      z = await new Promise(resolve => {
        console.log("set_delay3");
        setTimeout(() => {
          count++;
          next++;
          prev++;
          resolve("z");
        }, set_delay3)
      })

      console.log(x + y + z)

    }
    asyncFunc();

  }
  //setInterval(IntervalItem, time);

  setTimeout(function () {
    IntervalItem();
    setInterval(IntervalItem, time);
 }, time - new Date().getUTCMilliseconds() );
 //---------------------

}