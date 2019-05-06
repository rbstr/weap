$(function($) {

  $('#add-todo').click(function() {
    var todoText = $('#todo-text').val();
    $.post('/addtodo', todoText, function(todo) {
      appendTodo(todo);
      $('#todo-text').val('');
      addCheckClickAction();
      addDeleteAction();
    });
  });

  $.get('/gettodos', function(result) {
    addTodosToPage(result);
  });

  function addTodosToPage(result) {
    for(var i = 0; i < result.length; i++) {
      var todo = result[i];
      appendTodo(todo);
    }
    addCheckClickAction();
    addDeleteAction();
  }

  function appendTodo(todo) {
    $('#todo-list ul').append('<li id="' + todo.id + '"> <i class="check-button checked fa fa-check-circle-o ' + (todo.checked ? '' : 'hidden') + '"></i> <i class="check-button fa fa-circle-o ' + (todo.checked ? 'hidden' : '') + '"></i><i class="delete-button fa fa-trash-o"></i><span>' + todo.title + '</span></li>');
  }

  function addCheckClickAction() {
    $('.check-button').unbind('click');
    $('.check-button').click(function() {
      var id = $(this).parent().attr('id');
      var checked = !$(this).hasClass('checked');
      var button = $(this);
      $.ajax({
        url: '/modifytodo',
        type: 'PUT',
        data: JSON.stringify({id: id, checked: checked}),
        success: function() {
          button.toggleClass('hidden');
          button.siblings('.check-button').toggleClass('hidden');
        }
      });
    });
  }

  function addDeleteAction() {
    $('.delete-button').unbind('click');
    $('.delete-button').click(function() {
      var id = $(this).parent().attr('id');
      $.ajax({
        url: '/deletetodo',
        type: 'DELETE',
        data: id,
        success: function() {
          $('#' + id).remove();
        }
      });
    });
  }

});
