import React from 'react';
import ReactDOM from 'react-dom';

import { scroller, scrollSpy } from 'react-scroll';

var Spinner = require('react-spinkit');

class Games extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameResults: [],
      isLoading: true,
      isScrolling: false
    };
  }

  componentWillUpdate = (nextProps, nextState) => {
    if (this.state.isScrolling !== nextState.isScrolling) {
      this.toggleScrolling(nextState.isScrolling);
    }
  };

  toggleScrolling = isEnable => {
    if (isEnable) {
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
    } else {
      window.removeEventListener('mousemove', this.onMouseMove);
    }
  };

  onScroll = event => {};

  onMouseMove = event => {
    const { clientX, scrollLeft, scrollTop, clientY } = this.state;
    this._scroller.scrollLeft = scrollLeft - clientX + event.clientX;
    this._scroller.scrollTop = scrollTop - clientY + event.clientY;
  };

  onMouseUp = () => {
    this.setState({
      isScrolling: false,
      scrollLeft: 0,
      scrollTop: 0,
      clientX: 0,
      clientY: 0
    });
  };

  onMouseDown = event => {
    const { scrollLeft, scrollTop } = this._scroller;
    this.setState({
      isScrolling: true,
      scrollLeft,
      scrollTop,
      clientX: event.clientX,
      clientY: event.clientY
    });
  };

  attachScroller = scroller_a => {
    this._scroller = ReactDOM.findDOMNode(scroller_a);
  };

  componentDidMount() {
    fetch('/api/games')
      .then(results => {
        return results.json();
      })
      .then(data => {
        let gameResults = data.games.gameData.map(game => {
          const isHomeGame = game.homeGame === true;
          const hasLogo = game.opponentLogo !== '';
          const hasTime = game.gameTime !== '';
          const isCompositeSchedule = data.compositeSchedule;

          return (
            <div
              id={game.gameId}
              name={game.gameId}
              key={game.gameId}
              className="schedule-grid-row row"
            >
              {isCompositeSchedule ? (
                <div className="schedule-grid-item grid-sport flexcontainer">
                  <p className="rotate">{game.sport}</p>
                </div>
              ) : (
                ''
              )}
              <div className="schedule-grid-item grid-logo">
                {hasLogo ? (
                  <img src={game.opponentLogo} alt="" />
                ) : (
                  <img src="/uk_default.png" alt="" />
                )}
              </div>
              <div className="schedule-grid-item grid-game-info">
                <p className="schedule-gametime">
                  <span className="day">{game.gameDay}</span>
                  {hasTime ? <span className="time">{game.gameTime}</span> : ''}
                </p>
                <p className="schedule-opponent">
                  {isHomeGame ? (
                    <span className="home-away home-game">vs</span>
                  ) : (
                    <span className="home-away away-game">at</span>
                  )}
                  <span className="schedule-opponent-name">
                    {game.opponentName}
                  </span>
                </p>
                <p className="schedule-promo">{game.gamePromoName}</p>
              </div>
              <div className="schedule-grid-item grid-location">
                <p className="location">{game.location}</p>
                <p className="provider">{game.tvProvider}</p>
              </div>
              <div className="schedule-grid-item grid-results flexcontainer">
                <span>{game.gameResult}</span>
              </div>
            </div>
          );
        });
        this.setState({ gameResults: gameResults, isLoading: false });
        scroller.scrollTo(data.games.upcomingGame);
      });
  }

  componentWillUnmount() {
    scrollSpy.unmount();
    scroller.unmount();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className="spinner-container">
          <Spinner name="folding-cube" />
        </div>
      );
    }

    return (
      <div className="App">
        <div id="schedules-main">
          <div className="container-fluid">
            <div className="row">
              <div className="schedule-content col-sm-12">
                <div className="schedule-wrapper clearfix">
                  <div
                    id="schedules-grid"
                    className="container-fluid scroller_a"
                    ref={this.attachScroller}
                    onMouseDown={this.onScroll}
                    onScroll={this.onMouseMove}
                  >
                    {this.state.gameResults}
                  </div>

                  {/* <DragScroll
                    height={1080}
                    width={1920}
                    id="schedules-grid"
                    className="container-fluid"
                  >
                    {this.state.gameResults}
                  </DragScroll> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Games;
