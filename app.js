var app = angular.module("CIS550", []);


app.controller('vacationController', function($scope, $http) {

  $scope.category=["amusement park","beach","zoo","mountain","aquarium","ski resort","waterfall","museum"]

  $scope.categorySubmit= function(cat) {
    // To check in the console if the variables are correctly storing the input:
    // console.log($scope.username, $scope.password);
    var url='/getAttractions/'+cat;
    var request3 = $http({
      url: url,
      method: "GET",
    })

    request3.success(function(response) {

      console.log($scope.attractions);
      window.localStorage.setItem("attractions", JSON.stringify(response.rows));
      window.location.href = "http://localhost:8081/properties";
    });
    request3.error(function(err){
      console.log("eeeee",err);
    });
};


 
  $scope.attractions = JSON.parse(window.localStorage.getItem("attractions"));  

  $scope.myfunc= function(data) {
    console.log(data);
    window.location.href = "http://localhost:8081/property?"+data[2]+"?"+data[6];
  }; 
});


app.controller('propController', function($scope, $http) {

  $scope.myfunc= function(data) {
    console.log(data);
    window.location.href = "http://localhost:8081/property?"+data[2]+"?"+data[6];
  }; 
  
  var addurl = window.location.search;
  var address = addurl.split('?')[1].replace(/%20/g, ' ');
  var city = addurl.split('?')[2].replace(/%20/g, ' ');
  console.log(addurl);
  console.log(address);
  console.log(city);

  var url = '/getProperty/' + address;
  var request = $http({
    url: url,
    method: 'GET',
  })

  request.success(function(response){
    $scope.attraction=response.rows;
  });
  
  request.error(function(err){
    console.log("eeeee",err);
  });

  var addmap = addurl.substring(1).replace(/%20/g, '+');
  $scope.map = "https://maps.googleapis.com/maps/api/staticmap?center="+addmap+"&zoom=13&size=600x300&key=AIzaSyBibbCInVTlxCd_7nZkHp0dVr9_XgG-QFA";

  var url1 = '/getRest/' + address;
  var request1 = $http({
    url: url1,
    method: 'GET',
  })

  request1.success(function(response){
    $scope.restdata = response.rows;
    console.log($scope.restdata);
  });
  request1.error(function(err){
    console.log("eeeee",err);
  });

  var url2 = '/getHotel/' + address;
  var request2 = $http({
    url: url2,
    method: 'GET',
  })

  request2.success(function(response){
    $scope.hotdata = response.rows;
    console.log($scope.hotdata);
  });
  request2.error(function(err){
    console.log("eeeee",err);
  });

  var targetadd = address;
  var url3 = '/getState/' + targetadd;
  var request3 = $http({
    url: url3,
    method: 'GET',
  })

  request3.success(function(response){
    $scope.recommenddata = response;
    console.log($scope.recommenddata);
  });
  request3.error(function(err){
    console.log("eeeee",err);
  });

  var request4 = $http.get('/getrestprice/' + address);
  request4.success(function(data){
    var temp = '';
    for (var i = 0; i<data.length; i++){
      for (var j = 1; j<=data[i];j++){
        temp += '$';
      }
      data[i] = temp;
      temp = ''
    }
    $scope.pricerange = data;
  });
  request4.error(function(data){
    console.log('err');
  });

  var request5 = $http.get('/gethotprice/' + address);
  request5.success(function(data){
    $scope.hotrange = data;
    console.log($scope.hotrange);
  });
  request5.error(function(data){
    console.log('err');
  });

  $scope.filterfunc = function(){
    var restfilter = $scope.restfilter.split(' ')[0].length;
    var minp = $scope.minp;
    var maxp = $scope.maxp;

    if (minp == '') {minp = 0;}
    if (maxp == '') {maxp = 9999;}

    request6 = $http.get('/filteredrest/' + address +'/'+ restfilter);
    request6.success(function(data){
      $scope.filteredrest = data;
      console.log($scope.filteredrest);
    });
    request6.error(function(data){
      console.log('err');
    });

    request7 = $http.get('/filteredhot/' + address +'/'+ minp +'/'+ maxp);
    request7.success(function(data){
      $scope.filteredhot = data;
      console.log($scope.filteredhot);
    });
    request7.error(function(data){
      console.log('err');
    });

  };



});



