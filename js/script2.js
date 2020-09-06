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

    $('#actionOn').click(function(){
        var nome= $('#prelevaNome').val();
        if(nome !=''){
            var url1= 'https://api.themoviedb.org/3/search/movie';
            var url2 = "https://api.themoviedb.org/3/search/tv";
            /* chiamataAjax(nome,"https://api.themoviedb.org/3/search/movie");
            chiamataAjax(nome,"https://api.themoviedb.org/3/search/tv"); */
            $('.containerFilms').html('');
            $('.containerSerieTv').html('');
            chiamataAjax(nome,url1,'film');
            chiamataAjax(nome,url2,'tv');
            
        }
        else if(nome == ''){
            $('div.container').html('<h1>Inserisci un valore</h1>'); 
        }
    
    })

});

function aggImg(elemento){
    let urlImg= 'https://image.tmdb.org/t/p/w154';
    if(elemento == null){
        return "https://lh3.googleusercontent.com/proxy/uF2JoagaNuanL4vFyyNbIvJCDULG0FyKpTBFErvbLvhRWOmxaaDyz74ye_YExZ4yCEPTQFgrNhBUNNl5Jc5tsfcM6qCESvxZRfm5AAO9GeDSax0NRyHsWQGmrj5PKKpYctgLCEtt";
    }

    return urlImg + elemento;
}



function chiamataAjax(nome,url,type){
    $.ajax({
        method: "GET",
        url: url,
        data: {
            
            api_key: '2c42a4436c6db0bbb4e23ee64ca1bc93',
            poster_path: 'poster_path',
            query: nome,
            language: 'it-IT',
        },
        success: function (response) {
            console.log(response)
            if(response.total_results > 0){
                chiamataApi(response,type);
            }else{
                //alert('non ci sono risultati');
            }
            
        },
        error: function(errore){
            alert('errore ' + errore);
        } 
    });
}

/* function chiamataAjax2(){
    $.ajax({
        method: "GET",
        url: 'https://api.themoviedb.org/3/person/24428/combined_credits?api_key=2c42a4436c6db0bbb4e23ee64ca1bc93&language=it-IT',
        data: {
            
            api_key: '2c42a4436c6db0bbb4e23ee64ca1bc93',
            poster_path: 'poster_path',
            query: nome,
            language: 'it-IT',
        },
        success: function (response) {
            console.log(response)
            if(response.total_results > 0){
                chiamataApi(response,type);
            }else{
                //alert('non ci sono risultati');
            }
            
        },
        error: function(errore){
            alert('errore ' + errore);
        } 
    });
} */

function chiamataApi(response,type){

    let source = $("#template").html(); // !
    let template = Handlebars.compile(source);

    for(let i=0; i<response.results.length; i++){

        var title;
        var original_title;
        esito = response.results[i].id;

        trovaAttore()

        if(type == 'film'){

            title = response.results[i].title;
            original_title= response.results[i].original_title;
            tipoFilm= 'movie';
            //attori = trovaAttore('https://api.themoviedb.org/3/movie/' + esito + '/credits?api_key=2c42a4436c6db0bbb4e23ee64ca1bc93');

        }else if( type == 'tv'){
            title = response.results[i].name;
            original_title= response.results[i].original_name;
            tipoFilm = '';
            //attori = trovaAttore('https://api.themoviedb.org/3/search/tv/' + esito + '/credits?api_key=2c42a4436c6db0bbb4e23ee64ca1bc93');
        } 
        //for(var i=0; i<response.results)   

        //esito = response.results[i].id;
        //console.log(attori)

        var context = {
            //poster_path: response.results[i].poster_path,
            //nomiAttori: attori,
            overview: response.results[i].overview,
            poster_path: aggImg(response.results[i].poster_path),
            type : type,
            title: title, 
            original_language: flag(response,i), //response.results[i].original_language, 
            original_title: original_title,
            vote_average: stars(response.results[i].vote_average)//'<i class="fa fa-star-o" aria-hidden="true"></i>' //star(response.results[i].vote_average)   //response.results[i].vote_average
        };

        let html = template(context);
        if(type == 'film'){
            $('.containerFilms').append(html);
        }else if(type == 'tv'){
            $('.containerSerieTv').append(html);
        }

        //console.log(nomiAttori)
    }
}

function trovaAttore(){ // url
    $.ajax({
        type:'GET',
        url: 'https://api.themoviedb.org/3/movie/' + esito + '/credits?api_key=2c42a4436c6db0bbb4e23ee64ca1bc93',
        language: 'it-IT',

        success: function(response){
            for(var i=0; i<response.cast.length; i++){
                nomiAttori= response.cast[i].character;
               
                //return nomiAttori;
                console.log(nomiAttori)
                $('.nomi').append(nomiAttori.substring(0));
                
            }
        }
        
    })
}

function stars(num){
    num = Math.ceil(num/2).toFixed(0);
    var star=''; // ! errori 
    for(var i=1; i<=5; i++){
        if(i < num){ // se i è minore o uguale a num ovvero il numero che capiterà dalla mia ricerca
            star += '<i class="fas fa-star"></i>'; // stella piena
        }else{
            star += '<i class="far fa-star"></i>'; // stella vuota
        }
        
    }
    return star;
}

function flag(response,i){ // avendo poche lingue
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

/* function flag(response){ // avendo molte lingua 
    var language = ['en','it'];
    if(language.includes(response)){
        return `<img src='img/' + ${response} + .svg>`;
    }
    return response;
} */   
