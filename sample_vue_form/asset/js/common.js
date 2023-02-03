$(function () {
    $('.uploadFile').change(function () {
      var inputname = $(this);
      if (!this.files.length) {
        return;
      }
      $(inputname).parent().parent().parent().parent().parent().next('.prevlist').text('');
  
      var $files = $(this).prop('files');
      var len = $files.length;
      for (var i = 0; i < len; i++) {
        var file = $files[i];
        var fr = new FileReader();
  
        fr.onload = function (e) {
          var src = e.target.result;
          var img = '<img src="' + src + '">';
          $(inputname).parent().parent().parent().parent().parent().next('.prevlist').append(img);
        }
  
        fr.readAsDataURL(file);
      }
  
    });
});
  //---------------
  //  添付画像処理
  //---------------
  $(function () {
    // アップロードするファイルを選択
    //$('input[type=file]').change(function() {
    $(document).on("change", "input[type=file]", function () {
      console.log("up");
      $(this).next().children().remove();
  
      for (i = 0; i < this.files.length; i++) {
        file = $(this).prop('files')[i];
        file_name = file.name;
        file_name_txt = file_name.replace(/\./g, "");
        thumbArea = $(this).next();
        img_wrap = '<span class="img_item" id="' + file_name_txt + '"></span>';
        thumbArea.append(img_wrap);
  
        // 画像以外は処理を停止
        /*
            if (! file.type.match('image.*')) {
              // クリア
              $(this).val('');
              $('em.thumb_img').html('');
              return;
            }
        */
  
        // 画像表示
        reader = new FileReader();
        reader.name = this.files[i].name;
        $(reader).on("load", function (e) {
  
          img = e.target.result;
          img_name = this.name;
          img_name = img_name.replace(/\./g, "");
          img_del_btn = '<span class="img_item_del">✖</span>';
  
          //img_src = $('<img>').attr('src', img);
          if (file.type.match('application/zip')) {
            //img_src = $('<img>').attr('src', './theme/default/images/zipImage.png');
            img_src = $('<img>').attr('src', img);
          }else{
            img_src = $('<img>').attr('src', img);
          }
  
          //$("#" + img_name).append(img_del_btn);
          $("#" + img_name).append(img_src);
        });
        reader.readAsDataURL(file);
  
        file_type = file_name.split('.').pop();
        if(file_type == "zip"){
          $('.img_item#'+file_name_txt+'').addClass('type_zip');
          $('.img_item#'+file_name_txt+'').append('<span>'+file_name+'</span>');
        }else if(file_type == "psd"){
          $('.img_item#'+file_name_txt+'').addClass('type_psd');
          $('.img_item#'+file_name_txt+'').append('<span>'+file_name+'</span>');
        }else if(file_type == "ai"){
          $('.img_item#'+file_name_txt+'').addClass('type_ai');
          $('.img_item#'+file_name_txt+'').append('<span>'+file_name+'</span>');
        }else if(file_type == "pdf"){
          $('.img_item#'+file_name_txt+'').addClass('type_pdf');
          $('.img_item#'+file_name_txt+'').append('<span>'+file_name+'</span>');
        }
  
      }
  
    });
  
    // 個別削除
    $(document).on("click", ".img_item_del", function () {
      id = $(this).parent().attr("id")
      //val = $(this).parent().parent().prev().prop('files');
  
      item = $(this).parent().parent().prev().val();
      console.log(item);
  
      /*$.each(val,function(index,item){
        $(this).parent().parent().prev().val('');
        console.log(item);
      });*/
  
      
    });
  
    //一括削除
    $('.upFileWrap .js-clear').hide();
    $('.upFileWrap input[type=file]').change(function () {
      $(this).prev().show();
    });
    $('.upFileWrap .js-clear').click(function () {
      $(this).next().val('');
      $(this).next().next().children().remove();
      $(this).hide();
    });
  
  });