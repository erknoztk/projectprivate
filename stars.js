const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Star field setup
let STAR_COUNT = 40; // Start with low number of stars
let stars = [];
function generateStars(count) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 1.8,
      alpha: 0.5 + Math.random() * 0.5,
      shine: false
    });
  }
}
generateStars(STAR_COUNT);

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let s of stars) {
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
    ctx.fillStyle = s.shine ? '#fffde7' : '#fff';
    if (s.shine) {
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 18;
    }
    ctx.fill();
    ctx.restore();
  }
}

let animating = true;
function animateStars() {
  if (!animating) return;
  for (let s of stars) {
    s.alpha = 0.5 + 0.5 * Math.sin(Date.now() / 800 + s.x);
  }
  drawStars();
  requestAnimationFrame(animateStars);
}
animateStars();

// Input logic
const inputOverlay = document.querySelector('.input-overlay');
const input = document.getElementById('starInput');
const btn = document.getElementById('starBtn');

btn.addEventListener('click', checkInput);
input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') checkInput();
});

// Clear input when clicked to prevent showing old value
input.addEventListener('focus', function() {
  input.value = '';
  input.placeholder = 'Bir sayı giriniz lütfen';
});

function checkInput() {
  if (input.value == '17') {
    increaseAndShineStars();
  } else if (input.value == '3') {
    showBirthdayMessageWithImage();
  } else if (input.value == '7') {
    showImage1();
  } else if (input.value.toLowerCase() == 'frame') {
    showStarFrameWithImage();
  } else {
    showIronmanScreen();
  }
}

function increaseAndShineStars() {
  // Gradually add stars one by one in random positions, then shine them
  let targetCount = 300;
  let newStars = [];
  for (let i = 0; i < targetCount; i++) {
    newStars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 1.8,
      alpha: 0.5 + Math.random() * 0.5,
      shine: false
    });
  }
  stars = [];
  let i = 0;
  function addStar() {
    if (i < targetCount) {
      stars.push(newStars[i]);
      drawStars();
      i++;
      setTimeout(addStar, 18); // Delay between each star
    } else {
      shineAllStars();
    }
  }
  addStar();
  inputOverlay.style.transition = 'opacity 0.7s';
  inputOverlay.style.opacity = 0;
  setTimeout(() => { inputOverlay.style.display = 'none'; }, 700);
}

function shineAllStars() {
  for (let s of stars) s.shine = true;
  let shineTime = 0;
  function shineAnim() {
    shineTime += 1;
    for (let s of stars) {
      s.alpha = 0.7 + 0.3 * Math.sin(Date.now() / 120 + s.x);
    }
    drawStars();
    if (shineTime < 60) {
      requestAnimationFrame(shineAnim);
    } else {
      goToMatrixScreen();
    }
  }
  shineAnim();
}

// Candle matrix logic
function goToMatrixScreen() {
  // 19x7 matrix pattern: 1 = lit candle, 0 = no candle
  const pattern = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,0,1,1,1,0,0,0,1,1,1,0,1,1,1,0],
    [0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0],
    [0,1,1,1,0,1,1,1,0,0,0,1,0,1,0,0,0,1,0],
    [0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0],
    [0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];
  // Create matrix container
  let matrixDiv = document.createElement('div');
  matrixDiv.className = 'matrix-candle-grid';
  matrixDiv.style.gridTemplateColumns = 'repeat(19, 1fr)';
  // Build grid with all cells, only show candle for 1s
  let candleRefs = Array.from({length: 19}, () => Array(7).fill(null));
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 19; col++) {
      let candle = document.createElement('div');
      candle.className = 'candle-cell empty';
      // Only fill in candleRefs for pattern=1
      if (pattern[row][col]) {
        candleRefs[col][row] = candle;
      }
      matrixDiv.appendChild(candle);
    }
  }
  document.body.appendChild(matrixDiv);
  setTimeout(() => {
    matrixDiv.classList.add('visible');
    // Animate lighting column by column, row by row
    let col = 0;
    function animateColumn() {
      if (col >= 19) {
        // Animation complete, show ready screen with counter
        showReadyScreen();
        return;
      }
      let row = 0;
      function animateRow() {
        if (row >= 7) {
          col++;
          setTimeout(animateColumn, 80); // Next column
          return;
        }
        let candle = candleRefs[col][row];
        if (candle) {
          candle.className = 'candle-cell';
          candle.innerHTML = '<span class="candle-flame"></span><span class="candle-body lit"></span>';
        }
        row++;
        setTimeout(animateRow, 80); // Next row in this column
      }
      animateRow();
    }
    animateColumn();
  }, 100);
}

