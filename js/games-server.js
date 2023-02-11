var hasInstalled = false;

navigator.serviceWorker.getRegistrations().then(function (registrations) {
  for (let registration of registrations) {
    if (registration.active.scriptURL == location.origin + "/sw.js") {
      hasInstalled = true;
    }
  }
});

navigator.serviceWorker.register(location.origin + "/sw.js").then(function (reg) {
  if (!hasInstalled) {
    window.location.reload();
  }
});
