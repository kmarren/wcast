from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .ml.predict import predict_game

@csrf_exempt
def predict_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    game_info = {
        "Team": request.POST["team"],
        "Opponent": request.POST["opponent"],
        "games_played_before_date": int(request.POST["teamGamesPlayed"]),
        "opponent_games_played_before_date": int(request.POST["opponentGamesPlayed"]),
        "win_pct_before_date": float(request.POST["teamWinPercentage"]),
        "opponent_win_pct_before_date": float(request.POST["opponentWinPercentage"]),
        "Team_SOS": float(request.POST["teamSOS"]),
        "Opponent_SOS": float(request.POST["opponentSOS"]),
    }

    results = predict_game(game_info)

    return JsonResponse({
        "logistic_prediction": str(results["logistic_prediction"]),
        "random_forest_prediction": str(results["random_forest_prediction"]),
        "classes": [str(c) for c in results["classes"]],
        "logistic_probability": [float(p) for p in results["logistic_probability"]],
        "random_forest_probability": [float(p) for p in results["random_forest_probability"]],
    })