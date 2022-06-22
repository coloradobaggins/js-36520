import {loadQuestions} from './data/questions.js';
import {Trivia} from './classes/Trivia.js';
import {User} from './classes/User.js';

import { getArrWithRandomIndexes, uniq} from './utils/randomIndexArrayUtil.js';
import { animationShowScoreStats, animationHideScoreStats, animationShake, showOverlay, hideOverlay} from './utils/animationsUtil.js';
import { questionsAnimationFadeIn, questionsAnimationFadeOut  } from './utils/questionsAnimationsUtil.js';
import { soundDigital, soundCorrect, soundIncorrect, soundSelection } from './utils/soundUtils.js';

/**
 * Comision: 36520
 * 
 * Trabajo Final JavaScript
 * 
 */

let userStorage; // save user storage data

let userStorageData;

let storageLastPlayers;

let isUserLogged = false;

let navBarContainer= document.querySelector('#navbarContainer');

let logoutBtn; 

let loginDivContainer = document.querySelector('.login')

let userFormStart;

let categoriesContainer = document.querySelector('.categoriesContainer');

let categoryElemBtn;

let questionContainer = document.querySelector('.questionContainer');

let fadeAnimateQuestion = document.querySelector('.fade-animate-question');

let tipContainerElmt = document.querySelector('.tip');

let closeTipBtn = document.querySelector('.close-tip');

let blockUIElmt = document.querySelector('.blockUI');

let overlayElmt = document.querySelector('.overlay');

let endModal = new bootstrap.Modal(document.getElementById('endModal'), {});

let endModalBtn = document.querySelector('.modal-end-game');

let lastPlayerModal = new bootstrap.Modal(document.getElementById('lastPlayersModal'), {});

let lastPlayersModalBtn = document.querySelector('.open-last-players-modal');

let lastPlayersModalCloseBtn = document.querySelector('.close-last-players-modal');

let timeoutBarContainer = document.querySelector('.timeout-bar-container');

let trivia;

let choiceBtn;

let scrambleTitleText;

let actualQuestion;

let actualChoices;

let choicesLiArray = [];

let totalPlayTime = 210;    // (seconds) 

let timeBarElmt;            //Animated time bar elmt

let selectedCategory;       //String, category name

let questions;

let maxQuestions = 8;       //Maximo de preguntas por categorias


const main = async function(){

    questions = await loadQuestions();  //Se cargan todas las preguntas desde un .json

    checkLastPlayers();

    checkLogin();

    addListener();

}

/**
 * Check en el storage de los ultimos jugadores. Si no existe el item lastPlayer, cre un array vacio
 */
const checkLastPlayers = function(){

    storageLastPlayers = JSON.parse(localStorage.getItem('lastPlayers'));

    if(storageLastPlayers == null){

        localStorage.setItem('lastPlayers', JSON.stringify([]));
        
    }

}

const addListener = function(){
    
    closeTipBtn.addEventListener('click', closeTip);

    endModalBtn.addEventListener('click', endGameModal);

    lastPlayersModalBtn.addEventListener('click', openLastPlayerModal);

    lastPlayersModalCloseBtn.addEventListener('click', ()=>{

        lastPlayerModal.hide();

        endModal.show();

    });

}


const checkLogin = function(){

    userStorage = localStorage.getItem('user');

    isUserLogged = (userStorage!=null) ? true : false;
    
    if(isUserLogged){           //Si esta logueado, mostrar navbar con nombre de use. Ocultar loggin.

        userStorageData = JSON.parse(localStorage.getItem('user'));

        createNavbar(logoutBtn);
        
        loginDivContainer.innerHTML = "";

        goToSelectCategory();

    }else{                      //Si no esta logueado, ocultar navbar del user.

        createLogin();

    }

    
}


const logout = () =>{

    navBarContainer.innerHTML = "";

    localStorage.removeItem('user');    //Solo limpio los datos del user actual

    location.reload();

}


function onSubmit(e){

    e.preventDefault();

    let formData = new FormData(userFormStart);

    let user = new User(formData.get('name'), formData.get('email'));
    
    localStorage.setItem('user', JSON.stringify(user)); 

    gsap.to(loginDivContainer, { duration: 1.2, ease: "power3.out", y: -500, alpha:0, 
        onComplete:()=>{

            checkLogin();

        }
    });


}


