// select dom elms 
const cardsSectionElm = document.querySelector(".cards_section");
const searchElm = document.querySelector(".search_elm #country"); 
const searchBtn = document.querySelector(".search_elm .search"); 
const regionsElm = document.querySelector(".search_filter #select"); 
const darkModeElm = document.querySelector(".mode_elm .fa-moon");
const lightModeElm = document.querySelector(".mode_elm .fa-sun");

let data = [];
// for fetch all countries data.
async function fetchCountries(endPoint, countryName){
     let response = await fetch(`https://restcountries.com/v3.1/${endPoint}/${countryName?countryName:""}`);
     let allCountriesData = await response.json();
     showCountries(allCountriesData);
     return allCountriesData;
};
async function loadData(){
     data = await fetchCountries("all");
};
loadData();

// search country by name.
searchBtn.addEventListener("click", async()=>{
     cardsSectionElm.innerHTML = "";
     let inputVal = searchElm.value;
     if(inputVal !== ""){
          let countryData = await fetchCountries("name", inputVal);
          showCountries(countryData);
     }else {
          showCountries(data);
     }
});

// filter country by region
regionsElm.addEventListener("change", async(e)=>{
     cardsSectionElm.innerHTML = "";
     let val = e.target.value;
     if(val !== "All"){
          let regionData = await fetchCountries("region", val);
          showCountries(regionData);
     }else {
          showCountries(data);
     }
});

// render all countries data on the page.
async function showCountries(allData){
     allData.map((countryData)=>{
          const {flags:{svg}, name:{common}, population:population, region:region} = countryData;
          let capital = countryData.capital?countryData.capital[0]:"";

          let cardElm = `
               <div class="card">
                    <a href="/country.html?name=${common}" class="md light_md">
                         <img src=${svg} alt="country">
                         <div class="card-body">
                              <h5 class="card-title">${common}</h5>
                              <p class="card-text"><b>Population : </b>${population.toLocaleString("en-IN")}</p>
                              <p class="card-text"><b>Region : </b>${region}</p>
                              <p class="card-text"><b>Capital : </b>${capital}</p>
                         </div>
                    </a>
               </div>
          `;
          cardsSectionElm.innerHTML += cardElm;
     });
     const ModeElm = document.querySelectorAll(".md");
     
     // for dark mode
     darkModeElm.addEventListener("click", ()=>{
          darkModeElm.classList.add("hide");
          lightModeElm.classList.remove("hide");
          ModeElm.forEach((elm)=>{
               elm.classList.remove("light_md");
               elm.classList.add("dark_md");
               localStorage.setItem("dkMode", true);
          });
     });
     // for light mode
     lightModeElm.addEventListener("click", ()=>{
          darkModeElm.classList.remove("hide");
          lightModeElm.classList.add("hide");
          ModeElm.forEach((elm)=>{
               elm.classList.add("light_md");
               elm.classList.remove("dark_md");
               localStorage.setItem("dkMode", false);
          });
     });

     let lMode = localStorage.getItem("dkMode");
     if(lMode === true){
          darkModeElm.classList.add("hide");
          lightModeElm.classList.remove("hide");
          ModeElm.forEach((elm)=>{
               elm.classList.remove("light_md");
               elm.classList.add("dark_md");
          });
     };
};
