import {Question} from '../classes/Question.js';


const loadQuestions = async ()=>{

    try{

        let questions = await fetch('/data/triviaData.json');
        let questionsJson = await questions.json();

        let mappedQuestions = questionsJson.map(q => new Question(q.question, q.choices, q.answer, q.category, q.tip));

        return mappedQuestions;

    }catch(err){

        throw `Error al cargar preguntas.. ${err}`;

    }


}

export {loadQuestions};