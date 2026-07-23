(function () {
  var tiles = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  if (!tiles.length) return;

  var current = -1;
  var opener = null;

  var style = document.createElement('style');
  style.textContent =
    '.lightbox-dialog{border:0;padding:0;max-width:none;max-height:none;width:100%;height:100%;background:transparent;}' +
    '.lightbox-dialog::backdrop{background:rgba(20,32,27,0.92);}' +
    '.lightbox-inner{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:clamp(1rem,4vw,3rem);}' +
    '.lightbox-inner img{max-width:100%;max-height:100%;object-fit:contain;}' +
    '.lightbox-btn{position:absolute;top:50%;transform:translateY(-50%);min-width:44px;min-height:44px;border:0;background:rgba(20,32,27,0.6);color:#FBF8F1;font-size:1.5rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;}' +
    '.lightbox-btn:hover{background:rgba(20,32,27,0.85);}' +
    '.lightbox-btn:focus-visible{outline:2px solid #E8542F;outline-offset:2px;}' +
    '.lightbox-prev{left:0.5rem;}' +
    '.lightbox-next{right:0.5rem;}' +
    '.lightbox-close{position:absolute;top:0.5rem;right:0.5rem;min-width:44px;min-height:44px;border:0;background:rgba(20,32,27,0.6);color:#FBF8F1;font-size:1.5rem;line-height:1;cursor:pointer;}' +
    '.lightbox-close:hover{background:rgba(20,32,27,0.85);}' +
    '.lightbox-close:focus-visible{outline:2px solid #E8542F;outline-offset:2px;}';
  document.head.appendChild(style);

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox-dialog';
  dialog.innerHTML =
    '<div class="lightbox-inner">' +
      '<button type="button" class="lightbox-close" aria-label="Close gallery">&times;</button>' +
      '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous image">&#8249;</button>' +
      '<img alt="">' +
      '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next image">&#8250;</button>' +
    '</div>';
  document.body.appendChild(dialog);

  var img = dialog.querySelector('img');
  var closeBtn = dialog.querySelector('.lightbox-close');
  var prevBtn = dialog.querySelector('.lightbox-prev');
  var nextBtn = dialog.querySelector('.lightbox-next');

  function show(index) {
    current = (index + tiles.length) % tiles.length;
    var tile = tiles[current];
    var tileImg = tile.querySelector('img');
    img.src = tile.href;
    img.alt = tileImg ? tileImg.alt : '';
  }

  function open(index, source) {
    opener = source;
    show(index);
    dialog.showModal();
  }

  tiles.forEach(function (tile, index) {
    tile.addEventListener('click', function (e) {
      e.preventDefault();
      open(index, tile);
    });
  });

  closeBtn.addEventListener('click', function () { dialog.close(); });
  prevBtn.addEventListener('click', function () { show(current - 1); });
  nextBtn.addEventListener('click', function () { show(current + 1); });

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  dialog.addEventListener('close', function () {
    if (opener) opener.focus();
  });

  var touchStartX = null;
  dialog.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  });
  dialog.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      show(delta < 0 ? current + 1 : current - 1);
    }
    touchStartX = null;
  });
})();
