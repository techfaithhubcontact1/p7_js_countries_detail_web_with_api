// select dom elm 
const countryDetailElm = document.querySelector(".country_detail");
const backBtn = document.querySelector(".main_container .back_btn");
const darkModeElm = document.querySelector(".mode_elm .fa-moon");
const lightModeElm = document.querySelector(".mode_elm .fa-sun");

let countryName =  new URLSearchParams(location.search).get("name"); 

// for fetch data for specific country and border countries
async function fetchCountry(endPoint, countryName){
     let response = await fetch(`https://restcountries.com/v3.1/${endPoint}/${countryName}`);
     let countryData = await response.json();

     let borders = countryData[0].borders?countryData[0].borders.join(','):"";
     let brCountries = [];
     if(borders){
          let borderRes = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borders}`);
          brCountries = await borderRes.json()
     }
     showCountry(countryData, brCountries);
     return countryData;
};
fetchCountry("name", countryName);

// show specific country data on the page.
async function showCountry(countryData, brCountries){
     let {
          flags:{svg},
          name:{common},
          population, 
          region,
          subregion,
          currencies,
          languages,
          tld
     } = countryData[0];

     let currKey = Object.keys(currencies)[0];
     let nativeKey =  Object.keys(countryData[0].name.nativeName)[0];
     
     let capital = countryData[0].capital?countryData[0].capital[0]:"";
     languages = Object.values(languages).join(", "); 
     tld = tld.join(", ")

     countryDetailElm.innerHTML += `
          <div class="img_elm"><img src=${svg} alt="IMG"></div>
          <div class="content_elm">
               <h2>${common}</h2>
               <div class="top_elm">
                    <div class="left_elm">
                         <p><b>NativeName : </b>${countryData[0].name.nativeName[nativeKey].official}</p>
                         <p><b>Population : </b>${population.toLocaleString("en-IN")}</p>
                         <p><b>Region : </b>${region}</p>
                         <p><b>Sub Region : </b>${subregion}</p>
                         <p><b>Capital : </b>${capital}</p>
                    </div>
                    <div class="right_elm">
                         <p><b>TL Domain : </b>${tld}</p>
                         <p><b>Currencies : </b>${currencies[currKey].symbol}</p>
                         <p><b>Languages : </b>${languages}</p>
                    </div>
               </div>
               <div class="bottom_elm">
                    <p class="b_country"><b>Border Countries : </b>
                         <button class="btn btn-sm md light_md">${brCountries[0]?brCountries[0].name.common:""}</button>
                         <button class="btn btn-sm md light_md">${brCountries[1]?brCountries[1].name.common:""}</button>
                         <button class="btn btn-sm md light_md">${brCountries[2]?brCountries[2].name.common:""}</button>
                         <button class="btn btn-sm md light_md">${brCountries[3]?brCountries[3].name.common:""}</button>
                    </p>
               </div>
          </div>
     `;
     let borderButtons = document.querySelectorAll(".b_country .btn");
     borderButtons.forEach((elm)=>{
          elm.setAttribute("onclick", "borderFun(this)");
     });

     let mdElm = document.querySelectorAll(".md");
     // for dark mode.
     darkModeElm.addEventListener("click", ()=>{
          darkModeElm.classList.add("hide");
          lightModeElm.classList.remove("hide");
          mdElm.forEach((elm)=>{
               elm.classList.add("dark_md");
               elm.classList.remove("light_md");
               localStorage.setItem("dkk", true);
          });
     });
     // for light mode.
     lightModeElm.addEventListener("click", ()=>{
          lightModeElm.classList.add("hide");
          darkModeElm.classList.remove("hide");
          mdElm.forEach((elm)=>{
               elm.classList.remove("dark_md");
               elm.classList.add("light_md");
               localStorage.setItem("dkk", false);
          });
     });

     let lDk = localStorage.getItem("dkk");
     if(lDk === true){
          darkModeElm.classList.add("hide");
          lightModeElm.classList.remove("hide");
          mdElm.forEach((elm)=>{
               elm.classList.add("dark_md");
               elm.classList.remove("light_md");
          });
     }
};

const mainCountryBtn = document.querySelector(".country_btn");
// for get specific border country data.
function borderFun(elm){
     countryDetailElm.innerHTML = "";
     fetchCountry("name", elm.innerText);
     mainCountryBtn.innerText = countryName;
     mainCountryBtn.classList.remove("hide");
};
// for main country
mainCountryBtn.addEventListener("click",(e)=>{
     countryDetailElm.innerHTML = "";
     fetchCountry("name", e.target.innerText);
     mainCountryBtn.classList.add("hide");
});
// back button functionality
backBtn.addEventListener("click",()=>{
     history.back();
});

