//------------------
//カードスタックアニメーションでのスライダー
//------------------

// JavaScript Document
document.addEventListener("DOMContentLoaded", function(event) {

  stackedCards();
  function stackedCards () {
    var agent = window.navigator.userAgent.toLowerCase();
    var chrome = (agent.indexOf('chrome') !== -1) && (agent.indexOf('edge') === -1)  && (agent.indexOf('opr') === -1);
    var w = $(window).width();
    //var wSP = 768;
    var wSP = 1;

    var stackedOptions = 'Top'; // transform originの位置
    var intervalId; // タイマーフラグ
    var loopStopFlag = true; // ループ停止フラグ
    var slideInterval = 3600; // オートでスライドするミリ秒
    var rotate = true; //スタックされたカードでの移動ごとに要素の回転をアクティブ
    var items = 3; // スタックされる表示の枚数
    var elementsMargin = 10; //、最初の要素を除くすべての要素に追加されるマージン
    var useOverlays = false; //スワイプ要素のオーバーレイを有効または無効
    var contentRote = 18;
    // UseOverlays：スワイプ要素のオーバーレイを有効または無効に
    var maxElements = 6; // DOM上のスタックされたカードの合計
    var currentPosition = 0; //アクティブなスタックカードの位置を保持
    var velocity = 0.3; // スワイプをトリガーするために許可されるベロシティ
    var topObj; //スワイプトップのプロパティを保持
    var rightObj; //右のスワイププロパティを保持
    var leftObj; //左にスワイプのプロパティを保持
    var listElNodesObj; //スタックされたカードからノードのリストを保持
    var listElNodesWidth; //積み重ねたカードの幅を維持
    var currentElementObj; //スタックされたカード要素をスワイプ
    var stackedCardsObj; //スタックされた要素をコンテナに保持
    var isFirstTime = true;
    var elementHeight; //要素の高さを取得
    var obj; //スタックされたカードオブジェクトを保持
    var elTrans; //計算のための要素マージンの合計

    obj = document.getElementById('stacked-cards-block');
    stackedCardsObj = obj.querySelector('.stackedcards-container');
    listElNodesObj = stackedCardsObj.children;


    countElements();
    currentElement();
    listElNodesWidth = stackedCardsObj.offsetWidth;
    currentElementObj = listElNodesObj[0];
    updateUi();

    // DOMで要素を準備する
    addMargin = elementsMargin * (items -1) + 'px';
    console.log(addMargin);

    if(stackedOptions === "Top"){
      for(i = items; i < maxElements; i++){
        listElNodesObj[i].classList.add('stackedcards-top', 'stackedcards--animatable', 'stackedcards-origin-top');
      }
      elTrans = elementsMargin * (items - 1);
      stackedCardsObj.style.marginBottom = addMargin;
    }
    // 設定枚数以上超えると非表示
    for(i = items; i < maxElements; i++){
      listElNodesObj[i].style.zIndex = 0;
      listElNodesObj[i].style.opacity = 0;
      listElNodesObj[i].style.webkitTransform ='scale(' + (1 - (items * 0.04)) +') translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
      listElNodesObj[i].style.transform ='scale(' + (1 - (items * 0.04)) +') translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
    }

    if(listElNodesObj[currentPosition]){
      // console.log(listElNodesObj[currentPosition]);
      // console.log('listElNodesObj');
      listElNodesObj[currentPosition].classList.add('stackedcards-active');
    }


    setTimeout(function() {
      obj.classList.remove('init');
    }, 150);


    // ジャンプエリアに行かなかった場合、1番最初にもどる処理
    function backToMiddle() {
      // console.log('backToMiddlebackToMiddlebackToMiddlebackToMiddle');
      removeNoTransition();
      transformUi(0, 0, 1, 0, currentElementObj);

      if(useOverlays){
        transformUi(0, 0, 0, 0, leftObj);
        transformUi(0, 0, 0, 0, rightObj);
        transformUi(0, 0, 0, 0, topObj);
      }
      setZindex(5);

      if(!(currentPosition >= maxElements)){
        // 2番目の要素の不透明度をロールバック
        if((currentPosition + 1) < maxElements){
          listElNodesObj[currentPosition + 1].style.opacity = '.8';
        }
      }
    };

    // スタックされた各カードのDOM上のすべての要素を更新するアクション。
    // UI上は画像の枚数をカウントしてループで位置、画像の大きさ、透明度、重なりZ-indexを調整
    function updateUi() {
      requestAnimationFrame(function(){
        elTrans = 0;
        var elZindex = 5;
        var elScale = 1;
        var elOpac = 1;
        var NumPer = 500;
        var elRotate = contentRote / 3; // 本体も回転させて調整「表示枚数 * elRotateの数値」 itemsでもいいかも
        var elTransTop = items;
        var elTransInc = elementsMargin;
        // var elR = 10;

        // console.log('updateUi() ：currentPosition: ' + currentPosition);
        // itemsだと再帰時の際、stack準備されていないものが戻ってくる
        // for(i = currentPosition; i < (currentPosition + items); i++){
        for(i = currentPosition; i < (currentPosition + maxElements); i++){
          // console.log('updateUi');
          if(listElNodesObj[i]){
            // console.log('listElNodesObj[i]: '+ listElNodesObj[i]);
            if(stackedOptions === "Top"){
              // listElNodesObj[i].classList.add('stackedcards-top', 'stackedcards--animatable', 'stackedcards-origin-top');
              listElNodesObj[i].classList.add('stackedcards-origin-top');

              elTrans = elTransInc * elTransTop;
              elR = elRotate * elTransTop;
              elTransTop--;
            }

            listElNodesObj[i].style.transform ='scale(' + elScale + ') translateX(0) translateY(' + (elTrans - elTransInc) + 'px) perspective(' + NumPer + 'px) translateZ(0) rotate('+ elR +'deg)' ;
            listElNodesObj[i].style.webkitTransform ='scale(' + elScale + ') translateX(0) translateY(' + (elTrans - elTransInc) + 'px) perspective(' + NumPer + 'px) translateZ(0) rotate('+ elR +'deg)' ;
            listElNodesObj[i].style.opacity = elOpac;
            listElNodesObj[i].style.zIndex = elZindex;

            elScale = elScale - 0.04;
            elOpac = elOpac - (1 / items);
            elZindex--;
          }
        }
      });
    };


    // currentスタックの移動時インタラクション
    function transformUi(moveX, moveY, opacity, zoom, elementObj) {
      console.log('transformUitransformUitransformUitransformUitransformUi');
      requestAnimationFrame(function(){
        var element = elementObj,
          Rote = contentRote,
          NumpPer = 500,
          numZ    = zoom;

        if(!chrome) {
          numX =  Math.floor(moveX);
          numY =  Math.floor(moveY);
        }

        // 移動しながら回転
        function RotateRegulator(value) {
          if(value/10 > 15) {
            return 15;
          }
          else if(value/10 < -15) {
            return -15;
          }
          return value/10;
        }
        if(rotate){
          rotateElement = RotateRegulator(moveX);
        } else {
          rotateElement = 0;
        }

        // updateUi の elRotate分の数値を追加
        rotateElement += Rote;


        elTrans = elementsMargin * (items - 1);
        if(element) {
          // console.log('chorme-');
          // console.log('moveX: ' + moveX);
          element.style.webkitTransform = "translateX(" + moveX + "px) translateY(" + (moveY + elTrans) + "px) perspective(" + NumpPer + "px) translateZ(" +  numZ + "px) rotate(" + rotateElement + "deg)";
          element.style.transform = "translateX(" + moveX + "px) translateY(" + (moveY + elTrans) + "px) perspective(" + NumpPer + "px) translateZ(" +  numZ + "px) rotate(" + rotateElement + "deg)";

        }

      });
    };

    // スタックの枚数
    function countElements() {
      maxElements = listElNodesObj.length;
      if(items > maxElements){
        items = maxElements;
      }
    };

    // スタックの枚数目
    function currentElement() {
      currentElementObj = listElNodesObj[currentPosition];
      console.log('currentElementObjjj: ' + currentElementObj);
    };



    function changeStages() {
      if(currentPosition == maxElements){
        // 遷移がいつ終了して状態が変化するかを知るために作成されたイベントリスナー
        console.log('changeStages');
        setZindex(6);
        // playBack();
        // listElNodesObj[maxElements - 1].addEventListener('transitionend', function(){
        //   // document.body.classList.add("background-7");
        //   // document.querySelector('.stage').classList.add('hidden');
        //   // document.querySelector('.final-state').classList.remove('hidden');
        //   // document.querySelector('.final-state').classList.add('active');
        //   listElNodesObj[maxElements - 1].removeEventListener('transitionend', null, false);
        // });

      }
    };

    function onActionLeft() {
      if(!(currentPosition >= maxElements)){
        if(useOverlays) {
          leftObj.classList.remove('no-transition');
          topObj.classList.remove('no-transition');
          leftObj.style.zIndex = '8';
          transformUi(0, 0, 1, 0, leftObj);
        }
        setTimeout(function() {
          onSwipeLeft();
          // resetOverlayLeft();
        }, 300);
      }
    };

    function onActionRight() {
      // スタックの枚目が合計枚数以下なら true
      if(!(currentPosition >= maxElements)){
        console.log('スタックの枚目が合計枚数以下なら true' + 'onActionRight：currentPosition: ' + currentPosition);
        if(useOverlays) {
          rightObj.classList.remove('no-transition');
          topObj.classList.remove('no-transition');
          rightObj.style.zIndex = '8';
          transformUi(0, 0, 1, 0, rightObj);
        }

        setTimeout(function(){
          onSwipeRight();
          // resetOverlayRight();
        }, 300);
      }
    };

    function onActionTop() {
      if(!(currentPosition >= maxElements)){
        if(useOverlays) {
          leftObj.classList.remove('no-transition');
          rightObj.classList.remove('no-transition');
          topObj.classList.remove('no-transition');
          topObj.style.zIndex = '8';
          transformUi(0, 0, 1, 0, topObj);
        }
        setTimeout(function(){
          onSwipeTop();
          resetOverlays();
        }, 300);
      }
    };


    // カレント要素のパフォーマンスを向上させるために、スワイプするたびに移動する要素のトランジションを削除
    function removeNoTransition() {
      if(listElNodesObj[currentPosition]){
        if(useOverlays) {
          leftObj.classList.remove('no-transition');
          rightObj.classList.remove('no-transition');
          topObj.classList.remove('no-transition');
        }
        listElNodesObj[currentPosition].classList.remove('no-transition');
        listElNodesObj[currentPosition].style.zIndex = 6;
      }
    };

    // function setActiveHidden() {
    //   // 枚数目が合計以上じゃなかったら（以下だったら） true
    //   console.log('setActiveHidden: currentPosition ' + currentPosition);
    //   console.log('listElNodesObj[currentPosition]: ' + listElNodesObj[currentPosition]);
    //   if(!(currentPosition >= maxElements)){
    //     listElNodesObj[currentPosition - 1].classList.remove('stackedcards-active');
    //     listElNodesObj[currentPosition - 1].classList.add('stackedcards-hidden');
    //     listElNodesObj[currentPosition].classList.add('stackedcards-active');
    //   }
    //   if(currentElementObj === undefined) {
    //     reproduction();
    //   }
    // };

    function setActiveHiddenT() {
      // 枚数目が合計以上じゃなかったら（以下だったら） true
      // pager
      pagerNext();

      if(!(currentPosition >= maxElements)){
        listElNodesObj[currentPosition - 1].classList.remove('stackedcards-active');
        listElNodesObj[currentPosition - 1].classList.add('stackedcards-hidden');
        listElNodesObj[currentPosition - 1].classList.add('stackedcards-hidden--top');
        listElNodesObj[currentPosition].classList.add('stackedcards-active');
      }
      if(currentElementObj === undefined) {
        reproduction();
      }
    };

    function setActiveHiddenL() {
      // 枚数目が合計以上じゃなかったら（以下だったら） true
      // pager
      pagerNext();

      if(!(currentPosition >= maxElements)){
        listElNodesObj[currentPosition - 1].classList.remove('stackedcards-active');
        listElNodesObj[currentPosition - 1].classList.add('stackedcards-hidden');
        listElNodesObj[currentPosition - 1].classList.add('stackedcards-hidden--left');
        listElNodesObj[currentPosition].classList.add('stackedcards-active');
      }
      if(currentElementObj === undefined) {
        reproduction();
      }
    };

    function setActiveHiddenR() {
      // pager
      pagerNext();

      // 枚数目が合計以上じゃなかったら（以下だったら） true
      if(!(currentPosition >= maxElements)){
        listElNodesObj[currentPosition - 1].classList.remove('stackedcards-active');
        listElNodesObj[currentPosition - 1].classList.add('stackedcards-hidden');
        listElNodesObj[currentPosition - 1].classList.add('stackedcards-hidden--right');
        listElNodesObj[currentPosition].classList.add('stackedcards-active');
      }
      console.log('setActiveHiddenR');
      if(currentElementObj === undefined) {
        reproduction();
      }
    };


    function setZindex(zIndex) {
      if(listElNodesObj[currentPosition]){
        listElNodesObj[currentPosition].style.zIndex = zIndex;
      }
    };



    // window.requestAnimationFrame(transformUi);

    // タッチイベント変数
    var element = obj;
    var startTime;
    var startX;
    var startY;
    var translateX;
    var translateY;
    var currentX;
    var currentY;
    var touchingElement = false;
    var timeTaken;
    var topOpacity;
    var rightOpacity;
    var leftOpacity;


    // バタートランジションのようにスムーズにするため
    function setOverlayOpacity() {

      topOpacity = (((translateY + (elementHeight) / 2) / 100) * -1);
      rightOpacity = translateX / 100;
      leftOpacity = ((translateX / 100) * -1);


      if(topOpacity > 1) {
        topOpacity = 1;
      }

      if(rightOpacity > 1) {
        rightOpacity = 1;
      }

      if(leftOpacity > 1) {
        leftOpacity = 1;
      }

      console.log('setOverlayOpacity'+ rightOpacity);
    }

    function stackJump() {
      $stacJumpNum = 10;
      if(!(currentPosition >= maxElements)){
        // 縦フリック
        if(translateY < (elementHeight * -1) && translateX > ((listElNodesWidth / $stacJumpNum) * -1) && translateX < (listElNodesWidth / $stacJumpNum)){

          // フリック上で画面から消える
          if(translateY < (elementHeight * -1) || (Math.abs(translateY) / timeTaken > velocity)){
            console.log('onSwipeTop');
            onSwipeTop();
          } else {
            backToMiddle();
          }

        } else {
          // 横フリック
          // console.log('ジャンプ準備:' + translateX);
          if(translateX < 0){
            if(translateX < ((listElNodesWidth / $stacJumpNum) * -1) || (Math.abs(translateX) / timeTaken > velocity)){
              // console.log('onSwipeLeft');
              onSwipeLeft();
            } else {
              backToMiddle();
            }
          } else if(translateX > 0) {

            if (translateX > (listElNodesWidth / $stacJumpNum) && (Math.abs(translateX) / timeTaken > velocity)){
              // console.log('onSwipeRight');
              onSwipeRight();
            } else {
              backToMiddle();
            }

          }
        }
      }
    }


    function gestureStart(evt) {
      console.log('sp-start');

      startTime = new Date().getTime();

      startX = evt.changedTouches[0].clientX;
      startY = evt.changedTouches[0].clientY;

      currentX = startX;
      currentY = startY;

      setOverlayOpacity();

      touchingElement = true;
      if(!(currentPosition >= maxElements)){
        if(listElNodesObj[currentPosition]){
          listElNodesObj[currentPosition].classList.add('no-transition');
          setZindex(6);

          if(useOverlays){
            leftObj.classList.add('no-transition');
            rightObj.classList.add('no-transition');
            topObj.classList.add('no-transition');
          }

          // 次のスタックの透明度を1へ
          if((currentPosition + 1) < maxElements){
            listElNodesObj[currentPosition + 1].style.opacity = '1';
          }

          // 縦フリックで消える領域を計算する際の値
          elementHeight = listElNodesObj[currentPosition].offsetHeight / 3;
          // elementHeight = listElNodesObj[currentPosition].offsetHeight;
        }

      }

    };

    function gestureMove(evt) {
      console.log('sp-move');
      currentX = evt.changedTouches[0].pageX;
      currentY = evt.changedTouches[0].pageY;

      translateX = currentX - startX;
      translateY = currentY - startY;

      setOverlayOpacity();

      if(!(currentPosition >= maxElements)){
        evt.preventDefault();
        transformUi(translateX, translateY, 1, 0, currentElementObj);

        if(useOverlays){
          transformUi(translateX, translateY, 0, topOpacity, topObj);

          if(translateX < 0){
            transformUi(translateX, translateY, 0, leftOpacity, leftObj);
            transformUi(0, 0, 0, rightObj);

          } else if(translateX > 0){
            transformUi(translateX, translateY, 0, rightOpacity, rightObj);
            transformUi(0, 0, 0, 0, leftObj);
          }

          if(useOverlays){
            leftObj.style.zIndex = 8;
            rightObj.style.zIndex = 8;
            topObj.style.zIndex = 7;
          }

        }

      }

    };

    function gestureEnd(evt) {
      console.log('sp-end');
      if(!touchingElement){
        return;
      }

      translateX = currentX - startX;
      translateY = currentY - startY;

      timeTaken = new Date().getTime() - startTime;

      touchingElement = false;

      // スタック要素の幅を以下数で割った割合でonSwipeTop関数が実行
      stackJump();
    };

    element.addEventListener('touchstart', gestureStart, false);
    element.addEventListener('touchmove', gestureMove, false);
    element.addEventListener('touchend', gestureEnd, false);

    // windowが960以上だった場合
    if(w > wSP) {
      var numX;
      var numY;
      var isFlag = false;

      // マウスダウンイベント
      element.onmousedown = function(event) {
        isFlag = true;
        // console.log(isFlag);
        loopStop();
        // console.log('マウスダウン！');
        $(this).addClass('mouseDown');
        startTime = new Date().getTime();

        // setOverlayOpacity();

        startX = event.screenX;
        startY = event.screenY;

        // currentX = startX;
        // currentY = startY;
        // console.log('onmousedown:::::translateX: '+ translateX);

        if(!(currentPosition >= maxElements)){
          // 該当のスタックのトランジションを無効に
          if(listElNodesObj[currentPosition]){
            listElNodesObj[currentPosition].classList.add('no-transition');
            setZindex(6);

            // 次のスタックの透明度を1へ
            if((currentPosition + 1) < maxElements){
              listElNodesObj[currentPosition + 1].style.opacity = '1';
            }
            // 縦フリックで消える領域を計算する際の値
            elementHeight = listElNodesObj[currentPosition].offsetHeight / 3;
          }
        }


        transformUi(translateX, translateY, 1, 50, currentElementObj);
        // console.log('移動中');
        // ページ全体からの座標
        currentX = event.screenX;
        currentY = event.screenY;
        // マススを動かしていなかった場合の処理　マウスダウンのみ
        translateX = currentX - startX;
        translateY = currentY - startY;

        console.log(translateX);
        console.log(translateY);


        element.addEventListener('mousemove', onMouseMove, true);
      };

      function onMouseMove(event) {
        if(!isFlag){
          return;
        }
        // console.log('移動中');
        // ページ全体からの座標
        currentX = event.screenX;
        currentY = event.screenY;

        translateX = currentX - startX;
        translateY = currentY - startY;


        // console.log(currentElementObj);
        transformUi(translateX, translateY, 1, 50, currentElementObj);
      }

      element.addEventListener('mousemove', onMouseMove, true);
      // console.log(touchingElement);

      // UPPPPPP!
      document.onmouseup = function(event) {
        // console.log('UP');
        timeTaken = new Date().getTime() - startTime;
        // console.log(timeTaken);
        // console.log(element);
        // 移動のイベントリスナー削除
        $(this).removeClass('mouseDown');
        element.removeEventListener('mousemove', onMouseMove, true);
        if(translateX == 0 || translateY == 0 ) {
          console.log('マススを動かしていなかった場合の処理');
          backToMiddle();
          // ドラッグした距離をリセット
          translateX = 0;
          translateY = 0;
        }
        stackJump();
        // ドラッグした距離をリセット
        translateX = 0;
        translateY = 0;

        // ループタイマーフラグがtrueなら実行（停止ボタンのときはloopさせない）
        // console.log('loopStopFlag');
        // console.log(loopStopFlag);
        // console.log('loopStopFlag');
        if(w > wSP) {
          if(loopStopFlag) {
            loopStart(); // 時間をリセット
          }
        }
        // element.onmouseup = null;
        // console.log('UP完了');
      };
      element.ondragstart = function() {
        console.log('ondragstart');
        return false;
      };
    }



    function onSwipeTop() {
      removeNoTransition();
      // 回転しながら消えていくインタラクション
      transformUi(0, -2000, 0, 50, currentElementObj);
      currentPosition = currentPosition + 1;
      updateUi();
      currentElement();
      // changeBackground();
      changeStages();
      setActiveHiddenT();
    };

    function onSwipeLeft() {
      removeNoTransition();
      // 回転しながら消えていくインタラクション
      transformUi(-2000, 0, 0, 50, currentElementObj);
      currentPosition = currentPosition + 1;
      updateUi();
      currentElement();
      // changeBackground();
      changeStages();
      setActiveHiddenL();
    };

    function onSwipeRight() {
      removeNoTransition();
      // 回転しながら消えていくインタラクション
      transformUi(2000, 0, 0, 50, currentElementObj);

      currentPosition = currentPosition + 1;
      updateUi();
      currentElement();
      // changeBackground();
      changeStages();
      setActiveHiddenR();
    };


    // 再帰
    function reproduction() {
      setTimeout(function() {
        // console.log('再帰');
        // obj = document.getElementById('stacked-cards-block');
        // stackedCardsObj = obj.querySelector('.stackedcards-container');
        // listElNodesObj = stackedCardsObj.children;
        // currentPosition = 0;
        // console.log(listElNodesObj);
        // listElNodesObj[currentPosition - 1].classList.remove('stackedcards-hidden');
        currentPosition = 0;
        $el = $('.card');
        $dataf = $('.data.first');
        $el.removeClass('stackedcards-hidden');
        $el.removeClass('stackedcards-hidden--left');
        $el.removeClass('stackedcards-hidden--right');
        $el.removeClass('stackedcards-hidden--top');
        $el.css('translateX', '0px');
        $dataf.addClass('active');
        // transformUi(0, 0, 1, $el);
        updateUi();
        slideIndex = 0;
        currentElement()
        // $('.prev').addClass('is-disable');
      }, 450);

    }

    // 戻る
    function playBack() {
      currentPosition = currentPosition - 1;
      // currentPosition = slideIndex;
      // console.log('代入されたcurrentPosition: '+ currentPosition);
      if(!(currentPosition >= maxElements)){
        // 合計より少なかったらtrue
        // console.log('!: ' + !(currentPosition >= maxElements));
        if(currentPosition == 0) {
          // transformUi(1000, 1, 1, currentElementObj);
          console.log('0です');
          listElNodesObj[currentPosition].classList.add('stackedcards-active');
          listElNodesObj[currentPosition].classList.remove('stackedcards-hidden');
          listElNodesObj[currentPosition].classList.remove('stackedcards-hidden--top');
          listElNodesObj[currentPosition].classList.remove('stackedcards-hidden--right');
          listElNodesObj[currentPosition].classList.remove('stackedcards-hidden--left');
        } else {
          listElNodesObj[currentPosition - 1].classList.remove('stackedcards-active');
          listElNodesObj[currentPosition].classList.remove('stackedcards-hidden');
          listElNodesObj[currentPosition].classList.remove('stackedcards-hidden--top');
          listElNodesObj[currentPosition].classList.remove('stackedcards-hidden--right');
          listElNodesObj[currentPosition].classList.remove('stackedcards-hidden--left');
          listElNodesObj[currentPosition + 1].classList.remove('stackedcards-active');
          listElNodesObj[currentPosition].classList.add('stackedcards-active');
          console.log('play');
        }
      }
      updateUi();
      currentElement();
    }


    $snum = $('.stage .slide').length;
    $slide1 = $('.stage .slide').eq(0);
    $data1 = $('.data').eq(0);
    // console.log('length：' + $snum);
    // console.log('eq：' + $slide1);

    function pagerNext() {
      // 現在表示中のスライドを取得
      var $displaySlide = $('.active');
      // そのスライドからactiveクラスを除いて表示されないようにする
      $displaySlide.removeClass('active');
      // 一番最後の要素が表示されているとき
      if(slideIndex == $snum - 1) {
        // 最初の要素にactiveを付与
        $slide1.addClass('active');
        $data1.addClass('active');
        console.log('元に戻る');
      } else {
        // 次のスライドにactiveクラスをつけ、表示させる
        $displaySlide.next().addClass('active');
      }
      toggleChangeBtn();
    }


    function pagerPrev() {
      // フリックでのカレントポジションを戻す
      // currentPosition --;
      listElNodesObj[currentPosition].classList.remove('stackedcards-hidden');
      listElNodesObj[currentPosition].classList.remove('stackedcards-hidden--top');
      listElNodesObj[currentPosition].classList.remove('stackedcards-hidden--right');
      listElNodesObj[currentPosition].classList.remove('stackedcards-hidden--left');
      var $displaySlide = $('.active');
      $displaySlide.removeClass('active');
      $displaySlide.prev().addClass('active');
      toggleChangeBtn();
      // prevでもフリックされたCurrentスタックを取得
      currentElement();
    }

    var slideIndex;
    function toggleChangeBtn() {
      // activeクラスがついている要素(現在表示中のスライド)のindexを取得
      slideIndex = $('.stage .slide').index($('.active'));
      $('.button').show();/*両ボタンを表示*/
      // console.log('init: ' + slideIndex);
      // 一番最初の要素が表示されているとき
      if(slideIndex == 0){
        $('.prev').addClass('is-disable');
        $('.next').removeClass('is-disable');
      } else if(slideIndex == $snum - 1){
        // console.log('一番最後の要素が表示されているとき');
      } else {
        $('.prev').removeClass('is-disable');
      }
    }
    toggleChangeBtn();
    $('.next').on( 'click', function() {
      // slideIndex ++ ;
      // console.log('next: ' + slideIndex);
      onActionLeft();
    });


    $('.prev').on('click', function() {
      // slideIndex -- ;
      // console.log('prev: ' + slideIndex);
      playBack();
      pagerPrev();

    });

    $('.stop').on('click', function() {
      $(this).css('display', 'none');
      $('.play').css('display', 'block');
      loopStopFlag = false; // フリック用フラグ
      loopStop();
    });

    $('.play').on('click', function() {
      $(this).css('display', 'none');
      $('.stop').css('display', 'block');
      loopStopFlag = true;
      if(w > wSP) {
        loopStart();
      }

    });


    // ループ実行
    if(w > wSP) {
      loopStart();
    }
    // ループスタート
    function loopStart() {
      if (intervalId == null) {
        intervalId = setInterval(　function(){
          onActionLeft();
          console.log('ループ実行');
        }, slideInterval);
      }
    }
    // ループストップ
    function loopStop() {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

});