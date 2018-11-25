'use strict';

var app = angular.module('myApp.upload', ['ngRoute','ngFileUpload'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/upload', {
    templateUrl: 'views/upload_view/upload.html',
    controller: 'UploadCtrl'
  });
}]);

app.controller('UploadCtrl', ['$scope', 'Upload', '$timeout', "ngDialog", "$http", function ($scope, Upload, $timeout, ngDialog, $http) {

  $('body').removeClass('enterscreen');

  $(window).on('resize', function(){
    responsiveCalculate();
  });

  function responsiveCalculate() {
    var docWidth, docHeight;

    docWidth = document.body.clientWidth;
    docHeight = docWidth*1080/1920;

    $('.containerObj,.containerObj .sahne, .containerObj .uploadSahne img.bg').css({'width':docWidth});
  }
  

  $scope.uploadPic = function(file) {
    file.upload = Upload.upload({
      url: '/uploads',
      data: {file: file},
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
          $timeout(function() {
            $('.uploadProgess').slideUp()
          }, 1500);
        });
      }, function (response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
          $scope.picFile = null;
      }, function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
            $('.uploadProgess').show()
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
  }


  /*dialog*/
  $scope.selectedItems= {};


  var dialog;
  $scope.clickToOpen = function () {
       dialog = ngDialog.openConfirm({ 
          template: 'uploadTemplate', 
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

      $scope.selectedItems.klasikSpor  = -1;
      $scope.selectedItems.zeminRengi  = -1;
      $scope.selectedItems.motifRengi  = -1;
      $scope.selectedItems.motifRengi1 = -1;
      $scope.selectedItems.markaSelect = -1;
      $scope.selectedItems.seriSelect  = -1;

      $scope.renkler = $scope.data[9].datas;
      $scope.markalar= $scope.data[7].datas;
      $scope.seriler = [];


    });
  }

  $scope.init();

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

  var transformCreate = 0;
  $scope.changeHali = function(img, id){
    $scope.haliSource = img;
    $scope.haliId = id;
    ngDialog.close(dialog);
    $('#fatcap,#svg-tool').show();

    if (!transformCreate) {
      $timeout(function(){
        App.create();
      },1);
      transformCreate = 1;
    };
  }

  /*dialog*/


  $scope.openUploadWindow = function () {
      $('#upload').trigger('click');
  };


  $scope.$on('$viewContentLoaded', function() {
    //$scope.openUploadWindow();
    responsiveCalculate();
    App.create();
  });


  document.getElementById('upload').onchange = function() {
    document.getElementById("submitBtn").click();
      $timeout(function () {
        $scope.uploadPic($scope.picFile);
      }, 100);
  };


  /*halı ekleme işlemleri*/

  $scope.haliEkle = function (){
    $('#fatcap,#svg-tool').toggle();
    ngDialog.close(dialog);
  };


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

    var win = window.open("https://evimdegor.com/siparis_ver/"+ haliId +"/"+ ebatId +"/"+siparisAdet+"", '_blank');
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

  $scope.siparis = { ad: '', soyad:'', tcno:'', email:'', adres:''};
  $scope.kayitDurum;

  $scope.siparisOlustur = function(){

    var url = "https://evimdegor.com/siparis.php?siparisver=1&ad="+$scope.siparis.ad+"&soyad="+$scope.siparis.soyad+"&tcno=-1&gsm="+$scope.siparis.gsm+"&email="+$scope.siparis.email+"&adres="+$scope.siparis.adres+"&halid="+$scope.haliId+"&ebatid="+$scope.ebatid+"&userid="+$scope.userId+"&siparisAdet="+ $scope.siparisAdet;

    $http({
      url: url,
      method: "GET"
    }).then(function(response){

      var result = response.data.objects[0].Sonucvarmi;

      if (result) {
        $scope.kayitDurum = true;
      }else{
        $scope.kayitDurum = false;
      }


    }, function(err){ // error handler
       alert($scope.timeoutMessage);
    });

  };

  

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