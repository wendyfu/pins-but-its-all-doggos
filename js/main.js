function Model() {
  this.fetchDoggos = function() {
    return fetch("https://dog.ceo/api/breeds/image/random/25")
      .then(function(response) {
        return response.json();
      }).then(function(result) {
        return result.message;
      });
  };
}

function Controller(model, view) {
  this.model = model;
  this.view = view;
  
  this.init = async function() {
    let initialDoggos = await this.model.fetchDoggos();

    this.handleIntersection = async function(entries) {
      if (entries.some(entry => entry.intersectionRatio > 0)) {
        let moreDoggos = await this.model.fetchDoggos();
        this.view.populateLayout(moreDoggos, true);
      }
    }
    this.handleIntersection = this.handleIntersection.bind(this);
    this.view.init(initialDoggos, this.handleIntersection)
  }
}

function View() {
  const COL_WIDTH = 256;
  const TOP_BOT_MARGIN = 16;

  this.rootElement = document.getElementById("root");
  
  this.noOfCols = 0;
  this.columns;
  this.fillColIdx = 0;
  
  this.cardElements = [];
  this.loadMoreSentinel;

  this.adjustLayoutHeight = function() {
    let masonryHeight = Math.max(...this.columns.map(function(column) {
      return column.outerHeight;
    }));

    let fetchMoreColHeight = Math.min(...this.columns.map(function(column) {
      return column.outerHeight;
    }));

    cardOrder = 0;
    for (let column of this.columns) {
      for (let card of column.cards) {
        card.element.style.order = cardOrder++;
        card.element.style.flexBasis = 0;
      }

      let lastIdx = column.cards.length - 1;
      column.cards[lastIdx].element.style.flexBasis =
        column.cards[lastIdx].element.getBoundingClientRect().height + (masonryHeight - column.outerHeight) + 'px';

      if (column.outerHeight === fetchMoreColHeight) {
        column.cards[lastIdx].element.appendChild(this.fetchMoreSentinel);
      }
    }

    this.rootElement.style.maxHeight = masonryHeight + 'px';
  }

  this.populateColumns = function() {
    let newNoOfCols = Math.floor(this.rootElement.offsetWidth / COL_WIDTH);

    if (newNoOfCols == this.noOfCols || newNoOfCols === 0) {
      return;
    }

    this.noOfCols = newNoOfCols;
    this.fillColIdx = 0;
    this.columns = Array.from(new Array(newNoOfCols)).map(function(_col) {
      return {
        'cards': new Array(),
        'outerHeight': 0
      };
    });

    for (let card of this.cardElements) {
      this.columns[this.fillColIdx].cards.push(card);
      this.columns[this.fillColIdx].outerHeight += card.outerHeight;
      this.fillColIdx = (this.fillColIdx + 1) % newNoOfCols;
    }

    this.adjustLayoutHeight();
  }  

  this.appendToColumns = function(cards) {
    for (let card of cards) {
      this.columns[this.fillColIdx].cards.push(card);
      this.columns[this.fillColIdx].outerHeight += card.outerHeight;
      this.fillColIdx = (this.fillColIdx + 1) % this.noOfCols;
    }
    
    this.adjustLayoutHeight();    
  }

  this.populateCard = function(cardItem) {
    let card = document.createElement("div");
    card.className = "card";
    card.appendChild(cardItem);

    this.rootElement.appendChild(card);
    let cardStyle = getComputedStyle(card);
    
    let cardElement = {
      element: card,
      outerHeight: TOP_BOT_MARGIN + card.getBoundingClientRect().height + TOP_BOT_MARGIN
    };
    this.cardElements.push(cardElement);

    return cardElement;
  }

  this.populateImage = function(url) {
    return new Promise(function(resolve, reject) {
      let cardItem = new Image();
      cardItem.className = "card__item";
      cardItem.onload = function() {
        resolve(cardItem);
      }
      cardItem.src = url;      
    });
  }
  
  this.populateLayout = async function(cards, isAppendOnly) {
    let images = [];
    for (let i=0; i<cards.length; i++) {
      images.push(this.populateImage(cards[i]));
    }

    let cardItems = await Promise.all(images);
    let newCards = [];
    for (let i=0; i<cardItems.length; i++) {
      newCards.push(this.populateCard(cardItems[i]));
    }

    if (isAppendOnly) {
      this.appendToColumns(newCards);      
    } else {
      this.populateColumns();
    }
  }

  this.init = async function(cards, fetchMore) {
    this.fetchMoreSentinel = document.createElement("div");
    this.fetchMoreSentinel.id = 'load-more'

    let intersectionObserver = new IntersectionObserver(fetchMore);
    intersectionObserver.observe(this.fetchMoreSentinel);

    this.populateLayout(cards, false);
  }
}

window.onload = function() {
  let model = new Model();
  let view = new View();
  let controller = new Controller(model, view);

  controller.init(model, view);
  window.onresize = view.populateColumns.bind(view);
}
