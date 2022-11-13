//TO DO
//If the product price has some trailing decimal zeros (.00), they will have to be removed. Any other decimals will have to be shown;
//The products’ names should not break into two lines. If a name is too long, then it should be truncated;
/*Define Functions*/

//gets products return the data from the server/api
const getProducts = async (endpoint, query, authKey) => {
  try {
    const response = await fetch(endpoint, {
      body: query,
      method: "POST",
      headers: {
        "Content-Type": "application/graphql",
        Authorization: "Basic " + btoa(":" + authKey),
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    handleError();
  }
};

//function that grabs the best sold item ---- which is 0?
const getBestSeller = (items) => {
  let mostSold, mostSoldIndex;
  items.forEach((e, i) => {
    //populate vars with data from the first loop
    if (i === 0) {
      mostSold = e.scores.week.buys;
      mostSoldIndex = i;
    }
    //check if mostSold has value or if current element has a higher value in buys prop
    else if (e.scores.week.buys > mostSold) {
      mostSold = e.scores.week.buys;
      mostSoldIndex = i;
    }
  });
  return mostSoldIndex;
};

//function to get most views
const getMostViews = (items) => {
  let mostViewed, indexOfMostViewed;
  console.log(items, "items");
  items.forEach((e, i) => {
    //populate vars with data from the first loop
    if (i === 0) {
      mostViewed = e.scores.week.views;
      indexOfMostViewed = i;
    }
    //check if mostSold has value or if current element has a higher value in buys prop
    else if (e.scores.week.views > mostViewed) {
      mostViewed = e.scores.week.views;
      indexOfMostViewed = i;
    }
  });
  return indexOfMostViewed;
};

//append the most bought item to the dom
const appendMostBought = (mostBoughtItem) => {
  // create image element for most bought item
  const img = document.createElement("img");
  // insert src for img of most bought item
  img.src = mostBoughtItem.imageUrl;
  //append img to DOM
  document.getElementById("most-sold").appendChild(img);
};

//handle error

const handleError = (error) => {
  //create h2 element
  const h2 = document.createElement("h2");
  //add test to h2 element
  h2.innerText = `Data not retrieved please refresh due to this issue: ${error}`; //usually I would redirect on errors
  //append error to DOM
  document.getElementById("body").appendChild(h2);
};

const endpoint = "https://api.nosto.com/v1/graphql";

const authKey =
  "N7QnHtiseaaAtartB16sQ7jUcNAm0HgsTxTnwTX08GQ85EYShd90zN3qiYiDjVsq";

const query = `
    query {
        products (limit: 50) {
        products {
            name
            price
            listPrice
            brand
            imageUrl
            alternateImageUrls
            url
            scores {
                week {
                views
                buys
                     }
                    }
                }
            }
        }
    `;

//Page Load
const pageLoad = async () => {
  //fetch
  const getData = await getProducts(endpoint, query, authKey);
  console.log(getData);
  //some error handling
  if (!getData) {
    return;
  }
  //find the most sold item
  const productArray = getData.data.products.products;
  const spliced = productArray.splice(getBestSeller(productArray), 1)[0];

  //get most viewed item
  const mostViewedIndex = getMostViews(productArray);
  appendMostBought(spliced);
  console.log(mostViewedIndex, "number of views index");

  $(".all-products").slick(HomeSliderSetting());
  $.each(productArray, function () {
    const product = `<div class="wrapper"> <img alt="" src = ${this.imageUrl}/> 
    <div>
    <span>${this.brands}</span>
    </div>
    <div>
    <span>${this.names}</span>
    </div>
    <div>
    <span>${this.price}</span>
    </div>
    </div>`;
    $(".all-products").slick("slickAdd", product);
  });
};

// ************SLICK AND JQUERY***************

// slick initializer
const addSlick = () => {
  $(document).ready(() => {
    $(".all-products").slick({});
  });
};

function HomeSliderSetting() {
  return {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
}

pageLoad();