let goToSelectCategory = function (){

    //console.log(questions);   //all questions
    
    if(isUserLogged){
       
        categoriesContainer.style.display = "block";  

    } else{

        location.reload();  //User no logueado

    }
    
    categoriesContainerShow();

    let allCats = questions.map((q)=>q.category);   //Get all categories from json 

    let uniqueCategories = uniq(allCats);           //Get unique categories

    let strCategoryElmt = ``;
    
    for(let uniqCat of uniqueCategories){

        strCategoryElmt += `
        <div class="col-md-3">
            <div class="categoryElmt" data-category="${uniqCat}" style="background-image:url('../imgs/categories_bg/${uniqCat}.jpg');">
                
                <div class="cat-select-footer">
                    <h5 class="title text-center">${uniqCat}</h5>
                </div>
            </div>
        </div>`;

    }

    
    document.querySelector('.categories').innerHTML = strCategoryElmt;

    categoryElemBtn = document.querySelectorAll('.categoryElmt');

    for(let i = 0; i < categoryElemBtn.length; i++){

        categoryElemBtn[i].addEventListener('click', enterCategory);

    }

}


/**
 * Enter category
 * Hide actual step 
 * Show questions
 */
let enterCategory = function(){

    soundSelection.play();

    selectedCategory = this.getAttribute('data-category');

    startTrivia(selectedCategory);

    categoriesContainerHide();
    
    showLifeScoreStats();

    
}

/**
 * Actualizar valores de stats
 * Mostrar stats
 */
let showLifeScoreStats = function(){

    
    document.querySelector('.navbar-life').innerHTML = trivia.life;
    document.querySelector('.navbar-score').innerHTML = trivia.score;

    animationShowScoreStats(document.querySelector('.stats-container'));

}

/**
 * Ocultar stats
 */
let hideLifeScoreStats = function(){

    animationHideScoreStats(document.querySelector('.stats-container'));

}   



/**
 * ocultar categorias
 * 
 * Si mando true, oculta el contenedor de categorias  muestra el contenedor de preguntas
 * SI mando false, solo ocualta el contenedor de categorias 
 * 
 */

let categoriesContainerHide = function(){

    gsap.to(categoriesContainer, { duration: .6, ease: "power3.out", alpha:0, 
        onComplete:()=>{

            categoriesContainer.style.display = 'none';
            categoriesContainer.style.opacity = 0;
            
            questionContainer.style.display = 'block';

            gsap.to(questionContainer, { duration: .6, ease: "power3.out", alpha:1 });

        }
    });
}

let categoriesContainerShow = function(){
    
    categoriesContainer.style.display = "block";

    gsap.to(categoriesContainer, { duration: .6, ease: "power3.out", alpha:1 });

}


/**
 * Empieza Trivia con la categoria seleccionada
 * @param {string} cat 
 */
let startTrivia = function(cat){

    let filteredQuestions = questions.filter((question)=>{ return question.category == cat });  //Filter questions by user input

    let shuffledQ = _.shuffle(filteredQuestions);   //Mezclar preguntas antes de enviar a Trivia

    trivia = new Trivia(shuffledQ.slice(0, maxQuestions));     //Acortar y enviar array de preguntas a trivia

    createTimeoutBar();
    
    showQuestion();
    
    timeBarAnimation(totalPlayTime);    //Cuenta regresiva animated bar

}

/**
 * Creo divs time bar
 * asigno var a clase
 */
let createTimeoutBar = function(){


    let divTimeoutBar = document.createElement('div');
    divTimeoutBar.className = 'timeout-bar';

    let divBar = document.createElement('div');
    divBar.className = 'bar';

    divTimeoutBar.appendChild(divBar);

    timeoutBarContainer.appendChild(divTimeoutBar);

    timeBarElmt = document.querySelector('.bar');
}


/**
 * showQuestion()
 * Show Question and choices. Add event listener to choices.
 * 
 */
let showQuestion = function(){

    blockUIElmt.style.display = "block";    //BlockStage: Evitamos que se puedan tocar opciones hasta que no se terminen de animar los elementos.
    
    actualQuestion = trivia.getActualQuestion();

    actualChoices = trivia.getActualChoices();

    choicesLiArray = actualChoices.map((choices, i) => {

        return `<li><a href="#" data-choice="${i}" class="custom-btn-choice choice">${choices}</a></li>`;

    });

    let choicesLiElmt = choicesLiArray.join('');    //remove(', ') between array elements


    document.querySelector('.question-title-container').innerHTML = `<h4 class="qTitle">${actualQuestion.text}</h4>`;  //Print titles

    document.querySelector('.group-choices').innerHTML = choicesLiElmt; //Print choices

    document.querySelector('.group-choices').style.opacity = 0;


    //Click Listener for evey choice
    choiceBtn = document.querySelectorAll('.choice');

    for(let i = 0; i < choiceBtn.length; i++){

        choiceBtn[i].addEventListener('click', checkChoice);

    }

    //Actual question / Total question
    document.querySelector('.actualQuestion').innerHTML = trivia.actualQuestionsIndex+1;
    document.querySelector('.totalQuestion').innerHTML = trivia.getTotalQuestions();
    
    scrambleEffect(document.querySelector('.qTitle'), ()=>{             //Cuando termina efecto scramble, ejecuto animacion gsap.

        soundDigital.stop();

        gsap.to(document.querySelector('.group-choices'), { duration: .6, ease: "power3.out", alpha:1,

            onComplete:()=>{

                blockUIElmt.style.display = "none"; //UnblockStage

            }

        });

    });
  
    

}

