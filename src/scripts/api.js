const routes = {
  champions: "https://java-project-956272377903.southamerica-east1.run.app/champions",
  ask: "https://java-project-956272377903.southamerica-east1.run.app/champions/{id}/ask"
};

const apiService = {
  async getChampions(){
    const route = routes.champions
    const response = await fetch(route)
    return await response.json()
  },

  async postAskChampion(id, message){
    const route = routes.ask.replace("{id}", id);
    const options = {
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: message
      }),
    }
    const response = await fetch(route, options);
    return await response.json()

  }
};

const state = {
  values:{
    champions: []
  },
  views:{
    avatar: document.getElementById("avatar"),
    response: document.querySelector(".text-response"),
    question: document.getElementById("text-request"),
    carousel: document.getElementById("carousel-cards-content")
  }
}

async function main() {
  //const data = await apiService.postAskChampion(1,"a caitlyn ou a vi?")
  //console.log(data)

  await loadChampions()
  await renderChampions()
  await loadCarrousel();

}

async function loadChampions(){
  //1. chamada pra api do palhaço
  const data = await apiService.getChampions();
  //2. guardar os dados de personagens
  state.values.champions = data;

}

async function renderChampions() {
  //3. carregar personagens na tela
  const championsData = state.values.champions;
  const elements = championsData.map(
    (character) => 
        `<div class="timeline-carousel__item" onclick="onChangeChampionSelected(${character.id}, '${character.imageUrl}')" >
        <div class="timeline-carousel__image">
          <div class="media-wrapper media-wrapper--overlay"
            style="background: url('${character.imageUrl}') center center; background-size:cover;">
          </div>
        </div>
        <div class="timeline-carousel__item-inner">
          <span class="name">${character.name}</span>
          <span class="role">${character.role}</span>
          <p>${character.lore}</p>
        </div>
      </div>`
    )
    
    state.views.carousel.innerHTML = elements.join(" ")
}

async function onChangeChampionSelected(id, imageUrl) {
  // trocar a imagem do avatar
  state.views.avatar.style.backgroundImage = `url('${imageUrl}')`
  // guardar o id do personagem selecionado
  state.views.avatar.dataset.id = id
  // reset do formulario
  await resetForm();
}

async function resetForm(){
  state.views.question.value = ""
  state.views.response.textContent= await getRandomQuote();
}

async function getRandomQuote(){
  const quotes= [
    "Pode vir meu nobre",
    "Vamo que vamo meu chapa",
    "Pode vir quente que eu to fervendo",
    "Talvez seja melhor ir jogar dota...",
    "Ainda to tentando entender como essa geringonça funciona"
  ]
  const randomInt = Math.floor(Math.random() * quotes.length);
  return quotes[randomInt]
}

async function fetchAskChampion(){

  document.body.style.cursor = "wait";
  const id = state.views.avatar.dataset.id;
  const message = state.views.question.value;
  const response = await apiService.postAskChampion(id, message);
  state.views.response.textContent = response.answer;
  document.body.style.cursor = "default";
}



async function loadCarrousel() {
  const caroujs = (el) => {
    return $("[data-js=" + el + "]");
  };

  caroujs("timeline-carousel").slick({
    infinite: false,
    arrows: true,
    arrows: true,
    prevArrow:
      '<div class="slick-prev"> <div class="btn mr-3 btn-warning d-flex justify-content-center align-items-center"> <div>Anterior</div><svg class="ml-1" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"> <path d="M10.1,19.1l1.5-1.5L7,13h14.1v-2H7l4.6-4.6l-1.5-1.5L3,12L10.1,19.1z"/> </svg></div></div>',
    nextArrow:
      '<div class="slick-next"> <div class="btn btn-warning d-flex justify-content-center align-items-center"> <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M 14 4.9296875 L 12.5 6.4296875 L 17.070312 11 L 3 11 L 3 13 L 17.070312 13 L 12.5 17.570312 L 14 19.070312 L 21.070312 12 L 14 4.9296875 z"/> </svg> <div>Próximo</div></div></div>',
    dots: true,
    autoplay: false,
    speed: 1100,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
}

main();
