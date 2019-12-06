const btnSearch = document.querySelector('#btnSearchCard');
const inputSearch = document.querySelector('#searchCard');
const btnDashboard = document.querySelector('#btnDashboard');
const btnDeck = document.querySelector('#btnDeck');

const API_URL = 'https://db.ygoprodeck.com/api/v5/cardinfo.php';

const scrollMore = {
  paginationLength: 20,
  leftCards: [],
};

import { 
  updateDisplayCard,
  createCard,
  createLoadingGif,
  clearCards, 
  hideLoadingGif,
  toggleCardDisplay,
  makeDeckContainer,
  makeDeckCards
  } from './domM.js';

createLoadingGif();

async function router() {
  //waiting for the #hash 
  setTimeout(async () => {
    if(window.location.hash) {
      const hash = window.location.hash.substring(1); 
  
      //Creating Deck View
      if(hash == 'Dashboard') {
        activeDashBoard();
        await dashBoardView();
  
      //Deck View
      }else {
        activeDeck();
        await deckView()
      }
    }
  }, 500);
}

router();

async function dashBoardView() {
  clearCards();
  createLoadingGif();
  await search();
  hideLoadingGif();
  toggleCardDisplay(true);
}

async function deckView() {
  clearCards();
  toggleCardDisplay(false);
  createLoadingGif();
  setTimeout(async () => {
    let deck = JSON.parse(window.localStorage.getItem('deck'));
    const hold = makeDeckContainer();
    let length;
    if(deck) {
      length = deck.length >= 40 ? deck.length : 40;
    }else {
      length = 40;
      deck = [];
    }

    //We have to wait here because API limits
    for(let i = 0; i < length; i++) {
      setTimeout(async () => {  
        let card = [];
        if(deck[i]) card = await searchCard(deck[i]);
        makeDeckCards(card[0], hold.divDesc, hold.divCardList)
      }, i * 100);
    }
    hideLoadingGif();
  }, 1000);
}

async function search(searchTerm = '') {
  await contactAPI(searchTerm);
  updateDisplayCard(scrollMore.leftCards[0]);
  pagination();
}

async function searchCard(id) {
  const response = await fetch(`${API_URL}?name=${id}`);
  const json = await response.json();
  return json;
}

async function contactAPI(searchTerm) {
  const response = await fetch(`${API_URL}${searchTerm}`);
  const json = await response.json();
  scrollMore.leftCards = json;
}

async function pagination() {
  if(scrollMore.leftCards.length > 0) {
    for(let i = 0; i < scrollMore.paginationLength; i++) {
      setTimeout(() => {
        createCard(scrollMore.leftCards[i]);
        scrollMore.leftCards.splice(i, 1);
      }, i * 100);
    }
  }
}

function activeDeck() {
  btnDashboard.parentNode.classList.remove('active');
  btnDeck.parentNode.classList.add('active');
}

function activeDashBoard() {
  btnDashboard.parentNode.classList.add('active');
  btnDeck.parentNode.classList.remove('active');
}

// EVENTS 
btnDashboard.addEventListener('click', () => {
  router();
  activeDashBoard();
});

btnDeck.addEventListener('click', () => {
  router();
  activeDeck();
});

inputSearch.addEventListener('keydown', (ev) => {
  if(ev.key == 'Enter' || ev.key == 'Tab') {
    ev.preventDefault();
    clearCards();
    createLoadingGif();
    search(`?fname=${inputSearch.value}`).then(() => { hideLoadingGif() });
  }
});

btnSearch.addEventListener('click', (ev) => {
  ev.preventDefault();
  clearCards();
  createLoadingGif();
  search(`?fname=${inputSearch.value}`).then(() => { hideLoadingGif() });
});

window.onscroll = () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    const hash = window.location.hash.substring(1); 
    if(hash && hash == 'Dashboard') {
      pagination();
    }
  }
};