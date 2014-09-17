$(function() {
    var textbox = $('.index--create-room');
    textbox.on("keydown", function(e){
        if (e.which === 13) {
            location.href = "/mikumap.html#" + escapeHTML(textbox.val());
        }
    });
});

function escapeHTML(val) {
    return $('<div />').text(val).html();
};