// Frame of stars with yd.jpg in the center
function showStarFrameWithImage() {
  const rows = 9;
  const cols = 15;
  let matrixDiv = document.createElement('div');
  matrixDiv.className = 'matrix-candle-grid';
  matrixDiv.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  matrixDiv.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  matrixDiv.style.alignItems = 'center';
  matrixDiv.style.justifyItems = 'center';

  // Remove any existing matrix
  document.querySelectorAll('.matrix-candle-grid').forEach(e => e.remove());

  // Center image spans 3x3
  const imgStartRow = Math.floor(rows/2)-1;
  const imgStartCol = Math.floor(cols/2)-1;
  const imgEndRow = imgStartRow + 3;
  const imgEndCol = imgStartCol + 3;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Skip cells covered by the image except the top-left
      if (row >= imgStartRow && row < imgEndRow && col >= imgStartCol && col < imgEndCol && !(row === imgStartRow && col === imgStartCol)) {
        continue;
      }
      let cell = document.createElement('div');
      cell.className = 'candle-cell empty';
      // Frame: stars on the border
      if (row === 0 || row === rows-1 || col === 0 || col === cols-1) {
        cell.className = 'candle-cell';
        cell.innerHTML = '<div class="star"></div>';
      }
      // Center image (top-left of 3x3 span)
      if (row === imgStartRow && col === imgStartCol) {
        cell = document.createElement('div');
        cell.className = 'candle-cell';
        cell.style.gridColumn = `${col+1} / span 3`;
        cell.style.gridRow = `${row+1} / span 3`;
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.innerHTML = '<img src="yd.jpg" alt="YD" style="width:120px;height:120px;border-radius:16px;box-shadow:0 0 24px #ffd700;object-fit:cover;">';
      }
      matrixDiv.appendChild(cell);
    }
  }
  document.body.appendChild(matrixDiv);
  setTimeout(() => {
    matrixDiv.classList.add('visible');
    // Animate stars
    matrixDiv.querySelectorAll('.star').forEach((star, i) => {
      setTimeout(() => star.classList.add('shine'), 40*i);
    });
  }, 100);
}

// Show yd.jpg with 'happy birthday' in stars and a message below
function showBirthdayMessageWithImage() {
  // Remove any existing matrix
  document.querySelectorAll('.matrix-candle-grid').forEach(e => e.remove());

  // Remove any existing background music
  document.querySelectorAll('#backgroundMusic').forEach(e => e.remove());

  // Create background music (hidden video element)
  let backgroundMusic = document.createElement('video');
  backgroundMusic.id = 'backgroundMusic';
  backgroundMusic.src = 'yd.mp4';
  backgroundMusic.style.display = 'none';
  backgroundMusic.autoplay = true;
  backgroundMusic.loop = false;
  backgroundMusic.volume = 0.7; // Adjust volume as needed
  document.body.appendChild(backgroundMusic);

  // Create a simple centered container for the image and text
  let container = document.createElement('div');
  container.className = 'matrix-candle-grid visible';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.background = 'rgba(10, 16, 40, 0.98)';
  container.style.zIndex = '3';

  // Animated text
  let text = 'IYIKI DOGDUN';
  let textDiv = document.createElement('div');
  textDiv.style.fontSize = '2.2rem';
  textDiv.style.fontFamily = 'Segoe UI, Arial, sans-serif';
  textDiv.style.color = '#ffd700';
  textDiv.style.fontWeight = 'bold';
  textDiv.style.letterSpacing = '0.12em';
  textDiv.style.marginBottom = '32px';
  textDiv.style.textShadow = '0 2px 8px #222, 0 0 2px #ffd700';
  textDiv.style.minHeight = '2.5em';
  container.appendChild(textDiv);

  // Animate text letter by letter
  let i = 0;
  function animateText() {
    if (i <= text.length) {
      textDiv.textContent = text.slice(0, i);
      i++;
      setTimeout(animateText, 90);
    } else {
      animateMsg();
    }
  }
  animateText();

  let img = document.createElement('img');
  img.src = 'yd.jpg';
  img.alt = 'YD';
  img.style.width = '300px';
  img.style.height = '300px';
  img.style.borderRadius = '24px';
  img.style.boxShadow = '0 0 32px #ffd700';
  img.style.objectFit = 'cover';

  container.appendChild(img);

  // Add message at the bottom, animated after happy birthday
  let msgDiv = document.createElement('div');
  msgDiv.style.fontSize = '1.2rem';
  msgDiv.style.color = '#fffbe7';
  msgDiv.style.fontFamily = 'Segoe UI, Arial, sans-serif';
  msgDiv.style.textShadow = '0 2px 8px #222, 0 0 2px #ffd700';
  msgDiv.style.marginTop = '32px';
  msgDiv.style.textAlign = 'center';
  msgDiv.textContent = '';
  container.appendChild(msgDiv);

  // Animate bottom message after happy birthday
  const msg = 'şuan böyleyim, 3 doğru sayı degil :)';
  function animateMsg(j = 0) {
    if (j <= msg.length) {
      msgDiv.textContent = msg.slice(0, j);
      j++;
      setTimeout(() => animateMsg(j), 50);
    }
  }

  document.body.appendChild(container);
}

