pragma solidity 0.4.23;

contract MarketplaceAnalytics {
  /**
   * @notice Calculates cumulative amount paid to given supplier
   */
  function getAmountPaidTo(address supplier) public constant returns(uint256) {
    // TODO: implement
    return 0;
  }

  /**
   * @notice Calculates cumulative amount invoiced by given supplier
   */
  function getAmountInvoicedBy(address supplier) public constant returns(uint256) {
    // TODO: implement
    return 0;
  }

  /**
   * @notice Calculates cumulative amount paid by given client
   */
  function getAmountPaidBy(address client) public constant returns(uint256) {
    // TODO: implement
    return 0;
  }

  /**
   * @notice Calculates cumulative amount invoiced to given client
   */
  function getAmountInvoicedTo(address client) public constant returns(uint256) {
    // TODO: implement
    return 0;
  }

}
