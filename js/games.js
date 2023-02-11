function searchGames(query) {
    var gamesElement = document.querySelector(".games");
  
    for (let game in gamesElement.children) {
      if (gamesElement.children[game] instanceof Element) {
        if (query) {
          var gameName = gamesElement.children[game].querySelector(".game-text").innerText.trim().toLowerCase();
          if (gameName.includes(query)) {
            gamesElement.children[game].removeAttribute("hidden");
          } else {
            gamesElement.children[game].setAttribute("hidden", "");
          }
        } else {
          gamesElement.children[game].removeAttribute("hidden");
        }
      }
    }
  
    if (document.querySelectorAll(".game:not([hidden])").length == 0) {
      document.querySelector(".nogames").style.display = "initial";
    } else {
      document.querySelector(".nogames").style.display = "none";
    }
  }
  
  (async () => {
    var gamesElement = document.querySelector(".games");
  
    var gamesData = await fetch('./assets/games.json');
    var games = await gamesData.json();
  
    for (let game in games) {
      var newGame = document.createElement("a");
      newGame.className = "game";
      newGame.setAttribute("href", games[game].url);
  
      var gameImage = document.createElement("img");
      gameImage.className = "game-image";
      gameImage.src = games[game].img
      gameImage.setAttribute("onerror", "this.src='./assets/globe.svg'")
  
      newGame.appendChild(gameImage);
  
      var gameText = document.createElement("div");
      gameText.className = "game-text";
      gameText.innerText = games[game].name;
  
      newGame.appendChild(gameText);
  
      gamesElement.appendChild(newGame);
    }
  
    document.querySelector(".spinner").style.display = "none";
  })();
  
  function getMainSave() {
    var mainSave = {};
  
    var localStorageDontSave = ["theme", "tab", "nebelung"];
  
    localStorageSave = Object.entries(localStorage);
  
    for (let entry in localStorageSave) {
      if (localStorageDontSave.includes(localStorageSave[entry][0])) {
        localStorageSave.splice(entry, 1);
      }
    }
  
    localStorageSave = btoa(JSON.stringify(localStorageSave));
  
    mainSave.localStorage = localStorageSave;
  
    cookiesSave = document.cookie;
  
    cookiesSave = btoa(cookiesSave);
  
    mainSave.cookies = cookiesSave;
  
    mainSave = btoa(JSON.stringify(mainSave));
  
    mainSave = CryptoJS.AES.encrypt(mainSave, "save").toString();
  
    return mainSave;
  }
  
  function downloadMainSave() {
    var data = new Blob([getMainSave()]);
    var dataURL = URL.createObjectURL(data);
  
    var fakeElement = document.createElement("a");
    fakeElement.href = dataURL;
    fakeElement.download = "projects.save";
    fakeElement.click();
    URL.revokeObjectURL(dataURL);
  }
  
  function getMainSaveFromUpload(data) {
    data = CryptoJS.AES.decrypt(data, "save").toString(CryptoJS.enc.Utf8);
  
    var mainSave = JSON.parse(atob(data));
    var mainLocalStorageSave = JSON.parse(atob(mainSave.localStorage));
    var cookiesSave = atob(mainSave.cookies);
  
    for (let item in mainLocalStorageSave) {
      localStorage.setItem(mainLocalStorageSave[item][0], mainLocalStorageSave[item][1]);
    }
  
    document.cookie = cookiesSave;
  }
  
  function uploadMainSave() {
    var hiddenUpload = document.querySelector(".hiddenUpload");
    hiddenUpload.click();
  
    hiddenUpload.addEventListener("change", function (e) {
      var files = e.target.files;
      var file = files[0];
  
      if (!file) {
        return;
      }
  
      var reader = new FileReader();
  
      reader.onload = function (e) {
        getMainSaveFromUpload(e.target.result);
  
        var uploadResult = document.querySelector(".uploadResult");
        uploadResult.innerText = "Uploaded save!";
        uploadResult.style.display = "initial";
        setTimeout(function () {
          uploadResult.style.display = "none";
        }, 3000);
      };
  
      reader.readAsText(file);
    });
  }

var hiiPattern = ["h", "i", "i"];
var hiiCurrent = 0;

document.addEventListener("keydown", function (e) {
  if (e.key !== hiiPattern[hiiCurrent]) {
    return (hiiCurrent = 0);
  }

  hiiCurrent++;

  if (hiiPattern.length == hiiCurrent) {
    hiiCurrent = 0;
    document.querySelector(".hii").removeAttribute("hidden");
  }
});
