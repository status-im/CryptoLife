pragma solidity ^0.4.25;
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
}}