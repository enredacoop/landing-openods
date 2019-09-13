/* Función para poder incluir fragmentos en páginas */
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}

          includeVar(elmnt, "include-var", "title-banner");

          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
}
/* Función para añadir variables a elementos incluidos */
function includeVar(elmnt, data, location){
  if( $(elmnt).find("#"+location).length > 0 && $(elmnt).attr(data)!=null){
    $(elmnt).find("#"+location)[0].innerText = $(elmnt).attr(data);
    //debugger;
  }
}


/*  Función para enviar email mediante Javascript,
    haciendo uso de la librería EmailJS */
function sendEmail() {
  nombre = $("#form-name").val();
  email = $("#form-email").val();
  telefono = $("#form-phone").val();
  mensaje = $("#form-message").val();
  body = nombre + " ha rellenado el formulario de contacto de la web, los datos son los siguientes.<br><br><p><strong>Nombre:</strong> " + nombre + "</p><p><strong>Email:</strong> " + email + "</p><p><strong>Teléfono:</strong> " + telefono + "</p><br><p><strong>Motivo de la consulta:</strong><br> " + mensaje + "</p>";

  var template_params = {
     "reply_to": email,
     "message_html": body
  }

  var service_id = "default_service";
  var template_id = "template_DEZkozg6";

  emailjs.send(service_id, template_id, template_params, "user_aOLHkOHvrvk6eljIoHFwg")
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      $("#alert-ok").removeClass("hidden");
      $("#alert-ok").addClass("show");
      document.getElementById("form-openods").reset();
      // Redireccionamos a la página de Gracias
      //window.location = "";
    }, function(error) {
       console.log('FAILED...', error);
      $("#alert-ko").removeClass("hidden");
      $("#alert-ko").addClass("show");
    });
}