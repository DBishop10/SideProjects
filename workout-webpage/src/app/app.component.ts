import { Component } from '@angular/core';
import { DailyWorkoutComponent } from './daily-workout/daily-workout.component';

@Component({
  selector: 'app-root',
  imports: [DailyWorkoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'solo-leveling-workout';
}
