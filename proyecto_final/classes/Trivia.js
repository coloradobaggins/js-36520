export class Trivia{

    life = 3;
    score = 0;
    actualQuestionsIndex = 0;
    isCorrectAnswer = false;
    
    /**
     * 
     * @param {Question[]} questions array of Question object
     */
    constructor(questions){

        this.questions = questions;

    }

    /**
     *
     * @returns {Question} actual question (Question type!)
     */
    getActualQuestion(){

        return this.questions[this.actualQuestionsIndex];

    }

    /**
     * 
     * @returns {Array} choices for actual question
     */
    getActualChoices(){

        return this.questions[this.actualQuestionsIndex].choices;

    }

    getTotalQuestions(){

        
        return this.questions.length;

    }


    getTotalChoices(){

        return this.questions.getTotalChoices;

    }

    /**
     * Once the user give an answer, increment questionIndex
     * If answer is correct, score++
     * If answer is incorrect life--
     * @param {string} answer 
     */
    checkAnswer(answer){
        
          //next index..

        if(this.getActualQuestion().isCorrect(answer)){ ////Can access to isCorrect() because getActualQuestion() returns a Question object
            
            this.score++;

            this.isCorrectAnswer = true;

        }else{

            this.loseLife();

            this.isCorrectAnswer = false;

        }
        
        //this.actualQuestionsIndex++;

        return this.isCorrectAnswer;

    }

    nextIndexQuestion(){

        this.actualQuestionsIndex++;

    }

    /**
     * 
     * @returns the tip of actual question
     */
    getActualTip(){

        return this.questions[this.actualQuestionsIndex].tip;

    }

    /**
     * If true, game ended
     * @returns {boolean}
     */
    isGameEnd(){

        //return (this.actualQuestionsIndex === this.questions.length)

        return (this.actualQuestionsIndex === this.questions.length || this.life <= 0);

    }

    
    /**
     * 
     * @returns {int} actual lifes
     */
    loseLife(){

        if(this.life != 0){ 

            this.life--;

        }

        return this.life;
        
    }


    


}