// Show 1.jpeg image when input is 7
function showImage1() {
  // Remove any existing matrix
  document.querySelectorAll('.matrix-candle-grid').forEach(e => e.remove());

  // Create a centered container for the image
  let container = document.createElement('div');
  container.className = 'matrix-candle-grid visible';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.background = 'rgba(10, 16, 40, 0.98)';
  container.style.zIndex = '3';

  // Add "happy birthday" text on top
  let textDiv = document.createElement('div');
  textDiv.textContent = 'IYIKI DOGDUN';
  textDiv.style.fontSize = '2.5rem';
  textDiv.style.fontFamily = 'Segoe UI, Arial, sans-serif';
  textDiv.style.color = '#ffd700';
  textDiv.style.fontWeight = 'bold';
  textDiv.style.letterSpacing = '0.12em';
  textDiv.style.marginBottom = '20px';
  textDiv.style.textShadow = '0 2px 8px #222, 0 0 2px #ffd700';
  textDiv.style.animation = 'fadeIn 1s ease-in';
  container.appendChild(textDiv);

  let img = document.createElement('img');
  img.src = '1.jpeg';
  img.alt = 'Image 1';
  img.style.maxWidth = '90vw';
  img.style.maxHeight = '90vh';
  img.style.width = 'auto';
  img.style.height = 'auto';
  img.style.borderRadius = '24px';
  img.style.boxShadow = '0 0 32px #ffd700';
  img.style.animation = 'fadeIn 1s ease-in';

  container.appendChild(img);

  // Add animated text at the bottom
  let bottomTextDiv = document.createElement('div');
  bottomTextDiv.style.fontSize = '1.2rem';
  bottomTextDiv.style.color = '#fffbe7';
  bottomTextDiv.style.fontFamily = 'Segoe UI, Arial, sans-serif';
  bottomTextDiv.style.textShadow = '0 2px 8px #222, 0 0 2px #ffd700';
  bottomTextDiv.style.marginTop = '20px';
  bottomTextDiv.style.textAlign = 'center';
  bottomTextDiv.textContent = '';
  container.appendChild(bottomTextDiv);

  // Animate bottom text letter by letter
  const bottomMsg = 'ekip olarak biz ŞOK!, 7 doğru sayı değil :)';
  let j = 0;
  function animateBottomText() {
    if (j <= bottomMsg.length) {
      bottomTextDiv.textContent = bottomMsg.slice(0, j);
      j++;
      setTimeout(animateBottomText, 80);
    }
  }
  
  // Start animation after a short delay
  setTimeout(animateBottomText, 1000);

  document.body.appendChild(container);

  // Hide input overlay
  inputOverlay.style.transition = 'opacity 0.7s';
  inputOverlay.style.opacity = '0';
  setTimeout(() => { inputOverlay.style.display = 'none'; }, 700);
}

