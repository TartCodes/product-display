let productData;
//endpoint
const endpoint = "https://api.nosto.com/v1/graphql";

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

//combine bestSeller with mostViews use an if to check
function mostViews() {
  let mostViewed = 0; //holds the most viewed product
  for (let product of productData) {
    let views = product.scores.week.views;

    if (views > mostViewed) mostViewed = views;
  }
  return mostViewed;
}

// to extract the shoe that sold the most - however, from the fetched data, they're all 0?
function bestSeller() {
  let mostSold, mostSoldIndex;

  productData.forEach((e, i) => {
    //populate vars with data from the first loop
    if ((i = 0)) {
      mostSold = e.scores.week.buys;
      mostSoldIndex = i;
    }
    //check if mostSold has value or if current element has a higher value in buys prop
    else if (e.scores.week.buys > mostSold) {
      mostSold = e.scores.week.buys;
      mostSoldIndex = i;
      console.log(mostSold, "test");
    }
  });
  // mostSoldObject = productData[mostSoldIndex]
  //if nothing has been sold default to product 0 --- all buy values from the database are 0??
  //mostSold = productData[mostSoldIndex];

  let spliced = productData.splice(mostSoldIndex, 1);
  console.log(spliced);
  //create image element
  const img = document.createElement("img");
  //insert src for img element
  img.src = spliced[0].imageUrl;

  //put image element in the DOM

  document.getElementById("most-sold").appendChild(img);
}

//   ------------

async function runEverything() {
  //   let products = data.data.products.products;
  //fetch
  async function getData() {
    let response = await fetch(endpoint, {
      method: "POST",
      headers: {
        //data type being sent
        "Content-Type": "application/graphql",
        Authorization:
          "Basic " +
          btoa(
            ":" +
              "N7QnHtiseaaAtartB16sQ7jUcNAm0HgsTxTnwTX08GQ85EYShd90zN3qiYiDjVsq"
          ),
      },
      //tell server query string
      body: query,
    });
    data = await response.json();
    return data;
  }

  await getData();
  productData = data.data.products.products;
  const mostViewed = mostViews(data);
  const mostSold = bestSeller(data);
  console.log(productData);
  console.log(mostSold, mostViewed);
  console.log(data);

  // const mostViewed = mostViews(data);
  // const mostSold = bestSeller(dataGlobal);
  // console.log(mostSold, mostViewed);

  // ************SLICK AND JQUERY***************

  //slick initializer
  // $(document).ready(() => {
  //   $(".your-class").slick({
  //     infinite: true,
  //     slidesToShow: 3,
  //     slidesToScroll: 1,
  //   });
  // });

  // //   console.log(data.data.products.products);
  // let imageUrls = data.data.products.products;

  // for (let product of imageUrls) {
  //   let urls = product.imageUrl;
  //   console.log(urls);
}

//console.log(imageUrls.imageUrl);

//   data.products.products[0].url

//   data to be pulled and placed into the dom, imgs, price, alt img, name, brand

// let image = [
//   `<div><img class="selectedImage" src=`,
//   urls,
//   '" title="',
//   escape(data),
//   '"/></div>',
// ].join("");

// $(".your-class").slick("slickAdd", image);

// //slick default styling
// $(".responsive").slick({
//   dots: true,
//   infinite: false,
//   speed: 300,
//   slidesToShow: 4,
//   slidesToScroll: 4,
//   responsive: [
//     {
//       breakpoint: 1024,
//       settings: {
//         slidesToShow: 3,
//         slidesToScroll: 3,
//         infinite: true,
//         dots: true,
//       },
//     },
//     {
//       breakpoint: 600,
//       settings: {
//         slidesToShow: 2,
//         slidesToScroll: 2,
//       },
//     },
//     {
//       breakpoint: 480,
//       settings: {
//         slidesToShow: 1,
//         slidesToScroll: 1,
//       },
//     },
//     // You can unslick at a given breakpoint now by adding:
//     // settings: "unslick"
//     // instead of a settings object
//   ],
// });
//}

runEverything();
