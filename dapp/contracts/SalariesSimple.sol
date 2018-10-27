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

pragma experimental ABIEncoderV2;

contract Salaries is Ownable {
    using SafeMath for uint256;

    /**
     * Events
     */
    event EmployeeAdded(address employee, string name, string role);
    event EmployeeRemoved(address employee, string name, string role);
    event SalaryStarted(address business, address employee);
    event SalaryClosed(address business, address employee);
    event SalaryRedeemed(address business, address employee);

    /**
     * Structs
     */
    struct Employee {
        string name;
        string role;
    }

    struct Timeframe {
        uint256 start;
        uint256 stop;
    }

    struct Rate {
        uint256 price;
        uint256 interval;
    }

    struct Salary {
        SalaryState state;
        address business;
        address employee;
        uint256 balance;
        Timeframe timeframe;
        Rate rate;
    }

    /**
     * Enums
     */
    enum SalaryState { NonExistent, Paying, NonPaying, Finalized }

    /**
     * Storage
     */
    mapping (address => Employee) public employees;
    mapping (address => Salary) public salaries;

    /**
     * Modifiers
     */
    modifier isNonNilEmployee(address _address)
    {
        require(bytes(employees[_address].name).length > 0, "Employee does not exist in the storage");
        _;
    }

    modifier isPaying(address employee)
    {
        // make sure that the state is indeed `.Salarying` when it should be
        Salary memory salary = salaries[employee];
        if (salary.state != SalaryState.Paying && block.number >= salary.timeframe.start && block.number <= salary.timeframe.stop) {
            salaries[employee].state = SalaryState.Paying;
        }
        require(salary.state == SalaryState.Paying, "Continuous payment is not active");
        _;
    }

    modifier isNonPaying(address employee)
    {
        // make sure that the state is indeed `.NonSalarying` when it should be
        Salary memory salary = salaries[employee];
        if (salary.state != SalaryState.NonPaying && block.number >= salary.timeframe.stop) {
            salaries[employee].state = SalaryState.NonPaying;
        }
        require(salary.state == SalaryState.NonPaying, "Continuous payment is already active");
        _;
    }

    modifier isNonNilSalary(address employee)
    {
        require(bytes(employees[employee].name).length > 0, "Salary object does not exist in the storage");
        _;
    }

    modifier onlyBusiness(address _address) {
        require(salaries[_address].business == msg.sender, "Only the business can call this function");
        _;
    }

    modifier onlyEmployee(address _address) {
        require(salaries[_address].employee == msg.sender, "Only the employee can call this function");
        _;
    }

    /**
     * Functions
     */

    // @param employee      The address of the employee receiving the salary
    // @param name          The name of the employee
    // @param role          The role of the employee
    function addEmployee(address _address, string name, string role)
    onlyOwner
    public
    {
        require(bytes(name).length > 0, "name must be provided");
        require(bytes(role).length > 0, "role must be provided");
        employees[_address] = Employee(name, role);
        emit EmployeeAdded(_address, name, role);
    }

    // @param employee        The address of the employee receiving the salary
    function removeEmployee(address _address)
    onlyOwner
    isNonNilEmployee(_address)
    public
    {
        Employee memory employee = Employee(employees[_address].name, employees[_address].role);
        delete employees[_address];
        emit EmployeeRemoved(_address, employee.name, employee.role);
    }

    // @param employee        The address of the employee receiving the salary
    function currentBilling(address employee)
    isNonNilSalary(employee)
    public
    view
    returns (uint256 billing)
    {
        require(block.number >= salary.timeframe.start, "Continous payment not started yet");
        Salary memory salary = salaries[employee];
        uint256 blocks = block.number - salary.timeframe.start;
        if (blocks > salary.timeframe.stop - salary.timeframe.start) {
            blocks = salary.timeframe.stop - salary.timeframe.start;
        }
        return (blocks / salary.rate.interval) * salary.rate.price;
    }

    // @param employee        The address of the employee receiving the salary
    function stateOf(address employee)
    isNonNilSalary(employee)
    public
    view
    returns (SalaryState state)
    {
        return salaries[employee].state;
    }

    // Creates a salary
    //
    // @param employee      the account receiving the payments
    // @param startBlock    start of the salary
    // @param closeBlock    close of the salary
    // @param price         how much the payers pays per interval
    // @param interval      the rate at which $price worth of ㆔ is salaryed
    function startSalary(address employee, uint256 startBlock, uint256 closeBlock, uint256 price, uint256 interval)
    isNonNilEmployee(employee)
    public
    payable
    {
        require(startBlock >= block.number, "The starting block needs to be higher than the current block number");
        require(msg.sender != employee, "The business and the employee cannot be the same account");

        uint256 duration = closeBlock - startBlock;
        require(duration >= 1, "The closing block needs to be higher than the starting block");
        require(duration >= interval, "The total salary duration needs to be higher than the payment interval");

        uint256 funds = (duration / interval) * price;
        require(funds == msg.value, "Funds need to be deposited beforehand by the business");

        address business = msg.sender;
        salaries[employee] = Salary(
            SalaryState.Paying,
            business,
            employee,
            msg.value,
            Timeframe(startBlock, closeBlock),
            Rate(price, interval)
        );
        emit SalaryStarted(business, employee);
    }

    // Stops a salary
    //
    // @param employee        The address of the employee receiving the salary
    function stopSalary(address employee)
    isNonNilSalary(employee)
    public
    {
        Salary memory salary = salaries[employee];
        emit SalaryClosed(salary.business, salary.employee);

        // strong assumptions on tx processing speeds and economics
        uint256 blocks = block.number - salary.timeframe.start;
        if (blocks > salary.timeframe.stop - salary.timeframe.start) {
            blocks = salary.timeframe.stop - salary.timeframe.start;
        }
        uint256 remainder = (blocks / salary.rate.interval) * salary.rate.price;
        salary.business.transfer(remainder);
        salaries[employee].state = SalaryState.NonPaying;
    }

    // Recipients cannot currently close the salary while it is active,
    // but this may be amended in the future.
    //
    // @param employee        The address of the employee receiving the salary
    function redeem(address employee)
    onlyEmployee(employee)
    isNonNilSalary(employee)
    isNonPaying(employee)
    public
    {
        Salary memory salary = salaries[employee];
        msg.sender.transfer(salary.balance);
        emit SalaryRedeemed(salary.business, salary.employee);

        salaries[employee].balance = 0;
        salaries[employee].state = SalaryState.Finalized;
    }
}