function Model() {
  this.cards = [];

  this.fetchDoggos = function() {
    return fetch("https://dog.ceo/api/breeds/image/random/50")
      .then(function(response) {
        return response.json();
      });
  };
}

function Controller(model, view) {
  this.model = model;
  this.view = view;
  
  this.init = async function() {
    let result = await this.model.fetchDoggos();
    this.model.cards = result.message;

    this.view.populateLayout(this.model.cards)
  }
}

function View() {
  const COL_WIDTH = 256;
  this.rootElement = document.getElementById("root");
  this.noOfCols = 0;
  this.cardsElements = [];

  this.onResize = function() {
    let newNoOfCols = Math.floor(this.rootElement.offsetWidth / COL_WIDTH);

    if (newNoOfCols == this.noOfCols) {
      return;
    }

    this.noOfCols = newNoOfCols;
    let columns = Array.from(new Array(this.noOfCols)).map(function(_col) {
      return {
        'cards': new Array(),
        'outerHeight': 0
      };
    });

    let idx = 0;
    for (let card of this.cardsElements) {
      columns[idx].cards.push(card);
      columns[idx].outerHeight += card.outerHeight;
      idx = (idx + 1) % newNoOfCols;
    }

    let masonryHeight = Math.max(...columns.map(function(column) {
      return column.outerHeight;
    }));

    let order = 0;
    for (let column of columns) {
      for (let card of column.cards) {
        card.element.style.order = order++;
        card.element.style.flexBasis = 0;
      }

      if (column.cards.length) {
        column.cards[column.cards.length - 1].element.style.flexBasis =
          column.cards[column.cards.length - 1].element.getBoundingClientRect().height + (masonryHeight - column.outerHeight) + 'px';
      }
    }

    this.rootElement.style.maxHeight = masonryHeight + 'px';
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

  this.populateCard = function(cardItem) {
    let card = document.createElement("div");
    card.className = "card";
    card.appendChild(cardItem);

    this.rootElement.appendChild(card);
    let cardStyle = getComputedStyle(card);

    this.cardsElements.push({
      element: card,
      outerHeight: parseInt(cardStyle.marginTop) + card.getBoundingClientRect().height + parseInt(cardStyle.marginBottom)
    })
  }
  
  this.populateLayout = async function(cards) {
    if (!cards) {
      this.onResize();
    }    

    let images = [];
    for (let i=0; i<cards.length; i++) {
      images.push(this.populateImage(cards[i]));
    }

    let cardItems = await Promise.all(images);
    for (let i=0; i<cardItems.length; i++) {
      this.populateCard(cardItems[i]);
    }

    this.onResize();    
  }
}

window.onload = function() {
  let model = new Model();
  let view = new View();
  let controller = new Controller(model, view);

  controller.init(model, view);
  window.onresize = view.onResize.bind(view);
}
