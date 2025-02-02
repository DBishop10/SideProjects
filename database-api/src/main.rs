use axum::{routing::post, Router, Json, extract::Extension};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::collections::HashMap;
use std::net::SocketAddr;
use dotenv::dotenv;
use std::env;
use tokio::net::TcpListener;

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

// async fn add_workout(
//     Json(workout): Json<Workout>,
//     Extension(db_pool): Extension<PgPool>,
// ) -> Json<String> {
//     let workouts_json = serde_json::to_value(&workout.workouts).unwrap();
    
//     let query = sqlx::query!(
//         "INSERT INTO workouts (day, workouts, notes) VALUES ($1, $2, $3)",
//         workout.day,
//         workouts_json,
//         workout.notes
//     )
//     .execute(&db_pool)
//     .await;

//     match query {
//         Ok(_) => Json("Workout added successfully".to_string()),
//         Err(err) => Json(format!("Error: {:?}", err)),
//     }
// }

async fn add_workout(Json(workout): Json<Workout>) -> Json<Workout> {
    Json(workout) // Simply return the received workout as JSON
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL not set in .env");
    // let pool = PgPool::connect(&database_url).await.expect("Failed to connect to DB");

    let app = Router::new()
        .route("/workout", post(add_workout));
        // .layer(Extension(pool));

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("Server running at {}", addr);

    let listener = TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}