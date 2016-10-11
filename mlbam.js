(function(){
  'use strict';

  var Gallery = function Gallery(element) {
      this.element = element;
      this.games = [];
      this.currentIndex = 0;
  };
  window['Gallery'] = Gallery;

  Gallery.prototype.init = function(opts) {
    this.addTitle();
    this.gatherData();
    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  Gallery.prototype.addTitle = function () {
    var date = new Date();
    $('body').append('<h2>MLB Game Information for<br/>' + (date.getMonth()+1) + '/' + date.getDay() + '/' + (date.getYear()+1900) + '</h2>');
  };

  Gallery.prototype.gatherData = function () {
    var that = this;
    var date = new Date();

    // SHOULD BE USING getDate() HERE, BUT THE THUMBNAILS WERE LOADING WITH 404 ERROR AND NOT MANY GAMES
    var day = date.getDay();
    if (day < 10) {
      day = '0' + day.toString();
    } else {
      day = day.toString();
    }

    var month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month.toString();
    } else {
      month = month.toString();
    }

    var year = date.getYear() + 1900;
    year = year.toString();

    $.ajax({
      url: 'http://gdx.mlb.com/components/game/mlb/year_' + year + '/month_' + month + '/day_' + day + '/master_scoreboard.json',
      success: function (mlb) {
        that.games = mlb.data.games.game;
        that.createCards();
      }
    });
  };

  Gallery.prototype.createCards = function () {
    this.games.forEach(function(game){

      var card = $('<div>');
      card.addClass('card');

      var header = $('<h3>' + game.away_team_name + '<br/>@<br/>' + game.home_team_name + '</h3>');
      card.append(header);

      var panel = $('<div>');
      panel.addClass('panel');
      panel.css('background-image', 'url(' + game.video_thumbnail + ')');
      card.append(panel);

      var metadata = $('<div>');
      metadata.addClass('metadata');
      var time = $('<h4 class=time>' + game.home_time + ' ' + game.home_time_zone + '</h4>');
      var homeRecord = $('<h5 class=home-record>' + game.home_team_name + ': ' + game.home_win + '-' + game.home_loss + '</h5>');
      var awayRecord = $('<h5 class=away-record>' + game.away_team_name + ': ' + game.away_win + '-' + game.away_loss + '</h5>');
      metadata.append(time);
      metadata.append(homeRecord);
      metadata.append(awayRecord);
      card.append(metadata);

      this.element.append(card);

    }.bind(this));
    this.animate();
  };

  Gallery.prototype.handleKeyEvent = function (event) {
    var currentCard = $('.active');

    if (event.keyCode === 37) {
      if (this.currentIndex != 0) {
        event.preventDefault()
        currentCard.removeClass('active');
        this.currentIndex -= 1;
        window.scrollBy(-200,0);
        this.animate();
      }
    } else if (event.keyCode === 39) {
      if (this.currentIndex < this.games.length - 1) {
        event.preventDefault()
        currentCard.removeClass('active');
        this.currentIndex += 1;
        window.scrollBy(200,0);
        this.animate();
      }
    }
  };

  Gallery.prototype.animate = function () {
    var currentCard = $('#gallery .card:eq(' + this.currentIndex + ')');
    currentCard.addClass('active');
  };


})();
