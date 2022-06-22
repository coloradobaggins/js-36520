let soundDigital;

let soundCorrect;

let soundIncorrect;

let soundSelection;


(()=>{

    soundDigital = new Howl({src: ['sounds/digital.wav']});

    soundCorrect = new Howl({ src: ['sounds/correct.mp3']});
    
    soundIncorrect = new Howl({ src: ['sounds/wrong.wav']});

    soundSelection = new Howl({ src: ['sounds/selection.wav']});


})();

export {soundDigital, soundCorrect, soundIncorrect, soundSelection};

