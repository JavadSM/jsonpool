let data = {};

// create editor
var editor = ace.edit("editor"); editor.session.setMode("ace/mode/json"); editor.setTheme("ace/theme/monokai"); editor.getSession().on("change", function() {
    load(); // on change call load() which will check the json
});


function load(json = false) {
    if (typeof json == "object") {
        // load json into text box
        editor.setValue(JSON.stringify(json, null, 4));
    } else {
        try {
            data = JSON.parse(editor.getValue());
        } catch (_) {
            // disable button
            $("#push").prop("disabled", true);
            // return false
            return false;
        }
    }
    // reenable button
    $("#push").prop("disabled", false);
    // and return true
    return true
}

function postit() {
    // get id and auth key
    var input1 = $("#input1").val();
    var input2 = $("#input2").val();

    if ($("#push").text() === "create") {
        $('input:checkbox').attr('disabled', !0);
        $("push").text("update");
    }

    function callback(data) {
        if (data.hasOwnProperty("id") && data.hasOwnProperty("auth")) {
            $("#del").show();
            $("#input1").val(data.id);
            $("#input2").val(data.auth);
        }
        $("#response").html(hljs.highlightAuto(JSON.stringify(data)).value);
    }
    if (input1 && input2) {
        update_pool(input1, input2, data, callback)
    } else {
        create_pool(data, callback, $("#private").is(":checked"));
        reload()
    }
}

function rmpost() {
    var input1 = $("#input1").val();
    var input2 = $("#input2").val();

    function callback(data) {
        load({});
        $("#response").html(hljs.highlightAuto(JSON.stringify(data)).value);
        $("#input1").val("");
        $("#input2").val("");
        $("#del").hide();
        if ($("#push").text() === "update") {
            $('input:checkbox').removeAttr('checked');
            $('input:checkbox').attr('disabled', !1);
            $("#push").text("create");
        }
    }
    if (input1, input2) {
        delete_pool(input1, input2, callback);
    }
}

function raw() {
    var input1 = $("#input1").val();
    var input2 = $("#input2").val();
    var str = input2 ? "/?auth=" + input2 : "";
    if (input1) window.open("/pool/" + input1 + str);
}

function reload() {
    var input1 = $("#input1").val();
    var input2 = $("#input2").val();
    if (input2) {
        $('#del').show();
    }

    function callback(data) {
        if (typeof data === "object") {
            load(data);
        }
    }
    get_pool(input1, callback, input2);
}