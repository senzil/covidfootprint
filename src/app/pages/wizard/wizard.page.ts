import { Component, OnInit } from '@angular/core';
import * as questions from './questions.json';

// Objects
import { Question } from 'src/app/objects/question';
import { Response } from 'src/app/objects/response';
import { Answer } from 'src/app/objects/answer';

// Services
import { NavigationService, NAVIGATIONPAGES } from 'src/app/services/navigation-service/navigation.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { FirestoreService } from 'src/app/services/firestore-service/firestore.service';
import { FootprintService } from 'src/app/services/footprint-service/footprint.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.page.html',
  styleUrls: ['./wizard.page.scss'],
})

export class WizardPage implements OnInit {

  public step: number;
  public currentQuestion: Question;
  private answers: Array<Response>;

  constructor(
    private navigation: NavigationService,
    private userManager: UserService,
    private firestoreManager: FirestoreService,
    private foodprintManager: FootprintService
  ) {
    this.answers = [];
    this.step = 0;
    this.setCurrentQuestion();
  }

  ngOnInit() {
  }

  private setCurrentQuestion() {
    this.currentQuestion = new Question(questions.questions[this.step].id, questions.questions[this.step].question);
    questions.questions[this.step].answers.forEach(element => {
      this.currentQuestion.addAnswer(new Answer(element.answer.text, element.answer.value, element.answer.icon, element.answer.color));
    });
  }

  async continue(answer: Answer) {
    this.answers.push(new Response(this.currentQuestion.getID(), answer.getValue()));
    const that: any =  this;
    if (this.step >= questions.questions.length - 1) {
      const footprint: number = this.foodprintManager.calcFootprint(that.answers);
      this.firestoreManager.insertResponses(this.answers, this.userManager.getUser(), new Date(), footprint);
      this.userManager.setFootprint(footprint)
      this.navigation.setRoot(NAVIGATIONPAGES.HOME);
      return;
    }
    this.step++;
    this.setCurrentQuestion();
  }

}
