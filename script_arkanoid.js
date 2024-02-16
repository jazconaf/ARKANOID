//Declaramos una variable que almacenará los tres posibles estados del juego. Se inicializa en 'inicio'.
let estadoJuego = "inicio";
let botonPlay;
let ladrillos = [];//Array para almacenar los ladrillos
let xPala;//Variable para almacenar las coordenadas x de la pala
let anchoPala = 80;
let altoPala = 20;
let bola;
let diametroBola = 20;
let velocidadX = 3;
let velocidadY = 3;
let juegoGanado;

// Clase Bola que define la posición y el tamaño de la bola
class Bola {
  constructor(x, y, diametro) {
    this.x = x;
    this.y = y;
    this.diametro = diametro;
  }
}

//Añadimos una clase para poder crear los ladrillos
class Ladrillo{
	constructor(x, y){
     this.x = x;
     this.y = y;
     this.ancho = 50;
     this.alto = 20;
     this.visible = true;    
    }
  	display(){
     if(this.visible){    
     fill(155, 155, 155);
     rect(this.x, this.y, 50, 20);//Rect() dibuja un rectangulo con un ancho de 50 x una altura de 20. 
    }
 }

//Añadimos un metodo con la lógica para la detección del choque de la bola con un ladrillo
detectaChoque(){
  //Vemos si el ladrillo es visible y la bola se encuentra en las coordenadas de este      
  if (this.visible && bola.x + bola.diametro / 2 > this.x && bola.x - bola.diametro / 2 < this.x + this.ancho && bola.y + bola.diametro / 2 > this.y && bola.y -bola.diametro / 2 < this.y + this.alto) {
    this.visible = false;//Si choca el ladrillo desaparece
    velocidadY *= -1;//Invertimos la dirección para simular un rebote
     return true;
    }
    return false;
  }
}

//La función setup() es llamada una vez al inicio del juego para configurar en primera instancia el entorno del juego
function setup(){
  createCanvas(500, 400);
  
  //Con un bucle for creamos los ladrillos y con .push los añadimos al array vacio
  for(let i = 0; i < 9; i++){
  	for(let j = 0; j < 2; j++){
     let ladrillo = new Ladrillo(i * 55 + 5, j * 25 + 50);//55 y 25 son el ancho y el alto del ladrillo y los 5 sobrantes el espacio entre ellos
      ladrillos.push(ladrillo);
    }
  botonReinicio = createButton("Reiniciar");
  botonReinicio.position((windowWidth - botonReinicio.width) / 2, (windowHeight - botonReinicio.height) / 2 + 50);
  botonReinicio.mousePressed(reiniciarJuego);
  botonReinicio.hide();      
  }
//Inicializamos la pala en el centro X del canva    
xPala = (width - anchoPala) / 2;

//Inicializamos la bola en el centro del canva y con una dirección en diagonal hacia abajo    
bola = new Bola(width / 2, height / 2, diametroBola);
  velocidadX = 3;  
  velocidadY = 3;    
}

//Draw() es una función que se ejecuta continuamente y esta va actualizando el canva
function draw(){
  background(50, 205, 50);
//If/else controlan el estado actual del juego mediante las funciones que se ocuparan de dibujar los diferentes estados del juego  
  if (estadoJuego === "inicio"){
    dibujaInicio();
    //La funcion dibujaJuego() se llamara siempre que el estado sea 'play'. Es la lógica de funcionamiento del juego. 
  }else if (estadoJuego === "play"){
    dibujaJuego();
  }else if (estadoJuego === "final"){
    dibujaFinal();
  }
}

//Con esta función dibujamos la pantalla de inicio del juego
function dibujaInicio(){
  //Con text() dibujamos el texto en pantalla
  text("Arkanoid", width / 2, height / 2);
  textAlign(CENTER);
  textSize(50);
  fill(255);
  
  //Si el boton ya existe lo eliminamos. Esto es necesario ya que "dibujaInicio" es llamada continuamente en draw().
  if(botonPlay){
  	botonPlay.remove();
  }
  
  //Creamos el boton de "Play".
  botonPlay = createButton("Play");
  botonPlay.position((windowWidth - botonPlay.width) / 2, (windowHeight - botonPlay.height) / 2 + 50);
     
  //mousePressed() es una función que es llamada cada vez que se hace click con el mouse sobre un elemento.
  botonPlay.mousePressed(function(){
  estadoJuego = "play";
  //Funcion hide() para esconder el boton una vez que es presionado.  
  botonPlay.hide();
  });
}

function dibujaJuego(){
  //Dibujamos los ladrillos
  for(let i = 0; i < ladrillos.length; i++){
  	ladrillos[i].display();
    ladrillos[i].detectaChoque();  
  }
    
 fill(255);
  ellipse(bola.x, bola.y, 20, 20);  
  bola.x += velocidadX;  
  bola.y += velocidadY;  

 //Rebote en los laterales del canva
if (bola.x - bola.diametro / 2 < 0 || bola.x + bola.diametro / 2 > width) {
  velocidadX *= -1;
}

//Rebote en el margen superior
if (bola.y - bola.diametro / 2 < 0) {
  velocidadY *= -1;
}

//Detectamos si la bola alcanza el borde inferior para cambiar el estado del juego
if (bola.y + bola.diametro / 2 > height) {
  estadoJuego = "final";
}
//Detectamos si la bola choca con la pala, si es asi, invertimos la dirección
if (bola.y + bola.diametro / 2 > height - altoPala - 20 && bola.y - bola.diametro / 2 < height && bola.x + bola.diametro / 2 > xPala && bola.x - bola.diametro / 2 < xPala + anchoPala) {
  velocidadY *= -1;
}
    
//Dibujamos la pala dentro del canva cuando (estadoJuego === "inicio")    
fill(255, 230, 93);
rect(xPala, height - altoPala - 20, anchoPala, altoPala);

//keyIsDown comprueba si la tecla está presionada (añadimos el movimiento a la pala)
if(keyIsDown(LEFT_ARROW) && xPala > 0){
    xPala -= 5;
}else if(keyIsDown(RIGHT_ARROW) && xPala< (width - anchoPala)){
    xPala += 5;
}

//Comprobamos que todos los ladrillos esten destruidos y asi el estado del juego pasa a "final"    
let todosDestruidos = true;
  for (let i = 0; i < ladrillos.length; i++) {
    if (ladrillos[i].visible) {
      todosDestruidos = false;
      break;
    }
  }
  
  if (todosDestruidos) {
    estadoJuego = "final";
    juegoGanado = true;  
  }
}
   

function dibujaFinal(){
  textAlign(CENTER);
  textSize(48);
  fill(255);
    
 if(juegoGanado){    
  text("Enhorabuena", width / 2, height / 2);

 }
 else{
  text("Game Over", width / 2, height / 2);
 }
    
 botonReinicio.show();
}

function reiniciarJuego(){
  estadoJuego = "inicio";
  botonReinicio.hide();
  // Reiniciar las posiciones de la bola, la pala, y la velocidad de la bola
  xPala = (width - anchoPala) / 2;
  bola.x = width / 2;
  bola.y = height / 2;
  velocidadX = 3;
  velocidadY = 3;
  
  juegoGanado = false;
  // Restablecer los ladrillos
  ladrillos = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 2; j++) {
      let ladrillo = new Ladrillo(i * 55 + 5, j * 25 + 50);
      ladrillos.push(ladrillo);
    }
  }
}