// Show ready screen with counter before main.html
function showReadyScreen() {
  // Remove any existing matrix
  document.querySelectorAll('.matrix-candle-grid').forEach(e => e.remove());

  // Create ready screen container
  let readyContainer = document.createElement('div');
  readyContainer.className = 'matrix-candle-grid visible';
  readyContainer.style.display = 'flex';
  readyContainer.style.flexDirection = 'column';
  readyContainer.style.alignItems = 'center';
  readyContainer.style.justifyContent = 'center';
  readyContainer.style.position = 'absolute';
  readyContainer.style.top = '0';
  readyContainer.style.left = '0';
  readyContainer.style.width = '100vw';
  readyContainer.style.height = '100vh';
  readyContainer.style.background = 'rgba(10, 16, 40, 0.98)';
  readyContainer.style.zIndex = '3';

  // Ready text
  let readyText = document.createElement('div');
  readyText.style.fontSize = '2.5rem';
  readyText.style.fontFamily = 'Segoe UI, Arial, sans-serif';
  readyText.style.color = '#ffd700';
  readyText.style.fontWeight = 'bold';
  readyText.style.letterSpacing = '0.12em';
  readyText.style.marginBottom = '40px';
  readyText.style.textShadow = '0 2px 8px #222, 0 0 2px #ffd700';
  readyText.style.minHeight = '3em';
  readyText.style.textAlign = 'center';
  readyContainer.appendChild(readyText);

  // Animate the text letter by letter
  const message = "Hazırsan, başlayalım";
  let charIndex = 0;
  
  function animateText() {
    if (charIndex <= message.length) {
      readyText.textContent = message.slice(0, charIndex);
      charIndex++;
      setTimeout(animateText, 80);
    } else {
      // Start countdown after text animation completes
      setTimeout(updateCounter, 1000);
    }
  }
  
  // Start text animation
  setTimeout(animateText, 500);

  // Counter
  let counterText = document.createElement('div');
  counterText.style.fontSize = '2.5rem';
  counterText.style.fontFamily = 'Segoe UI, Arial, sans-serif';
  counterText.style.color = '#fffbe7';
  counterText.style.fontWeight = 'bold';
  counterText.style.textShadow = '0 2px 8px #222, 0 0 2px #ffd700';
  readyContainer.appendChild(counterText);

  document.body.appendChild(readyContainer);

  // Countdown from 3 to 1
  let count = 3;
  function updateCounter() {
    if (count > 0) {
      counterText.textContent = count;
      count--;
      setTimeout(updateCounter, 1000);
    } else {
      // Redirect to main.html
      window.location.href = 'image_gallery.html';
    }
  }
  
  // Countdown will start after text animation completes
}

// Show ironman.jpeg when input is not 17, 3, or 7
function showIronmanScreen() {
  // Remove any existing matrix
  document.querySelectorAll('.matrix-candle-grid').forEach(e => e.remove());

  // Create a centered container for the image
  let container = document.createElement('div');
  container.className = 'matrix-candle-grid visible';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.background = 'rgba(10, 16, 40, 0.98)';
  container.style.zIndex = '3';

  // Add title text on top
  let titleDiv = document.createElement('div');
  titleDiv.textContent = 'IYIKI DOGDUN';
  titleDiv.style.fontSize = '2.5rem';
  titleDiv.style.fontFamily = 'Segoe UI, Arial, sans-serif';
  titleDiv.style.color = '#ffd700';
  titleDiv.style.fontWeight = 'bold';
  titleDiv.style.letterSpacing = '0.12em';
  titleDiv.style.marginBottom = '20px';
  titleDiv.style.textShadow = '0 2px 8px #222, 0 0 2px #ffd700';
  titleDiv.style.animation = 'fadeIn 1s ease-in';
  container.appendChild(titleDiv);

  let img = document.createElement('img');
  img.src = 'ironman.jpeg';
  img.alt = 'Iron Man';
  img.style.maxWidth = '90vw';
  img.style.maxHeight = '90vh';
  img.style.width = 'auto';
  img.style.height = 'auto';
  img.style.borderRadius = '24px';
  img.style.boxShadow = '0 0 32px #ffd700';
  img.style.animation = 'fadeIn 1s ease-in';

  container.appendChild(img);

  // Add message at the bottom
  let msgDiv = document.createElement('div');
  msgDiv.style.fontSize = '1.2rem';
  msgDiv.style.color = '#fffbe7';
  msgDiv.style.fontFamily = 'Segoe UI, Arial, sans-serif';
  msgDiv.style.textShadow = '0 2px 8px #222, 0 0 2px #ffd700';
  msgDiv.style.marginTop = '20px';
  msgDiv.style.textAlign = 'center';
  msgDiv.textContent = '';
  container.appendChild(msgDiv);

  // Animate message letter by letter
  const msg = 'şuan "SAFE AREA" dasın, üzgünüm doğru sayılar ile denemelesin :)';
  let j = 0;
  function animateMsg() {
    if (j <= msg.length) {
      msgDiv.textContent = msg.slice(0, j);
      j++;
      setTimeout(animateMsg, 50);
    }
  }
  
  // Start animation after a short delay
  setTimeout(animateMsg, 1000);

  document.body.appendChild(container);

  // Hide input overlay
  inputOverlay.style.transition = 'opacity 0.7s';
  inputOverlay.style.opacity = '0';
  setTimeout(() => { inputOverlay.style.display = 'none'; }, 700);
}

// Responsive canvas
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generateStars(STAR_COUNT);
  drawStars();
}); 