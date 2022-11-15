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

//find the item with the most views
const getMostViews = (items) => {
  let mostViewed, indexOfMostViewed, mostViewedItem;

  // console.log(items, "items");
  items.forEach((e, i) => {
    //populate vars with data from the first loop

    if (i === 0) {
      mostViewed = e.scores.week.views;

      return (indexOfMostViewed = i);
    }
    //check if mostSold has value or if current element has a higher value in buys prop
    if (e.scores.week.views > mostViewed) {
      mostViewed = e.scores.week.views;
      indexOfMostViewed = i;
      mostViewedItem = e;
    }
  });
  return indexOfMostViewed;
};

//grabs the most bought/sold item
const getBestSeller = (items) => {
  let mostSold,
    mostSoldIndex = 0;
  items.forEach((e, i) => {
    //populate vars with data from the first loop
    if (!i) {
      mostSold = e.scores.week.buys;
      mostSoldIndex = i;
    }
    //check if mostSold has value or if current element has a higher value in buys prop
    if (e.scores.week.buys > mostSold) {
      mostSold = e.scores.week.buys;
      mostSoldIndex = i;
    }
  });
  return mostSoldIndex;
};

//Append the most sold/bought item to the dom
const appendMostBought = (mostBoughtItem) => {
  // create image element for most bought item
  const img = document.createElement("img");
  // insert src for img of most bought item
  img.src = mostBoughtItem.imageUrl;
  img.id = "most-sold-pic";
  //append img to DOM
  document.getElementById("most-sold").appendChild(img);
  const div = document.createElement("div");
  div.id = "best-text"; //<div class="best-text">BEST SELLER!</div>
  div.innerHTML = "BEST SELLER THIS WEEK!";
  document.getElementById("most-sold").appendChild(div);
  // if link is dead
  $("img").on("error", function () {
    $(this).attr("src", "./testimg/error.png");
  });
};

//handle errors

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

  appendMostBought(spliced);
  //get most viewed item
  mostViewedIndex = getMostViews(productArray);
  productArray[mostViewedIndex].mostViewed = true;
  console.log(mostViewedIndex, "number of views index");

  $.each(productArray, function () {
    const product = `<div class="carousel-cell">
    <div class="most-viewed" style= "visibility:${
      this.mostViewed ? "visible" : "hidden"
    }">MOST VIEWED!</div>
        <a target="_blank" href= "${this.url}">
          <img alt=""
          id=""
          src="${this.imageUrl}"
          onmouseover="this.src='${
            this.alternateImageUrls[0]
              ? this.alternateImageUrls[0]
              : this.imageUrl
          }'"
          onmouseout="this.src='${this.imageUrl}'"
          onerror="this.src='./testimg/error.png'"/>
        </a>
           <div class="product-info tooltip">

           
            <span>${this.brand}</span>              
            
            <span>${this.name}</span>
            <span class="tooltiptext">${this.name}</span>            
            
            <span>€${this.price}</span>     
            
         </div>
      </div>`;
    $(".all-products").append(product);
  });

  (function ($) {
    $(document).ready(function () {
      $(".all-products").flickityResponsive({
        cellAlign: "left",
        wrapAround: true,
        imagesLoaded: true,
        draggable: false,
        pageDots: false,
        responsive: [
          {
            breakpoint: 480,
            settings: {
              prevNextButtons: false,
              draggable: true,
              freeScroll: true,
              wrapAround: true,
            },
          },
        ],
        responsive: [
          {
            breakpoint: 600,
            settings: {
              prevNextButtons: false,
              draggable: true,
              freeScroll: true,
              wrapAround: true,
            },
          },
        ],
      });
    });
  })(jQuery);
};

pageLoad();
