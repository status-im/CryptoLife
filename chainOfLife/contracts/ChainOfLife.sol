pragma solidity ^0.4.24;

contract ChainOfLife {

  event StartGame(bytes32 indexed gameId, address indexed playerOne);
  event JoinGame(bytes32 indexed gameId, address indexed playerTwo, bytes32[] PlayerTwoField);
  event ResolveGame(bytes32 indexed gameId, address indexed winner, bytes32[] PLayerOneField);

  event LogHash(string message, bytes32 value);

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

  struct PlayerStats{
    uint games;
    uint wins;
  }

  mapping (bytes32 => Game) public games;
  mapping (address => PlayerStats) public players;

  function register(bytes32 _hash) public {
    games[_hash] = Game(msg.sender, 0, 0, 0, block.timestamp);
    
    emit StartGame(_hash, msg.sender);
  }

  function join(bytes32 _gameId, bytes32[] _field) public {
    Game storage game = games[_gameId];
    require(game.alice != address(0));
    require(game.state == 0);
    game.state = 1;
    game.bob = msg.sender;
    game.bobHash = keccak256(abi.encodePacked(_field));
    game.time = block.timestamp;

    emit JoinGame(_gameId, msg.sender, _field);
  }

  function resolve(bytes32 _gameId, bytes32[] _field, bool _isWinner) public {
    bytes32 fieldHash = keccak256(abi.encodePacked(_field));
    require(_gameId == fieldHash, "Alice hashes do not match");

    Game storage game = games[_gameId];
    require(msg.sender == game.alice, "Resolve message is not sent by Alice");

    address winner;
    if (_isWinner){
      winner = game.alice;
      game.state = 2;
      game.time = block.timestamp;
    } else {
      winner = game.bob;
      game.state = 3;
      game.time = block.timestamp;
    }

    emit ResolveGame(_gameId, winner, _field);
  }
}