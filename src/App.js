import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { useEffect, useState } from 'react';
function App() {
  const [manager, setManager] = useState(null);
  const [msg, setMsg] = useState('');
  const [result, setRes] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [value, setValue] = useState(0);
  const getManager = async () => {
    const accounts = await web3.eth.getAccounts();
    let manag = await lottery.methods.manager().call({ from: accounts[0] });
    setManager(manag);
  };
  const getPlayers = async () => {
    const accounts = await web3.eth.getAccounts();
    let play = await lottery.methods.getPlayers().call({ from: accounts[0] });
    setPlayers(play);
  };

  const getBal = async () => {
    let bal = await web3.eth.getBalance(lottery.options.address);
    setBalance(bal);
  };
  useEffect(() => {
    getManager();
    getPlayers();
    getBal();
    console.log(manager);
  }, [manager]);

  const entry = async (e) => {
    e.preventDefault();
    if (value <= 0.01) {
      setMsg('Please enter more than 0.01 ether!');
      return;
    }
    setMsg('Waiting on transaction to get succesful....');
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.entry().send({
      from: accounts[0],
      value: web3.utils.toWei(String(value), 'ether'),
      gas: '',
    });
    setMsg('Transaction succesful !!');
  };
  const pickWinner = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    if (accounts[0] !== manager) {
      setRes('You can not pick the winner!');
      return;
    }
    setRes('Waiting for the winner to be picked...');
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    setRes('A winner has been picked!!');
  };
  return (
    <div className='App'>
      <h1>Lottery Contract!</h1>
      <h3>
        This Contract is managed by <u>{manager}</u>
      </h3>
      <h3>
        There are currently <u>{players.length}</u> players competing to win the
        price amount of <u>{web3.utils.fromWei(String(balance), 'ether')}</u>{' '}
        ether!
      </h3>
      <hr />
      <form
        onSubmit={(e) => {
          entry(e);
        }}>
        <h3>Wanna try your luck?</h3>
        <label>Amount of ether to enter: </label>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <br />
        <button>Enter</button>
      </form>
      <hr />
      <h3>Ready to Pick a Winner??</h3>
      <form
        onSubmit={(e) => {
          pickWinner(e);
        }}>
        <button>Pick Winner</button>
      </form>
      <h4>{result}</h4>
      <hr />
      <h4>{msg}</h4>
    </div>
  );
}

export default App;
