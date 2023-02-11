// This is a JavaScript code that implements various functionalities for a web page, such as registering a service worker, registering custom elements, changing the theme of the page, and implementing secret themes.
// Service Worker Registration:
// The code first registers a service worker with the path "/sw.js". A Service Worker is a script that acts as a client-side proxy for network requests and can be used for offline support and push notifications.

// Script Loading:
// The code then loads an external script from "https://cdn.jsdelivr.net/gh/3kh0/3kh0.github.io/js/main.js". The script is added to the head of the document.

// Tab Data Retrieval:
// The code retrieves tab data from the local storage using localStorage.getItem("tab"). If the tab data exists, it is parsed into a JSON object. If the tab data doesn't exist, an empty object is created.

// Tab Title and Icon Update:
// If the tab data has a title property, the document title is updated. If the tab data has an icon property, the href attribute of the link element with the rel attribute set to "icon" is updated.

// Color Contrast and Color Hex Functions:
// The code defines two functions, getContrastHex and getColorHex, which calculate the contrast color and the text color, respectively, based on a given hexadecimal color value.

// Theme Handling:
// The code retrieves the theme from local storage using localStorage.getItem("theme") or sets the theme to "default" if it does not exist. The themes are defined as an array of objects, each with a theme and a color property.

// Custom Theme:
// If the theme is set to "custom", the theme color is retrieved from local storage using localStorage.getItem("theme_color"), and the body element is updated with the custom theme color.

// Custom Elements:
// The code defines three custom elements, <changelog-added>, <changelog-removed>, and <changelog-changed>, which are used to display information about changes made to the web page.

// Secret Themes:
// The code implements secret themes using the createSecretThemeType function, which takes two arguments: the name of the theme and an array of key patterns. The function listens for key events on the document and updates the theme if the correct pattern of keys is pressed. The code also defines the secretThemeButton function, which displays the secret theme if it has been unlocked previously.

// Overall, this code is part of a larger web page that implements various functionalities, including theme handling, custom elements, and secret themes.

try {
  navigator.serviceWorker.register(location.origin + "/sw.js");
} catch (error) {
  console.error("Service Worker registration failed:", error);
  console.warn("Since the registration of the serivce worker failed, many things will also break.");
}

const jsdelivr = document.createElement("script");
jsdelivr.setAttribute("src", "https://cdn.jsdelivr.net/gh/3kh0/3kh0.github.io/js/main.js");
document.head.append(jsdelivr);

var tab = localStorage.getItem("tab");
if (tab) {
  try {
    var tabData = JSON.parse(tab);
  } catch {
    var tabData = {};
  }
} else {
  var tabData = {};
}
if (tabData.title) {
  document.title = tabData.title;
}
if (tabData.icon) {
  document.querySelector("link[rel='icon']").href = tabData.icon;
}

function getContrastHex(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#1c1c1c' : 'white';
}

function getColorHex(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'white' : 'black';
}

var theme = localStorage.getItem("theme") || "default";

const themes = [
  {
    theme: 'default',
    color: '#4caf50'
  },
  {
    theme: 'light',
    color: '#4caf50'
  },
  {
    theme: 'orchid',
    color: '#b625cc'
  },
  {
    theme: 'sky',
    color: '#0084ff'
  },
  {
    theme: 'winter',
    color: '#3da341'
  },
  {
    theme: 'nebelung',
    color: '#3d2d1e'
  },
  {
    theme: 'piplup',
    color: '#0026ff'
  },
  {
    theme: 'forternish',
    color: '#003443'
  },
  {
    theme: 'northernfish',
    color: '#0ec9f8'
  },
  {
    theme: 'forgor',
    color: '#d7d700'
  },
  {
    theme: 'monotonium',
    color: '#fff'
  },
  {
    theme: 'monotonium-dark',
    color: '#000'
  },
  {
    theme: 'concrete',
    color: '#808080'
  },
  {
    theme: 'sunset',
    color: '#e83141'
  }
]

if (theme !== 'custom') {
  document.body.setAttribute("theme", theme);

  if (location.pathname.includes('/settings')) {
    themes.forEach(palette => {
      if (palette.theme == theme) {
        document.querySelector('#theme_color').value = palette.color;
      }
    });
  }
} else {
  const theme = localStorage.getItem('theme_color');

  document.body.setAttribute('theme', 'custom');
  document.body.style = `--theme: ${theme}; --background: ${getContrastHex(theme)}; --text: ${getColorHex(theme)}; --text-secondary: ${getColorHex(theme)};`;

  if (location.pathname.includes('/settings')) {
    document.querySelector('#theme_color').value = theme;
  }
}

class changelogAdded extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <div class="changelog-item">
        <div class="changelog-type" added></div>
        ${this.innerText}
        </div>
        `;
  }
}

customElements.define("changelog-added", changelogAdded);

class changelogRemoved extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <div class="changelog-item">
        <div class="changelog-type" removed></div>
        ${this.innerText}
        </div>
        `;
  }
}

customElements.define("changelog-removed", changelogRemoved);

class changelogChanged extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <div class="changelog-item">
        <div class="changelog-type" changed></div>
        ${this.innerText}
        </div>
        `;
  }
}

customElements.define("changelog-changed", changelogChanged);

function foundSecretTheme(name) {
  document.body.setAttribute("theme", name);
  localStorage.setItem("theme", name);
  localStorage.setItem(name, "true");
  if (document.querySelector("." + name)) {
    document.querySelector("." + name).removeAttribute("hidden");
  }
}

function secretThemeButton(name) {
  if (localStorage.getItem(name) == "true") {
    if (document.querySelector("." + name)) {
      document.querySelector("." + name).removeAttribute("hidden");
    }
  }
}

function createSecretThemeType(name, pattern) {
window[name + "pattern"] = pattern;
window[name + "current"] = 0;
  
var themePattern = window[name + "pattern"]
var themeCurrent = window[name + "current"]

document.addEventListener("keydown", function (e) {
  if (e.key !== themePattern[themeCurrent]) {
    return (themeCurrent = 0);
  }

  themeCurrent++;

  if (themePattern.length == themeCurrent) {
    themeCurrent = 0;
    foundSecretTheme(name);
  }
});
  
secretThemeButton(name)
}

createSecretThemeType("nebelung", ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"])
createSecretThemeType("piplup", ["p", "i", "p", "l", "u", "p", "i", "s", "c", "o", "o", "l"])
createSecretThemeType("forternish", ["c", "o", "m", "i", "c", "s", "a", "n", "s"])