pragma solidity ^0.4.25;

// File: openzeppelin-solidity/contracts/ownership/Ownable.sol

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address private _owner;

  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() internal {
    _owner = msg.sender;
    emit OwnershipTransferred(address(0), _owner);
  }

  /**
   * @return the address of the owner.
   */
  function owner() public view returns(address) {
    return _owner;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(isOwner());
    _;
  }

  /**
   * @return true if `msg.sender` is the owner of the contract.
   */
  function isOwner() public view returns(bool) {
    return msg.sender == _owner;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipTransferred(_owner, address(0));
    _owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    _transferOwnership(newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0));
    emit OwnershipTransferred(_owner, newOwner);
    _owner = newOwner;
  }
}

// File: openzeppelin-solidity/contracts/math/SafeMath.sol

/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, reverts on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    uint256 c = a * b;
    require(c / a == b);

    return c;
  }

  /**
  * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b > 0); // Solidity only automatically asserts when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  /**
  * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b <= a);
    uint256 c = a - b;

    return c;
  }

  /**
  * @dev Adds two numbers, reverts on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a);

    return c;
  }

  /**
  * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
  * reverts when dividing by zero.
  */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0);
    return a % b;
  }
}

// File: contracts/Salaries.sol

//pragma experimental ABIEncoderV2;



contract Salaries is Ownable {
    using SafeMath for uint256;

    /**
     * Events
     */

    event SalaryStarted(address payer, address payee);
    event SalaryClosed(address payer, address payee);
    event SalaryRedeemed(address payer, address payee);

    /**
     * Structs
     */

    // strong assumptions on block intervals
    struct Timeframe {
        uint256 start;
        uint256 close;
    }

    struct Rate {
        uint256 price;
        uint256 interval;
    }

    struct Salary {
        SalaryState state;
        address payer;
        address payee;
        uint256 balance;
        Timeframe timeframe;
        Rate rate;
    }

    /**
     * Enums
     */
    enum SalaryState { NonExistent, Salarying, NonSalarying, Finalized }

    /**
     * Storage
     */
    uint256 public salaryNonce;
    mapping (uint256 => Salary) public salaries;

    constructor()
    public
    {
        salaryNonce = 1;
    }

    /**
     * Modifiers
     */
    modifier isSalarying(uint256 id)
    {
        // make sure that the state is indeed `.Salarying` when it should be
        Salary memory salary = salaries[id];
        if (salary.state != SalaryState.Salarying && block.number >= salary.timeframe.start && block.number <= salary.timeframe.close) {
            salaries[id].state = SalaryState.Salarying;
        }
        require(salary.state == SalaryState.Salarying, "salary must be active");
        _;
    }

    modifier isNonSalarying(uint256 id)
    {
        // make sure that the state is indeed `.NonSalarying` when it should be
        Salary memory salary = salaries[id];
        if (salary.state != SalaryState.NonSalarying && block.number >= salary.timeframe.close) {
            salaries[id].state = SalaryState.NonSalarying;
        }
        require(salary.state == SalaryState.NonSalarying, "salary must not be active");
        _;
    }

    modifier isNonNilSalary(uint256 id)
    {
        require(id < salaryNonce, "id is incorrect");
        //require(salarys[salaryId] != nil); // gotta research what nil is in solidity
        _;
    }

    modifier onlyPayer(uint256 id) {
        require(salaries[id].payer == msg.sender, "only the payer can call this function");
        _;
    }

    modifier onlyPayee(uint256 id) {
        require(salaries[id].payee == msg.sender, "only the payee can call this function");
        _;
    }

    /**
     * Functions
     */

    // @param salaryId      the id of the salary
    function currentBilling(uint256 id)
    isNonNilSalary(id)
    isSalarying(id)
    public
    returns (uint256 billing)
    {

        // p * ((c - s) / i)
        Salary memory salary = salaries[id];
        return ((block.number - salary.timeframe.start) / salary.rate.interval) * salary.rate.price;
    }

    // @param id      the id of the salary
    function stateOf(uint256 id)
    isNonNilSalary(id)
    public
    view
    returns (SalaryState state)
    {
        // Salary memory salary = salarys[id];
        // if (block.number > salary.timeframe.close) {
        //     salarys[id].state = salary.balance > 0 ? SalaryState.NonSalarying : SalaryState.Finalized;
        // }
        return salaries[id].state;
    }

    // Creates a salary
    //
    // @param payee         the account receiving the payments
    // @param startBlock    start of the salary
    // @param closeBlock    close of the salary
    // @param price         how much the payers pays per interval
    // @param interval      the rate at which $price worth of ㆔ is salaryed
    function startSalary(address payee, uint256 startBlock, uint256 closeBlock, uint256 price, uint256 interval)
    public
    payable
    {
        require(startBlock >= block.number, "The starting block needs to be higher than the current block number");

        uint256 duration = closeBlock - startBlock;
        require(duration >= 1, "The closing block needs to be higher than the starting block");
        require(duration >= interval, "The total salary duration needs to be higher than the payment interval");

        uint256 funds = (duration / interval) * price;
        require(funds == msg.value, "Funds need to be deposited beforehand by the payer");

        address payer = msg.sender;
        salaries[salaryNonce] = Salary(
            SalaryState.Salarying,
            payer,
            payee,
            msg.value,
            Timeframe(startBlock, closeBlock),
            Rate(price, interval)
        );
        emit SalaryStarted(payer, payee);

        salaryNonce = salaryNonce.add(1);
    }

    // Stops a salary
    //
    // @param id        The id of the salary
    function stopSalary(uint256 id)
    isNonNilSalary(id)
    public
    {
        Salary memory salary = salaries[id];
        emit SalaryClosed(salary.payer, salary.payee);

        // strong assumptions on tx processing speeds and economics
        uint256 remainder = ((block.number - salary.timeframe.start) / salary.rate.interval) * salary.rate.price;
        salary.payer.transfer(remainder);
        salaries[id].state = SalaryState.NonSalarying;
    }

    // Recipients cannot currently close the salary while it is active,
    // but this may be amended in the future.
    //
    // @param id        The id of the salary
    function redeem(uint256 id)
    onlyPayee(id)
    isNonNilSalary(id)
    isNonSalarying(id)
    public
    {
        Salary memory salary = salaries[id];
        msg.sender.transfer(salary.balance);
        emit SalaryRedeemed(salary.payer, salary.payee);

        salaries[id].balance = 0;
        salaries[id].state = SalaryState.Finalized;
    }
}
pragma solidity ^0.4.25;

