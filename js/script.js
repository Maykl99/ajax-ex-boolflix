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
        //let nome='';
        let nome= $('#prelevaNome').val();
        if(nome !=''){
            chiamataAjax(nome);
            $('div.container').text('')
        }
        else if(nome == ''){
            $('.container').html('<h1>Inserisci un valore</h1>'); 
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


    $("#prelevaNome").keyup(function(){
            //let nome='';
            let nome= $('#prelevaNome').val();
            if(nome !== ""){
                chiamataAjax(nome);
                $('div.container').text('')
            }
    })

});


function chiamataAjax(nome){
    $.ajax({
        type: "GET",
        url: "https://api.themoviedb.org/3/search/movie",
        data: {
            
            api_key: '2c42a4436c6db0bbb4e23ee64ca1bc93',
            poster_path: 'poster_path',
            query: nome,
            language: 'it-IT',
        },
        success: function (response) {
            console.log(response);
            if(response.total_results > 0){
                chiamataApi(response);
                console.log(response);
            }else{
                alert('non ci sono risultati');
            }
            
        },
        error: function(errore){
            alert('errore ' + errore);
        } 
    });
}

function chiamataApi(response){
    let source = $("#entry-template").html();
    let template = Handlebars.compile(source);

    for(let i=0; i<response.results.length; i++){
        let context = { 
            title: response.results[i].title, 
            original_language: flag(response,i), //response.results[i].original_language, 
            original_title: response.results[i].original_title,
            vote_average: star(response.results[i].vote_average)//'<i class="fa fa-star-o" aria-hidden="true"></i>' //star(response.results[i].vote_average)   //response.results[i].vote_average
        };

        let html = template(context);
        $('.container').append(html);
        //$('#prelevaNome').val('');
       
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
    for(var i=1; i<=5; i++){
        num+= star;
        console.log(num)
        console.log(i)
        if(i <= num){
            star = '<i class="fas fa-star"></i>';
        }else{
            star = '<i class="far fa-star"></i>';
        }
        
        // num += star;
    }

    // vedere quant'è il numero e colorare le stelle
    // fino a che i è minore uguale a num stampo pieno altrimenti vuoto

    
    //console.log(num)
    return num;
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
