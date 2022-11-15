//define constants

const endpoint = "https://api.nosto.com/v1/graphql";

const authKey =
  "N7QnHtiseaaAtartB16sQ7jUcNAm0HgsTxTnwTX08GQ85EYShd90zN3qiYiDjVsq"; // this would be hidden in an .env file and imported

const query = `
      query {
          products (limit: 51) {
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

//gets the best seller and the most viewed and returns them in an array most viewed in index 0 most bought in index 1
const getBestSellerAndMostViewed = (items) => {
  //init and object with values for return
  let indices = {
      mostBought: 0,
      mostViewed: 0,
    },
    //track the values for most bought and most viewed
    mostViewed = 0,
    mostBought = 0;
  //loop each item in the array to replace values of vars tracking highest values
  items.forEach((e, i) => {
    if (e.scores.week.views > mostViewed) {
      mostViewed = e.scores.week.views;
      indices.mostViewed = i;
    }
    if (e.scores.week.buys > mostBought) {
      mostBought = e.scores.week.buys;
      indices.mostBought = i;
    }
  });
  //if the index value of most bought is less than most viewed, subtract 1 from most viewed due to removing the most bought from the array later
  indices.mostViewed =
    indices.mostBought < indices.mostViewed
      ? indices.mostViewed - 1
      : indices.mostViewed;
  //return indices object
  return indices;
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
  div.id = "best-text";
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

//Page Load
const pageLoad = async () => {
  //fetch
  const getData = await getProducts(endpoint, query, authKey);
  //some error handling
  if (!getData) {
    return;
  }
  console.log(getData);
  const productArray = getData.data.products.products;
  //call the most sold and most viewed items
  const highestIndices = getBestSellerAndMostViewed(productArray);
  //remove the most bought from the carousel
  const spliced = productArray.splice(highestIndices.mostBought, 1)[0]; //splice returns an array
  //assign the mostViewed property to the element with the most views
  productArray[highestIndices.mostViewed].mostViewed = true;
  //appends the most bought
  appendMostBought(spliced);
  // jquery to append the dom
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

                <span>€${String(this.price).replace(/\.00$/, "")}</span>

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
