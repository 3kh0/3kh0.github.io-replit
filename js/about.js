(async () => {
    var version = document.getElementById("version");
    var versionWarning = document.getElementById("version-warning");
  
    var currentVersion;
    var latestVersion;
  
    try {
      var infoFetch = await fetch(location.origin + "/info.json");
      try {
        var infoResult = await infoFetch.json();
        if (infoResult.version) {
          currentVersion = infoResult.version;
        }
      } catch {}
    } catch {}
  
    try {
      var infoFetch = await fetch("https://raw.githack.com/3kh0/3kh0.github.io/main/info.json");
      try {
        var infoResult = await infoFetch.json();
        if (infoResult.version) {
          latestVersion = infoResult.version;
        }
      } catch {}
    } catch {}
  
    if (currentVersion) {
      version.innerText = "You are on version " + currentVersion;
    } else {
      version.innerText = "Cannot get current version.";
    }
  
    var oldMessage = "Warning: You are on a older version. The current version is %VERSION%"
    var betaMessage = "You are on a pre-release version! The current release is %VERSION%"
    var otherMessage = "You not on the currently released version. The current release is %VERSION%"

    if (latestVersion && currentVersion !== latestVersion) {
      var latestVersionNumber = latestVersion.replace("v", "").replaceAll("-", ".")
      var firstStr = latestVersionNumber.search(/\./) + 1
      latestVersionNumber = Number(latestVersionNumber.substr(0, firstStr) + latestVersionNumber.slice(firstStr).replace(/\./g, ''))

      var currentVersionNumber = currentVersion.replace("v", "").replaceAll("-", ".")
      var firstStr2 = currentVersionNumber.search(/\./) + 1
      currentVersionNumber = Number(currentVersionNumber.substr(0, firstStr2) + currentVersionNumber.slice(firstStr2).replace(/\./g, ''))

      var message;

      if (isNaN(latestVersionNumber) || isNaN(currentVersionNumber)) {
          message = otherMessage
      } else {
          if (currentVersionNumber > latestVersionNumber) {
              message = betaMessage
          } else {
              message = oldMessage
          }
      }

      versionWarning.innerText = betaMessage.replace("%VERSION%", latestVersion);
      versionWarning.style.display = "block";
    }
  })();
