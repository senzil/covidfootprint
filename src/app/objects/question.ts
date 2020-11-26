import { Answer } from './answer';

export class Question {
    private answers: Array<Answer>;

    constructor(private id: string, private question: string) {
        this.answers = new Array<Answer>();
    }

    public setID(id: string) {
        this.id = id;
    }

    public getID(): string {
        return this.id;
    }

    public setQuestion(question: string) {
        this.question = question;
    }

    public getQuestion(): string {
        return this.question;
    }


    public addAnswer(answer: Answer) {
        this.answers.push(answer);
    }

    public getAnswers(): Array<Answer> {
        return this.answers;
    }

    public clearAnswers() {
        this.answers = new Array<Answer>();
    }
}
