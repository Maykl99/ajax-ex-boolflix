$(document).ready(function(){
    var v=prompt('Inserisci valore');
    //https://api.themoviedb.org/3/movie/24428/credits?api_key=2c42a4436c6db0bbb4e23ee64ca1bc93
/*     var url1= 'https://api.themoviedb.org/3/search/movie' + esito + api_key;
    var url2 = "https://api.themoviedb.org/3/search/tv"; */
    ajax(v);
    
});

function ajax(nome,url){
    $.ajax({
        type: "GET",
        url: 'https://api.themoviedb.org/3/search/movie',
        data: {
            api_key: '2c42a4436c6db0bbb4e23ee64ca1bc93',
            poster_path: 'poster_path',
            query: nome,
            language: 'it-IT',
        },
        success: function (response) {
            //console.log(response);
            for(var i=0; i<response.results.length; i++){
                esito = response.results[i].id;
                //console.log(esito);
                //console.log('https://api.themoviedb.org/3/movie/' + esito + '/credits?api_key=2c42a4436c6db0bbb4e23ee64ca1bc93');
                //https://api.themoviedb.org/3/movie/24428/credits?api_key=2c42a4436c6db0bbb4e23ee64ca1bc93
                //console.log(esito)
                ajaxDentro();
            }

            
        }
    });
}

function ajaxDentro(){
    $.ajax({
        type:'GET',
        url: 'https://api.themoviedb.org/3/movie/' + esito + '/credits?api_key=2c42a4436c6db0bbb4e23ee64ca1bc93',
        language: 'it-IT',

        success: function(response){
            for(var i=0; i<response.cast.length; i++){
                var esito = response.cast[i].character;
                //var lista= [response.cast[i].character]
                console.log(esito)
                $('.container-fluid').append(esito);
            }
        }
        
    })
}