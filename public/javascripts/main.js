$(function () {

 var index = 1;

  $('body').on('click', '.tabs button', function(){
    index = $(this).index();
    $('.tabs button').removeClass('active');
    $(this).addClass('active');
    $('#tab_contents > div').hide();
    $('#tab_contents > div:eq('+ index +')').show();

    $('.tabs button img.white').removeClass('hidden');
    $('.tabs button img.brown').addClass('hidden');

    $(this).children('img.white').addClass('hidden');
    $(this).children('img.brown').removeClass('hidden');

  });

});