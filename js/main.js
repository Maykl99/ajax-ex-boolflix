$(function(){
    ready(); 
});

// esegue il codice 
function ready(){
    $(document).on('click', '#actionOn', () => {
        let nome = $('#prelevaNome').val();
        if(nome != 0){
            let url1= "https://api.themoviedb.org/3/search/movie";
            let url2= "https://api.themoviedb.org/3/search/tv";
            
            chiamataAjax(nome,url1,'film');
            chiamataAjax(nome,url2,'tv');
            reset(nome)
        }else{
            $('contenitore').html('<h2>Inserisci un valore!</h2>')
        }
    });

    $(document).on('click', '#scelta option', function(){
        let genere = $(this).html();
        console.log(genere);
        sceltaGenere(genere);
    });
}

// funzione esegue la chiamate AJAX al servizio API
function chiamataAjax(nome,url,type){ 
    $.ajax({
        method: "GET",
        url: url,
        data: {
                // valori obbligatori l'api_key ed opzionali la lingua
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
                alert('non ci sono risultati');
            }
                
        },
        error: function(errore){
            alert('errore ' + errore);
        } 
    });
}

// funzione ripulise il campo di input dopo la ricerca
function reset(nome){ 
    nome = $('#prelevaNome').val('');
    $('.containerFilms').html('');
    $('.containerSerieTv').html('');
}

// funzione stampa valori in html 
function chiamataApi(response,type){

    // copia baffi
    let source = $("#template").html();
    let template = Handlebars.compile(source);

    for(let i=0; i<response.results.length; i++){

        let title;
        let original_title;
        let tipo;

        // in base alla condizione cambierò i valori da stampare
        if(type == 'film'){ 
            title = response.results[i].title;
            original_title= response.results[i].original_title;
            tipo='movie';

        }else if( type == 'tv'){
            title = response.results[i].name;
            original_title= response.results[i].original_name;
            tipo='tv';
        }
        
        esitoId = response.results[i].id;
        
        // creo l'oggetto da clonare con template
        let context = { 
            id: esitoId,
            poster_path: aggImg(response.results[i].poster_path),
            title: title,
            original_language: flag(response,i),
            original_title: original_title,
            vote_average: stars(response.results[i].vote_average),
            type : type,
            overview: response.results[i].overview.substring(0,200) + '[...]',
        };

        // in base al type andrò a stampare in posizioni differenti
        let html = template(context);
        if(type == 'film'){
            $('.containerFilms').append(html);
        }else if(type == 'tv'){
            $('.containerSerieTv').append(html);
        }

        trovaAttoreGenere(tipo,esitoId) // rihiamo la funzione che mi permette di accedere alla lista degli attori e ai generi
    }
}

// funzione trova elementi con una seconda chiamata ajax passando il tipo (da passare all'url e l'id) di ogni card!
function trovaAttoreGenere(type,id){
    let url= 'https://api.themoviedb.org/3/' + type + '/' + id; 
    $.ajax({
        type:'GET',
        url: url,
        data:{
            api_key: '2c42a4436c6db0bbb4e23ee64ca1bc93',
            language: 'it-IT',
            append_to_response: 'credits' // appendo nell'url la parola credits
        },
        success: function(response){
           //console.log(response.genres, response.credits.cast);
            let genere= response.genres;
            let attori= response.credits.cast;

            stampaDettagli(id,genere,attori)
        }
        
    })
}

// funzione che stampa gli attori e i generi in html con la seconda chiamate ajax ed un nuovo template
function stampaDettagli(id,genres,attori){
    let source = $("#template-detailes").html();
    let template = Handlebars.compile(source);

    let castList=[];
    for(let i=1; i < attori.length; i++){
        castList.push(attori[i].name)
        if(castList.length >= 5){
           castList.splice(5)
        }
        // if(i !== attori.length - 1){
        //     castList += ', ';
        // } 
    }
    

    let genereList=[];
    for(var i=0; i< genres.length; i++){
        genereList.push(genres[i].name);
    }

    let context={
        actors : castList,
        genres: genereList
    } 
    
    let html= template(context);
    $( `.card[data-id= '${id}'`).find('.dettagli').append(html);
}

// funzione seleziona genere in base al genere verrà visualizzato o meno l'elemento
function sceltaGenere(genere){
    if(genere == 'All'){
      $('.card').show();
    }else{
      $('.card').hide();
      $('.card.' + genere).show();
    }
} 

// funzione aggiungi immagine prelevandola dalla chiamata API, dove non è presente aggiunge l'immagine sostitutiva
function aggImg(elemento){
    let urlImg='https://image.tmdb.org/t/p/w154';
    if(elemento == null){
        return "https://cdn0.iconfinder.com/data/icons/interface-set-vol-2/50/No_data_No_info_Missing-512.png";
    }

    return urlImg + elemento;
}

// funzione valutazione con le stelline
function stars(num){
    num = Math.ceil(num/2).toFixed(0); //divido il numero per due e lo arrotondo per eccesso togliendo i decimali con toFixed!
    let stars='';
    for(let i=1; i<=5; i++){
        if(i < num){ // se i è minore o uguale a num ovvero il numero che capiterà dalla mia ricerca
            stars += '<i class="fas fa-star"></i>'; // stella piena
        }else{
            stars += '<i class="far fa-star"></i>'; // stella vuota
        }
    }

    return stars;
}

// funzione stampa bandiere avendo poche lingue
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

/* //funzione stampa bandiere avendo molte lingue
function flag(elemento){
    let listLingue=['en','it'];
    if(listLingue.includes(elemento)){
        return `<img src='img/' + ${elemento} + .svg>`;
    }

    return elemento;
} */
  
