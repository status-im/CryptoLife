# deployed to Rinkeby network at address 0xa2bab40fe7cee82dcb92302b1521ffc03e06e2fd
pragma solidity ^0.4.0;
contract Greeter {

    string greeting = "Hello from contract";

    function greet() public constant returns (string) {
        return greeting;
    }

}