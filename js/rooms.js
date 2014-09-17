var milkcocoa = new MilkCocoa("https://<yourappid>.mlkcca.com");
var ds_rooms = milkcocoa.dataStore('rooms');
var ds_chats = milkcocoa.dataStore('chats');
var ds_members = milkcocoa.dataStore('members');

$(document).ready(function() {
    $('#rooms').dataTable();

    ds_rooms.query({}).done(function(rooms){
        $("body").prepend("rooms:" + rooms.length);
        rooms.forEach(function(room){
            ds_chats.child(room.id).query({}).sort('desc').limit(1).done(function(comments){
                var new_comment = (comments[0]) ? comments[0].label : 'none';
                ds_members.query({"roomID":room.id}).done(function(members){
                    $("#records").append("<tr><th><a class='rooms--roomlist' href='mikumap.html#" + decodeURI(room.id) + "'>" + decodeURI(room.id) + "</a></th><th>" + members.length + "</th><th>" + new_comment + "</th></tr>");
                });
            });
        });
    });
} );

ds_rooms.on("set", function(room){
    ds_members.query({"roomID":room.id}).done(function(members){
        $("#records").append("<tr><th>" + room.id + "</th><th>" + members.length + "</th></tr>");
    });
})
