(function(){

  var app = angular.module('notesApp',['ngRoute', 'ngMaterial', 'ngCookies']);

  app.config(['$locationProvider', '$routeProvider',
      function ($locationProvider, $routeProvider) {

        $routeProvider
          .when('/', {
            templateUrl: '/partials/notes-view.html',
            controller: 'notesController'
          })
          .when('/login', {
             templateUrl: '/partials/login.html',
             controller: 'loginController',
          })
          .otherwise('/');
      }
  ]);

  app.run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {
      $rootScope.$on('$routeChangeStart', function (event) {
          if ($location.path() == "/login"){
             return;
          }

          if (!AuthService.isLoggedIn()) {
              console.log('DENY');
              event.preventDefault();
              $location.path('/login');
          }
      });
      $rootScope.logout = function() {
        AuthService.logout();
      }
  }]);


  app.service('AuthService', function($http, $cookies, $location, $rootScope){
        var loggedUser = $cookies.get("X-Auth-User") ? atob($cookies.get("X-Auth-User")) : null;

        function login (username, password){
            return $http.post("api/login", {username: username, password: password}).then(function(user){
                loggedUser = user;
                $cookies.put("X-Auth-User", btoa(user.data));
                isLoggedIn();
            }, function(error){
                loggedUser = null;
                isLoggedIn();
            })
        }

      function logout (){
          $cookies.remove("X-Auth-User");
          $rootScope.isLogged = false;
          $location.path("/login");
      }

        function isLoggedIn(){
            $rootScope.isLogged = loggedUser != null;
            return $rootScope.isLogged;
        }
        return {
            login : login,
            isLoggedIn: isLoggedIn,
            logout: logout
        }
  });

  app.controller('loginController', function($scope, AuthService, $location){

    $scope.invalidCreds = false;
    $scope.login = {
        username : null,
        password : null
    };

    $scope.login = function(){
        AuthService.login($scope.login.username, $scope.login.password).then(function(user){
            console.log(user);
            if (AuthService.isLoggedIn()) {
                $location.path("/");
            } else {
                $scope.invalidCreds = true;
            }
        }, function(error){
            console.log(error);
            $scope.invalidCreds = true;
        });
    };
  });


  app.controller('notesController', function($scope, $http){
    $scope.noteList = [];

    $scope.getNotes = function() {
        $scope.isEditCreateView = false;

        return $http.get("/api/notes/").then(onSuccess, onError);

      ////
      function onSuccess(data) {
          $scope.noteList = data.data;
      }

      function onError(err) {
          debugger;
      }
    }

    $scope.getNotes();

    $scope.isEditCreateView = false;

    $scope.newNoteView = function(){
        $scope.note = {
            id: null,
            name : null,
            note : null,
            timeDate: null
        };
        $scope.isEditCreateView = true;
    };

    $scope.createOrEditNote = function() {
        let nObj = {name: $scope.note.name, note: $scope.note.note, id: $scope.note.id, timeDate: $scope.note.timeDate};
        if ($scope.note.id) {
            $http.put("/api/notes/" + $scope.note.id, nObj).then(onSuccess)
        } else {
            $http.post("/api/notes/", nObj).then(onSuccess)
        }
        /////
        function onSuccess(note) {
            $scope.getNotes();
        }
    }

    $scope.deleteNote = function (id) {
      var r = confirm("Are you sure you want to delete this note?");
      if (r === true){
          if (id) {
              return $http.delete("/api/notes/" + id).then(onSuccess);
          }
      }

      ////
        function onSuccess() {
            $scope.getNotes();
        }
    };

    $scope.viewNote = function(id){
        $scope.isEditCreateView = true;
        return $http.get("/api/notes/" + id).then(onSuccess);

        ////
        function onSuccess(data) {
            $scope.note = data.data;
        }
    }
    $scope.cancelCreateOrEditNote = function() {
        $scope.isEditCreateView = false;
    }
  });

})();