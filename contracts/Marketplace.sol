pragma solidity 0.4.23;

/**
 * @notice Peer-to-peer decentralized marketplace
 */
contract Marketplace {

  /**
   * @dev Basic structure representing terms of agreement between
   *      client and supplier
   */
  struct Contract {
    /// @dev Client wants to buy goods/services and pay for them
    /// @dev Cannot be zero
    address client;

    /// @dev Supplier wants to sell goods/services and get paid for them
    /// @dev Cannot be zero
    address supplier;

    /// @dev Amount to pay to supplier by client, agreed initially
    /// @dev Cannot be zero
    uint64 initialAmount;

    /// @dev Amount actually paid by client.
    /// @dev Initially zero
    uint64 amountPaid;

    /// @dev If amount paid is less than initial amount,
    ///      supplier may reduce the amount to pay or leave it equal to initial
    /// @dev Initially zero
    uint64 amountAgreed;

    /// @dev Date the contract is signed, unix timestamp
    /// @dev Cannot be zero
    uint64 dateSigned;

    /// @dev Date the parties finished their interaction through the contract
    /// @dev Initially zero
    uint64 dateFinished;

    /// @dev Deadline for the client to pay according to the contract
    /// @dev Cannot be zero
    uint64 dueDate;

    /// @dev Contract type classifier, used to improve search
    uint32 contractType;

    /// @dev Arbitrary description of the terms and conditions,
    ///      not used in smart contract logic, may be helpful for disputes, etc.
    /// @dev May include chat history of the parties, related to agreement
    string description;
  }

  /**
   * @dev All the contracts that were properly signed and submitted into the system
   */
  Contract[] public contractsRepository;

  /**
   * @dev Track of record for each participant: list of contract IDs (index in `contractsRepository`)
   */
  mapping(address => uint256[]) contractsHistory;

}