/***
 * Check selected choice by user click
 * 
 */
 let checkChoice = function(){

    let selectedChoice = parseInt(this.getAttribute('data-choice'));

    if(trivia.checkAnswer(selectedChoice)){

        soundCorrect.play();
        
    }else{

        animationShake(document.querySelector('.questionsFiltered'));

        soundIncorrect.play();

    }

    showTip(.5);

    updateNabvarStats();   
}

let showTip = function(delay){

    
    if(trivia.getActualTip() != "" && trivia.getActualTip() != null && trivia.getActualTip() != undefined){

        showOverlay(overlayElmt);

        tipContainerElmt.querySelector('.tip-body').innerHTML = `<p>${trivia.getActualTip()}</p>`;

        gsap.to(tipContainerElmt, .3, { duration: .6, delay:delay, ease: "power3.out", alpha: 1, 
            onStart:()=>{ 
                tipContainerElmt.style.display = "block";
            },
            onComplete:()=>{

                trivia.nextIndexQuestion(); //Cuando termino la animacion de mostrar el tip, incremento el indexQuetion.

            }
        });

    }else{  //Pregunta sin tip

        trivia.nextIndexQuestion(); //Si no tengo tip, incremento el indexQuestion aca.

        checkBeforPassToNextQuestion();
    }

}

/**
 * Cierra popup tip
 */
let closeTip = function(){


    gsap.to(tipContainerElmt, .3, { duration: .6, ease: "power3.out", alpha: 0, 
        onComplete: ()=>{
            tipContainerElmt.style.display = "none";
            
            hideOverlay(overlayElmt);
            
            checkBeforPassToNextQuestion();

        }
    });

}

/**
 * Antes de pasar a la siguiente pregunta, verificar que tengamos mas
 */
const checkBeforPassToNextQuestion = function(){

    if(!trivia.isGameEnd()){

        questionsAnimationFadeOut(fadeAnimateQuestion, showQuestion, questionsAnimationFadeIn);//2 callbacks.. cuando termina animacion ejecuta estas funciones

    }else{

        gameEnd();

    }

}

/**
 * Scramble text animation
 * @param {*} elmt, callback
 */
let scrambleEffect = function(elmt, fn){

    soundDigital.play();
    
    scrambleTitleText = new ScrambleText( elmt, 
        {
            timeOffset: 20,
            callback: fn
        } 
    ).play().start();

}


/**
 * Actualizar stats en el storage y en html
 */
let updateNabvarStats = function(){

    document.querySelector('.navbar-life').innerHTML = trivia.life;
    document.querySelector('.navbar-score').innerHTML = trivia.score;

    userStorage = JSON.parse(localStorage.user);

    userStorage.life = trivia.life;
    userStorage.score = trivia.score;

    localStorage.setItem('user', JSON.stringify(userStorage));

}


/**
 * Barra de estado de tiempo
 * Segun el progreso, se cambia de color ver a amarillo y a rojo.
 * 
 * @param {int} time 
 */
let timeBarAnimation = function(time){

    let yellowFlag = false;
    let redFlag = false;

    gsap.to(timeBarElmt, { duration: time, ease: "power3.out", scaleX:0, transformOrigin:'left',
        onUpdate: function(){   
            
            if(this.progress() > 0.4 && !yellowFlag){
                timeBarElmt.style.backgroundColor = "yellow";
                yellowFlag = true;
            }
            if(this.progress() > 0.6 && !redFlag){
                timeBarElmt.style.backgroundColor = "red";
                redFlag = true;
            }

        },
        onComplete:()=>{
            
            gameEnd('byTime');

        }
    });
}


/**
 * 
 * Si pierde por tiempo recibe "byTime"
 * Si no se pasa nada, perdio por intentos.
 * So llega aca y el score es igual a la cantidad de preguntas, contesto todo bien.
 * Agrega jugador al storage
 * Muestra modal con mensaje al usuario de como le fue.
 * 
 * @param {string} type byTime || ""
 */
