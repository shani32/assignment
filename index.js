const container = document.querySelector(".container");
const productList = document.querySelector(".productList");
const productListBtn = document.querySelector(".productListBtn");


let attArr = {};
(async () => {
  const data = await fetch(
    `https://intense-mesa-62220.herokuapp.com/ewp.co.il/product_json.php`
  );
  const fetchData = await data.text();
  const regex = JSON.parse(fetchData.match(/\{.*\}/g));
  attArr = regex.attributes;
})().catch((err) => {
  console.error(err);
});

const getProducts = async () => {
  const data = await fetch(
    `https://intense-mesa-62220.herokuapp.com/ewp.co.il/product_json.php`
  );
  const fetchData = await data.text();
  const regex = JSON.parse(fetchData.match(/\{.*\}/g));
  return regex.products;
};

const getLabelTitle = async (id) => {
  for (let i = 0; i < attArr.length; i++) {
    for (let j = 0; j < attArr[i].labels.length; j++) {
      if (attArr[i].labels[j].id === id) {
        return attArr[i].labels[j].title;
      }
    }
  }
};

const getLabelAttribute = async (id) => {
  for (let i = 0; i < attArr.length; i++) {
    for (let j = 0; j < attArr[i].labels.length; j++) {
      if (attArr[i].labels[j].id === id) {
        return attArr[i].title;
      }
    }
  }
};

const getProductList = async () => {
  const arr = await getProducts();
  const ul = document.createElement("ul");
  for (let i = 0; i < arr.length; i++) {
    let attrWithLabel = {};
    let stringToPrint = "";
    for (let d = 0; d < arr[i].labels.length; d++) {
      if (arr[i].labels[d] !== undefined) {
        attTitleToAdd = await getLabelAttribute(arr[i].labels[d]);
        let labelTitle = await getLabelTitle(arr[i].labels[d]);
        if (attrWithLabel[attTitleToAdd]) {
          attrWithLabel[attTitleToAdd] = [
            ...attrWithLabel[attTitleToAdd],
            labelTitle,
          ];
        } else {
          attrWithLabel[attTitleToAdd] = [labelTitle];
        }
      }
    }

    for (const key in attrWithLabel) {
      stringToPrint += `${key}: ${attrWithLabel[key]} \n`;
    }
    let li = document.createElement("li");
    li.innerHTML = `ID ${arr[i].id} <br> Title ${arr[i].title} <br> Price ${arr[i].price}
                               <br> ${stringToPrint} <br> Categories: `;
    for (let j = 0; j < arr[i].categories.length; j++) {
      li.innerHTML += `${arr[i].categories[j].title}`;
    }
    ul.appendChild(li);
  }
  productList.appendChild(ul);
};
productListBtn.addEventListener("click", function () {
  getProductList();
});
