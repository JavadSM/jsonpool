let data = {};

// create editor
var editor = ace.edit("editor"); editor.session.setMode("ace/mode/json"); editor.setTheme("ace/theme/monokai"); editor.getSession().on("change", function() {
    load(); // on change call load() which will check the json
});

// set events
$("#reload").on("click", reload);
$("#push").on("click", postit);
$("#del").on("click", rmpost);
$("#genlink").on("click", raw);
$("#editor").on("change", load);
$("#more").on("click", function(){
    window.location.replace('about.html')
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

// highlight json
function highlight(obj, id) {
    if (typeof obj !== "object") obj = JSON.parse(obj);
    var keys = Object.keys(obj);
    var all_html = "";
    keys.forEach((key) => {
      var html = "<span>\"" + key +"\":";
      var elm = obj[key];
      
      if (typeof elm === "string") {
        html += "\"<span style='color: red;'>" + elm + "<\/span><\/span>\"";
      } else {
        html += "<span style='color: blue;'>\"" + String(elm) + "<\/span><\/span>";
      }
      
      if (keys.indexOf(key) !== keys.length - 1) {
        html += ", ";
      }
      
      all_html += html;
    });
    // return html object
    return "<span>{" + all_html + "}<\/span>";
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
        $("#response").html(highlight(data));
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
        $("#response").html(highlight(data));
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
    var str = input2 && $("#private").is(":checked") ? "/?auth=" + input2 : "";
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