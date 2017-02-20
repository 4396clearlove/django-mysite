$("#btn_add").click(function(){
    var form = $("#main_form");
    var div = $("<div></div>");
    var select = $("<select></select>");
    var option1 = $("<option>7</option>");
    var option2 = $("<option>8</option>");
    var option3 = $("<option>9</option>");
    select.append(option1);
    select.append(option2);
    select.append(option3);
    var input  = $("<input type='file'/>");
    div.append(input);
    div.append(select);
    form.append(div);
});

$("#main_form").submit(function(){
    var formData = new FormData($("#main_form")[0]);
    $.ajax({
        url:"/odf/update/",
        type:"POST",
        data:formData,
        beforeSend:function(xhr, settings){
            var csrftoken = Cookies.get('csrftoken');
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        async:false,
        cache:false,
        contentType:false,
        processData:false,
        success:function(returndate){
            alert(returndate);
        },
        error:function(returndate){
            alert(returndate);
        }
    });
    return false;
});