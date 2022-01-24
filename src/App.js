import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from './redux/blockchain/blockchainActions';
import { fetchData } from './redux/data/dataActions';
import icon from './ch-icon.png';
import chAnimated from './ch-animated.gif';
import './App.css';
import * as s from './styles/globalStyles';
import styled from 'styled-components';
import config from './config.js';

const truncate = (input, len) => (input.length > len ? `${input.substring(0, len)}...` : input);

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #1f1f1f;
  padding: 10px;
  font-weight: bold;
  font-size: 1.2rem;
  font-family: 'Power Breakfast DEMO';
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 40px;
  color: var(--primary-text);
  width: 60px;
  height: 60px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: '#26a1ff';
  text-decoration: none;
`;
function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: '',
    SCAN_LINK: '',
    NETWORK: {
      NAME: '',
      SYMBOL: '',
      ID: 0,
    },
    NFT_NAME: '',
    SYMBOL: '',
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: '',
    MARKETPLACE_LINK: '',
    SHOW_BACKGROUND: false,
    MAX_TRANSACTION: 0,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once('error', (err) => {
        // console.log(err);
        setFeedback('Sorry, something went wrong please try again later.');
        setClaimingNft(false);
      })
      .then((receipt) => {
        // console.log(receipt);
        setFeedback(`WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`);
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > CONFIG.MAX_TRANSACTION) {
      newMintAmount = CONFIG.MAX_TRANSACTION;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== '' && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      console.log('get blockchain account:', blockchain.account);
      console.log('get blockchain smartContract:', blockchain.smartContract);
    }
  };

  const getConfig = async () => {
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <>
      <div className='fullscreen nopadding'>
        <div id='header'>
          <img src={icon} alt='./ch-icon.png' className='img-logo' width='60px' />
          <ul>
            <li>
              <a target='_blank' href={process.env.REACT_APP_DISCORD_URL}>
                Discord
              </a>
            </li>
            <li>
              <a target='_blank' href={process.env.REACT_APP_TWITTER_URL}>
                Twitter
              </a>
            </li>
            <li>
              <a target='_blank' href={process.env.REACT_APP_OPENSEA_URL}>
                Opensea
              </a>
            </li>
            <li>
              <a target='_blank' href={process.env.REACT_APP_ETHERSCAN_URL}>
                Etherscan
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className='semitrans'>
        <h1>Chameleons In The City</h1>
        <img src={chAnimated} alt='chAnimated' className='floatleft' />
        <h1>NOW OPEN FOR FREE MINT!!!</h1>
        <h2>No Roadmap. Just building Community Sharing Alphas</h2>
        <br />
        <p>
          Chameleons are one of the Masters in Camouflage. <br /> <br />
          To survive, they mimic their surroundings and remain unnoticeable by bigger animals. Until one day, They
          decided to Live in the City! Every night they gather around and share some useful information with each other
          to making their life in the city much easier. They call themselves "The CITC-ens". <br /> <br />
          Can you spot them in the City? Or are you one of them? Happy Hunting!
        </p>
        <s.Container flex={2} jc={'center'} ai={'center'} style={{}}>
          {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
            <>
              <s.TextTitle style={{ fontSize: '2em', textAlign: 'center', color: 'black' }}>
                The sale has ended.
              </s.TextTitle>
              <s.SpacerSmall />
              <StyledLink target={'_blank'} href={CONFIG.MARKETPLACE_LINK}>
                {CONFIG.MARKETPLACE}
              </StyledLink>
              <s.SpacerMedium />
            </>
          ) : (
            <>
              {blockchain.account === '' || blockchain.smartContract === null ? (
                <s.Container ai={'center'} jc={'center'}>
                  <s.TextDescription
                    style={{
                      textAlign: 'center',
                      color: 'black',
                      fontSize: '2em',
                    }}
                  >
                    {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                    <br />
                    Connect to the {CONFIG.NETWORK.NAME} network
                  </s.TextDescription>
                  <s.SpacerMedium />
                  <StyledButton
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(connect());
                      getData();
                    }}
                  >
                    CONNECT
                  </StyledButton>
                  <s.SpacerMedium />

                  {blockchain.errorMsg !== '' ? (
                    <>
                      <s.SpacerSmall />
                      <s.TextDescription
                        style={{
                          textAlign: 'center',
                          color: 'black',
                          fontSize: '2em',
                        }}
                      >
                        {blockchain.errorMsg}
                      </s.TextDescription>
                    </>
                  ) : null}
                </s.Container>
              ) : (
                <>
                  <s.TextDescription
                    style={{
                      textAlign: 'center',
                      color: 'black',
                      fontSize: '2em',
                    }}
                  >
                    {data.totalSupply} / {CONFIG.MAX_SUPPLY} <br />
                    {feedback}
                  </s.TextDescription>
                  <s.Container ai={'center'} jc={'center'} fd={'row'}>
                    <StyledRoundButton
                      style={{ lineHeight: 0.4 }}
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        decrementMintAmount();
                      }}
                    >
                      -
                    </StyledRoundButton>
                    <s.TextDescription
                      style={{
                        textAlign: 'center',
                        color: 'black',
                        fontSize: '2em',
                      }}
                    >
                      {mintAmount}
                    </s.TextDescription>
                    <StyledRoundButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        incrementMintAmount();
                      }}
                    >
                      +
                    </StyledRoundButton>
                  </s.Container>
                  <s.Container ai={'center'} jc={'center'} fd={'row'}>
                    <StyledButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs();
                        getData();
                      }}
                    >
                      {claimingNft ? 'LOADING' : 'BUY'}
                    </StyledButton>
                    <s.SpacerSmall />
                  </s.Container>
                  <div>
                    <br />
                  </div>
                </>
              )}
            </>
          )}
        </s.Container>
      </div>
      <div className='white'>
        <h2>Frequently Asked Questions</h2>
        <p></p>
        <p>
          How many Chameleons are there? <br />* There are currently <b>6000</b> Chameleon in the City. <br /> <br />
          How do I mint my own Chameleon? <br />
          * You can mint your own Chameleon by clicking the button above. <br /> <br />
          How many Chameleons can I mint? <br />* You can mint up to <b>{CONFIG.MAX_TRANSACTION}</b> Chameleon per
          transaction. <br /> <br />
          How much is a Chameleon worth? <br />* Chameleons are worth <b>FREE</b>.
        </p>
      </div>

      <div className='dark'>
        <h1>FREE MINT ROCKS!!!. LFG!!!</h1>
      </div>
    </>
  );
}

export default App;
