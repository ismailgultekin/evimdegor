'use strict';

var app = angular.module('myApp.design', ['ngRoute','ngDialog'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/design', {
    templateUrl: 'views/design_view/design.html',
    controller: 'DesignCtrl'
  });
}]);

app.controller('DesignCtrl', ["$scope","$http",  "$timeout", "ngDialog", '$location', function($scope, $http, $timeout, ngDialog, $location) {

  $scope.selectedItems= {};

  var dialog;
  $scope.clickToOpen = function () {
    dialog = ngDialog.openConfirm({ 
      template: 'templateId', 
      scope: $scope
    });
  };

  $scope.tekrarTara = function(){
    $scope.haliListesiShowStatus = 0;
  }

  $scope.data;
  $scope.haliDurum = false;

  $scope.init = function(){

    $('body').removeClass('enterscreen');

    $http({
      url: "https://evimdegor.com/json.php", 
      method: "GET"
    }).then(function(response){

      $scope.data = response.data.objects;

      $scope.selectedItems.haliSelect   = 1;
      $scope.selectedItems.koltukSelect = 1;
      $scope.selectedItems.duvarSelect = 1;
      $scope.selectedItems.zeminSelect = 1;
      $scope.selectedItems.perdeSelect = 1;
      $scope.selectedItems.tavanSelect = 1;
      $scope.selectedItems.cam = 1;

      $scope.selectedItems.klasikSpor  = -1;
      $scope.selectedItems.zeminRengi  = -1;
      $scope.selectedItems.motifRengi  = -1;
      $scope.selectedItems.motifRengi1 = -1;
      $scope.selectedItems.cocukStandart = -1;
      $scope.selectedItems.markaSelect = -1;
      $scope.selectedItems.seriSelect  = -1;
      $scope.selectedItems.cocukOzelTasarim  = -1;

      $scope.renkler = $scope.data[9].datas;
      $scope.markalar= $scope.data[7].datas;
      $scope.seriler = [];

      render();

    });
  }

  $scope.init();
  

  $scope.change = function(){
      if (!$scope.haliDurum) $scope.haliDurum = true;
      render();
  }

  $scope.changeMarka = function(){

    var degerler = [];
    var seriler =  $scope.data[8].datas;
    var sayac = 1;

    seriler.forEach(function(entry, index){
      if (entry.markaid == $scope.selectedItems.markaSelect) {
        degerler.push(entry);
      };
      
      if (sayac == seriler.length) {
        $scope.seriler = degerler;
      };

      sayac++;
    });

  }


  function render(){
    $scope.koltukSource = $scope.data[5].datas[$scope.selectedItems.koltukSelect-1].image_hd;
    $scope.duvarSource  = $scope.data[1].datas[$scope.selectedItems.duvarSelect-1].image_hd;
    $scope.zeminSource  = $scope.data[2].datas[$scope.selectedItems.zeminSelect-1].image_hd;
    $scope.perdeSource  = $scope.data[4].datas[$scope.selectedItems.perdeSelect-1].image_hd;
    $scope.tavanSource  = $scope.data[3].datas[$scope.selectedItems.tavanSelect-1].image_hd;
    $scope.camSource    = $scope.data[6].datas[$scope.selectedItems.tavanSelect-1].image_hd;
  }


  $scope.haliListesi;

  $scope.haliListesiShowStatus = 0;
  $scope.aramaDurum = false;

  $scope.detaylandir = function(){
    $scope.aramaDurum = false;

    $scope.page = 1;

    nullControl();

    var url = "https://evimdegor.com/jsonsearch.php?haliara=1&klasikspor="+$scope.selectedItems.klasikSpor+"&zeminRengi="+$scope.selectedItems.zeminRengi+"&motifRengi="+$scope.selectedItems.motifRengi+"&motifRengi1="+$scope.selectedItems.motifRengi1+"&marka="+$scope.selectedItems.markaSelect+"&seri="+$scope.selectedItems.seriSelect+"&cocukOzelTasarim="+ $scope.selectedItems.cocukOzelTasarim ;


    $http({
      url: url, 
      method: "GET"
    }).then(function(response){

      var result = response.data.objects;

      if(result[1].Sonucvarmi){
        $scope.haliListesiShowStatus = 1;
        $scope.haliListesi = result[0];
      }else{
        $scope.haliListesi = [];
        $scope.aramaDurum = true;
      }
    });
    
  }

  function nullControl(){
    if ($scope.selectedItems.klasikSpor == "") { $scope.selectedItems.klasikSpor = -1};
    if ($scope.selectedItems.zeminRengi == null) { $scope.selectedItems.zeminRengi = -1};
    if ($scope.selectedItems.motifRengi == null) { $scope.selectedItems.motifRengi = -1};
    if ($scope.selectedItems.motifRengi1 == null) { $scope.selectedItems.motifRengi1 = -1};
    if ($scope.selectedItems.markaSelect == null) { $scope.selectedItems.markaSelect = -1};
    if ($scope.selectedItems.seriSelect == null) { $scope.selectedItems.seriSelect = -1};
    if ($scope.selectedItems.cocukOzelTasarim == null) { $scope.selectedItems.cocukOzelTasarim = -1};
  }


  $scope.changeHali = function(img, id){
    $scope.haliSource = img;
    $scope.haliId = id;
    ngDialog.close(dialog);
  }


  /* select buttons actions*/
  $scope.show_menu = function (){
    $('#select_buttons').show();
    $('.black_area').fadeIn();
  }

  jQuery.fn.center = function () {
    return this.each(function() {
      var top = ($(window).height() - $(this).outerHeight()) / 2;
      var left = ($(window).width() - $(this).outerWidth()) / 2;
      $(this).css({position:'absolute', margin:0, top: (top > 0 ? top : 0)+'px', left: (left > 0 ? left : 0)+'px'});
    });
  }


  function responsiveCalculate() {
    var docWidth, docHeight;

    docWidth = document.body.clientWidth;
    docHeight = docWidth*1080/1920;

    $('.containerObj,.containerObj .sahne').css({'width':docWidth});
  }

  responsiveCalculate();

  $(window).on('resize', function(){
    $("#select_buttons").center();

    responsiveCalculate();
    //deviceDetect();
  });

  $("#select_buttons").center();

  $('.black_area,.close_popup').on('click', function(){
    $('.black_area').fadeOut();
    $('#select_buttons').hide();
  })

  

  /*detay sayfası*/
  var dialogDetay;
  $scope.detayDialog = function () {
    
    var haliId = $scope.haliId;
    var url = "https://evimdegor.com/jsonsearch.php?haliara=2&hali_id="+ haliId;
    $http({
        url: url, 
        method: "GET"
      }).then(function(response){
        
          var result = response.data.objects;
          var data   = result[0][0];
        if(result[1].Sonucvarmi){

          $scope.title   = data.name;
          $scope.imgName = data.image_hd;
          $scope.markaAdi= data.marka;
          $scope.seriAdi = data.seriadi;
          $scope.ebatlar = data.datas;

          if ($scope.ebatlar.length < 1) {
            alert('Ebat bilgisi bulunamadı');
            return false;
          };

          $scope.secilenler = {};
          $scope.secilenler.ebatSelected = $scope.ebatlar[0].num;

          dialogDetay = ngDialog.openConfirm({ 
            template: 'detayDialog', 
            scope: $scope
          });

          $scope.$watch('secilenler.ebatSelected', function() {
            $scope.fiyat          = $scope.ebatlar[$scope.secilenler.ebatSelected].fiyat;
            $scope.ozellikler     = data.ozellikler
            $scope.indirim        = $scope.ebatlar[$scope.secilenler.ebatSelected].indirim;
            $scope.indirimliFiyat = $scope.fiyat - ( ($scope.fiyat * $scope.indirim) / 100);
            $scope.ebatid         = $scope.ebatlar[$scope.secilenler.ebatSelected].id;
          });


        }else{
          alert("böyle bir kayıt  yok");
          return false; 
        }

        

    });
  };


  /*sipariş sayfası*/
  var siparisDetay;
  $scope.siparisDialog = function () {
    
    //ngDialog.close(dialogDetay);

    $scope.kayitDurum = undefined;

    var haliId = $scope.haliId;
    var ebatId = $scope.ebatid;
    var siparisAdet = $scope.siparisAdet;

    /*
    siparisDetay = ngDialog.openConfirm({ 
      template: 'siparisDialog', 
      scope: $scope
    });*/


    var win = window.open("https://evimdegor.com/siparis_ver/"+ haliId +"/"+ ebatId +"/"+$scope.siparisAdet+"", '_blank');
    win.focus();
    
  };


  $scope.siparisAdet = 1;

  $scope.siparisArtirAzalt = function (exp) {
    if (exp == '-') {
      if($scope.siparisAdet > 1)
        $scope.siparisAdet--;
    }else if(exp == '+'){
      $scope.siparisAdet++;
    }
  }

  $scope.siparis = { ad: '', soyad:'', tcno:'', email:'', adres:'', siparisid: ''};
  $scope.kayitDurum;

  $scope.siparisOlustur = function(){


    var url = "https://evimdegor.com/siparis.php?siparisver=1&ad="+$scope.siparis.ad+"&tcno=-1&soyad="+$scope.siparis.soyad+"&gsm="+$scope.siparis.gsm+"&email="+$scope.siparis.email+"&adres="+$scope.siparis.adres+"&halid="+$scope.haliId+"&ebatid="+$scope.ebatid+"&userid=-2&siparisAdet="+ $scope.siparisAdet;

    $http({
      url: url,
      method: "GET"
    }).then(function(response){

      var result = response.data.objects[0].Sonucvarmi;

      if (result) {
        $scope.kayitDurum = true;
        $scope.siparis.siparisid = response.data.objects[0].siparisid;
      }else{
        $scope.kayitDurum = false;
      }


    }, function(err){ // error handler
       alert($scope.timeoutMessage);
    });

  };

  $scope.page = 1;
  $scope.loadMore = function(){
      nullControl();

      var url = "https://evimdegor.com/jsonsearch.php?haliara=1&page="+$scope.page+"&klasikspor="+$scope.selectedItems.klasikSpor+"&cocukOzelTasarim="+ $scope.selectedItems.cocukOzelTasarim +"&zeminRengi="+$scope.selectedItems.zeminRengi+"&motifRengi="+$scope.selectedItems.motifRengi+"&motifRengi1="+$scope.selectedItems.motifRengi1+"&marka="+$scope.selectedItems.markaSelect+"&seri="+$scope.selectedItems.seriSelect;

      $http({
        url: url, 
        method: "GET"
      }).then(function(response){

        var result = response.data.objects;
        var data = result[0];

        if(result[1].Sonucvarmi){
          angular.forEach(result[0], function(obj){
            $scope.haliListesi.push(obj);
          });

          $scope.page++;

        }else{
          alert("Bu kriterlere uygun başka ürün bulunmamaktadır.");
        }


      }, function(err){ // error handler
         alert($scope.timeoutMessage);
      });

  }

  $scope.closeSiparisDialog = function(){
    ngDialog.close(siparisDetay);
  };


$scope.odemeYap = function(){

    var url = "https://evimdegor.com/siparis.php?siparisver=5&kartSahibi="+$scope.siparis.kartSahibi+"&kartno="+$scope.siparis.kartNo+"&sonkultar="+$scope.siparis.sktAy+"/"+ $scope.siparis.sktYil +"&imza="+$scope.siparis.csv+"&siparisid="+$scope.siparis.siparisid+"&userid=-2";

    $http({
      url: url,
      method: "GET"
    }).then(function(response){

      var result = response.data.objects[0].Sonucvarmi;

      if (result) {
        $scope.kayitDurumSon = true;
      }else{
        $scope.kayitDurumSon = false;
      }


    }, function(err){ // error handler
       alert($scope.timeoutMessage);
    });
  };


}]);



app.directive('imgPreload', ['$rootScope', function($rootScope) {
    return {
      restrict: 'A',
      scope: {
        ngSrc: '@'
      },
      link: function(scope, element, attrs) {
        element.on('load', function() {
          element.addClass('in');
        }).on('error', function() {
          //
        });

        scope.$watch('ngSrc', function(newVal) {
          element.removeClass('in');
        });
      }
    };
}]);