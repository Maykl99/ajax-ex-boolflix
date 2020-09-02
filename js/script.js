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

    var nome='';
   
    $('button').click(function(){
        nome= $('#prelevaNome').val();
        console.log(nome)
        if(nome !=''){
            $.ajax({
                type: "GET",
                url: "https://api.themoviedb.org/3/search/movie",
                data: {
                    api_key: '2c42a4436c6db0bbb4e23ee64ca1bc93',
                    query: nome,
                    language: 'it-IT',
                },
                success: function (response) {
                    for(var i=0; i<response.results.length; i++){
                        console.log(response.results[i].title)
                        var n= response.results[i].title;
                        var l=response.results[i].original_language;
                        var original_title =response.results[i].original_title;
                        var vote_average= response.results[i].vote_average;
                        var source = $("#entry-template").html();
                        var template = Handlebars.compile(source);
                        var context = { title: n, original_language: l, original_title: original_title,vote_average: vote_average};
                        var html = template(context);
                        $('.container').append(html);
                    }
                },
                error: function(){
                    alert('errore')
                } 
            });
        } 
    })

  

});