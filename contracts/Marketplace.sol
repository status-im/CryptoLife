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

    /// @dev Deadline for the contract to be signed by parties
    /// @dev Cannot be zero
    uint64 signDueDate;

    /// @dev Date the contract is signed, unix timestamp
    /// @dev Cannot be zero, must be less or equal to `dueDate`
    uint64 dateSigned;

    /// @dev Date the contract is paid by the client, unix timestamp
    /// @dev Initially zero, can remain zero
    uint64 datePaid;

    /// @dev Date the parties finished their interaction through the contract
    /// @dev Initially zero
    uint64 dateFinished;

    /// @dev Time for the client to pay according to the contract
    ///      after the contract has been signed
    /// @dev Cannot be zero
    uint32 validityPeriod;

    /// @dev Time for the supplier to agree/disagree on the amount
    ///      paid by client if it differs from initial amount agreed
    /// @dev Cannot be zero
    uint32 updatePeriod;

    /// @dev Arbitrary description of the terms and conditions,
    ///      not used in smart contract logic, may be helpful for disputes, etc.
    /// @dev May include chat history of the parties, related to agreement
    /// @dev May be empty
    //string description;
  }

  /**
   * @dev All the contracts that were properly signed and submitted into the system
   */
  mapping(uint256 => Contract) public contractsRepository;

  /**
   * @dev Track of record for each participant: list of contract IDs (index in `contractsRepository`)
   */
  mapping(address => uint256[]) contractsHistory;

  /// @dev Fired in submitSignedContract()
  event ContractSubmitted(
    uint256 indexed contractId,
    address indexed client,
    address indexed supplier,
    uint64 initialAmount
  );

  /// @dev Fired in pay()
  event ContractPaid(
    uint256 indexed contractId,
    address indexed client,
    address indexed supplier,
    uint64 initialAmount,
    uint64 amountPaid
  );

  /// @dev Fired in update()
  event ContractUpdated(
    uint256 indexed contractId,
    address indexed client,
    address indexed supplier,
    uint64 initialAmount,
    uint64 amountPaid,
    uint64 amountAgreed
  );

  /**
   * @dev Constructs a message to be signed by the parties
   * @dev Requires `signDueDate` to be in the future or now
   * @dev Requires contract ID to be unique, non-existent in the system
   * @param contractId unique ID of the contract to submit
   * @param client the client
   * @param supplier the supplier
   * @param initialAmount amount to pay to supplier by client
   * @param signDueDate deadline for the contract to be signed by parties
   * @param validityPeriod time for the client to pay according to the contract
   *      after the contract has been signed
   * @param updatePeriod time for the supplier to agree/disagree on the amount
   *      paid by client if it differs from initial amount agreed
   * param description terms and conditions as a plain human readable text
   * @return keccak256 hash of the input parameters - a message to sign
   */
  function constructContract(
    uint256 contractId,
    address client,
    address supplier,
    uint64 initialAmount,
    uint64 signDueDate,
    uint32 validityPeriod,
    uint32 updatePeriod
  ) public constant returns(bytes32) {
    // validate the input
    require(contractsRepository[contractId].client == address(0));
    require(client != address(0));
    require(supplier != address(0));
    require(client != supplier);
    require(initialAmount != 0);
    require(signDueDate >= now);
    require(validityPeriod != 0);
    require(updatePeriod != 0);

    // calculate sha3 of the tightly packed variables including nonce
    return keccak256(
      contractId,
      client,
      supplier,
      initialAmount,
      signDueDate,
      validityPeriod,
      updatePeriod
    );
  }

  /**
   * @dev Submits signed contract into the system
   * @dev Requires the message to be sent by one of the parties
   *      and be signed by another one
   * @dev Requires contract ID to be unique, non-existent in the system
   * @param contractId unique ID of the contract to submit
   * @param client the client
   * @param supplier the supplier
   * @param initialAmount amount to pay to supplier by client
   * @param signDueDate deadline for the contract to be signed by parties
   * @param validityPeriod time for the client to pay according to the contract
   *      after the contract has been signed
   * @param updatePeriod time for the supplier to agree/disagree on the amount
   *      paid by client if it differs from initial amount agreed
   * param description terms and conditions as a plain human readable text
   * @param v part of the ECDSA signature - signature[128:130]
   * @param r part of the ECDSA signature - signature[0:64]
   * @param s part of the ECDSA signature - signature[64:128]
   */
  function submitSignedContract(
    uint256 contractId,
    address client,
    address supplier,
    uint64 initialAmount,
    uint64 signDueDate,
    uint32 validityPeriod,
    uint32 updatePeriod,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public {
    // extract message signature using eth_sign and EIP712 algorithms
    address ethSign = recoverEthSign(contractId, client, supplier, initialAmount, signDueDate, validityPeriod, updatePeriod, v, r, s);
    address eip712 = recoverEIP712(contractId, client, supplier, initialAmount, signDueDate, validityPeriod, updatePeriod, v, r, s);

    // validate the input and signatures
    require(msg.sender == client && (ethSign == supplier || eip712 == supplier) || msg.sender == supplier && (ethSign == client || eip712 == client));

    // create the contract data structure
    Contract memory c = Contract({
      client: client,
      supplier: supplier,
      initialAmount: initialAmount,
      amountPaid: 0,
      amountAgreed: 0,
      signDueDate: signDueDate,
      dateSigned: uint64(now),
      datePaid: 0,
      dateFinished: 0,
      validityPeriod: validityPeriod,
      updatePeriod: updatePeriod
    });

    // push contract into the storage
    contractsRepository[contractId] = c;

    // emit an event
    emit ContractSubmitted(contractId, client, supplier, initialAmount);
  }

  /**
   * @notice Allows client to pay to supplier according to the contract
   *
   * @param contractId ID of the contract previously submitted into the system
   * @param amount amount client willing to pay
   */
  // TODO: use Dai token instead of ETH
  function pay(uint256 contractId, uint64 amount) public payable {
    // check the message has exactly an amount specified
    require(amount == msg.value);

    // get a reference to the contract in storage
    Contract storage c = contractsRepository[contractId];

    // check that sender is a client (ensures the contract exists)
    require(msg.sender == c.client);

    // check that the contract is not already paid
    require(c.amountPaid == 0 && c.datePaid == 0);

    // check that the contract didn't expire
    require(c.dateSigned + c.validityPeriod >= now);

    // update amount paid
    c.amountPaid = amount;

    // update date paid
    c.datePaid = uint64(now);

    // transfer the amount to the supplier
    c.supplier.transfer(amount);

    // if the amount paid is what was previously agreed
    // we're done with this contract
    if(c.amountPaid == c.amountAgreed) {
      // save it into the client history
      contractsHistory[c.client].push(contractId);

      // save it into the supplier history
      contractsHistory[c.supplier].push(contractId);
    }

    // emit an event
    emit ContractPaid(contractId, c.client, c.supplier, c.initialAmount, amount);
  }

  /**
   * @notice Allows supplier to change contract terms (reduce the amount
   *      to pay or leave it equal to initial) in case if client didn't pay
   *      an amount initially agreed between the parties
   *
   * @param contractId ID of the contract previously submitted into the system
   * @param amount amount supplier willing to update amount agreed to
   */
  function update(uint256 contractId, uint64 amount) public {
    // get a reference to the contract in storage
    Contract storage c = contractsRepository[contractId];

    // check that sender is a supplier (ensures the contract exists)
    require(msg.sender == c.supplier);

    // check the contract is already paid partially or not paid in time
    require(c.datePaid != 0 && c.amountPaid < c.amountAgreed || c.dateSigned + c.validityPeriod < now);

    // check the contract has not expired
    require(c.datePaid + c.updatePeriod >= now || c.dateSigned + c.validityPeriod + c.updatePeriod >= now);

    // check contract is not finished already
    require(c.dateFinished == 0);

    // check the amount is in allowed bounds - between initial amount and amount paid
    require(amount <= c.initialAmount && amount >= c.amountPaid);

    // update amount agreed
    c.amountAgreed = amount;

    // update date finished
    c.dateFinished = uint64(now);

    // save contract into the client history
    contractsHistory[c.client].push(contractId);

    // save contract into the supplier history
    contractsHistory[c.supplier].push(contractId);

    // emit an event
    emit ContractUpdated(contractId, c.client, c.supplier, c.initialAmount, c.amountPaid, amount);
  }

  /**
   * @dev Used to verify a transfer order signature according to eth_sign
   * @dev Returns the address which signed the order
   * @dev See https://github.com/paritytech/parity-ethereum/issues/8127
   * @dev See https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign
   * @param contractId unique ID of the contract to submit
   * @param client the client
   * @param supplier the supplier
   * @param initialAmount amount to pay to supplier by client
   * @param signDueDate deadline for the contract to be signed by parties
   * @param validityPeriod time for the client to pay according to the contract
   *      after the contract has been signed
   * @param updatePeriod time for the supplier to agree/disagree on the amount
   *      paid by client if it differs from initial amount agreed
   * param description terms and conditions as a plain human readable text
   * @param v part of the ECDSA signature - signature[128:130]
   * @param r part of the ECDSA signature - signature[0:64]
   * @param s part of the ECDSA signature - signature[64:128]
   * @return recovered address of the message signer
   */
  function recoverEthSign(
    uint256 contractId,
    address client,
    address supplier,
    uint64 initialAmount,
    uint64 signDueDate,
    uint32 validityPeriod,
    uint32 updatePeriod,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public constant returns (address _signer) {
    // valid values are 27 and 28, some implementations may return 0 and 1 instead
    v = v < 27 ? v + 27 : v;

    // eth_sign, https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign
    return ecrecover(keccak256("\x19Ethereum Signed Message:\n32", constructContract(contractId, client, supplier, initialAmount, signDueDate, validityPeriod, updatePeriod)), v, r, s);
  }

  /**
   * @dev Used to verify a transfer order signature according to EIP712
   * @dev Returns the address which signed the message
   * @param contractId unique ID of the contract to submit
   * @param client the client
   * @param supplier the supplier
   * @param initialAmount amount to pay to supplier by client
   * @param signDueDate deadline for the contract to be signed by parties
   * @param validityPeriod time for the client to pay according to the contract
   *      after the contract has been signed
   * @param updatePeriod time for the supplier to agree/disagree on the amount
   *      paid by client if it differs from initial amount agreed
   * param description terms and conditions as a plain human readable text
   * @param v part of the ECDSA signature - signature[128:130]
   * @param r part of the ECDSA signature - signature[0:64]
   * @param s part of the ECDSA signature - signature[64:128]
   * @return recovered address of the message signer
   */
  function recoverEIP712(
    uint256 contractId,
    address client,
    address supplier,
    uint64 initialAmount,
    uint64 signDueDate,
    uint32 validityPeriod,
    uint32 updatePeriod,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public constant returns (address _signer) {
    // valid values are 27 and 28, some implementations may return 0 and 1 instead
    v = v < 27 ? v + 27 : v;

    // EIP712, https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md
    return ecrecover(constructContract(contractId, client, supplier, initialAmount, signDueDate, validityPeriod, updatePeriod), v, r, s);
  }

}
