(async () => {
  var reviewsElement = document.getElementById("my-keen-slider");

  var reviewsData = await fetch('./assets/reviews.json');
  var reviews = await reviewsData.json();

  for (let i = reviews.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [reviews[i], reviews[j]] = [reviews[j], reviews[i]];
  }

  var reviewsGroups = reviews.reduce((r, e, i) => (i % 3 ? r[r.length - 1].push(e) : r.push([e])) && r, []);

  var lastReviewGroup = reviewsGroups[reviewsGroups.length - 1];

  if (lastReviewGroup) {
    if (lastReviewGroup.length == 1) {
      lastReviewGroup.push({
        placeholder: true,
      });

      lastReviewGroup.push({
        placeholder: true,
      });
    }

    if (lastReviewGroup.length == 2) {
      lastReviewGroup.push({
        placeholder: true,
      });
    }
  }

  for (let reviewsGroup in reviewsGroups) {
    var newSlide = document.createElement("div");
    newSlide.className = "keen-slider__slide number-slide" + Number(Number(reviewsGroup) + 1);

    var reviewContainer = document.createElement("div");
    reviewContainer.className = "review-container";

    for (let review in reviewsGroups[reviewsGroup]) {
      if (!reviewsGroups[reviewsGroup][review].placeholder) {
        var newReview = document.createElement("div");
        newReview.className = "review";

        var reviewImg = document.createElement("img");
        reviewImg.className = "review-img";
        reviewImg.src = reviewsGroups[reviewsGroup][review].img;
        newReview.appendChild(reviewImg);

        var reviewName = document.createElement("div");
        reviewName.className = "review-name";
        reviewName.innerText = reviewsGroups[reviewsGroup][review].name;
        newReview.appendChild(reviewName);

        var reviewContent = document.createElement("div");
        reviewContent.className = "review-content";
        reviewContent.innerText = reviewsGroups[reviewsGroup][review].review;
        newReview.appendChild(reviewContent);
      } else {
        var newReview = document.createElement("div");
        newReview.className = "review-placeholder";
      }

      reviewContainer.appendChild(newReview);
    }

    newSlide.appendChild(reviewContainer);

    reviewsElement.appendChild(newSlide);
  }

  function navigation(slider) {
    let wrapper, dots, arrowLeft, arrowRight;

    function markup(remove) {
      wrapperMarkup(remove);
      dotMarkup(remove);
      arrowMarkup(remove);
    }

    function removeElement(elment) {
      elment.parentNode.removeChild(elment);
    }
    function createDiv(className) {
      var div = document.createElement("div");
      var classNames = className.split(" ");
      classNames.forEach((name) => div.classList.add(name));
      return div;
    }

    function arrowMarkup(remove) {
      if (remove) {
        removeElement(arrowLeft);
        removeElement(arrowRight);
        return;
      }
      arrowLeft = createDiv("arrow arrow--left");
      arrowLeft.addEventListener("click", () => slider.prev());
      arrowRight = createDiv("arrow arrow--right");
      arrowRight.addEventListener("click", () => slider.next());

      wrapper.appendChild(arrowLeft);
      wrapper.appendChild(arrowRight);
    }

    function wrapperMarkup(remove) {
      if (remove) {
        var parent = wrapper.parentNode;
        while (wrapper.firstChild) parent.insertBefore(wrapper.firstChild, wrapper);
        removeElement(wrapper);
        return;
      }
      wrapper = createDiv("navigation-wrapper");
      document.getElementById("reviews").appendChild(wrapper);
      wrapper.appendChild(slider.container);
    }

    function dotMarkup(remove) {
      if (remove) {
        removeElement(dots);
        return;
      }
      dots = createDiv("dots");
      slider.track.details.slides.forEach((_e, idx) => {
        var dot = createDiv("dot");
        dot.addEventListener("click", () => slider.moveToIdx(idx));
        dots.appendChild(dot);
      });
      wrapper.appendChild(dots);
    }

    function updateClasses() {
      var slide = slider.track.details.rel;
      slide === 0 ? arrowLeft.classList.add("arrow--disabled") : arrowLeft.classList.remove("arrow--disabled");
      slide === slider.track.details.slides.length - 1 ? arrowRight.classList.add("arrow--disabled") : arrowRight.classList.remove("arrow--disabled");
      Array.from(dots.children).forEach(function (dot, idx) {
        idx === slide ? dot.classList.add("dot--active") : dot.classList.remove("dot--active");
      });
    }

    slider.on("created", () => {
      markup();
      updateClasses();
      document.getElementById("reviews").style.visibility = "initial";
    });
    slider.on("optionsChanged", () => {
      console.log(2);
      markup(true);
      markup();
      updateClasses();
    });
    slider.on("slideChanged", () => {
      updateClasses();
    });
    slider.on("destroyed", () => {
      markup(true);
    });
  }

  var slider = new KeenSlider("#my-keen-slider", {}, [navigation]);
})();
