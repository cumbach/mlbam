(function(){
  'use strict';

  // $(window).on('resize', onResize);
  //
  // function onResize(){
  //     var w = $("body").innerWidth();
  //     var fontSize = w / 60.625; // 970/60.625 = 16
  //     $("body").css('font-size', fontSize + 'px');
  // }

  $(document).ready(function() {
    // onResize();
  });

  var Gallery = function Gallery(element) {
      this.element = element;
      this.games = [];
      this.currentIndex = 0;
      // this.textFill = [];
      // this.textDelay = 2;
  };
  window['Gallery'] = Gallery;

  Gallery.prototype.init = function(opts) {
    this.gatherData();
    $(window).on("keydown", this.handleKeyEvent.bind(this));
    // this.animate();

    // this.createCards();

    // console.log('hi');
    // this.textDelay = (opts.textDelay ? opts.textDelay : this.textDelay);
  };

  Gallery.prototype.gatherData = function () {
    var that = this;
    var date = new Date();

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
        console.log(that.games);
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
      var time = $('<h6>' + game.home_time + ' ' + game.home_time_zone + '</h6>');
      metadata.append(time);
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
        window.scrollBy(-100,0);
        this.animate();
      }
    } else if (event.keyCode === 39) {
      if (this.currentIndex < this.games.length - 1) {
        event.preventDefault()
        currentCard.removeClass('active');
        this.currentIndex += 1;
        window.scrollBy(100,0);
        this.animate();
      }
    }
  };

  Gallery.prototype.animate = function () {
    var currentCard = $('#gallery .card:eq(' + this.currentIndex + ')');
    currentCard.addClass('active');
  };

})();