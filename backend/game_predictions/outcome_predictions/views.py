from .ml.predict import predict_game
from django.shortcuts import render
from .forms import GameForm

def main(request):
  return render(request, 'home.html')

def create_game(request):
    results = None
    game = None

    if request.method == "POST":
        form = GameForm(request.POST)

        if form.is_valid():
            game = form.save()

            game_info = {
                'Team': game.team,
                'Opponent': game.opponent,
                'games_played_before_date': game.teamGamesPlayed,
                'opponent_games_played_before_date': game.opponentGamesPlayed,
                'win_pct_before_date': game.teamWinPercentage,
                'opponent_win_pct_before_date': game.opponentWinPercentage,
                'Team_SOS': game.teamSOS,
                'Opponent_SOS': game.opponentSOS,
            }

            results = predict_game(game_info)
    else:
        form = GameForm()

    return render(request, 'prediction.html', {
        'form': form,
        'game': game,
        'results': results,
    })
