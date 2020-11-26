export class Answer {

    constructor(private answer: string, private value: number, private icon: string, private color: string) { }

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

    public setIcon(icon: string) {
        this.icon = icon;
    }

    public getIcon(): string {
        return this.icon;
    }


    public setColor(color: string) {
        this.color = color;
    }

    public getColor(): string {
        return this.color;
    }
}