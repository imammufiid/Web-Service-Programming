const ApiKey = '4405f261db8843dc88c339b9074f74d1';
const baseUrl = 'https://api.football-data.org/v2/'
const leagueId = '2021'

const listEndpoint = {
  base: `${baseUrl}competitions/${leagueId}`,
  team: `${baseUrl}competitions/${leagueId}/teams`,
  standing: `${baseUrl}competitions/${leagueId}/standings`,
  match: `${baseUrl}competitions/${leagueId}/matches`
}

const contents = document.querySelector('#content-list')
const title = document.querySelector('#card-title')
const fetchHeader = {
  headers: {
    'X-Auth-Token': ApiKey
  }
}

function getListTeams() {
  title.innerHTML = "Daftar Tim Liga Primer Inggris"
  fetch(listEndpoint.team, fetchHeader)
    .then(response => response.json())
    .then(resJson => {
      console.log(resJson.teams);
      let teams = ""
      resJson.teams.forEach(team => {
        teams += `
          <li class="collection-item avatar">
            <img src="${team.crestUrl}" alt="" class="circle">
            <span class="title">${team.name}</span>
            <p>
                Founded : ${team.founded} <br>
                Vanue : ${team.venue} <br>
                Website : <a href='${team.website}' target='_blank'>${team.website}</a>
            </p>
            <a href="#!" class="secondary-content"><i class="material-icons">info</i></a>
          </li>`
      });
      contents.innerHTML = `<ul class="collection">${teams}</ul>`
    }).catch(e => {
      console.error(e);
    })
}

function getListStanding() {
  title.innerHTML = "Daftar Klasemen Sementara Liga Primer Inggris"
  fetch(listEndpoint.standing, fetchHeader)
    .then(response => response.json())
    .then(resJson => {
      console.log(resJson.standings[0]);
      let standings = ""
      let i = 1
      resJson.standings[0].table.forEach(item => {
        standings += `
          <tr>
            <td>${i}</td>
            <td>
              <img src="${item.team.crestUrl}" alt="${item.team.name}" width="30px" class="circle">
            </td>
            <td>${item.team.name}</td>
            <td>${item.playedGames}</td>
            <td>${item.won}</td>
            <td>${item.draw}</td>
            <td>${item.lost}</td>
            <td>${item.points}</td>
          </tr>`
          i++
      });
      contents.innerHTML = `<table class="striped centered responsive-table">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Nama Klub</th>
            <th>Played Games</th>
            <th>Menang</th>
            <th>Seri</th>
            <th>Kalah</th>
            <th>Point</th>
          </tr>
        </thead>
        <tbody>
          ${standings}
        </tbody>
      </table>`
    }).catch(e => {
      console.error(e);
    })
}

function getListMatches() {
  title.innerHTML = "Jadwal Liga Primer Inggris"
  fetch(listEndpoint.match, fetchHeader)
  .then(response => response.json())
  .then(resJson => {
    console.log(resJson.matches);
    let matches = ""
    let i = 1
    resJson.matches.forEach(item => {
      let d = new Date(item.utcDate).toLocaleDateString("id")
      let scoreHomeTeam = (item.score.fullTime.homeTeam == null?0:item.score.fullTime.homeTeam)
      let scoreAwayTeam = (item.score.fullTime.awayTeam == null?0:item.score.fullTime.awayTeam)
      matches += `
        <tr>
          <td>${i}</td>
          <td><b>${item.homeTeam.name}</b> vs <b>${item.awayTeam.name}</b></td>
          <td>${d}</td>
          <td>${scoreHomeTeam} - ${scoreHomeTeam}</td>
        </tr>`
        i++
    });
    contents.innerHTML = `<table class="striped centered responsive-table">
      <thead>
        <tr>
          <th></th>
          <th>Klub</th>
          <th>Tanggal</th>
          <th>Score Akhir</th>
        </tr>
      </thead>
      <tbody>
        ${matches}
      </tbody>
    </table>`
  }).catch(e => {
    console.error(e);
  })
}


function loadpage(page) {
  switch (page) {
    case "teams":
      getListTeams()
      break;
    case "standings":
      getListStanding()
      break;
    case "matches":
      getListMatches()
      break;
  
    default:
      break;
  }
}

function navigation() {
  document.querySelectorAll(".sidenav a, .topnav a").forEach(element => {
    element.addEventListener("click", event => {
      let sideNav = document.querySelector('.sidenav')
      M.Sidenav.getInstance(sideNav).close()
      page = event.target.getAttribute("href").substr(1)
      loadpage(page)
    })
  })

  var page = window.location.hash.substr(1)
  console.log(page);
  if(page === "" || page === "!") page = "teams"
  loadpage(page)
}


document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
  navigation()
});