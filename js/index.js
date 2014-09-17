$(function() {
    var textbox = $('.index--create-room');
	var url = "/mikumap.html#" + escapeHTML(textbox.val());
    textbox.on("keydown", function(e){
        if (e.which === 13) location.href = url;
    });
});

function escapeHTML(val) {
    return $('<div />').text(val).html();
};
