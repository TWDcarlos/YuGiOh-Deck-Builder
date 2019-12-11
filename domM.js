const cardsHolder = document.querySelector('.yugioh-cards-holder');
const banished = new RegExp('Cyberse|Bonz|Yugi|Rex|Pegasus');
const deckLength = document.querySelector('#deckLength');
let deck = getDeckFromLocalStorage();
const cardDisplay = {
  image: document.querySelector('#cardImage'),
  title: document.querySelector('#cardTitle'),
  atkDef: document.querySelector('#cardAtkDef'),
  attribute: document.querySelector('#cardAttribute'),
  race: document.querySelector('#cardRace'),
  type: document.querySelector('#cardType'),
  desc: document.querySelector('#cardDesc')
}

function getDeckFromLocalStorage() {
  if(window.localStorage.getItem('deck')) {
    const savedDeck = JSON.parse(window.localStorage.getItem('deck'));
    toggleDeckLengthDisplay(savedDeck);
    
    return savedDeck;
  }else {
    deckLength.style.display = 'none';
    return [];
  }
}

function toggleDeckLengthDisplay(arr) {
  if(arr.length > 0) {
    deckLength.textContent = arr.length;
    deckLength.style.display = 'inline-flex';
  }else {
    deckLength.style.display = 'none';
  }
}


export function updateDisplayCard(card) {
  cardDisplay.image.classList.remove('bounce', 'animated');
  cardDisplay.image.src = card.card_images[0].image_url;

  cardDisplay.image.onload = () => {cardDisplay.image.classList.add('bounce', 'animated');}

  cardDisplay.title.textContent = card.name;
  cardDisplay.atkDef.textContent = card.def ? `ATK/${card.atk}   DEF/${card.def}` : '';
  cardDisplay.attribute.src = card.attribute ? `./images/attributes/${card.attribute}.svg` : '';
  cardDisplay.race.src = (card.type != 'Spell Card' && card.type != 'Trap Card') ? `./images/race/${card.race}.png` : '';
  cardDisplay.type.textContent = `${card.race}/${card.type}`;
  cardDisplay.desc.textContent = card.desc;
}

export function makeDeckContainer(hasCards = false) {
  const divDesc = document.createElement('div');
  divDesc.style ="position: relative; text-align: center; margin-top: 4rem;"

  const deckH2 = document.createElement('h2');
  deckH2.textContent = 'Your Deck:';
  divDesc.appendChild(deckH2);

  const deckP = document.createElement('p');
  if(hasCards) {
    deckP.textContent = 'All cards on your deck is displayed bellow';
  } else {
    deckP.textContent = `You don't have cards in your deck, try adding on 'dashboard' tab!`;
  }
  divDesc.appendChild(deckP);

  const divCardList = document.createElement('div');
  divCardList.id = 'card-list';
  divCardList.style ="position: relative;text-align: center;"

  return {divDesc, divCardList}
}

export function makeDeckCards(card, divDesc, divCardList) {
  const divContainer = document.createElement('div');
  divContainer.classList.add('card-container');
  divCardList.appendChild(divContainer);

  const figure = document.createElement('figure');
  divContainer.appendChild(figure);

  const cardImg = document.createElement('img');
  cardImg.classList.add('deck-cards');
  if(card) cardImg.src = card.card_images[0].image_url;
  else cardImg.src = './images/back_card.png';
  figure.classList.add('bounce', 'animated');
  figure.appendChild(cardImg);

  const figcaption = document.createElement('figcaption');
  figcaption.classList.add('s-legend');
  figcaption.style = 'line-height:4px;';
  figure.appendChild(figcaption);

  cardsHolder.appendChild(divDesc);
  cardsHolder.appendChild(divCardList);
}

export function toggleCardDisplay(hide = false) {
  if(hide) {
    document.querySelector('.aside-left-float').style.display = 'block';
    document.querySelector('.aside-left-float').classList.add('slideInLeft', 'animated');
    cardsHolder.style.marginLeft = '30%';
  }else {
    cardsHolder.style.marginLeft = '0px';
    document.querySelector('.aside-left-float').style.display = 'none';
    document.querySelector('.aside-left-float').classList.remove('slideInLeft', 'animated');
  }
}

