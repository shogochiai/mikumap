(function(global){
    var milkcocoa = new MilkCocoa("https://[your-app-id].mlkcca.com");
    var ROOT;
    var DICTIONARY = {};
    var roomID = decodeURI(location.hash.substr(1));
    var chatstore = (roomID == null) ? 'chats' : 'chats/' + roomID;

    /* roomの変更の監視 */
    $(window).on('hashchange', function(){
        location.reload();
    });

    $(document).ready(function() {
        /* making rooms datastore */
        var ds_rooms = milkcocoa.dataStore('rooms');
        ds_rooms.set(roomID, { "updated_date" : new Date() });

        /* making chats datastore */
        var ds = milkcocoa.dataStore(chatstore);
        $('body').mindmap();
        if (roomID){
            addNewNode('asRoot','#'+roomID,'');
        } else {
            addNewNode('asRoot','Ｙ(๑°口°๑)','');
        }
        getDataAndBuildFrom(ds);
    });

    $(document).on("keydown", function(e){
        if(e.which === 13) $('div.active').trigger('click');
    });

    milkcocoa.dataStore(chatstore).on("push", function(e){
        $('#modal-dialog').modal('hide');
        var parent_node = DICTIONARY[e.value.parent_path];
        addNewNode( parent_node, escapeHTML(e.value.label), escapeHTML(e.value.name) )
    });

    function getDataAndBuildFrom(ds){
        ds.query({}).done(function(data){
            data.sort(function(a,b){
                var max = a.node_path.length;
                var min = b.node_path.length;
                if(min < max)return 1;
                else if (min == max)return 0;
                else return -1
            });
            data.forEach(function(elem, index, array){
                addNewNode(DICTIONARY[elem.parent_path], elem.label, elem.name);
            });

            /* レンダリング終了後childrenにする */
            ROOT.children.forEach(function(node){
              node.el.addClass('children');
            });
        });
    }

    function addNewNode(parentNode, label, name){
        var label = escapeHTML(label);
        var name = escapeHTML(name);

        var returnNode;
        var onclick = function(node) {
            if(node === CURRENT_NODE){
                /* show modal */
                $('#modal-dialog').modal('show');
                var wLimit = 40;
                $("div.modal-footer").prepend('<p class="init-count">' + wLimit + '</p>');

                /* focus textarea */
                $('#modal-dialog').on('shown.bs.modal', function () {
                    $("#label").focus();
                });

                /* バリデーションメッセージを隠す */
                $('#modal-dialog').on('shown.bs.modal', function () {
                    $("p.count").hide();
                    $("p.init-count").hide();
                    $("p.modal-alert").hide();
                });

                /* when keydown length limit */
                $("#label").off("keydown").on("keydown", function(e){
                    if ( $("p.init-count") ) $("p.init-count").hide()
                    if ( $("p.count") ) $("p.count").hide()

                    var wLength = escapeHTML($("#label").val()).length;;
                    var wRemain = wLimit - wLength;
                    if ( wRemain > 0 ){
                        $("div.modal-footer").prepend('<p class="count">' + wRemain + '</p>');
                    } else if ( wRemain === 0 ){
                        $("div.modal-footer").prepend('<p class="count count-zero">' + wRemain + '</p>');
                    }

                    /* submit */
                    if((e.shiftKey||e.metaKey||e.ctrlKey)&&e.which===13) $("#submit").trigger('click');
                    e.stopPropagation(); //親への伝播防止
                });

                /* click submit */
                $("#submit").off("click").on("click", function(){
                    submit(node);
                });
            }else{
                $(node.obj.activeNode.content).each(function() {
                    this.hide();
                });
            }
        };
        var onContextMenu = function(node){};
        //root Node
        if(parentNode == null || parentNode == 'root' || parentNode == 'ROOT' || parentNode == 'asRoot'){
            if(!ROOT){
                ROOT = $('body').addRootNode('noname', {
                    name:name,
                    label:label,
                    path:'root',
                    onclick:onclick,
                    onContextMenu:onContextMenu
                });
            }
            returnNode = ROOT
        }
        //normal node
        else{
            var node = $('body').addNode(parentNode, 'noname', {
                label:label,
                name:name,
                path:parentNode.opts.path + '/' + label,
                onclick:onclick,
                onContextMenu:onContextMenu
            });
            returnNode = node
        }
        DICTIONARY[returnNode.opts.path] = returnNode;
        return returnNode;
    }

    function submit(node){
        var label = escapeHTML( $("textarea#label").val() );
        var name = escapeHTML( $("textarea#name").val() );
        var parent_path = node.opts.path;
        var node_path = parent_path + "/" + label;
        var ds = milkcocoa.dataStore(chatstore);
        if(!name){ name = "" }
        if(label && !DICTIONARY[node_path]){
            ds.push({
                "label" : label,
                "name" : name,
                "node_path" : node_path,
                "parent_path" : parent_path
            });
            var ds_rooms = milkcocoa.dataStore('rooms');
            ds_rooms.set(roomID, { "updated_date" : new Date() });
        } else {
            $("div.modal-footer").append("<p class='modal-alert pull-left'>コメントは空白と重複がないようにしてください</p>");
        }
        return false;
    };

    function getParentPath(node){
        if (node.parent) {
            return node.parent.opts.path;
        } else {
            //case root
            return '';
        }
    }

    function clearDataStore(ds){
        ds.query({}).done(function(data){
            data.forEach(function(elem){
                console.log('delete data id = ' + elem.id);
                ds.remove(elem.id);
            });
        });
    }

    function escapeHTML(val) {
        return $('<div />').text(val).html();
    };
}(window));

