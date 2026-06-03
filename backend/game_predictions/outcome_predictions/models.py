from django.db import models

class Game(models.Model):
  team = models.CharField(max_length=255)
  teamGamesPlayed =  models.IntegerField(null=True)
  teamWinPercentage = models.FloatField()
  teamSOS = models.FloatField()

  opponent = models.CharField(max_length=255)
  opponentGamesPlayed = models.IntegerField(null=True)
  opponentWinPercentage = models.FloatField()
  opponentSOS = models.FloatField()