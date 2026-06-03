import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "trained_models"

lr_model = joblib.load(MODEL_DIR / "logistic_regression.joblib")
rf_model = joblib.load(MODEL_DIR / "random_forest.joblib")
model_columns = joblib.load(MODEL_DIR / "model_columns.joblib")


def predict_game(game_info):
    new_game = pd.DataFrame([game_info])

    new_game_encoded = pd.get_dummies(
        new_game,
        columns=['Team', 'Opponent'],
        drop_first=True
    )

    new_game_encoded = new_game_encoded.reindex(
        columns=model_columns,
        fill_value=0
    )

    lr_prediction = lr_model.predict(new_game_encoded)[0]
    rf_prediction = rf_model.predict(new_game_encoded)[0]

    lr_probability = lr_model.predict_proba(new_game_encoded)[0]
    rf_probability = rf_model.predict_proba(new_game_encoded)[0]

    return {
        'logistic_prediction': lr_prediction,
        'random_forest_prediction': rf_prediction,
        'logistic_probability': lr_probability,
        'random_forest_probability': rf_probability,
        'classes': lr_model.classes_,
    }