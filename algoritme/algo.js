let gridContainer = document.getElementById('grid');
let status = document.getElementById('status');

function startSieve() {
    let maxNumber = parseInt(document.getElementById('maxNumber').value);
    let blockSize = parseInt(document.getElementById('blockSize').value);

    if (isNaN(maxNumber) || isNaN(blockSize) || maxNumber < 2 || blockSize < 2) {
        alert("Please enter valid numbers.");
        return;
    }

    // Clear grid and reset status
    gridContainer.innerHTML = '';
    status.textContent = 'Processing...';

    // Create grid of numbers
    let numbers = Array.from({ length: maxNumber - 1 }, (_, i) => i + 2);
    numbers.forEach(num => {
        let div = document.createElement('div');
        div.classList.add('grid-cell');
        div.textContent = num;
        div.setAttribute('data-number', num);
        gridContainer.appendChild(div);
    });

    // Begin block-wise sieve
    sieveByBlocks(numbers, maxNumber, blockSize);
}

function sieveByBlocks(numbers, maxNumber, blockSize) {
    let primes = Array(maxNumber + 1).fill(true); // Assume all numbers are prime
    primes[0] = primes[1] = false; // 0 and 1 are not prime
    let sqrtMax = Math.floor(Math.sqrt(maxNumber));

    // Use classical sieve to find all primes up to sqrt(N)
    let smallPrimes = [];
    for (let i = 2; i <= sqrtMax; i++) {
        if (primes[i]) {
            smallPrimes.push(i);
            for (let j = i * i; j <= sqrtMax; j += i) {
                primes[j] = false;
            }
        }
    }

    // Process the numbers in blocks
    let start = 2;
    function processNextBlock() {
        if (start > maxNumber) {
            status.textContent = 'Sieve Completed!';
            return;
        }

        let end = Math.min(start + blockSize - 1, maxNumber);
        highlightBlock(start, end);

        // Process each block and apply small primes
        setTimeout(() => {
            processBlock(start, end, smallPrimes);
            start += blockSize;
            setTimeout(processNextBlock, 1500); // Continue with the next block after 1.5 seconds
        }, 1000); // Delay before processing each block
    }

    processNextBlock(); // Start processing blocks
}

function highlightBlock(start, end) {
    // Highlight the numbers in the current block
    for (let i = start; i <= end; i++) {
        let cell = document.querySelector(`.grid-cell[data-number='${i}']`);
        if (cell) {
            cell.classList.add('highlight');
        }
    }
}

function processBlock(start, end, smallPrimes) {
    let blockPrimes = Array(end - start + 1).fill(true); // Assume all numbers are prime

    // Mark non-primes in the current block using small primes
    smallPrimes.forEach(prime => {
        let firstMultiple = Math.max(prime * prime, Math.ceil(start / prime) * prime);
        for (let j = firstMultiple; j <= end; j += prime) {
            if (j >= start) {
                let index = j - start;
                blockPrimes[index] = false;
            }
        }
    });

    // Cross out non-primes with animation
    setTimeout(() => {
        for (let i = start; i <= end; i++) {
            let cell = document.querySelector(`.grid-cell[data-number='${i}']`);
            if (cell && !blockPrimes[i - start]) {
                cell.classList.add('x-marked');
            }
        }
    }, 1000); // Wait 1 second before crossing out non-primes
}
