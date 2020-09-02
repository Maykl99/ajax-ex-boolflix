/* Guardate il file pdf che ho inviato su general per i dettagli
Milestone 1:
Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere 
completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API 
tutti i film che contengono ciò che ha scritto l’utente.
Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
Titolo
Titolo Originale
Lingua
Voto */

$(document).ready(function(){

    nome='';
   
    $('button').click(function(){
        nome= $('#prelevaNome').val();
        if(nome !=''){
            chiamataAjax();
        }
        else if(nome == ''){
            $('.container').html('<h1>Inserisci un valore</h1>'); 
        }
    
    })

    $("#prelevaNome").keydown(function(event){
        if(event.which == 13 || event.keyCode == 13){
            nome= $('#prelevaNome').val();
            if(nome !== ""){
                chiamataAjax();
                $('#prelevaNome').val('');
            }else if(nome == ''){
                $('.container').html('<h1>Inserisci un valore</h1>'); 
            }
        }
    })

  

});


function chiamataAjax(){
    $.ajax({
        type: "GET",
        url: "https://api.themoviedb.org/3/search/movie",
        data: {
            api_key: '2c42a4436c6db0bbb4e23ee64ca1bc93',
            query: nome,
            language: 'it-IT',
        },
        success: function (response) {
                chiamataApi(response);
        
        },
        error: function(){
            alert('errore')
        } 
    });
}

function chiamataApi(response){
    for(var i=0; i<response.results.length; i++){

        var source = $("#entry-template").html();
        var template = Handlebars.compile(source);

        var context = { 
            title: response.results[i].title, 
            original_language: response.results[i].original_language, 
            riginal_title: response.results[i].original_title,
            vote_average: response.results[i].vote_average
        };

        var html = template(context);
        $('.container').append(html);
        $('#prelevaNome').val('');
        $('button#cancella').click(function(){
            $('.container').text('');
            //.empty()
            
        });
    }
}