package cz.burios.wt.widget;

/**
 * Form

Override defaults with $.fn.form.defaults.

The form provides various methods to perform actions with form fields such as ajax submit, load, clear, etc. When submiting the form, the 'validate' method can be called to check whether or not a form is valid.

Usage
Create a simple HTML form. Construct this as you normally would with and id, action and method values.

<form id="ff" method="post">
    <div>
        <label for="name">Name:</label>
        <input class="nestui-validatebox" type="text" name="name" data-options="required:true" />
    </div>
    <div>
        <label for="email">Email:</label>
        <input class="nestui-validatebox" type="text" name="email" data-options="validType:'email'" />
    </div>
    ...
</form>
To make the form become ajax submit form

$('#ff').form({
    url:...,
    onSubmit: function(){
        // do some check
        // return false to prevent submit;
    },
    success:function(data){
        alert(data)
    }
});
// submit the form
$('#ff').submit();
To do a submit action

// call 'submit' method of form plugin to submit the form
$('#ff').form('submit', {
    url:...,
    onSubmit: function(){
        // do some check
        // return false to prevent submit;
    },
    success:function(data){
        alert(data)
    }
});
Submit with extra parameters

$('#ff').form('submit', {
    url:...,
    onSubmit: function(param){
        param.p1 = 'value1';
        param.p2 = 'value2';
    }
});
Handle submit response

Submitting an ajax form is very simple. Users can get the response data when the submission is finished. Notice that the response data is the raw data from server. A parse action to the response data is required to get the correct data.

For example, response data is assumed to be JSON, a typical response data may look like this:

{
    "success": true,
    "message": "Message sent successfully."
}
Now handle the JSON string in 'success' callback function.

$('#ff').form('submit', {
    success: function(data){
        var data = eval('(' + data + ')');  // change the JSON string to javascript object
        if (data.success){
            alert(data.message)
        }
    }
});
 * 
 * @author Buriosca.cz
 *
 */
public class Form {

}
