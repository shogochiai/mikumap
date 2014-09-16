(function(){
    var milkcocoa = new MilkCocoa("https://[your-app-id].mlkcca.com");
    var ds_rooms = milkcocoa.dataStore('rooms');
    var ds_chats = milkcocoa.dataStore('chats');
    var room_map = {};

    $(document).ready(function() {
        $('#rooms').dataTable();

        ds_rooms.query({}).done(function(rooms){
            $("body").prepend("rooms:" + rooms.length);
            rooms.forEach(function(room){
                ds_chats.child(room.id).query({}).sort('desc').limit(100).done(function(comments){
                    var new_comment = (comments[0]) ? comments[0].label : 'none';
                    var element_id = gen_id();
                    room_map[room.id] = element_id;
                    add_room(element_id, room.id, comments.length, new_comment);
                });
            });
        });
    });

    ds_rooms.on("set", function(room){
        ds_chats.child(room.id).query({}).sort('desc').limit(100).done(function(comments){
            var new_comment = (comments[0]) ? comments[0].label : "-";
            if(room_map.hasOwnProperty(room.id)) {
                update_room(room_map[room.id], room.id, comments.length, new_comment)
            }else{
                var element_id = gen_id();
                room_map[room.id] = element_id;
                add_room(element_id, room.id, comments.length, new_comment);
            }
        });
    });

    function add_room(id, room_id, ncomment, latest_comment) {
        $("#records").append("<tr id='"+id+"'><th><a class='rooms--roomlist' href='mikumap.html#" + decodeURI(room_id) + "'>" + decodeURI(room_id) + "</a></th><th>" + ncomment + "</th><th>" + latest_comment + "</th></tr>");
    }

    function update_room(id, room_id, ncomment, latest_comment) {
        $("#" + id).html("<th><a class='rooms--roomlist' href='mikumap.html#" + decodeURI(room_id) + "'>" + decodeURI(room_id) + "</a></th><th>" + ncomment + "</th><th>" + latest_comment + "</th>");
    }

    function gen_id() {
        return "id" + String(Math.random()).substr(2);
    }

}());