export function toggleSearchForm(hide = false) {
  if(hide) {
    document.querySelector('#form').style.display = 'none';
  }else {
    document.querySelector('#form').style.display = 'flex';
  }
}

export function hideLoadingGif() {
  document.querySelector('#loading-gif').style.display = 'none';
}

function setCardBackgroundColor(type) {
  switch (type) {
    case 'Effect Monster':
      return '#e3b999';
    case 'Union Effect Monster':
      return '#e3b999';
    case 'Toon Monster':
      return '#e3b999';
    case 'Gemini Monster':
      return '#e3b999';
    case 'Pendulum Tuner Effect Monster':
      return '#e3b999';
    case 'Tuner Monster':
      return '#e3b999';
    case 'Synchro Tuner Monster':
      return '#e3b999';
    case 'Pendulum Effect Monster':
      return '#e3b999';
    case 'Flip Effect Monster':
      return '#e3b999';
    case 'Normal Monster':
      return '#dec79e';
    case 'Pendulum Normal Monster':
      return '#dec79e';
    case 'Spell Card':
      return '#86ccc4';
    case 'Trap Card':
      return '#cc82ab';
    case 'XYZ Monster':
      return '#6e6e6e';
    case 'XYZ Pendulum Effect Monster':
      return '#6e6e6e';
    case 'Link Monster':
      return '#77a8d2';
    case 'Synchro Monster':
      return '#d6d3d2';
    case 'Fusion Monster':
      return '#bd98c9';
    case 'Ritual Effect Monster':
      return '#8174cb';
    case 'Ritual Monster':
      return '#8174cb';
    default:
      return undefined;
  }
}

function modifyDeck(card, span, remBtn, addBtn, isAdding = true) {
  if(isAdding) {
    deck.push(card.id);
    const newValue = parseInt(span.textContent) + 1;
    span.textContent = newValue;
    if(newValue == 3) {
      addBtn.disabled = true;
      span.style.color = 'red';
    }

    remBtn.disabled = false;
  }else {
    deck.splice(deck.indexOf(card.id), 1);
    const newValue = parseInt(span.textContent) - 1;
    span.textContent = newValue;
    if(newValue == 0) {
      remBtn.disabled = true;
      span.style.color = 'black';
    }

    addBtn.disabled = false;
  }

  window.localStorage.setItem('deck', JSON.stringify(deck));
  toggleDeckLengthDisplay(JSON.parse(window.localStorage.getItem('deck')));
}

export function createLoadingGif() {
  const loadingDiv = document.createElement('div');
  loadingDiv.classList.add('text-center');
  loadingDiv.id = 'loading-gif';

  const loadingGif = document.createElement('img');
  loadingGif.src = './images/loading.gif';
  loadingGif.alt = 'A loading gif';
  loadingDiv.appendChild(loadingGif);

  cardsHolder.appendChild(loadingDiv);
}

export function createErrorGif() {
  const errorDiv = document.createElement('div');
  errorDiv.classList.add('text-center', 'pt-5');
  //loadingDiv.id = 'loading-gif';

  const errorGif = document.createElement('img');
  errorGif.src = './images/error.gif';
  errorGif.alt = 'Somathing went wrong gif';
  errorDiv.appendChild(errorGif);

  const errorMsg = document.createElement('p');
  errorMsg.textContent = 'No cards found!';
  errorDiv.appendChild(errorMsg);

  cardsHolder.appendChild(errorDiv);
}

