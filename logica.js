
var h2 = document.getElementById("espacio");
function GeneradorNumero(multiplicador){
    return Math.floor(Math.random() * multiplicador);
}

function SetGeneradorNumero() {
h2.innerHTML = GeneradorNumero(100);
}

var audio = document.getElementById("myaudio");
  audio.volume = 0.85;

  var audio = document.getElementById("myaudio2");
  audio.volume = 0.065;  

  document.addEventListener('click', musicPlay);
  function musicPlay() {
      document.getElementById('myaudio').play();
      document.getElementById('myaudio2').play();
      document.removeEventListener('click', musicPlay);
  }

 