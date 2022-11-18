class Page {
  endpoint = "https://api.nosto.com/v1/graphql"; // usually would hide in an .env

  authKey = "N7QnHtiseaaAtartB16sQ7jUcNAm0HgsTxTnwTX08GQ85EYShd90zN3qiYiDjVsq"; // usually would hide in an .env

  query = `
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

  // named properties
  productArray;
  mostBoughtItem; //needs to have the spliced value

  //FETCH ---
  //gets products return the data from the server/api
  async getProducts() {
    try {
      const response = await fetch(this.endpoint, {
        body: this.query,
        method: "POST",
        headers: {
          "Content-Type": "application/graphql",
          //just a basic auth to provide a user name and pw when making a request - Base64 binary string
          Authorization: "Basic " + btoa(":" + this.authKey),
        },
      });
      const data = await response.json();
      this.productArray = data.data.products.products;
    } catch (err) {
      this.handleError();
    }
  }

  // METHODS ------

  //get most sold and views
  getBestSellerAndMostViewed() {
    //init and object with values for return
    let mostViewed = 0,
      mostBought = 0,
      mostViewedIndex = 0,
      mostBoughtIndex = 0;

    //loop each item in the array to replace values of vars tracking highest values
    this.productArray.forEach((e, i) => {
      let currentViews = e.scores.week.views,
        currentBuys = e.scores.week.buys;

      if (currentViews > mostViewed) {
        mostViewed = currentViews;
        mostViewedIndex = i;
      }
      if (currentBuys > mostBought) {
        mostBought = currentBuys;
        mostBoughtIndex = i;
      }
    });
    //if the index value of most bought is less than most viewed, subtract 1 from most viewed due to removing the most bought from the array later
    mostViewedIndex =
      mostBoughtIndex < mostViewedIndex ? mostViewedIndex - 1 : mostViewedIndex;
    this.mostBoughtItem = this.productArray.splice(
      this.productArray[mostBoughtIndex],
      1
    )[0];
    this.productArray[mostViewedIndex].mostViewed = true;
  }

  //Append the most sold/bought item to the dom
  appendMostBought() {
    // create image element for most bought item
    const img = document.createElement("img");
    // insert src for img of most bought item
    img.src = this.mostBoughtItem.imageUrl;
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
  }

  //handle errors
  handleError() {
    //create h2 element
    const h2 = document.createElement("h2");
    //add test to h2 element
    h2.innerText = `Data not retrieved please refresh due to this issue: ${error}`; //usually I would redirect on errors
    //append error to DOM
    document.getElementById("body").appendChild(h2);
  }
}

//Create the page

let newPage = new Page();

const loadPage = async () => {
  await newPage.getProducts();
  newPage.getBestSellerAndMostViewed();
  newPage.appendMostBought();

  // jquery to append the dom
  $.each(newPage.productArray, function () {
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
            breakpoint: 300,
            prevNextButtons: false,
          },
        ],
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
              prevNextButtons: true,
              draggable: true,
              freeScroll: true,
              wrapAround: true,
            },
          },
        ],
        responsive: [
          {
            breakpoint: 1300,
            settings: {
              draggable: true,
            },
          },
        ],
      });
    });
  })(jQuery);
};
loadPage();
