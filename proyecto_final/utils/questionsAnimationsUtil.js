/**
 * fade in animation to question container (question title and choices)
 */
 let questionsAnimationFadeIn = function(elmt){

    gsap.to(elmt, { duration: .6, ease: "power3.out", alpha:1 });
    
}

/**
 * fade out animation to question container (question title and choices)
 */
let questionsAnimationFadeOut = function(elmt, callback1, callback2){

    gsap.to(elmt, { duration: .6, ease: "power3.out", alpha:0, 
        onComplete:()=>{

            callback1();

            callback2(elmt);

        }
    });

}

export { questionsAnimationFadeIn, questionsAnimationFadeOut }