export function createCard(card) {
  if(banished.test(card.race)) return;

  const cardContDiv = document.createElement('div');
  cardContDiv.classList.add('card-cont', 'slideInRight', 'animated');

  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card', 'w-100');
  cardDiv.style.backgroundColor = setCardBackgroundColor(card.type);
  cardContDiv.appendChild(cardDiv);

  const cardBodyDiv = document.createElement('div');
  cardBodyDiv.classList.add('card-body', 'padding-card');
  cardDiv.appendChild(cardBodyDiv);

  const cardImg = document.createElement('img');
  cardImg.classList.add('card-img', 'img-card-little');
  cardImg.src = card.card_images[0].image_url_small;
  cardBodyDiv.appendChild(cardImg);

  const cardTitle = document.createElement('h4');
  cardTitle.textContent = card.name;
  cardTitle.classList.add('card-title');
  cardBodyDiv.appendChild(cardTitle);

  const cardAttributeDiv = document.createElement('div');
  cardBodyDiv.appendChild(cardAttributeDiv);

  if(card.attribute) {
    const cardAtt = document.createElement('img');
    cardAtt.src = `./images/attributes/${card.attribute}.svg`;
    cardAtt.classList.add('space-out', 'little-icon');
    cardAttributeDiv.appendChild(cardAtt);
  }

  if(card.type == 'Trap Card') {
    const cardAtt = document.createElement('img');
    cardAtt.src = `./images/attributes/TRAP.svg`;
    cardAtt.classList.add('space-out', 'little-icon');
    cardAttributeDiv.appendChild(cardAtt);
  }else if(card.type == 'Spell Card') {
    const cardAtt = document.createElement('img');
    cardAtt.src = `./images/attributes/SPELL.svg`;
    cardAtt.classList.add('space-out', 'little-icon');
    cardAttributeDiv.appendChild(cardAtt);
  }else {
    const cardRace= document.createElement('img');
    cardRace.src = `./images/race/${card.race}.png`;
    cardRace.classList.add('space-out', 'little-icon');
    cardAttributeDiv.appendChild(cardRace);
  }

  if(card.level) {
    const cardLvl = document.createElement('img');
    cardLvl.src = `./images/Level.png`;
    cardLvl.style.width = '20px';
    cardAttributeDiv.appendChild(cardLvl);

    const cardLvlText = document.createElement('span');
    cardLvlText.textContent = 'x' + card.level;
    cardAttributeDiv.appendChild(cardLvlText);
  }

  if(card.atk) {
    const cardAtkDef = document.createElement('span');
    cardAtkDef.textContent = `ATK/${card.atk}` + (card.def ? `DEF/${card.def}` : '');
    cardAtkDef.classList.add('space-out');
    cardAttributeDiv.appendChild(cardAtkDef);
  }

  const cardControlDiv = document.createElement('div');
  cardControlDiv.classList.add('card-controls');
  cardAttributeDiv.appendChild(cardControlDiv);

  const cardsCount = document.createElement('span');
  cardsCount.textContent = checkItIsOnDeck(card, cardsCount);
  cardsCount.classList.add('space-out', 'card-controls-number');
  cardsCount.title = 'The number of this card on your Deck'
  cardControlDiv.appendChild(cardsCount);

  const addBtn = document.createElement('button');
  addBtn.textContent = '+';
  addBtn.classList.add('space-out', 'btn', 'btn-success', 'btn-sm');
  addBtn.title = 'Add this card to your Deck';
  cardControlDiv.appendChild(addBtn);

  const remBtn = document.createElement('button');
  remBtn.textContent = '-';
  remBtn.classList.add('space-out', 'btn', 'btn-danger', 'btn-sm');
  remBtn.title = 'Remove this card from your Deck';
  remBtn.disabled = true;
  cardControlDiv.appendChild(remBtn);

  addBtn.addEventListener('click', () => {modifyDeck(card, cardsCount, remBtn, addBtn)})
  remBtn.addEventListener('click', () => {modifyDeck(card, cardsCount, remBtn, addBtn, false)})

  cardContDiv.addEventListener('mouseover', () => {
    updateDisplayCard(card);
  });

  cardsHolder.appendChild(cardContDiv);
}

function checkItIsOnDeck(card, span) {
  if(deck.includes(card.id)) {
    let num = 0;
    deck.forEach(elt => {
      if(elt == card.id) {
        num++;
      }
    });
    
    if(num == 3) {
      span.style.color = 'red';
    }

    return num;
  }

  return 0;
}

export function clearCards() {
  cardsHolder.innerHTML = ""
}