const defaultConfig = {
  recipient_name: 'Shahinam',
  greeting_text: 'Sizni 8-Mart — Xalqaro Xotin-Qizlar kuni bilan chin dildan tabriklayman!\n\nHayotingiz baxt-saodatga, yuragingiz mehr-muhabbatga to\'la bo\'lsin!\n\nOilangizga tinchlik, ishlaringizga omad tilayman! 🌸'
};

let isOpened = false;
let isTyping = false;

function typeText(element, text, speed = 40) {
  return new Promise((resolve) => {
    element.innerHTML = '';
    let charIndex = 0;

    function type() {
      if (charIndex < text.length) {
        const char = text[charIndex];
        if (char === '\n') {
          element.innerHTML += '<br>';
        } else {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.animation = 'ink-flow 0.15s ease-out';
          element.appendChild(span);
        }
        charIndex++;
        setTimeout(type, speed);
      } else {
        element.classList.remove('writing');
        resolve();
      }
    }

    element.classList.add('writing');
    type();
  });
}

function createConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#ec4899', '#f472b6', '#a855f7', '#c084fc', '#fbbf24', '#f87171', '#34d399', '#60a5fa', '#f9a8d4', '#fcd34d'];
  const shapes = ['●', '■', '★', '♥', '✦', '❀', '✿', '❁'];

  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = (Math.random() * 2.5 + 2) + 's';
      confetti.style.animationDelay = Math.random() * 0.3 + 's';

      const isShape = Math.random() > 0.5;
      if (isShape) {
        confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        confetti.style.background = 'none';
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.fontSize = (Math.random() * 16 + 12) + 'px';
      } else {
        confetti.style.width = (Math.random() * 10 + 6) + 'px';
        confetti.style.height = (Math.random() * 10 + 6) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      }

      container.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }, i * 22);
  }
}

async function openEnvelope() {
  if (isOpened || isTyping) return;
  isOpened = true;

  const seal = document.getElementById('seal');
  const envelope = document.getElementById('envelope');
  const letter = document.getElementById('letter');
  const burst = document.getElementById('burst');
  const instruction = document.getElementById('instruction');
  const recipientEl = document.getElementById('recipient-name');
  const greetingEl = document.getElementById('greeting-text');
  const bayramEl = document.getElementById('bayram-text');
  const signatureEl = document.getElementById('signature');

  seal.classList.add('breaking');
  burst.classList.add('active');

  setTimeout(() => {
    seal.style.display = 'none';
    envelope.classList.remove('pulse');
    envelope.classList.add('opened');

    setTimeout(() => {
      letter.classList.add('visible');
      createConfetti();

      instruction.style.opacity = '0';
      isTyping = true;

      setTimeout(async () => {
        const name = defaultConfig.recipient_name;
        const greeting = defaultConfig.greeting_text;

        await typeText(recipientEl, name, 70);
        await new Promise(r => setTimeout(r, 350));

        await typeText(greetingEl, greeting, 38);
        await new Promise(r => setTimeout(r, 400));

        await typeText(bayramEl, 'Bayramingiz muborak!', 60);
        await new Promise(r => setTimeout(r, 350));

        await typeText(signatureEl, 'Hurmat bilan,\nShohruh', 90);

        isTyping = false;

        setTimeout(() => {
          instruction.textContent = '🎉 Bayramingiz muborak! 🎉';
          instruction.style.opacity = '1';
        }, 300);
      }, 500);
    }, 450);
  }, 480);
}

document.getElementById('seal').addEventListener('click', openEnvelope);
document.getElementById('envelope').addEventListener('click', function(e) {
  if (!isOpened && !isTyping && !e.target.closest('.seal')) {
    openEnvelope();
  }
});

async function onConfigChange(config) {
  if (config.recipient_name) defaultConfig.recipient_name = config.recipient_name;
  if (config.greeting_text) defaultConfig.greeting_text = config.greeting_text;

  if (!isOpened) {
    const recipientEl = document.getElementById('recipient-name');
    const greetingEl = document.getElementById('greeting-text');
    if (recipientEl) recipientEl.textContent = config.recipient_name || defaultConfig.recipient_name;
    if (greetingEl) greetingEl.textContent = (config.greeting_text || defaultConfig.greeting_text).replace(/\\n/g, '\n');
  }
}

function mapToCapabilities(config) {
  return { recolorables: [], borderables: [], fontEditable: undefined, fontSizeable: undefined };
}

function mapToEditPanelValues(config) {
  return new Map([
    ['recipient_name', config.recipient_name || defaultConfig.recipient_name],
    ['greeting_text', config.greeting_text || defaultConfig.greeting_text]
  ]);
}

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities,
    mapToEditPanelValues
  });
}
