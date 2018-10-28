pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Salaries is Ownable {
    using SafeMath for uint256;

    /**
     * Events
     */
    event EmployeeAdded(address employee, string name, string role);
    event EmployeeRemoved(address employee, string name, string role);
    event SalaryStarted(address business, address employee, uint256 deposit);
    event SalaryCheckpointed(address business, address employee, uint256 amount);
    event SalaryClosed(address business, address employee, uint256 businessFunds, uint256 employeeFunds);

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

    constructor() public {
        employees[0xe7D6a2a1cbEd37EE7446d78Fd5E6B38AAAe3f3B2] = Employee("Alicia Drake", "Lead Engineer");
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
    uint256 public checkpointBlock;

    /**
     * Modifiers
     */
    modifier isNonNilEmployee(address addr)
    {
        require(bytes(employees[addr].name).length > 0, "Employee does not exist in the storage");
        _;
    }

    modifier isPaying(address employee)
    {
        // make sure that the state is indeed `.Paying` when it should be
        Salary memory salary = salaries[employee];
        salaries[employee].state = (block.number >= salary.timeframe.start && block.number <= salary.timeframe.stop) ? SalaryState.Paying : SalaryState.NonPaying;
        require(salaries[employee].state == SalaryState.Paying, "Salary is not being paid");
        _;
    }

    modifier isNonPaying(address employee)
    {
        // make sure that the state is indeed `.NonSalarying` when it should be
        Salary memory salary = salaries[employee];
        salaries[employee].state = (block.number >= salary.timeframe.start && block.number <= salary.timeframe.stop) ? SalaryState.Paying : SalaryState.NonPaying;
        require(salaries[employee].state == SalaryState.NonPaying, "Salary is already being paid");
        _;
    }

    modifier isNonNilSalary(address employee)
    {
        require(salaries[employee].state != SalaryState.NonExistent, "Salary object does not exist in the storage");
        _;
    }

    modifier onlyEmployee(address _address) {
        require(salaries[_address].employee == msg.sender, "Only the employee can call this function");
        _;
    }

    /**
     * Helpers
     */
    // blockDelta returns the difference between the current block height
    // and the latest checkpointed state (by default this is the start time).
    //
    // @param employee      The address of the employee receiving the salary
    function blockDelta(address employee)
    private
    view
    returns (uint256)
    {
        Salary memory salary = salaries[employee];
        uint256 startBlock = salary.timeframe.start;
        // Called before the streaming period ended
        if (block.number < startBlock) {
            return 0;
        }
        if (checkpointBlock > 0) {
            startBlock = checkpointBlock;
        }
        // Called after the streaming period ended
        uint256 latestBlock = block.number;
        if (latestBlock > salary.timeframe.stop) {
            latestBlock = salary.timeframe.stop;
        }
        uint256 delta = latestBlock - startBlock;
        return delta;
    }

    // @param employee        The address of the employee receiving the salary
    function balanceOf(address employee)
    isNonNilSalary(employee)
    public
    view
    returns (uint256 balance)
    {
        Salary memory salary = salaries[employee];
        if (block.number < salary.timeframe.start) {
            return 0;
        }
        if (block.number > salary.timeframe.stop) {
            return salary.balance;
        }
        uint256 delta = blockDelta(employee);
        return (delta / salary.rate.interval) * salary.rate.price;
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
    function stateOf(address employee)
    isNonNilSalary(employee)
    public
    view
    returns (SalaryState state)
    {
        return salaries[employee].state;
    }

    // Starts a continuous salary
    //
    // @param employee      the account receiving the payments
    // @param startBlock    start of the salary
    // @param closeBlock    close of the salary
    // @param price         how much the payers pays per interval
    // @param interval      the rate at which $price worth of ㆔ is salaryed
    function startSalary(address employee, uint256 startBlock, uint256 closeBlock, uint256 price, uint256 interval)
    onlyOwner
    isNonNilEmployee(employee)
    isNonPaying(employee)
    public
    payable
    {
        require(startBlock >= block.number, "The starting block needs to be higher than the current block number");
        require(msg.sender != employee, "The business and the employee cannot be the same account");

        uint256 duration = closeBlock - startBlock;
        require(duration >= 1, "The closing block needs to be higher than the starting block");
        require(duration >= interval, "The total salary duration needs to be higher than the payment interval");

        uint256 funds = (duration / interval) * price;
        require(funds == msg.value, "Funds deposited by the business need to be exact");

        address business = msg.sender;
        salaries[employee] = Salary(
            SalaryState.Paying,
            business,
            employee,
            msg.value,
            Timeframe(startBlock, closeBlock),
            Rate(price, interval)
        );
        emit SalaryStarted(business, employee, msg.value);
    }

    // checkpoint lets the employee move the current blaa the funds into their
    // actual wallet account
    //
    // @param employee        The address of the employee receiving the salary
    function checkpoint(address employee)
    onlyEmployee(employee)
    isNonNilSalary(employee)
    isPaying(employee)
    public
    {
        Salary memory salary = salaries[employee];
        uint256 funds = ((checkpointBlock - salary.timeframe.start) / salary.rate.interval) * salary.rate.price;
        msg.sender.transfer(funds);

        salaries[employee].balance -= funds;
        checkpointBlock = block.number;
        emit SalaryCheckpointed(salary.business, salary.employee, funds);
    }

    // closeSalary stops a continuous salary. Both the business and the employee can do this.
    // This can be triggered while the salary is being paid, or afterwards, but
    // never before.
    //
    // @param employee        The address of the employee receiving the salary
    function closeSalary(address employee)
    isNonNilSalary(employee)
    public
    {
        Salary memory salary = salaries[employee];
        if (block.number <= salary.timeframe.start) {
            delete salaries[employee];
            emit SalaryClosed(salary.business, salary.employee, 0, 0);
        }

        uint256 delta = blockDelta(employee);
        uint256 funds = (delta / salary.rate.interval) * salary.rate.price;
        salary.employee.transfer(funds);
        salary.business.transfer(salary.balance - funds);

        delete salaries[employee];
        emit SalaryClosed(salary.business, salary.employee, funds, salary.balance - funds);
    }
}