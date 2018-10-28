pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract ChainOfLife {
  using SafeMath for uint256;

  event StartGame(bytes32 indexed gameId, address indexed playerOne);
  event JoinGame(bytes32 indexed gameId, address indexed playerTwo, bytes32[] PlayerTwoField);
  event ResolveGame(bytes32 indexed gameId, address indexed winner, bytes32[] PLayerOneField);
  event FinalizeGame(bytes32 indexed gameId, address indexed winner, string message);
  event CancelGame(bytes32 indexed gameId);

  uint256 timeout;
  uint256 stake;
  ERC20 token;
  address owner;

  struct Game{
    address alice;
    address bob;

    bytes32 bobHash;

    // 0 only hash
    // 1 hash and bob data
    // 2 resolved alice wins 
    // 3 resolved bob wins
    // 4 resolved draw
    // 5 challenged
    uint256 state;
    uint256 time;
  }

  struct PlayerStats{
    uint256 games;
    uint256 wins;
  }

  mapping (bytes32 => Game) public games;
  mapping (address => PlayerStats) public players;

  constructor (uint _timeout, uint256 _stake, address _tokenAddr) public {
    owner = msg.sender;
    timeout = _timeout;
    stake = _stake;
    token = ERC20(_tokenAddr);
  }

  function setTokenAddress (address _tokenAddr) public {
    require(msg.sender == owner, "Not called by contract owner");
    token = ERC20(_tokenAddr);
  }
  
  function register(bytes32 _hash) public {
    require(token != address(0) || stake == 0, "Token contract address not set");
    require(games[_hash].alice == address(0), "Game with the same initial field already exists");
    games[_hash] = Game(msg.sender, 0, 0, 0, block.number);
    if (stake > 0) token.transferFrom(msg.sender,address(this),stake);
    
    emit StartGame(_hash, msg.sender);
  }

  function join(bytes32 _gameId, bytes32[] _field) public {
    require(token != address(0) || stake == 0, "Token contract address not set");
    Game storage game = games[_gameId];
    require(game.alice != address(0), "Game doesn't exist");
    require(game.state == 0, "Wrong game state");
    game.state = 1;
    game.bob = msg.sender;
    game.bobHash = keccak256(abi.encodePacked(_field));
    game.time = block.number;
    if (stake > 0) token.transferFrom(msg.sender,address(this),stake);
    
    emit JoinGame(_gameId, msg.sender, _field);
  }

  function resolve(bytes32 _gameId, bytes32[] _field, uint256 _outcome) public {  //_outcome: 0 - Alice wins; 1 - Bob wins; 2 - Draw
    require(token != address(0) || stake == 0, "Token contract address not set");
    require(_outcome == 0 || _outcome == 1 || _outcome == 2, "Not calid outcome");
    bytes32 fieldHash = keccak256(abi.encodePacked(_field));
    require(_gameId == fieldHash, "Alice hashes do not match");
    Game storage game = games[_gameId];
    require(msg.sender == game.alice, "Resolve message is not sent by player 1 or game doesn't exist");
    require(game.state == 1, "Wrong game state");

    address winner;
    if (_outcome == 0){
      winner = game.alice;
      game.state = 2;      
    } 
    if (_outcome == 1) {
      winner = game.bob;
      game.state = 3;
    }
    if (_outcome == 2) {
      winner = address(0);
      game.state = 4;
    } 
    game.time = block.number;

    emit ResolveGame(_gameId, winner, _field);
  }

  function finalize(bytes32 _gameId) public {
    require(token != address(0) || stake == 0, "Token contract address not set");
    Game storage game = games[_gameId];
    if(game.state == 0 && msg.sender == game.alice) {
      games[_gameId] = Game(0,0,0,0,0);
      if (stake > 0) token.transfer(msg.sender,stake);
      emit CancelGame(_gameId);
      return;      
    }

    require(block.number > game.time + timeout * 12, "Timeout has not been reached");
    require(game.state == 1 || game.state == 2 || game.state == 3 || game.state == 4, "Wrong game state");
    require(msg.sender == game.alice || msg.sender == game.bob, "Finalize message not send sent by player");

    address winner;
    string memory message;
    if(game.state == 1) {
      winner = game.bob;
      players[game.alice].games.add(1);
      players[game.bob].games.add(1);
      players[game.bob].wins.add(1);
      message = "Player 2 wins due to Player 1 inactivity";
    }
    if(game.state == 2) {
      winner = game.alice;
      players[game.alice].games.add(1);
      players[game.bob].games.add(1);
      players[game.alice].wins.add(1);
      message = "Player 1 wins";
    }
    if(game.state == 3) {
      winner = game.bob;
      players[game.alice].games.add(1);
      players[game.bob].games.add(1);
      players[game.bob].wins.add(1);
      message = "Player 2 wins";
    }
    if(game.state == 4) {
      address bob = game.bob;
      winner = game.alice;
      players[game.alice].games.add(1);
      players[game.bob].games.add(1);
      message = "Draw";
      games[_gameId] = Game(0,0,0,0,0);
      if (stake > 0) token.transfer(winner,stake);
      if (stake > 0) token.transfer(bob,stake);

      emit FinalizeGame(_gameId, address(0),message);
      return; 
    }
    games[_gameId] = Game(0,0,0,0,0);
    if (stake > 0) token.transfer(winner,stake * 2);

    emit FinalizeGame(_gameId, winner,message);    
  }
}