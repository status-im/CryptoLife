import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const zero = "0x0000000000000000000000000000000000000000";

class GameList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      games: []
    }

    this.getActiveGames = this.getActiveGames.bind(this);
    this.getActiveGames();
  }

  async getActiveGames() {
    const allEvents = await this.props.eth.contract.getPastEvents('allEvents', {
      fromBlock: 0
    });
    const gameIds = allEvents.map(event => {
      return event.returnValues.gameId;
    });
    let games = await Promise.all(gameIds.map(gameId => {
      return this.props.eth.contract.methods.games(gameIds[0]).call();
    }));
    games = games.map((game, i) => {
      return {...game, gameId: gameIds[i]}
    });
    const activeGames = games.filter(game => game.alice !== zero);
    this.setState({
      games: activeGames
    });
  }

  render() {
    const gameLinks = this.state.games.map(game => {
      return (
        <div>
          <Link to={"/join/" + game.gameId}> {game.gameId} </Link>
        </div>
      );
    });

    return (
      <div>
        {gameLinks}
        <Link to='/create'>
          <button>Create New Game</button>
        </Link>

      </div>
    );
  }
}

export default GameList;