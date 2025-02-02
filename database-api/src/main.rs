use axum::{routing::post, Router, Json};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::net::SocketAddr;
use dotenv::dotenv;
use std::env;
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
struct WorkoutEntry {
    amount: i32,
    unit: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Workout {
    day: String,
    workouts: HashMap<String, WorkoutEntry>,
    notes: Option<String>,    
}

async fn add_workout(
    Json(workout): Json<Workout>,
    db_pool: axum::extract::Extension<PgPool>,
) -> Json<String> {
    let query = sqlx::query!(
        "INSERT INTO workouts (user_id, workout_type, duration, calories_burned) VALUES ($1, $2, $3, $4)",
        workout.user_id,
        workout.workout_type,
        workout.duration,
        workout.calories_burned
    )
    .execute(db_pool.as_ref())
    .await;

    match query {
        Ok(_) => Json("Workout added successfully".to_string()),
        Err(err) => Json(format!("Error: {:?}", err)),
    }
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL not set in .env");
    let pool = PgPool::connect(&database_url).await.expect("Failed to connect to DB");

    let app = Router::new()
        .route("/workout", post(add_workout))
        .layer(axum::extract::Extension(pool));

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("Server running at {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
