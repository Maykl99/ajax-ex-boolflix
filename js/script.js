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

   

    $('#actionOn').click(function(){ // al click preleva i valori dall'input
        var nome= $('#prelevaNome').val();
        if(nome !=''){ // se è diverso dal vuoto
            var url1= 'https://api.themoviedb.org/3/search/movie';
            var url2 = "https://api.themoviedb.org/3/search/tv";
            // svuota il tutto
            $('.containerFilms').html('');
            $('.containerSerieTv').html('');
            // esegui le due chiamate ajax con i due url differenti per prendere sia e film che le serie tv
            chiamataAjax(nome,url1,'film');
            chiamataAjax(nome,url2,'tv');
            
        }
        else if(nome == ''){
            $('div.container').html('<h1>Inserisci un valore</h1>'); 
        }
    
    })
});




// chiamata ajax, con tre parametri in ingresso nome passato attraverso l'input, url da passare, e il tipo (in base al tipo avro una risposta differente)
function chiamataAjax(nome,url,type){
    $.ajax({
        method: "GET",
        url: url,
        data: {
            // valori obbligatori come l'api_key ed opzionali come la lingua
            api_key: '2c42a4436c6db0bbb4e23ee64ca1bc93',
            poster_path: 'poster_path',
            query: nome,
            language: 'it-IT',
        },
        success: function (response) {
            
            // se il risulato è maggiore di zero parte la chiamataApi con due parametri in ingresso
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


function chiamataApi(response,type){

    // copia baffi
    let source = $("#template").html();
    let template = Handlebars.compile(source);

    // ciclo su response e in base alla condizione passa con type riceverò info diverse
    for(let i=0; i<response.results.length; i++){

        var title;
        var original_title;
        var tipo;

        

        

        if(type == 'film'){

            title = response.results[i].title;
            original_title= response.results[i].original_title;
            tipoFilm= 'movie';
            tipo='movie';
            

        }else if( type == 'tv'){
            title = response.results[i].name;
            original_title= response.results[i].original_name;
            tipoFilm = '';
            tipo='tv';
            
        } 

        esitoId = response.results[i].id;
        

        var context = { // creo l'oggetto che andrò a passare al metodo template
            id: esitoId,
            overview: response.results[i].overview.substring(0,200) + '[...]',
            poster_path: aggImg(response.results[i].poster_path),
            type : type,
            title: title, 
            original_language: flag(response,i), 
            original_title: original_title,
            vote_average: stars(response.results[i].vote_average),
            //nomiAttori: castList.name
        };

        // in base al type andrò a stampare in posizioni differenti
        let html = template(context);
        if(type == 'film'){
            $('.containerFilms').append(html);
        }else if(type == 'tv'){
            $('.containerSerieTv').append(html);
        }

        trovaAttore(tipo,esitoId)
    }
}



function trovaAttore(type,id){ // url // funzione contenente una chiamata aja, l'url varia
    var url= 'https://api.themoviedb.org/3/' + type + '/' + id; 
    $.ajax({
        type:'GET',
        url: url,
        data:{
            api_key: '2c42a4436c6db0bbb4e23ee64ca1bc93',
            language: 'it-IT',
            append_to_response: 'credits' // appendo nell'url la parola credits
        },
        success: function(response){
           // console.log(response.genres, response.credits.cast);
            var genere= response.genres;
            var attori= response.credits.cast;

            stampaDettagli(id,genere,attori,type)
        }
        
    })
}

function stampaDettagli(id,genres,attori){

    var castList='';
    /* if(attori.length >= 5){
        castList=attori.splice(0,6);
    } */

    for(var i=0; i<attori.length; i++){
        castList += attori[i].name;
        if(i !== attori.length - 1){
            castList += ', ';
        }
    }

    var genereList='';
    for(var i=0; i< genres.length; i++){
        //let genere = genres[i].name;
        genereList += genres[i].name;

        if(i !== genres.length-1){
            genereList += ', ';
        }
    }

    let source = $("#template-detailes").html();
    let template = Handlebars.compile(source);

    console.log(genereList)
    //console.log(castList)

    let context={
        actors: castList,
        genres: genereList
    }

    let html= template(context);

    $('.card[data-id="'+ id +'"]').find('.dettagli').append(html);

    /* if(attori.length>=5){
        var castList= attori.splice(0,6)
        console.log(castList);

        let source = $("#template").html();
        let template = Handlebars.compile(source);
        var context = { // creo l'oggetto che andrò a passare al metodo template
        nomiAttori: castList.name
        };
        let html = template(context);
        //console.log(html)
        //$('.cast').append(html);
        
    } */
}

// aggiunge immagine prelevandola dalla chiamata della API, dove non è presente aggiunge l'immagine sostitutiva
function aggImg(elemento){
    let urlImg= 'https://image.tmdb.org/t/p/w154';
    if(elemento == null){
        return "https://cdn0.iconfinder.com/data/icons/interface-set-vol-2/50/No_data_No_info_Missing-512.png";
    }
    return urlImg + elemento;
}

// funzione per la stella
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

// funzione per le immagini delle bandiere
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

