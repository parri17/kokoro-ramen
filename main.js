/* =========================================================
   KOKORO · Interacciones
   Librerías: jQuery (principal), AOS (scroll) y Typed.js (texto)

   1. Menú responsive y cabecera
   2. Hero: reloj, lluvia, Typed.js y parallax del interludio
   3. Monta tu bowl: pestañas, ánimo, toppings y omikuji
   4. Carrusel de la carta (sin librerías de sliders)
   5. Acordeón
   6. Validación del formulario
   7. AOS
   ========================================================= */

$(function () {

  /* ---------- 1. MENÚ RESPONSIVE Y CABECERA ---------- */
  const $menuBtn = $('.menu-btn');
  const $nav = $('.nav');

  function closeMenu() {
    $nav.fadeOut(300);
    $menuBtn.removeClass('is-open').attr('aria-expanded', 'false');
    $('body').css('overflow', '');
  }

  // Abre y cierra el menú a pantalla completa en móvil
  $menuBtn.on('click', function () {
    if ($(this).hasClass('is-open')) {
      closeMenu();
    } else {
      $nav.fadeIn(300);
      $(this).addClass('is-open').attr('aria-expanded', 'true');
      $('body').css('overflow', 'hidden'); // evita que la página se mueva detrás
    }
  });

  // Scroll suave al pulsar cualquier enlace interno
  $('a[href^="#"]').on('click', function (e) {
    const destino = $(this).attr('href');
    if (destino.length > 1 && $(destino).length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $(destino).offset().top - 70 }, 800);
    }
    if ($(window).width() < 1024 && $menuBtn.hasClass('is-open')) {
      closeMenu();
    }
  });

  // Cabecera con fondo al bajar y enlace activo según la sección
  $(window).on('scroll', function () {
    const scroll = $(this).scrollTop();
    $('.header').toggleClass('is-scrolled', scroll > 40);

    $('main section[id]').each(function () {
      const top = $(this).offset().top - 140;
      const bottom = top + $(this).outerHeight();
      if (scroll >= top && scroll < bottom) {
        $('.nav__list a').removeClass('is-current');
        $('.nav__list a[href="#' + $(this).attr('id') + '"]').addClass('is-current');
      }
    });
  }).trigger('scroll');

  /* ---------- 2. HERO ---------- */

  // Reloj con la hora de Madrid
  function updateClock() {
    const hora = new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid'
    });
    $('#clock').text(hora);
  }
  updateClock();
  setInterval(updateClock, 30000);

  // Lluvia: crea gotas con posición, tamaño y velocidad aleatorias
  const $rain = $('.rain');
  const numGotas = $(window).width() < 768 ? 35 : 70;

  for (let i = 0; i < numGotas; i++) {
    $('<span class="drop"></span>').css({
      left: Math.random() * 100 + '%',
      height: 40 + Math.random() * 70 + 'px',
      opacity: 0.2 + Math.random() * 0.6,
      animationDuration: 0.6 + Math.random() * 0.8 + 's',
      animationDelay: Math.random() * 2 + 's'
    }).appendTo($rain);
  }

  // Texto que se escribe solo
  new Typed('.typed-text', {
    strings: ['cansada.', 'feliz.', 'con frío.', 'con ganas de todo.'],
    typeSpeed: 65,
    backSpeed: 35,
    backDelay: 1600,
    startDelay: 600,
    loop: true
  });

  // Parallax del interludio: el fondo se mueve más despacio que la página
  const $interlude = $('.interlude');
  const $interludeBg = $('.interlude__bg');

  $(window).on('scroll', function () {
    const distancia = $(window).scrollTop() + $(window).height() - $interlude.offset().top;
    if (distancia > 0 && distancia < $(window).height() + $interlude.outerHeight()) {
      $interludeBg.css('transform', 'translateY(' + (distancia * -0.12) + 'px)');
    }
  });

  /* ---------- 3. MONTA TU BOL ---------- */

  // Cada topping tiene una foto (ID.png, en la misma carpeta).
  // Si la foto todavía no existe, se usa el dibujo SVG de "svg".
  const toppings = [
    {
      id: 'huevo', name: 'Huevo marinado', price: 1.5,
      svg: '<defs><radialGradient id="g-yolk" cx="45%" cy="40%"><stop offset="0" stop-color="#ffb347"/><stop offset="1" stop-color="#e07b12"/></radialGradient></defs><ellipse cx="50" cy="50" rx="42" ry="32" fill="#c98a4b"/><ellipse cx="50" cy="50" rx="38" ry="28" fill="#fbf3e4"/><ellipse cx="50" cy="51" rx="18" ry="15" fill="url(#g-yolk)"/><ellipse cx="44" cy="46" rx="5" ry="3" fill="#fff" opacity=".5"/>'
    },
    {
      id: 'chashu', name: 'Chashu', price: 2.5,
      svg: '<defs><radialGradient id="g-pork" cx="50%" cy="50%"><stop offset="0" stop-color="#f1c4a0"/><stop offset=".7" stop-color="#d9946a"/><stop offset="1" stop-color="#8a4420"/></radialGradient></defs><circle cx="50" cy="50" r="42" fill="#5e2c12"/><circle cx="50" cy="50" r="37" fill="url(#g-pork)"/><path d="M28 50 q22 -26 44 0" fill="none" stroke="#fbe6d3" stroke-width="4" opacity=".8"/><path d="M33 62 q17 -14 34 0" fill="none" stroke="#fbe6d3" stroke-width="3" opacity=".6"/>'
    },
    {
      id: 'naruto', name: 'Naruto', price: 1,
      svg: '<circle cx="50" cy="50" r="40" fill="#fdf7f1"/><path d="M50 10 l4 -4 l4 5 l5 -3 l3 6 l5 -2 l2 6" fill="none" stroke="#ece3d8" stroke-width="2"/><path d="M50 50 m-20 0 a20 20 0 1 1 20 20 a12 12 0 1 1 -12 -12 a5 5 0 1 1 5 5" fill="none" stroke="#e8467c" stroke-width="5" stroke-linecap="round"/>'
    },
    {
      id: 'nori', name: 'Alga nori', price: 0.8,
      svg: '<defs><linearGradient id="g-nori" x1="0" x2="1"><stop offset="0" stop-color="#0f1f19"/><stop offset=".5" stop-color="#1d3a2f"/><stop offset="1" stop-color="#0f1f19"/></linearGradient></defs><rect x="24" y="8" width="52" height="84" rx="2" fill="url(#g-nori)"/><path d="M28 30 h44 M28 52 h44 M28 74 h44" stroke="#2c5444" stroke-width="1.5" opacity=".7"/>'
    },
    {
      id: 'cebolleta', name: 'Cebolleta', price: 0.5,
      svg: '<g fill="none" stroke-width="5"><circle cx="30" cy="34" r="10" stroke="#5fa35a"/><circle cx="62" cy="28" r="9" stroke="#86c57a"/><circle cx="46" cy="60" r="11" stroke="#5fa35a"/><circle cx="74" cy="62" r="8" stroke="#a6d98f"/><circle cx="26" cy="70" r="7" stroke="#86c57a"/></g>'
    },
    {
      id: 'maiz', name: 'Maíz', price: 0.7,
      svg: '<defs><radialGradient id="g-corn" cx="40%" cy="35%"><stop offset="0" stop-color="#ffec8a"/><stop offset="1" stop-color="#e2a91c"/></radialGradient></defs><g fill="url(#g-corn)"><circle cx="34" cy="34" r="8"/><circle cx="52" cy="28" r="8"/><circle cx="68" cy="42" r="8"/><circle cx="46" cy="48" r="8"/><circle cx="30" cy="62" r="8"/><circle cx="56" cy="66" r="8"/><circle cx="72" cy="62" r="7"/></g>'
    },
    {
      id: 'setas', name: 'Shiitake', price: 1.2,
      svg: '<defs><radialGradient id="g-shii" cx="40%" cy="35%"><stop offset="0" stop-color="#9a6a45"/><stop offset="1" stop-color="#4a2a15"/></radialGradient></defs><ellipse cx="38" cy="40" rx="24" ry="19" fill="url(#g-shii)"/><path d="M26 40 h24 M38 29 v22" stroke="#e9cfae" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="64" cy="66" rx="21" ry="16" fill="url(#g-shii)"/><path d="M54 66 h20 M64 57 v18" stroke="#e9cfae" stroke-width="2.5" stroke-linecap="round"/>'
    },
    {
      id: 'chile', name: 'Chile verde', price: 0.6,
      svg: '<g><circle cx="34" cy="36" r="10" fill="#c81d16"/><circle cx="64" cy="40" r="10" fill="#e0301f"/><circle cx="48" cy="66" r="10" fill="#c81d16"/></g><g fill="#ffd9a8"><circle cx="31" cy="35" r="2"/><circle cx="37" cy="39" r="2"/><circle cx="62" cy="39" r="2"/><circle cx="67" cy="42" r="2"/><circle cx="46" cy="64" r="2"/><circle cx="51" cy="68" r="2"/></g>'
    },
    {
      id: 'kimchi', name: 'Kimchi', price: 1,
      svg: '<g fill="#e8742c" stroke="#b44a12" stroke-width="2"><path d="M22 52 q10 -24 30 -16 q16 -14 28 6 q8 18 -10 28 q-20 14 -40 2 q-14 -8 -8 -20z"/></g><g fill="#f6d9a4" opacity=".8"><path d="M34 46 q8 -6 16 0"/><path d="M50 58 q10 -6 18 2"/></g>'
    }
  ];

  const BASE_PRICE = 11.5;

  // Huecos del bowl (en %) donde se colocan los toppings
  const slots = [
    { x: 30, y: 31 }, { x: 69, y: 29 }, { x: 26, y: 65 },
    { x: 72, y: 66 }, { x: 50, y: 48 }, { x: 50, y: 80 }
  ];
  const usedSlots = [false, false, false, false, false, false];
  let selectedMood = { name: 'Miso', word: 'con frío' };

  const $ingredients = $('#ingredients');
  const $bowlToppings = $('#bowl-toppings');

  // Devuelve la foto del topping. Si falla, la cambia por el dibujo SVG.
  function toppingImage(t, clase) {
    const $img = $('<img>', {
      src: t.id + '.png',
      alt: t.name,
      class: clase
    });
    $img.on('error', function () {
      $(this).replaceWith('<svg class="' + clase + '" viewBox="0 0 100 100" role="img" aria-label="' + t.name + '">' + t.svg + '</svg>');
    });
    return $img;
  }

  // Crea los botones de ingredientes a partir del array
  $.each(toppings, function (i, t) {
    const $btn = $('<button class="ingredient" type="button"></button>').attr('data-index', i);
    $btn.append(toppingImage(t, 'ingredient__img'));
    $btn.append('<span>' + t.name + '<small>+' + formatPrice(t.price) + '</small></span>');
    $ingredients.append($btn);
  });

  // 3.1 Pestañas
  function openTab(tabId) {
    $('.tabs__btn').removeClass('is-active');
    $('.tabs__btn[data-tab="' + tabId + '"]').addClass('is-active');
    $('.tabs__panel').removeClass('is-active').hide();
    $('#' + tabId).addClass('is-active').fadeIn(400);
  }

  $('.tabs__btn').on('click', function () {
    openTab($(this).data('tab'));
  });

  $('.btn--next').on('click', function () {
    openTab($(this).data('go'));
  });

  // 3.2 Estado de ánimo: cambia el color del caldo
  $('.mood').on('click', function () {
    $('.mood').removeClass('is-selected');
    $(this).addClass('is-selected');
    $('#broth').css('--broth', $(this).data('color'));
    selectedMood = { name: $(this).data('name'), word: $(this).data('word') };
  });

  // 3.3 Añadir topping al bowl
  $ingredients.on('click', '.ingredient', function () {
    const freeSlot = usedSlots.indexOf(false);

    if (freeSlot === -1) {
      const $total = $('.builder__total');
      $total.removeClass('shake');
      setTimeout(function () { $total.addClass('shake'); }, 10);
      return;
    }

    const t = toppings[$(this).data('index')];
    const giro = Math.floor(Math.random() * 70) - 35;

    const $topping = $('<div class="topping"></div>')
      .attr({ 'data-slot': freeSlot, 'data-price': t.price, 'data-name': t.name })
      .css({
        left: slots[freeSlot].x + '%',
        top: slots[freeSlot].y + '%',
        '--rot': giro + 'deg'
      })
      .append(toppingImage(t, 'topping__img'));

    $bowlToppings.append($topping);
    usedSlots[freeSlot] = true;

    setTimeout(function () { $topping.addClass('is-in'); }, 20);
    updateTotal();
  });

  // 3.4 Quitar topping tocándolo en el bowl
  $bowlToppings.on('click', '.topping', function () {
    const $t = $(this);
    usedSlots[$t.attr('data-slot')] = false;
    $t.removeClass('is-in');
    setTimeout(function () {
      $t.remove();
      updateTotal();
    }, 350);
  });

  function updateTotal() {
    const $all = $bowlToppings.find('.topping');
    let total = BASE_PRICE;
    $all.each(function () {
      total += parseFloat($(this).attr('data-price'));
    });
    $('#topping-count').text($all.length);
    $('#price').text(formatPrice(total));
  }

  function formatPrice(num) {
    return num.toFixed(2).replace('.', ',') + ' €';
  }

  // 3.5 Omikuji
  const fortunes = [
    'Lo que hoy te pesa, mañana será una anécdota.',
    'Alguien está pensando en ti mientras comes esto.',
    'Esta semana, un pequeño riesgo saldrá muy bien.',
    'Descansar también es avanzar.',
    'Se acerca una buena noticia. Prepárate para celebrarla.',
    'Tu próxima idea loca es mejor de lo que crees.',
    'La noche es larga y tú brillas más que el neón.'
  ];

  $('#open-fortune').on('click', function () {
    const nombre = $.trim($('#bowl-name').val()) || 'esta noche';
    const nombres = $bowlToppings.find('.topping').map(function () {
      return $(this).attr('data-name').toLowerCase();
    }).get();
    const frase = fortunes[Math.floor(Math.random() * fortunes.length)];

    $('#fortune-title').text(nombre === 'esta noche' ? 'Tu bowl de esta noche' : 'El bowl de ' + nombre);
    $('#fortune-text').text(frase);
    $('#fortune-summary').text(
      'Caldo ' + selectedMood.name + ' para llegar ' + selectedMood.word +
      (nombres.length ? ' · ' + nombres.join(', ') : ' · sin toppings') +
      ' · ' + $('#price').text()
    );

    $('#fortune-modal').fadeIn(400).attr('aria-hidden', 'false');
  });

  function closeModal() {
    $('#fortune-modal').fadeOut(300).attr('aria-hidden', 'true');
  }

  $('.modal__close, .modal__btn').on('click', closeModal);

  $('#fortune-modal').on('click', function (e) {
    if (e.target === this) closeModal();
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- 4. CARRUSEL ---------- */
  const $track = $('.slider__track');
  const $dots = $('.slider__dots');
  const totalSlides = $('.slide').length;
  let current = 0;
  let autoplay;

  for (let i = 0; i < totalSlides; i++) {
    $dots.append('<button class="slider__dot" type="button" aria-label="Ir al plato ' + (i + 1) + '"></button>');
  }

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;   // del primero salta al último
    if (index >= totalSlides) index = 0;      // del último vuelve al primero
    current = index;
    $track.css('transform', 'translateX(-' + (current * 100) + '%)');
    $('.slider__dot').removeClass('is-active').eq(current).addClass('is-active');
  }

  function startAutoplay() {
    stopAutoplay();
    autoplay = setInterval(function () { goToSlide(current + 1); }, 6000);
  }

  function stopAutoplay() {
    clearInterval(autoplay);
  }

  $('.slider__arrow--next').on('click', function () { goToSlide(current + 1); });
  $('.slider__arrow--prev').on('click', function () { goToSlide(current - 1); });
  $dots.on('click', '.slider__dot', function () { goToSlide($(this).index()); });

  $('.slider').on('mouseenter', stopAutoplay).on('mouseleave', startAutoplay);

  // Deslizar con el dedo
  let touchStartX = 0;
  $('.slider__window').on('touchstart', function (e) {
    touchStartX = e.originalEvent.touches[0].clientX;
    stopAutoplay();
  }).on('touchend', function (e) {
    const diff = touchStartX - e.originalEvent.changedTouches[0].clientX;
    if (diff > 50) goToSlide(current + 1);
    if (diff < -50) goToSlide(current - 1);
    startAutoplay();
  });

  goToSlide(0);
  startAutoplay();

  /* ---------- 5. ACORDEÓN ---------- */
  $('.accordion__head').on('click', function () {
    const $item = $(this).parent();

    if ($item.hasClass('is-open')) {
      $item.removeClass('is-open').find('.accordion__body').slideUp(350);
    } else {
      $('.accordion__item.is-open').removeClass('is-open').find('.accordion__body').slideUp(350);
      $item.addClass('is-open').find('.accordion__body').slideDown(350);
    }
  });

  /* ---------- 6. FORMULARIO ---------- */
  function showError($input, mensaje) {
    $input.closest('.field').addClass('has-error').find('.field__error').text(mensaje);
  }

  function clearError($input) {
    $input.closest('.field').removeClass('has-error').find('.field__error').text('');
  }

  $('#booking-form input, #booking-form select').on('input change', function () {
    clearError($(this));
  });

  $('#booking-form').on('submit', function (e) {
    e.preventDefault();
    let valido = true;

    const $name = $('#f-name');
    const $email = $('#f-email');
    const $date = $('#f-date');
    const $people = $('#f-people');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if ($.trim($name.val()).length < 2) {
      showError($name, 'Escribe tu nombre');
      valido = false;
    }

    if (!emailRegex.test($email.val())) {
      showError($email, 'Revisa el email');
      valido = false;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (!$date.val() || new Date($date.val()) < hoy) {
      showError($date, 'Elige un día a partir de hoy');
      valido = false;
    }

    if (!$people.val()) {
      showError($people, '¿Cuántos venís?');
      valido = false;
    }

    if (valido) {
      $('#form-success')
        .hide()
        .text('Reserva recibida, ' + $.trim($name.val()) + '. Te esperamos en la barra.')
        .fadeIn(500);
      this.reset();
    } else {
      $('#form-success').text('');
    }
  });

  /* ---------- 7. AOS ---------- */
  AOS.init({
    duration: 900,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80
  });

});
