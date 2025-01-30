import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-daily-workout',
  templateUrl: './daily-workout.component.html',
  imports: [CommonModule],
  standalone: true,
})
export class DailyWorkoutComponent {
  pushup_min = 100;
  situp_min = 100;
  squat_min = 100;
  run_min = 2;

  // Signals for today's workout
  todays_workouts = {
    pushup: signal(0),
    situp: signal(0),
    squat: signal(0),
    run: signal(0),
  };

  // Signal for historical data
  workoutHistory = signal<{ date: string; workouts: any }[]>([]);

  constructor(private http: HttpClient) {
    this.loadWorkoutHistory(); // Load history on component initialization
  }

  increment(workout: keyof typeof this.todays_workouts) {
    this.todays_workouts[workout].set(this.todays_workouts[workout]() + 1);
  }

  decrement(workout: keyof typeof this.todays_workouts) {
    if (this.todays_workouts[workout]() > 0) {
      this.todays_workouts[workout].set(this.todays_workouts[workout]() - 1);
    }
  }

  loadWorkoutHistory() {
    this.http.get<any[]>('./assets/workout-history.json').subscribe((data) => {
      this.workoutHistory.set(data);
    });
  }

  // Save today's workout to the workout history
  saveWorkout() {
    // Get today's date in local timezone
    const today = new Date();
    const localDate = today.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
  
    const newEntry = {
      date: localDate,
      workouts: {
        pushup: this.todays_workouts.pushup(),
        situp: this.todays_workouts.situp(),
        squat: this.todays_workouts.squat(),
        run: this.todays_workouts.run(),
      },
    };
  
    // Update history
    const updatedHistory = [...this.workoutHistory(), newEntry];
    this.workoutHistory.set(updatedHistory);
  
    // Reset today's workout
    Object.keys(this.todays_workouts).forEach((key) =>
      this.todays_workouts[key as keyof typeof this.todays_workouts].set(0)
    );
  }

  downloadWorkoutHistory() {
    const blob = new Blob([JSON.stringify(this.workoutHistory(), null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, 'workout-history.json');
  }
}
