import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

interface Workout {
  amount: number;
  minRequired: number;
  unit: string;
}

@Component({
  selector: 'app-daily-workout',
  templateUrl: './daily-workout.component.html',
  imports: [CommonModule],
  standalone: true,
})
export class DailyWorkoutComponent {
  // Using Record for workouts with type as key
  workouts = signal<Record<string, Workout>>({
    pushup: { amount: 0, minRequired: 100, unit: 'reps' },
    situp: { amount: 0, minRequired: 100, unit: 'reps' },
    squat: { amount: 0, minRequired: 100, unit: 'reps' },
    run: { amount: 0, minRequired: 2, unit: 'miles' }
  });

  // Signal for historical data
  workoutHistory = signal<{ day: string; workouts: Record<string, Workout> }[]>([]);

  constructor(private http: HttpClient) {
    this.loadWorkoutHistory(); // Load history on component initialization
  }

  increment(workoutType: string) {
    const currentWorkout = this.workouts()[workoutType];
    if (currentWorkout) {
      this.workouts.set({
        ...this.workouts(),
        [workoutType]: { ...currentWorkout, amount: currentWorkout.amount + 1 }
      });
    }
  }

  decrement(workoutType: string) {
    const currentWorkout = this.workouts()[workoutType];
    if (currentWorkout && currentWorkout.amount > 0) {
      this.workouts.set({
        ...this.workouts(),
        [workoutType]: { ...currentWorkout, amount: currentWorkout.amount - 1 }
      });
    }
  }

  addWorkout(type: string, minRequired: number, unit: string) {
    this.workouts.set({
      ...this.workouts(),
      [type]: { amount: 0, minRequired, unit }
    });
  }

  loadWorkoutHistory() {
    this.http.get<any[]>('./assets/workout-history.json').subscribe((data) => {
      this.workoutHistory.set(data);
    });
  }

  downloadWorkoutHistory() {
    const blob = new Blob([JSON.stringify(this.workoutHistory(), null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, 'workout-history.json');
  }
}