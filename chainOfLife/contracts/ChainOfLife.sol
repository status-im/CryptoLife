pragma solidity ^0.4.24;

contract ChainOfLife {

  event StartGame(bytes32 indexed gameId, address indexed alice);
  event Join(bytes32 indexed gameId, address indexed bob, bytes32[] field);

  struct Game{
    address alice;
    address bob;

    bytes32 bobHash;

    // 0 only hash
    // 1 hash and bob data
    // 2 resolved alice wins 
    // 3 resolved bob wins
    // 4 challenged
    // 5 finalized
    uint256 state;
    uint256 time;
  }

  mapping (bytes32 => Game) public games;

  function register(bytes32 _hash) public {
    games[_hash] = Game(msg.sender, 0, 0, 0, 0);
    emit StartGame(_hash, msg.sender);
  }

  function join(bytes32 _gameId, bytes32[] _field) public {
    Game storage game = games[_gameId];
    require(game.alice != address(0));
    require(game.state == 0);
    emit Join(_gameId, msg.sender, _field);
    game.state = 1;
    game.bob = msg.sender;
  }

  function hashField(bytes32[] _field) pure returns (bytes32 hash) {
    // TODO: 
    return _field[0];
  }

}