const API_KEY = '2338903860f79309a2c80029ea7ee41f';
const API_ID = '47c93345';

// Function to search for food using Nutritionix API
function searchFood() {
    const query = document.getElementById('food-search').value;
    fetch(`https://trackapi.nutritionix.com/v2/search/instant?query=${query}`, {
        method: 'GET',
        headers: {
            'x-app-id': API_ID,
            'x-app-key': API_KEY,
        }
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data.common);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to display search results
function displayResults(foods) {
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = '';
    
    foods.forEach(food => {
        const foodDiv = document.createElement('div');
        foodDiv.classList.add('food-item');
        foodDiv.innerHTML = `
            <h3>${food.food_name}</h3>
            <button onclick="getFoodDetails('${food.food_name}')">Get Nutrition Info</button>
        `;
        resultsDiv.appendChild(foodDiv);
    });
}

// Function to get nutritional info of selected food
function getFoodDetails(foodName) {
    fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
        method: 'POST',
        headers: {
            'x-app-id': API_ID,
            'x-app-key': API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: foodName
        })
    })
    .then(response => response.json())
    .then(data => {
        logFood(data.foods[0]);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to log food to daily intake
function logFood(food) {
    let dailyLog = JSON.parse(localStorage.getItem('dailyLog')) || [];
    dailyLog.push(food);
    localStorage.setItem('dailyLog', JSON.stringify(dailyLog));
    alert(`${food.food_name} added to your log!`);
}

// Function to display daily log
// Function to clear the daily log
function clearDailyLog() {
    localStorage.removeItem('dailyLog');
    alert('Daily log cleared!');
    displayDailyLog();  // Refresh the displayed log
}

// Existing displayDailyLog function
function displayDailyLog() {
    const dailyLog = JSON.parse(localStorage.getItem('dailyLog')) || [];
    const logDiv = document.getElementById('daily-log');
    const summary = { calories: 0, protein: 0, carbs: 0 };

    logDiv.innerHTML = '';
    dailyLog.forEach(food => {
        logDiv.innerHTML += `
            <div>
                <h3>${food.food_name}</h3>
                <p>Calories: ${food.nf_calories}</p>
                <p>Protein: ${food.nf_protein}g</p>
                <p>Carbs: ${food.nf_total_carbohydrate}g</p>
            </div>
        `;
        summary.calories += food.nf_calories;
        summary.protein += food.nf_protein;
        summary.carbs += food.nf_total_carbohydrate;
    });

    document.getElementById('summary').innerHTML = `
        <h2>Daily Summary</h2>
        <p>Total Calories: ${summary.calories.toFixed(2)}</p>
        <p>Total Protein: ${summary.protein.toFixed(2)}g</p>
        <p>Total Carbs: ${summary.carbs.toFixed(2)}g</p>
    `;
}

// Call displayDailyLog when on the log page
if (window.location.href.includes('log.html')) {
    displayDailyLog();
}

function clearDailyLog() {
    localStorage.removeItem('dailyLog');
    alert('Daily log cleared!');
    displayDailyLog();  // Refresh the displayed log
}
