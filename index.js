const container = document.querySelector(".container");
      const productList = document.querySelector(".productList");
      const productCategories = document.querySelector(".productCategories");
      const productListBtn = document.querySelector(".productListBtn");
      const productCategoriesBtn = document.querySelector(".productCategoriesBtn");
      const tatCategory = document.querySelector(".tat-category");
      const tatCategoryBtn = document.querySelector(".third");

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
        console.log(regex);
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
          for (let k = 0; k < arr.length; k++) {
            if (arr[i].labels[k] !== undefined) {
              arr[i].labels[k] = await getLabelTitle(arr[i].labels[k]);
            }
          }
          let li = document.createElement("li");
            li.innerHTML = `ID ${arr[i].id} <br> Title ${arr[i].title} <br> Price ${arr[i].price}
                               <br> Labels ${arr[i].labels} <br> Categories: `;
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

      const getAllCategories = async () => {
        const arr = await getProducts();
        let categoryObj = {};
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].categories.length; j++) {
            if (categoryObj[arr[i].categories[j].title]) {
              categoryObj[arr[i].categories[j].title] += 1;
            } else {
              categoryObj[arr[i].categories[j].title] = 1;     
            }
          }
        }
        for (var key in categoryObj) {
          const button = document.createElement("button");
          button.classList.add('category')
          button.innerHTML = `${key}  (${categoryObj[key]})`;
          const div = document.createElement("div");
          div.className = `${key}`;
          div.appendChild(button);

          
          button.addEventListener("click", async function () {
            let allProductAttrTextToAdd = "";
            let counter=0;
            for (let i = 0; i < arr.length; i++) {
              let textToAdd = "";
              let content = "";
              for (let k = 0; k < arr[i].categories.length; k++) {
                if (button.innerText.includes(arr[i].categories[k].title)) {
                  for (let g = 0; g < arr[i].labels.length; g++) {
                    if (arr[i].labels[g] !== undefined) {
                      content = await getLabelAttribute(arr[i].labels[g]);
                      counter+=1
                    //   console.log(counter)
                    }
                    if (!textToAdd.includes(content)) {
                      textToAdd += content + " ";
                    }
                  }
                }
              }
              
              let arrToCheck = textToAdd.split(" ");

              for (let x = 0; x < arrToCheck.length; x++) {
                if (!allProductAttrTextToAdd.includes(arrToCheck[x])) {
                  allProductAttrTextToAdd += arrToCheck[x] + " ";
                }
              }
            }
            const finalArr = allProductAttrTextToAdd.split(" ");
            for (let d = 0; d < finalArr.length; d++) {
              if (finalArr[d] !== " " && finalArr[d] !== "") {
                const buttonAtr = document.createElement("button");
                buttonAtr.classList.add('tatCategory')
                buttonAtr.textContent = finalArr[d];
                console.log(counter)
                div.appendChild(buttonAtr);
              }
            }

          });
          productCategories.appendChild(div);
        }
      };

      productCategoriesBtn.addEventListener("click", function () {
        getAllCategories();
      })