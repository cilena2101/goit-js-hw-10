import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

let getRef = selector => document.querySelector(selector);
const searchBoxRef = getRef('#search-box');
const countryListRef = getRef('.country-list');
const countryInfoRef = getRef('.country-info');

searchBoxRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  let nameCountry = evt.target.value.trim();

  if (nameCountry) {
   return fetchCountries(nameCountry)
      .then(data => {
        createMarkup(data);
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
			});		
  }
}

function createMarkup(array) {
  if (array.length === 1) {
    countryListRef.innerHTML = '';
    return markupCountry(array);
  } 
  if (array.length >= 2 && array.length <= 10) {
    countryInfoRef.innerHTML = '';
    return markupCountryList(array); 
  }
  return Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function markupCountryList(data) {
  const markup = data
    .map(el => {
      return `<li class="country-item">
            <img src="${el.flags.svg}" alt="${el.name.official}" height="30" width="40"  /> 
            <p class="country-text">${el.name.official}</p>
            </li>`;
    })
    .join('');

  countryListRef.innerHTML = markup;
}

function markupCountry(data) {
  const markup = data
    .map(el => {
      return `<h1>
       <img src="${el.flags.svg}" alt="${el.name.official}" height="30" width="40"  />  
        ${el.name.official}
      </h1>
      <ul class="country-info">
        <li class="country-info_item">
          <h2>Capital:</h2>
          <p>${el.capital}</p>
        </li>
        <li class="country-info_item">
          <h2>Population:</h2>
          <p>${el.population}</p>
        </li>
        <li class="country-info_item">
          <h2>Languages:</h2>
          <p>${Object.values(el.languages).join(', ')}</p>
        </li>
      </ul>`;
    })
    .join('');

  countryInfoRef.innerHTML = markup;
}