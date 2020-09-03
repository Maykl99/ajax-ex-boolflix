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

    $('button').click(function(){
        let nome= $('#prelevaNome').val();
        if(nome !=''){
            chiamataAjax(nome);
        }
        else if(nome == ''){
            $('div.container').html('<h1>Inserisci un valore</h1>'); 
        }
    
    })

});


function chiamataAjax(nome){
    var listaUrl=['https://api.themoviedb.org/3/search/movie','https://api.themoviedb.org/3/search/tv']
    for (const url in listaUrl) {
        var urlPassante = listaUrl[url];
    }
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

function chiamataApi(response,type){
    if(type == response.results[i].title){
        
        let source = $("#templateFilm").html();
        let template = Handlebars.compile(source);

        for(let i=0; i<response.results.length; i++){

            var context = {
                //type : type,
                title: response.results[i].title, 
                original_language: flag(response,i), //response.results[i].original_language, 
                original_title: original_title,
                vote_average: star(response.results[i].vote_average)//'<i class="fa fa-star-o" aria-hidden="true"></i>' //star(response.results[i].vote_average)   //response.results[i].vote_average
            };

            let html = template(context);
            $('.container').append(html);
        }
    }else{
        let source = $("#templateFilm").html();
        let template = Handlebars.compile(source);

        for(let i=0; i<response.results.length; i++){

            var context = {
                //type : type,
                title: response.results[i].name, 
                original_language: flag(response,i), //response.results[i].original_language, 
                original_title: original_name,
                vote_average: star(response.results[i].vote_average)//'<i class="fa fa-star-o" aria-hidden="true"></i>' //star(response.results[i].vote_average)   //response.results[i].vote_average
            };

            let html = template(context);
            $('.container').append(html);
        }
    }   
}

function star(num){
    // dividere num per 2
    // arrotondare per eccesso
    // ciclo
    // i<5
    // come faccio a capire quante stelle devo passare? con un if
    // controllo se il numero è minore di quello ottenuto di num

    var star=''
    num = Math.ceil(num).toFixed(0);
    num = num / 2

    //num.length == star;
    for(var i=1; i<=5; i++){
        //num+= star;

        // num è il valore che varia in base a cosa digido 
        // i nel ciclo vale da uno a cinque 
        /* console.log(num)
        console.log(i) */
        var star='';
        if(i <= num){ // se i è minore o uguale a num ovvero il numero che capiterà dalla mia ricerca
            star = '<i class="fas fa-star"></i>'; // stella piena
        }else{
            star = '<i class="far fa-star"></i>'; // stella vuota
        }
        
        //num += star;
    }

    // vedere quant'è il numero e colorare le stelle
    // fino a che i è minore uguale a num stampo pieno altrimenti vuoto

    
    //console.log(num)
    //console.log(star)
    return star;
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


/* var context = { 
    title: response.results[i].title, 
    original_language: flag(response,i), //response.results[i].original_language, 
    original_title: response.results[i].original_title,
    vote_average: star(response.results[i].vote_average)//'<i class="fa fa-star-o" aria-hidden="true"></i>' //star(response.results[i].vote_average)   //response.results[i].vote_average
}; */





            //type = response.results[i].title;
            /* if(response.results[i].title == 'film'){
                title = response.results[i].title;
                original_title=response.results[i].original_title;
            }else{
                title=response.results[i].name;
                original_title=response.results[i].original_name;
            }

            console.log(type) */

            /* if(type == 'serieTv'){
                title=response.results[i].name;
                original_title=response.results[i].original_name;
            }/* else{
                title == response.results[i].title;
                original_title=response.results[i].original_title;
            } */ 









            

    

    /* if(type == 'serieTv'){

        let source = $("#templateSerieTv").html();
        let template = Handlebars.compile(source);
        
        for(let i=0; i<response.results.length; i++){
            var context1 = { 
                name: response.results[i].name, 
                original_language: flag(response,i), //response.results[i].original_language, 
                original_name: response.results[i].original_name,
                vote_average: star(response.results[i].vote_average)//'<i class="fa fa-star-o" aria-hidden="true"></i>' //star(response.results[i].vote_average)   //response.results[i].vote_average
            };
        }

        let html2 = template(context1);
        $('.containerSerieTv').append(html2);
    } */


        //$('#prelevaNome').val('');