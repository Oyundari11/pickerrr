document.addEventListener("DOMContentLoaded", () => {
  const wheel = document.getElementById('wheel');
  const spinBtn = document.getElementById('spinBtn');
  const overlay = document.getElementById('resultOverlay');
  const questionText = document.getElementById('questionText');
  const resultText = document.getElementById('resultText');
  const closeBtn = document.getElementById('closeBtn');
  const toggleText = document.getElementById('toggleText');

  const optionInputs = [
    document.getElementById('option1'),
    document.getElementById('option2'),
    document.getElementById('option3')
  ];

  const totalSlices = 11;
  let rotation = 0;

  function generateWheel() {
    const sliceAngle = 360 / totalSlices;
    const options = optionInputs.map((inp, i) => inp.value.trim() || ['Yes', 'No', 'Maybe'][i]);
    const showText = toggleText.checked;

    wheel.innerHTML = '';
    for (let i = 0; i < totalSlices; i++) {
      const slice = document.createElement('div');
      slice.className = 'slice';
      slice.style.transform = `rotate(${i * sliceAngle}deg)`;
      slice.style.background = '#000';

      if (showText) {
        const span = document.createElement('span');
        span.textContent = options[i % 3];
        span.style.transform = `rotate(${-i * sliceAngle}deg)`; // keep text upright
        slice.appendChild(span);
      }

      wheel.appendChild(slice);
    }
  }

  generateWheel();
  toggleText.addEventListener('change', generateWheel);
  optionInputs.forEach(inp => inp.addEventListener('input', generateWheel));

  spinBtn.addEventListener('click', () => {
    spinBtn.disabled = true;

    const randomFullSpins = Math.floor(Math.random() * 5 + 5); // 5–9 full spins
    const randomExtra = Math.random() * 360; // extra degrees for randomness
    rotation += randomFullSpins * 360 + randomExtra;

    wheel.style.transition = 'transform 4s cubic-bezier(0.33,1,0.68,1)';
    wheel.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
      const normalizedRotation = rotation % 360;
      const sliceAngle = 360 / totalSlices;

      // Adjust for triangular slice so pointer matches the visible top part
      const visualOffset = sliceAngle * 0.1; // tweak 0.1 until perfectly aligned
      let index = Math.floor((normalizedRotation + visualOffset) / sliceAngle);
      index = (totalSlices - index) % totalSlices;

      const options = optionInputs.map((inp, i) => inp.value.trim() || ['Yes', 'No', 'Maybe'][i]);
      const result = options[index % 3];

      questionText.textContent = '';
      resultText.textContent = `Result: ${result}`;
      overlay.style.display = 'flex';

      spinBtn.disabled = false;
    }, 4000);
  });

  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
  });
});