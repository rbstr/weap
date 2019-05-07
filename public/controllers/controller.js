var myApp = angular.module('myApp', ['ngMaterial']);

myApp.controller('AppCtrl', ['$scope', '$http', function ($scope, $http, $mdDialog) {

  console.log("controller");


  var refresh = function () {
    $http.get('/todoList').success(function (response) {
      console.log("I got the data I requested");
      $scope.todoList = response;
      $scope.total = response.length;
      $scope.remaining = response.filter(function(todo) {
        return todo.done == false;
    }).length;
      $scope.todo = "";
    });
  };

  refresh();

  //Functions from html page. Remove, edit, update, deselect.  CRUD

  $scope.addTodo = function () {
    console.log($scope.todo);
    if($scope.todo.description != null && $scope.todo.date != null){
      $scope.todo.done = false;
      $http.post('/todoList', $scope.todo).success(function (response) {
        console.log(response);
        refresh();
      });
    }
  };

  $scope.remove = function (id) {
    console.log("Remove: ", id);
    $http.delete('/todoList/' + id).success(function (response) {
      refresh();
    });
  };

  $scope.edit = function (id) {
    console.log(id);
    $http.get('/todoList/' + id).success(function (response) {
      console.log("In Edit");
      $scope.todo = response;
    });
  };

  $scope.update = function () {
    console.log("Update: ", $scope.todo._id);
    console.log($scope.todo._id);
    $http.put('/todoList/' + $scope.todo._id, $scope.todo).success(function (response) {
      refresh();
    })
  };

  $scope.deselect = function () {
    $scope.todo = "";
  }

  $scope.markDone = function (id) {
    console.log("Mark Done: ", id);
    $http.get('/todoList/' + id).success(function (response) {
      console.log("In Edit");
      $scope.todo = response;
      $scope.todo.done = true;
      $http.put('/todoList/' + $scope.todo._id, $scope.todo).success(function (response2) {
      	refresh();
    	})
    });
  };

  $scope.markNotDone = function (id) {
    console.log("Mark Not Done: ", id);
    $http.get('/todoList/' + id).success(function (response) {
      console.log("In Edit");
      $scope.todo = response;
      $scope.todo.done = false;
      $http.put('/todoList/' + $scope.todo._id, $scope.todo).success(function (response2) {
      	refresh();
    	})
    });
  };

  $scope.resetTodo = function () {
    console.log("Reset");
    $http.delete('/todoList/reset/all').success(function (response) {
      refresh();
    });
  };


}]);