const gameEnd = function(type)
{          

    hideLifeScoreStats();

    gsap.killTweensOf(timeBarElmt); //Eliminar tween de barra de tiempo.
    
    timeoutBarContainer.innerHTML = "";

    let msg = ``;

    if(trivia.score == trivia.getTotalQuestions()){

        msg = ` EXCELENTE!! Todas tus preguntas fueron correctas!`;

    }else if(trivia.actualQuestionsIndex == trivia.getTotalQuestions()){

        msg = ` Ya no quedan mas preguntas, mira tus stats!`;
        
    }else{

        if(type == 'byTime'){

            msg = ` se termino el tiempo. Más suerte la próxima!`;
    
        }else{
            
            msg = ` no te quedan mas vidas. Más suerte para la próxima!`;
    
        }

    }
    
    document.querySelector('.end-modal-msg').innerHTML = `${userStorageData.name}, ${msg}`;
    document.querySelector('.resume-life').innerHTML = `${trivia.life}`;
    document.querySelector('.resume-right-anwswers').innerHTML = `${trivia.score}`;

    addUserToLastPlayers();  //Agregar al local storage este jugador / jugada


    //Cerrar si los modales
    if(tipContainerElmt.style.opacity > 0){

        tipContainerElmt.style.opacity = 0;
        tipContainerElmt.style.display = "none";
        hideOverlay(overlayElmt);

    }

    endModal.show();

}

/**
 * Se agrega jugador-jugada al storage
 * Maximo de jugadas almacenadas = 10
 * Si ya tenemos el limite de almacenamiento, borramos el primero para luego agregar a lo ultimo de la lista.
 */
let addUserToLastPlayers = function(){
    
    if(storageLastPlayers.length > 9){

        storageLastPlayers.shift(); //Eliminar el elemento mas viejo..

    }

    storageLastPlayers.push({nombre: `${userStorageData.name}`, score: `${trivia.score}`, categoryPlayed: `${selectedCategory}`});

    localStorage.setItem('lastPlayers', JSON.stringify(storageLastPlayers));

}

/**
 * Se cierra modal de fin de juego y se muestran las categorias iniciales.
 * Se cierran modal custom de tip (en el caso de que haya quedado abierto mientras se termino el juego).
 */
let endGameModal = function(){

    endModal.hide();

    gsap.to(questionContainer, { duration: .6, ease: "power3.out", alpha:0,

        onComplete:()=>{

            questionContainer.style.display = 'none';

        }

    });
    
    categoriesContainerShow();

}

/**
 * Cierra modal de fin de juego, abre modal con los ultimos 10 jugadores.
 */
let openLastPlayerModal = function(){

    endModal.hide();

    createRankingList();

    lastPlayerModal.show();

}

/**
 * Se crea desde los datos del storage la tabla con los ultimos 10 jugadores.
 */
let createRankingList = function(){

    let list = ``;

    let ordererRanking = storageLastPlayers.sort((a, b)=> b.score - a.score);   //Ordenar de mayor puntaje a menor

    let i = 1;

    for (const item of ordererRanking) {

        list += `<tr>
            <th scope="row">${i}</th>
            <td>${item.nombre}</td>
            <td>${item.score}</td>
            <td>${item.categoryPlayed}</td>
        </tr>`;

        i++;
    }

    document.querySelector('.ranking-tbody').innerHTML = list;

}



/**
 * Crea login y eventos de sus botones
 */
function createLogin(){
    
    loginDivContainer.innerHTML = `
        
            <div class="login-container">

                <div class="login-left-container">

                    <div class="logo-container">
                        
                    </div>
                    
                    <div class="login-description">
                        Jugá, aprendé.. divertite!
                    </div>

                </div>

                <div class="login-right-container">

                    <h1 class="mt-2text-center">¿Cuanto sabes de Buenos Aires?</h1>
                    <p class="lead">Ingresá tu nombre y email</p>

                    <form id="userForm" name="userForm">

                        <div class="mb-3">

                            <label for="name" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="name" name="name" placeholder="Nombre" required>
                        
                        </div>

                        <div class="mb-3">

                            <label for="name" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" name="email" placeholder="Email" required>
                        
                        </div>
                        
                        <button type="submit" class="btn">Continuar</button>

                    </form>

                </div>

            </div>`;
     

    userFormStart = document.querySelector('#userForm');

    userFormStart.addEventListener('submit', onSubmit);

}

/**
 * 
 * Crea navbar y evento de sus botones
 */
const createNavbar = function(){

    navBarContainer.innerHTML = `
        <nav class="navbar navbar-expand-lg bg-light">
            <div class="container-fluid">

                <a class="navbar-brand" href="#">${userStorageData.name}</a>
                
                <div class="stats-container">

                    <a class="navbar-brand navbar-life-container" href="#">Vidas: <span class="navbar-life">${userStorageData.life}</span></a>

                    <a class="navbar-brand navbar-score-container" href="#">Puntos: <span class="navbar-score">${userStorageData.score}</navbar></a>

                </div>
                
                <button id="logout" class="btn btn-warning" type="btn">Salir</button>

            </div>
        </nav>
    `;

    logoutBtn = document.querySelector('#logout');

    logoutBtn.addEventListener('click', logout);
    
}

main();