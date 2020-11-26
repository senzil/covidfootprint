export class Response {

    constructor(private answer: string, private value: number) {}

    public setAnswer(answer: string) {
        this.answer = answer;
    }

    public getAnswer(): string {
        return this.answer;
    }

    public setValue(value: number) {
        this.value = value;
    }

    public getValue(): number {
        return this.value;
    }
}