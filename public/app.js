

// When document first loads, hide chat and show login field
$(document).ready(function(){
    var socket = io();
    $("#chat").hide();
    $("#name").focus();
    $("form").submit(function(event){
        event.preventDefault();
    });

// When user clicks join-button show chat and hide login field
    $("#join").click(function(){
      var name = $("#name").val();
      // Username can't be empty
      if (name != "") {
        socket.emit("join", name);
        $("#login").detach();
        $("#chat").show();
        $("#msg").focus();
        ready = true;
      }
    });

// When user presses enter show chat and hide login field
    $("#name").keypress(function(e){
      if(e.which == 13) {
        var name = $("#name").val();
        // Username can't be empty
        if (name != "") {
          socket.emit("join", name);
          ready = true;
          $("#login").detach();
          $("#chat").show();
          $("#msg").focus();
        }
      }
    });

    socket.on("update", function(msg) {
      if(ready)
        $("#msgs").append($('<li>').text(msg));
    });

// Updates userlist
    socket.on("update-people", function(people){
      if(ready) {
        $("#people").empty();
        $.each(people, function(clientid, name) {
          $('#people').append(" " + name + " ");
        });
      }
    });

// Showing messages on chat
    socket.on("chat", function(who, msg){
      if(ready) {
        $("#msgs").append($('<li>').text(" " + who + " says: " + msg ));
      }
    });

// Server disconnects
    socket.on("disconnect", function(){
      $("#msgs").append("The server is not available");
      $("#msg").attr("disabled", "disabled");
      $("#send").attr("disabled", "disabled");
    });

// Sending message by clicking send button
    $("#send").click(function(){
      var msg = $("#msg").val();
      socket.emit("send", msg);
      $("#msg").val(" ");
    });
    
// Sending message by pressing enter
    $("#msg").keypress(function(e){
      if(e.which == 13) {
        var msg = $("#msg").val();
        socket.emit("send", msg);
        $("#msg").val(" ");
      }
    });
});