// File: openzeppelin-solidity/contracts/ownership/Ownable.sol

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address private _owner;

  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() internal {
    _owner = msg.sender;
    emit OwnershipTransferred(address(0), _owner);
  }

  /**
   * @return the address of the owner.
   */
  function owner() public view returns(address) {
    return _owner;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(isOwner());
    _;
  }

  /**
   * @return true if `msg.sender` is the owner of the contract.
   */
  function isOwner() public view returns(bool) {
    return msg.sender == _owner;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipTransferred(_owner, address(0));
    _owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    _transferOwnership(newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0));
    emit OwnershipTransferred(_owner, newOwner);
    _owner = newOwner;
  }
}

// File: openzeppelin-solidity/contracts/math/SafeMath.sol

/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, reverts on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    uint256 c = a * b;
    require(c / a == b);

    return c;
  }

  /**
  * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b > 0); // Solidity only automatically asserts when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  /**
  * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b <= a);
    uint256 c = a - b;

    return c;
  }

  /**
  * @dev Adds two numbers, reverts on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a);

    return c;
  }

  /**
  * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
  * reverts when dividing by zero.
  */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0);
    return a % b;
  }
}

// File: contracts/Salaries.sol

//pragma experimental ABIEncoderV2;



contract Salaries is Ownable {
    using SafeMath for uint256;

    /**
     * Events
     */

    event SalaryStarted(address payer, address payee);
    event SalaryClosed(address payer, address payee);
    event SalaryRedeemed(address payer, address payee);

    /**
     * Structs
     */

    // strong assumptions on block intervals
    struct Timeframe {
        uint256 start;
        uint256 close;
    }

    struct Rate {
        uint256 price;
        uint256 interval;
    }

    struct Salary {
        SalaryState state;
        address payer;
        address payee;
        uint256 balance;
        Timeframe timeframe;
        Rate rate;
    }

    /**
     * Enums
     */
    enum SalaryState { NonExistent, Salarying, NonSalarying, Finalized }

    /**
     * Storage
     */
    uint256 public salaryNonce;
    mapping (uint256 => Salary) public salaries;

    constructor()
    public
    {
        salaryNonce = 1;
    }

    /**
     * Modifiers
     */
    modifier isSalarying(uint256 id)
    {
        // make sure that the state is indeed `.Salarying` when it should be
        Salary memory salary = salaries[id];
        if (salary.state != SalaryState.Salarying && block.number >= salary.timeframe.start && block.number <= salary.timeframe.close) {
            salaries[id].state = SalaryState.Salarying;
        }
        require(salary.state == SalaryState.Salarying, "salary must be active");
        _;
    }

    modifier isNonSalarying(uint256 id)
    {
        // make sure that the state is indeed `.NonSalarying` when it should be
        Salary memory salary = salaries[id];
        if (salary.state != SalaryState.NonSalarying && block.number >= salary.timeframe.close) {
            salaries[id].state = SalaryState.NonSalarying;
        }
        require(salary.state == SalaryState.NonSalarying, "salary must not be active");
        _;
    }

    modifier isNonNilSalary(uint256 id)
    {
        require(id < salaryNonce, "id is incorrect");
        //require(salarys[salaryId] != nil); // gotta research what nil is in solidity
        _;
    }

    modifier onlyPayer(uint256 id) {
        require(salaries[id].payer == msg.sender, "only the payer can call this function");
        _;
    }

    modifier onlyPayee(uint256 id) {
        require(salaries[id].payee == msg.sender, "only the payee can call this function");
        _;
    }

    /**
     * Functions
     */

    // @param salaryId      the id of the salary
    function currentBilling(uint256 id)
    isNonNilSalary(id)
    isSalarying(id)
    public
    returns (uint256 billing)
    {

        // p * ((c - s) / i)
        Salary memory salary = salaries[id];
        return ((block.number - salary.timeframe.start) / salary.rate.interval) * salary.rate.price;
    }

    // @param id      the id of the salary
    function stateOf(uint256 id)
    isNonNilSalary(id)
    public
    view
    returns (SalaryState state)
    {
        // Salary memory salary = salarys[id];
        // if (block.number > salary.timeframe.close) {
        //     salarys[id].state = salary.balance > 0 ? SalaryState.NonSalarying : SalaryState.Finalized;
        // }
        return salaries[id].state;
    }

    // Creates a salary
    //
    // @param payee         the account receiving the payments
    // @param startBlock    start of the salary
    // @param closeBlock    close of the salary
    // @param price         how much the payers pays per interval
    // @param interval      the rate at which $price worth of ㆔ is salaryed
    function startSalary(address payee, uint256 startBlock, uint256 closeBlock, uint256 price, uint256 interval)
    public
    payable
    {
        require(startBlock >= block.number, "The starting block needs to be higher than the current block number");

        uint256 duration = closeBlock - startBlock;
        require(duration >= 1, "The closing block needs to be higher than the starting block");
        require(duration >= interval, "The total salary duration needs to be higher than the payment interval");

        uint256 funds = (duration / interval) * price;
        require(funds == msg.value, "Funds need to be deposited beforehand by the payer");

        address payer = msg.sender;
        salaries[salaryNonce] = Salary(
            SalaryState.Salarying,
            payer,
            payee,
            msg.value,
            Timeframe(startBlock, closeBlock),
            Rate(price, interval)
        );
        emit SalaryStarted(payer, payee);

        salaryNonce = salaryNonce.add(1);
    }

    // Stops a salary
    //
    // @param id        The id of the salary
    function stopSalary(uint256 id)
    isNonNilSalary(id)
    public
    {
        Salary memory salary = salaries[id];
        emit SalaryClosed(salary.payer, salary.payee);

        // strong assumptions on tx processing speeds and economics
        uint256 remainder = ((block.number - salary.timeframe.start) / salary.rate.interval) * salary.rate.price;
        salary.payer.transfer(remainder);
        salaries[id].state = SalaryState.NonSalarying;
    }

    // Recipients cannot currently close the salary while it is active,
    // but this may be amended in the future.
    //
    // @param id        The id of the salary
    function redeem(uint256 id)
    onlyPayee(id)
    isNonNilSalary(id)
    isNonSalarying(id)
    public
    {
        Salary memory salary = salaries[id];
        msg.sender.transfer(salary.balance);
        emit SalaryRedeemed(salary.payer, salary.payee);

        salaries[id].balance = 0;
        salaries[id].state = SalaryState.Finalized;
    }
}
