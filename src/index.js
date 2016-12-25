const Web3 = require('web3')

// basic web3 object
const web3 = new Web3()
// set provider, typically you run 'testrpc -p 8545' in your terminal
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

// example showing how to use basic web3 functions
const coinbase = web3.eth.coinbase;
const balance = web3.fromWei(web3.eth.getBalance(coinbase), 'ether')
console.log("current coinbase:", coinbase);
console.log("current balance (in ether) of coinbase:", balance.toString(10));

// create solidity source code with all new lines removed
var source = "pragma solidity ^0.4.2; contract Greeter { address creator; string greeting; function Greeter(string _greeting) public { creator = msg.sender; greeting = _greeting; } function greet() constant returns (string) { return greeting; } function getBlockNumber() constant returns (uint) { return block.number; } function setGreeting(string _newgreeting) { greeting = _newgreeting; } function kill() { if (msg.sender == creator) suicide(creator); } }"

// compile the solidity source code
var compiled = web3.eth.compile.solidity(source);

// code will be the machine/binary code of the compiled result
var code = compiled.code;

// abi
var abi = compiled.info.abiDefinition;

// create a contract class based on abi
const greeterContract = web3.eth.contract(abi)

// create instance of a contract class, i.e., deploy a contract
const greeter = greeterContract.new(
  "hello world", // as the constructor argument
  {
    from: web3.eth.accounts[0],
    data: code,
    gas: 3000000
  }, function (e, contract) {
    // NOTE: callback will happen twice: contract created and contract mined
    if (e) {
      console.log("error happen")
    } else if (typeof contract.address != 'undefined') {
      console.log("========================================")
      console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
      console.log("Invoke contract.greet")
      console.log(contract.greet())
      console.log("Invoke contract.getBlockNumber")
      console.log(contract.getBlockNumber().toNumber())
      console.log("========================================")
    } else {
      console.log("========================================")
      console.log("Contract deployed, but not mined yet.")
      console.log("contract address:", contract.address)
      console.log("========================================")
    }
  })
