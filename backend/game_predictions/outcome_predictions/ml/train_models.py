import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn import metrics
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]


datadir = 'data/'
datafile = BASE_DIR / "data" / "Basketball-SOS.csv"
data = pd.read_csv(datafile)

data['games_played_before_date'] = data['wins_before_date'] + data['losses_before_date']
data['opponent_games_played_before_date'] = data['opponent_wins_before_date'] + data['opponent_losses_before_date']
data['win_pct_before_date'] = np.where(
    data['games_played_before_date'] > 0,
    data['wins_before_date'] / data['games_played_before_date'],
    0
)
data['opponent_win_pct_before_date'] = np.where(
    data['opponent_games_played_before_date'] > 0,
    data['opponent_wins_before_date'] / data['opponent_games_played_before_date'],
    0
)
data['Win-Loss'] = np.where((data['Team_Points'] > data['Opp_Points']) , 'Win', 'Loss')

features = ['Team', 'Opponent', 'games_played_before_date', 'opponent_games_played_before_date', 'win_pct_before_date', 'opponent_win_pct_before_date', 'Team_SOS', 'Opponent_SOS']
x = data [features]
y = data ['Win-Loss']
x = pd.get_dummies(x, columns=['Team', 'Opponent'], drop_first=True)

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=0)

logreg = LogisticRegression(C=1e3, max_iter=5000)
lr_model = logreg.fit(x_train, y_train)

lr_y_pred_train = lr_model.predict(x_train)
lr_y_pred_test = lr_model.predict(x_test)

rf_model = RandomForestClassifier(max_depth=8, random_state=0)
rf_model.fit(x_train, y_train)

rf_y_pred_train = rf_model.predict(x_train)
rf_y_pred_test = rf_model.predict(x_test)

model_dir = BASE_DIR / "trained_models"
model_dir.mkdir(exist_ok=True)

joblib.dump(lr_model, model_dir / "logistic_regression.joblib")
joblib.dump(rf_model, model_dir / "random_forest.joblib")
joblib.dump(x_train.columns.tolist(), model_dir / "model_columns.joblib")