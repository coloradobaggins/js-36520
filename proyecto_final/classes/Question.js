export class Question{

    /**
     * 
     * @param {string} text Text of the question 
     * @param {string[]} choices Array with choices of this question
     * @param {string} correctAnswer The correct answser
     */
    constructor(text, choices, correctAnswer, category, tip){

        this.text = text;
        this.choices = choices;
        this.correctAnswer = correctAnswer;
        this.category = category;
        this.tip = tip;

    }

    /**
     * 
     * @param {string} choice 
     * @returns {boolean}
     */
    isCorrect(choice){

        return (this.correctAnswer === choice)

    }



    getChoices(){

        return this.choices;

    }

    getTotalChoices(){

        return this.choices.length;

    }


}