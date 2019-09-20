/*-----------------------------------------------------------------------------------

  Author: ENREDA
  Author URI: https://enreda.coop
  Version: 0.4

-----------------------------------------------------------------------------------*/

$(document).ready(function(){

  if( $("#blog-content").length > 0){
    getBlogContent();
  };
});

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
          includeLevelRoot(elmnt, "level-root");

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
  }
}

var level_root = "";
/* Función para añadir el nivel de carpeta */
function includeLevelRoot(elmnt, location){
  if( $(elmnt).find("."+location).length > 0 && $( elmnt).attr("level-root")!=null ){
    level_root = $(elmnt).attr("level-root");

    $(elmnt).find("."+location).each( function(key, element){

      if( $(this).attr("href")!=null){
        var new_href = level_root + $(this).attr("href");
        $(this).attr("href", new_href);

      }
      else if( $(this).attr("src") ){
        var new_src = level_root + $(this).attr("src");
        $(this).attr("src", new_src);
      }
      else if( $(this).attr("style")!=null && $(this).attr("style").includes("url(") ){
        var splits = $(this).attr("style").split("url(");
        splits[1] = level_root + splits[1];
        new_style = splits[0] + "url(" + splits[1];
        $(this).attr("style", new_style);
      }

    });
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


/* Función para obtener las entradas del blog y añadirlas a la web */
function getBlogContent(){
  var $content = $('#blog-content');
  var data = {
    rss_url: 'http://medium.com/feed/@openods.redes'
  };
  $.get('https://api.rss2json.com/v1/api.json', data, function (response) {
    if (response.status == 'ok') {
      var output = '';
      $.each(response.items, function (k, item) {
        var tagIndex = item.description.indexOf('<img'); // Find where the img tag starts
        var srcIndex = item.description.substring(tagIndex).indexOf('src=') + tagIndex; // Find where the src attribute starts
        var srcStart = srcIndex + 5; // Find where the actual image URL starts; 5 for the length of 'src="'
        var srcEnd = item.description.substring(srcStart).indexOf('"') + srcStart; // Find where the URL ends
        var src = item.description.substring(srcStart, srcEnd); // Extract just the URL
        var date = new Date( item.pubDate);
        var strDate = date.toLocaleDateString();

        var descriptionStart = item.description.indexOf('<p>');
        var descriptionEnd = item.description.substring(tagIndex).indexOf('</p>');
        var description = item.description.substring(descriptionStart, descriptionEnd).substring(3);

        output = `<!- - Single Item - ->
                  <div class="col-md-4 single-item" item-blog="` + k + `">
                      <div class="item">
                          <div class="thumb">
                              <a ><img src="`+ src + `" alt="Thumb"></a>
                          </div>
                          <div class="info">
                              <div class="content">
                                  <div class="date">
                                      ` + strDate + `
                                  </div>
                                  <h4>
                                      <a id="item-` + k + `-title">` + item.title + `</a>
                                  </h4>
                                  <p>
                                      ` + description.substring(0, 250) + "..." + `
                                  </p>
                                  <a id="item-` + k + `-title">Leer más <i class="fas fa-angle-right"></i></a>
                              </div>
                              <!--div class="meta">
                                  <ul>
                                      <li>
                                          <a href="#">
                                              <img src="assets/img/100x100.png" alt="Author">
                                              <span>Author</span>
                                          </a>
                                      </li>
                                      <li>
                                          <a href="#">
                                              <i class="fas fa-comments"></i>
                                              <span>05</span>
                                          </a>
                                      </li>
                                      <li>
                                          <a href="#">
                                              <i class="fas fa-share-alt"></i>
                                              <span>37</span>
                                          </a>
                                      </li>
                                  </ul>
                              </div-->
                          </div>
                      </div>
                      <div id="item-` + k + `-description" class="hidden">` + item.description + `</div>
                  </div>
                  <!- - Single Item - ->`;

        return k < 10;
      });
      $content.html(output);
    }
  }).then( function(){
    showModalContent();
  });
}

/* Función para mostrar modal con el contenido de la entrada del blog */
function showModalContent(){
  $('#blog-content > div').click( function(){
    var number = $(this).attr("item-blog");
    var content = $("#item-" + number + "-description")[0].innerHTML;
    var title = $("#item-" + number + "-title")[0].innerHTML;

    $("#modal-content").html(content);
    $("#modal-title").html(title);

    setLinksSocialNetworks( title );

    $('#blog-modal').modal('show');
  }); 
}

/* Función para cambiar los enlaces de los iconos de compartir en redes sociales */
function setLinksSocialNetworks( title ) {
  var url_blog = "https://openods.es/ultimas_noticias/";

  var url_facebook = "https://facebook.com/sharer/sharer.php?u=" + url_blog;
  var url_twitter = "https://twitter.com/intent/tweet/?text=" + title + "&amp;url=" + url_blog;
  var url_linkedin = "https://www.linkedin.com/sharing/share-offsite/?url=" + url_blog;
  var url_whatsapp = "whatsapp://send?text=" + title + "%20" + url_blog;
  var url_telegram = "https://telegram.me/share/url?text=" + title + "&url=" + url_blog;

  $("#bs-facebook").attr("href", url_facebook );
  $("#bs-twitter").attr("href", url_twitter );
  $("#bs-linkedin").attr("href", url_linkedin );
  $("#bs-whatsapp").attr("href", url_whatsapp );
  $("#bs-telegram").attr("href", url_telegram );
}