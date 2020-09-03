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

// if(data[i].title == 'film')-> var title= data[i].title else->var title= data[i].name

//var lista=['https://api.themoviedb.org/3/search/movie','https://api.themoviedb.org/3/search/tv']

// COMPLETO CON LE RIPETIZIONI!!!!!!!!!!!1

$(document).ready(function(){

    $('button').click(function(){
        let nome= $('#prelevaNome').val();
        if(nome !=''){
            
            chiamataAjax(nome);
            //chiamataAjax1(nome);
            reset();
        }
        else if(nome == ''){
            $('div.container').html('<h1>Inserisci un valore</h1>'); 
        }
    
    })

    /* $("#prelevaNome").keydown(function(event){
        let nome='';
        if(event.which == 13 || event.keyCode == 13){
            nome= $('#prelevaNome').val();
            if(nome !== ""){
                chiamataAjax(nome);
                $('#prelevaNome').val('');
                $('div.container').text('')
            }else if(nome == ''){
                $('.container').html('<h1>Inserisci un valore</h1>'); 
            }
        }
    }) */

    var listaUrl=['https://api.themoviedb.org/3/search/tv','https://api.themoviedb.org/3/search/movie']
    for (let i=0; i<listaUrl.length; i++) {
        var urlPassante = listaUrl[i];
        console.log(urlPassante)
    }
    $("#prelevaNome").keyup(function(){
            //let nome='';
            let nome= $('#prelevaNome').val();
            if(nome !== ""){
                reset();
                if(urlPassante == "https://api.themoviedb.org/3/search/tv"){
                    chiamataAjax(nome,urlPassante);
                }
                
                //chiamataAjax1(nome);
                //chiamataAjax1(nome);
            }
    })

});


function reset(){
    $('.container').empty(); 
    //$('#prelevaNome').val('');  
}


function chiamataAjax(nome,urlPassante){

    $.ajax({
        type: "GET",
        url: urlPassante,
        data: {
            api_key: '2c42a4436c6db0bbb4e23ee64ca1bc93',
            poster_path: 'poster_path',
            query: nome,
            language: 'it-IT',
        },
        success: function (response) {
            //console.log(response);
            if(response.total_results > 0){
                //console.log(urlPassante)
                if(urlPassante == 'https://api.themoviedb.org/3/search/movie'){
                    chiamataApiFilm(response);
                    
                }else{
                    chiamataApiSerieTv(response);
                }
                
                //chiamataApi1(response);
                //console.log(response);
            }else{
                //alert('non ci sono risultati');
                console.log('non ci sono risultati')
            }
            
        },
        error: function(errore){
            alert('errore ' + errore);
        } 
    });
} 

/* function chiamataAjax1(nome){
    $.ajax({
        type: "GET",
        url: "https://api.themoviedb.org/3/search/tv",
        data: {
            
            api_key: '2c42a4436c6db0bbb4e23ee64ca1bc93',
            poster_path: 'poster_path',
            query: nome,
            language: 'it-IT',
        },
        success: function (response) {
            //console.log(response);
            if(response.total_results > 0){
                chiamataApi1(response);
                console.log(response);
            }else{
                alert('non ci sono risultati');
            }
            
        },
        error: function(errore){
            alert('errore ' + errore);
        } 
    });
} */

function chiamataApiFilm(response){ // chiamata film
        let source = $("#template").html();
        let template = Handlebars.compile(source);

        for(let i=0; i<response.results.length; i++){

            var contextFilm = {
                type: 'film',
                title: response.results[i].title, 
                original_language: flag(response,i), //response.results[i].original_language, 
                original_title: response.results[i].original_title,
                vote_average: response.results[i].vote_average//'<i class="fa fa-star-o" aria-hidden="true"></i>' //star(response.results[i].vote_average)   //response.results[i].vote_average
            };

            let html = template(contextFilm);
            $('.container').append(html);
        };   
}

function chiamataApiSerieTv(response){ // chiamata serie tv
    let source = $("#template").html();
    let template = Handlebars.compile(source);

    for(let i=0; i<response.results.length; i++){

        var contextSerieTv = {
            type: 'serie Tv',
            title: response.results[i].name, 
            original_language: flag(response,i), //response.results[i].original_language, 
            original_title: response.results[i].original_name,
            vote_average: response.results[i].vote_average //star(response.results[i].vote_average)//'<i class="fa fa-star-o" aria-hidden="true"></i>' //star(response.results[i].vote_average)   //response.results[i].vote_average
        };

        let html = template(contextSerieTv);
        $('.container').append(html); 
    };

     
}



function flag(response,i){
    imageEn= '<img src="img/en.svg"></img>';
    imageIt= '<img src="img/it.svg"></img>';
    if(response.results[i].original_language == 'en'){
        return response.results[i].original_language + ' ' + imageEn;
    }else if(response.results[i].original_language == 'it'){
        return response.results[i].original_language + ' ' + imageIt;
    }
    else{
        return response.results[i].original_language;
    }
}
