
//Anima y muestra stats
let animationShowScoreStats = (elmt)=>{

    elmt.style.display = 'block';

    gsap.to(elmt, { duration: .4, ease: "power3.out", alpha:1, 
        onComplete:()=>{

        }
    });

}

//Anima y oculta stats
let animationHideScoreStats = (elmt)=>{
    
    gsap.to(elmt, { duration: .4, ease: "power3.out", alpha:0, 
        onComplete:()=>{

            elmt.style.display = 'none';

        }
    });

}


/**
 * Animacion shake
 * @param {*} elmt to shake
 */
let animationShake = (elmt)=>{

    gsap.fromTo(elmt, {x:-20}, {x:20, clearProps:"x", repeat:4, duration:.05});
    
}

//Mostrar overlay para modal tip
const showOverlay = function(elmt){

    elmt.style.display = "block";

    gsap.to(elmt, {duration: .2, ease: "power3.in", alpha:.7});

}

//Ocultar overlay para modal tip
const hideOverlay = function(elmt){

    gsap.to(elmt, {duration: .3, ease: "power3.out", alpha:0, 
        onComplete:function(){
            elmt.style.display = "none";
        }
    });

}


export { 
    animationShowScoreStats, 
    animationHideScoreStats, 
    animationShake, 
    showOverlay, 
    hideOverlay
};