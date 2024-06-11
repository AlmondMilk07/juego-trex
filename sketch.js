var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var estado_de_juego="inicio"
var game_over, restart, game_overS, restartS
var mp3_1, mp3_2, mp3_3
var score=0
// createEdgeSprites();
var obstacle, obstacleImage, obstacleImage2, obstacleImage3, obstacleImage4, obstacleImage5, obstacleImage6;
var grupo_obstaculos
var nube, nubeS, grupo_nubes;
function preload(){
//Creacion de objetos 

      //Trex
     trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
     trex_collided = loadImage("trex_collided.png");

    //Ground
  groundImage=loadImage("ground2.png")
  
  //creacion de obstaculos
 obstacleImage = loadImage("obstacle2.png");
 obstacleImage2 = loadImage("obstacle1.png");
 obstacleImage3 = loadImage("obstacle3.png");
 obstacleImage4 = loadImage("obstacle4.png");
 obstacleImage5 = loadImage("obstacle5.png");
 obstacleImage6 = loadImage("obstacle6.png");
  
  game_over=loadImage("gameOver.png")
  restart=loadImage("restart.png")
  mp3_1=loadSound("jump.mp3")
  mp3_2=loadSound("die.mp3")
  mp3_3=loadSound("checkpoint.mp3")
  
  nube = loadImage("cloud.png")
}

function setup() {
  //Creacion de Cnvas 
  createCanvas(500, 500)

  //Invisisble Ground
  invisibleGround=createSprite(30,315,100,30)
 invisibleGround.visible=false
  //crear sprite de trex 
  trex = createSprite(50,280,20,50);
  //trex.setCollider("rectangle",0,0,100,trex.height) 
  trex.setCollider("circle",0,0,49)
  trex.debug=false
  //Crear objeto trex  animado
       trex.addAnimation("etiqueta1",trex_collided);
     //   Mandar variable  de animacion del Trex 
  trex.addAnimation ("etiqueta2", trex_running);
  trex.changeAnimation("etiqueta2")   
  trex.scale = 0.5;
  
  
  //crear sprite de suelo
 ground=createSprite(50,300,20,20)
ground.addImage("piso",groundImage)
  //mover  piso   coordenada X - izquierda 
   ground.x=ground.width/2
  ground.velocityX=-4
  //creacion obstaculo
   //creacion_obstaculos()
  //coordenada x de ground  hacer que se duplique

  
  //crear sprite de suelo invisible 
grupo_obstaculos= new Group()
grupo_nubes= new Group()
  
  game_overS=createSprite(200,200)
  game_overS.addImage("game_over",game_over)
  game_overS.scale=2
  game_overS.visible=false 
  
  restartS=createSprite(220,250)
  restartS.addImage("restart", restart)
  restartS.scale=0.8
  restartS.visible=false
 
}

function draw() {
  //establecer el color de fondo
  background(220);
  console.log("estado de juego:"+ estado_de_juego)
  if(estado_de_juego=="inicio"){
    fill("rgb(14,127,243)")
    textSize(20)
     text("presiona la tecla de espacio para brincar",90,200);
    trex.velocityY=0
     }
  if(estado_de_juego==="play"){
      ground.x=ground.width/2
  ground.velocityX=-4
    //score = score + Math.round(getFrameRate()/60);
    score = score + Math.round(getFrameRate()/60);
    if(score >0 && score%100 === 0){
  mp3_3.play()
      ground.velocityX=-(6+score)     
  console.log("entro a la evaluacion score")
       
}

  //hacer que el trex salte al presionar la barra espaciadora
  creacion_obstaculos()
    brincar()
  //agregar gravedad


  //hacer que el piso se repita 
    if(ground.x <0){
       ground.x=ground.width/2
      console.log("evaluacion_ground")
    }
  
  //evitar que el trex caiga

  evaluacion_de_choque()
    //fin de play
    }
  if(estado_de_juego==="end"){
    base_de_datos()
    console.log("estado end")
     grupo_obstaculos.setVelocityXEach(0);
    trex.changeAnimation("etiqueta1")
    ground.velocityX=0
    game_overS.visible=true
    restartS.visible=true
    
    if(mousePressedOver(restartS)){
      console.log("entro al mouse pressed")
       reset()
       }
     }
  
   if(ground.x <0){
       ground.x=ground.width/2
      console.log("evaluacion_ground")
     }
  //visualiza Sprites
  trex.collide(invisibleGround)
  drawSprites();
}
function brincar(){
  //console.log("trex"+trex.y)
  if(keyDown("space")&&trex.y>=160){
     trex.velocityY=-10;
    mp3_1.play()
    //console.log("brincar")
     }
  trex.velocityY=trex.velocityY+0.8
  //trex.bounceOff(edges);
}

function creacion_obstaculos(){
    var r1=Math.round(random(1,6));
  console.log(r1)
   obstacle = createSprite(480,280,20,20);
  if(frameCount %60===0){
  switch(r1){
      case 1:obstacle.addImage(obstacleImage2);break;
      case 2:obstacle.addImage(obstacleImage);break;
      case 3:obstacle.addImage(obstacleImage2);break;
      case 4:obstacle.addImage(obstacleImage3);break;
      case 5:obstacle.addImage(obstacleImage6);break;
      case 6:obstacle.addImage(obstacleImage);break;
      default:break;
  }          
   //crear sprite de obstacle
  obstacle.scale=0.1
  obstacle.visible=true
  obstacle.velocityX=-4
  grupo_obstaculos.add(obstacle)
    
}  
  }
function creacion_nubes(){
  
}
function evaluacion_de_choque(){
  console.log("se entro a la evaluacion choque")
  if(grupo_obstaculos.isTouching(trex)){
     console.log("entro evluacion")
    estado_de_juego="end"
    console.log("estado de juego= "+ estado_de_juego)
     mp3_2.play()
     }
   }
function reset(){
  trex.changeAnimation("etiqueta2")   
  grupo_obstaculos.setVelocityXEach(0)
  score=0
  estado_de_juego = "play"; 
  game_overS.visible = false; 
  restartS.visible = false; 
  grupo_obstaculos.destroyEach();

}

function base_de_datos(){
  const base_de_datos_1=firebase.database();
  base_de_datos_1.ref("/score").set({score:score})
}
function play(){
  var nombre=document.getElementById("nombre_jugador").value;
   const base_de_datos_2=firebase.database();
  base_de_datos_2.ref("/nombre_del_jugador").set({nombre:nombre})
  estado_de_juego="play"
}