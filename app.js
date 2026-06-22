document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================
     1. MENU DE NAVIGATION MOBILE
     ========================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Fermer le menu lors du clic sur un lien
    const navLinks = navMenu.querySelectorAll('.nav-link, .btn');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
      });
    });
  }

  // Effet d'en-tête réduit au scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });


  /* ==========================================
     2. ANIMATION AU DEFILEMENT (Intersection Observer)
     ========================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Rétrocompatibilité si IntersectionObserver n'est pas supporté
    revealElements.forEach(el => el.classList.add('revealed'));
  }


  /* ==========================================
     3. DECK INTERACTIF DE CARTES (SWIPE WIDGET)
     ========================================== */
  const cardDeck = document.getElementById('card-deck');
  const swipeNopeBtn = document.getElementById('swipe-nope');
  const swipeLikeBtn = document.getElementById('swipe-like');
  let cards = Array.from(cardDeck.querySelectorAll('.swipe-card'));
  
  let activeCard = null;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  // Initialiser les écouteurs de drag sur la carte du dessus
  function updateActiveCard() {
    // La carte du dessus est le dernier enfant visible dans le conteneur
    const visibleCards = cardDeck.querySelectorAll('.swipe-card:not(.swiped)');
    if (visibleCards.length > 0) {
      activeCard = visibleCards[visibleCards.length - 1];
      initDragEvents(activeCard);
    } else {
      // Si toutes les cartes ont été swipées, on les réinitialise pour l'interaction infinie
      activeCard = null;
      setTimeout(resetCardDeck, 800);
    }
  }

  function initDragEvents(card) {
    card.addEventListener('pointerdown', onDragStart);
  }

  function onDragStart(e) {
    isDragging = true;
    activeCard.classList.add('dragging');
    // pointerCapture permet de suivre la souris même si elle sort des limites de la carte
    activeCard.setPointerCapture(e.pointerId);
    
    startX = e.clientX;
    startY = e.clientY;
    
    activeCard.addEventListener('pointermove', onDragMove);
    activeCard.addEventListener('pointerup', onDragEnd);
    activeCard.addEventListener('pointercancel', onDragEnd);
  }

  function onDragMove(e) {
    if (!isDragging) return;
    
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    
    // Rotation progressive basée sur le déplacement horizontal
    const rotation = currentX * 0.08;
    activeCard.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
    
    // Affichage des tampons "Adopter" (like) et "Passe" (nope)
    const likeStamp = activeCard.querySelector('.card-stamp.like');
    const nopeStamp = activeCard.querySelector('.card-stamp.nope');
    
    if (currentX > 20) {
      likeStamp.style.opacity = Math.min(currentX / 100, 1);
      nopeStamp.style.opacity = 0;
    } else if (currentX < -20) {
      nopeStamp.style.opacity = Math.min(Math.abs(currentX) / 100, 1);
      likeStamp.style.opacity = 0;
    } else {
      likeStamp.style.opacity = 0;
      nopeStamp.style.opacity = 0;
    }
  }

  function onDragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    
    activeCard.classList.remove('dragging');
    activeCard.removeEventListener('pointermove', onDragMove);
    activeCard.removeEventListener('pointerup', onDragEnd);
    activeCard.removeEventListener('pointercancel', onDragEnd);
    
    const swipeThreshold = 100;
    
    if (currentX > swipeThreshold) {
      // Swipe Droite (Like/Adopter)
      swipeCardAway('right');
    } else if (currentX < -swipeThreshold) {
      // Swipe Gauche (Nope/Passe)
      swipeCardAway('left');
    } else {
      // Retour à la position initiale
      activeCard.style.transform = 'translate(0, 0) rotate(0deg)';
      const stamps = activeCard.querySelectorAll('.card-stamp');
      stamps.forEach(s => s.style.opacity = 0);
    }
    
    currentX = 0;
    currentY = 0;
  }

  function swipeCardAway(direction) {
    const card = activeCard;
    card.classList.add('swiped');
    
    // Animation de sortie
    if (direction === 'right') {
      card.style.transform = 'translate(350px, 50px) rotate(30deg)';
      card.style.opacity = '0';
    } else {
      card.style.transform = 'translate(-350px, 50px) rotate(-30deg)';
      card.style.opacity = '0';
    }
    
    // Désactiver les événements pour éviter des clics parasites
    card.style.pointerEvents = 'none';
    
    // Mettre à jour la carte active après la transition
    setTimeout(() => {
      card.style.display = 'none';
      updateActiveCard();
    }, 300);
  }

  // Liaison avec les boutons physiques du mockup
  if (swipeNopeBtn && swipeLikeBtn) {
    swipeNopeBtn.addEventListener('click', () => {
      if (activeCard && !isDragging) {
        const nopeStamp = activeCard.querySelector('.card-stamp.nope');
        if (nopeStamp) nopeStamp.style.opacity = 1;
        swipeCardAway('left');
      }
    });

    swipeLikeBtn.addEventListener('click', () => {
      if (activeCard && !isDragging) {
        const likeStamp = activeCard.querySelector('.card-stamp.like');
        if (likeStamp) likeStamp.style.opacity = 1;
        swipeCardAway('right');
      }
    });
  }

  function resetCardDeck() {
    cards.forEach(card => {
      card.classList.remove('swiped');
      card.style.display = 'flex';
      card.style.transform = 'translate(0, 0) rotate(0deg)';
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
      const stamps = card.querySelectorAll('.card-stamp');
      stamps.forEach(s => s.style.opacity = 0);
    });
    updateActiveCard();
  }

  // Démarrer la gestion du deck
  updateActiveCard();


  /* ==========================================
     4. WIDGET DE MINI-QUIZ DE PERSONNALITE
     ========================================== */
  const quizWidget = document.getElementById('quiz-widget');
  const quizSteps = quizWidget.querySelectorAll('.quiz-step');
  const progressBar = document.getElementById('quiz-progress-bar');
  const loadingScreen = document.getElementById('quiz-loading');
  const resultScreen = document.getElementById('quiz-result');

  // Navigation Buttons
  const nextBtn1 = document.getElementById('quiz-next-1');
  const nextBtn2 = document.getElementById('quiz-next-2');
  const submitBtn = document.getElementById('quiz-submit');
  const prevBtn2 = document.getElementById('quiz-prev-2');
  const prevBtn3 = document.getElementById('quiz-prev-3');
  const restartBtn = document.getElementById('quiz-restart');

  // Réponses du quiz
  let answers = {
    activity: null,  // sportif, modere, calme
    space: null,     // jardin, balcon, interieur
    time: null       // beaucoup, moyen, peu
  };

  // Activer/Désactiver la sélection d'options pour une étape donnée
  function setupStepOptions(stepNum, answerKey, nextBtn) {
    const stepEl = quizWidget.querySelector(`.quiz-step[data-step="${stepNum}"]`);
    const options = stepEl.querySelectorAll('.quiz-option');

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        // Enlever la classe selected des autres options du même groupe
        options.forEach(o => {
          o.classList.remove('selected');
          o.setAttribute('aria-checked', 'false');
        });

        // Sélectionner l'option cliquée
        opt.classList.add('selected');
        opt.setAttribute('aria-checked', 'true');
        
        // Enregistrer la réponse
        answers[answerKey] = opt.getAttribute('data-value');

        // Activer le bouton Continuer
        nextBtn.removeAttribute('disabled');
      });
    });
  }

  setupStepOptions(1, 'activity', nextBtn1);
  setupStepOptions(2, 'space', nextBtn2);
  setupStepOptions(3, 'time', submitBtn);

  // Changement d'étape
  function goToStep(currentStep, targetStep) {
    const currentEl = quizWidget.querySelector(`.quiz-step[data-step="${currentStep}"]`);
    const targetEl = quizWidget.querySelector(`.quiz-step[data-step="${targetStep}"]`);
    
    currentEl.classList.remove('active');
    targetEl.classList.add('active');

    // Mettre à jour la barre de progression
    const progressPct = (targetStep / 3) * 100;
    progressBar.style.width = `${progressPct}%`;
    progressBar.parentNode.setAttribute('aria-valuenow', progressPct);
  }

  // Navigation Event Listeners
  if (nextBtn1) {
    nextBtn1.addEventListener('click', () => goToStep(1, 2));
  }
  if (nextBtn2) {
    nextBtn2.addEventListener('click', () => goToStep(2, 3));
  }
  if (prevBtn2) {
    prevBtn2.addEventListener('click', () => goToStep(2, 1));
  }
  if (prevBtn3) {
    prevBtn3.addEventListener('click', () => goToStep(3, 2));
  }

  // Soumission et calcul du résultat personnalisé
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      // Cacher l'étape 3
      quizWidget.querySelector('.quiz-step[data-step="3"]').classList.remove('active');
      progressBar.parentNode.style.display = 'none';

      // Montrer le chargement
      loadingScreen.style.display = 'block';

      // Simuler une recherche de 2 secondes
      setTimeout(showQuizResult, 2000);
    });
  }

  // Profils pour les résultats du quiz
  const petProfiles = {
    dogSportive: {
      name: "Max",
      meta: "Golden Retriever • Mâle • 2 ans",
      img: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400",
      pct: "98% Match",
      desc: "Max est un Golden Retriever débordant d'énergie et d'amour. Son profil sportif correspond parfaitement à votre rythme d'activité élevé. Il sera le partenaire idéal pour vos footings et vos sorties nature dans votre grand espace !",
      reason: "✓ Parfait pour les profils sportifs disposant d'un extérieur.",
      tags: ["Sportif", "Sociable", "Adore l'eau"]
    },
    dogCalm: {
      name: "Rocky",
      meta: "Chiot Épagneul Breton • Mâle • 6 mois",
      img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400",
      pct: "93% Match",
      desc: "Rocky est un adorable chiot en demande d'attention. Même s'il a besoin de balades, sa nature douce s'accorde bien avec un quotidien modéré et un balcon. Il adore apprendre et faire des câlins sur le canapé.",
      reason: "✓ Idéal pour les appartements avec balcon et présence modérée.",
      tags: ["Joueur", "Affectueux", "Intelligent"]
    },
    catActive: {
      name: "Luna",
      meta: "Siamois croisé • Femelle • 4 mois",
      img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400",
      pct: "96% Match",
      desc: "Luna est une jeune chatte curieuse et très joueuse. Si vous avez du temps à lui accorder à l'intérieur, elle transformera vos journées avec ses cabrioles et ses moments de ronrons intenses.",
      reason: "✓ Recommandé pour les appartements et les personnes très présentes.",
      tags: ["Trépidante", "Ok enfants", "Très sociable"]
    },
    catCalm: {
      name: "Oliver",
      meta: "Chat roux tigré • Mâle • 1 an",
      img: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=400",
      pct: "95% Match",
      desc: "Oliver recherche une vie tranquille. Casanier et indépendant, il s'adapte sans problème aux appartements sans accès extérieur et tolère très bien l'absence de ses adoptants pendant la journée de travail.",
      reason: "✓ Excellent pour les appartements calmes et les rythmes professionnels classiques.",
      tags: ["Indépendant", "Calme", "Propre"]
    }
  };

  function showQuizResult() {
    loadingScreen.style.display = 'none';
    resultScreen.style.display = 'block';

    // Déterminer le meilleur profil selon les réponses
    let match = petProfiles.catCalm; // Fallback par défaut

    if (answers.activity === 'sportif' && answers.space === 'jardin') {
      match = petProfiles.dogSportive;
    } else if (answers.activity === 'sportif' || answers.space === 'jardin' || answers.space === 'balcon') {
      match = petProfiles.dogCalm;
    } else if (answers.time === 'beaucoup') {
      match = petProfiles.catActive;
    } else {
      match = petProfiles.catCalm;
    }

    // Remplir les données dans le DOM
    document.getElementById('result-pet-img').src = match.img;
    document.getElementById('result-pet-img').alt = `${match.name}, ${match.meta}`;
    document.getElementById('result-pet-pct').textContent = match.pct;
    document.getElementById('result-pet-name').textContent = `${match.name}`;
    document.getElementById('result-pet-meta').textContent = match.meta;
    document.getElementById('result-pet-desc').textContent = match.desc;
    document.getElementById('result-compatibility-reason').textContent = match.reason;

    // Remplir les tags
    const tagsContainer = document.getElementById('result-pet-tags');
    tagsContainer.innerHTML = '';
    match.tags.forEach((tag, idx) => {
      const span = document.createElement('span');
      span.className = 'result-tag';
      if (idx === 0) span.classList.add('primary');
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });
  }

  // Recommencer le test
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      // Réinitialiser les réponses
      answers = { activity: null, space: null, time: null };
      
      // Réinitialiser l'affichage des boutons
      const allOptions = quizWidget.querySelectorAll('.quiz-option');
      allOptions.forEach(opt => {
        opt.classList.remove('selected');
        opt.setAttribute('aria-checked', 'false');
      });

      nextBtn1.setAttribute('disabled', 'true');
      nextBtn2.setAttribute('disabled', 'true');
      submitBtn.setAttribute('disabled', 'true');

      // Revenir à l'étape 1
      resultScreen.style.display = 'none';
      progressBar.parentNode.style.display = 'block';
      progressBar.style.width = '33.33%';
      progressBar.parentNode.setAttribute('aria-valuenow', 33);
      quizSteps[0].classList.add('active');
    });
  }

  /* ==========================================
     5. SIMULATEUR D'ADOPTION INTERACTIF (Scrollytelling)
     ========================================== */
  const scrollySteps = document.querySelectorAll('.scrolly-step');
  const simPetImg = document.getElementById('sim-pet-img');
  const simStatusTag = document.getElementById('sim-status-tag');
  const simPetName = document.getElementById('sim-pet-name');
  const simPetBreed = document.getElementById('sim-pet-breed');
  const metricEnergy = document.getElementById('metric-energy');
  const metricSpace = document.getElementById('metric-space');
  const metricTime = document.getElementById('metric-time');
  const happinessCircle = document.getElementById('happiness-circle');
  const happinessVal = document.getElementById('happiness-val');
  const happinessDesc = document.getElementById('happiness-desc');

  const stepData = {
    1: {
      img: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400",
      tag: "Coup de cœur en ligne 📸",
      name: "Max, 2 ans",
      breed: "Retriever Énergique",
      energy: "95%",
      space: "100%",
      time: "100%",
      happyVal: "80%",
      happyDesc: "Adopté sur un coup de cœur visuel",
      happyBg: "var(--primary-light)",
      happyColor: "var(--primary)"
    },
    2: {
      img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400",
      tag: "40m² sans balcon 🏢",
      name: "Max, 2 ans",
      breed: "Retriever Énergique",
      energy: "95%",
      space: "25%",
      time: "100%",
      happyVal: "40%",
      happyDesc: "Manque d'espace et frustration",
      happyBg: "#FFF3E0",
      happyColor: "#E65100"
    },
    3: {
      img: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=400",
      tag: "8h seul par jour 😢",
      name: "Max, 2 ans",
      breed: "Retriever Énergique",
      energy: "95%",
      space: "25%",
      time: "15%",
      happyVal: "15%",
      happyDesc: "Ennui, solitude et destruction",
      happyBg: "#FFEBEE",
      happyColor: "#C62828"
    },
    4: {
      img: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=400",
      tag: "98% Affinité Matchever 💚",
      name: "Oliver, 1 an",
      breed: "Siamois Calme",
      energy: "30%",
      space: "100%",
      time: "100%",
      happyVal: "98%",
      happyDesc: "Adoption responsable, chat comblé !",
      happyBg: "var(--secondary-light)",
      happyColor: "var(--secondary)"
    }
  };

  function updateSimulator(stepNum) {
    const data = stepData[stepNum];
    if (!data) return;

    // Animating image transition
    simPetImg.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    simPetImg.style.transform = 'scale(1.05)';
    simPetImg.style.opacity = '0.3';
    simStatusTag.style.opacity = '0';

    setTimeout(() => {
      simPetImg.src = data.img;
      simStatusTag.textContent = data.tag;
      simPetName.textContent = data.name;
      simPetBreed.textContent = data.breed;
      
      metricEnergy.style.width = data.energy;
      metricSpace.style.width = data.space;
      metricTime.style.width = data.time;

      happinessVal.textContent = data.happyVal;
      happinessDesc.textContent = data.happyDesc;
      happinessCircle.style.backgroundColor = data.happyBg;
      happinessCircle.style.color = data.happyColor;

      simPetImg.style.transform = 'scale(1)';
      simPetImg.style.opacity = '1';
      simStatusTag.style.opacity = '1';
    }, 200);
  }

  // Click to navigate
  scrollySteps.forEach(step => {
    step.addEventListener('click', () => {
      scrollySteps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
      const stepNum = parseInt(step.getAttribute('data-step'));
      updateSimulator(stepNum);
    });
  });

  // Optional: IntersectionObserver to sync with scroll
  if ('IntersectionObserver' in window) {
    const scrollyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const step = entry.target;
          scrollySteps.forEach(s => s.classList.remove('active'));
          step.classList.add('active');
          const stepNum = parseInt(step.getAttribute('data-step'));
          updateSimulator(stepNum);
        }
      });
    }, {
      threshold: 0.6,
      rootMargin: '0px 0px -10% 0px'
    });

    scrollySteps.forEach(step => scrollyObserver.observe(step));
  }

});

