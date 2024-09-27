// URLs for JSON files from different kitchens
const jsonUrls = [
    "https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/93077/49?lang=fi",
    'https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/93077/69?lang=fi',
    'https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/93077/70?lang=fi'];


// Get the current date in YYYYMMDD format to match with the JSON
const today = new Date();
const formattedDate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
// Get the container to display the menus
const menuContainer = document.getElementById('menu-container');

// Fetch and display the menus for today
function fetchAndDisplayMenus() {
    jsonUrls.forEach(url => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayMenuForToday(data);
            })
            .catch(error => console.error('Error fetching menu:', error));
    });
}

function displayMenuToday(data) {
    const restaurantName = data.siteId; // Assuming this is the restaurant name (update based on actual field if needed)
    const mealOptions = data.mealOptions;

    // Create a container for this restaurant's menu
    const restaurantMenuDiv = document.createElement('div');
    restaurantMenuDiv.classList.add('restaurant-menu');

    // Display the restaurant name
    const nameTitle = document.createElement('h2');
    nameTitle.classList.add('restaurant-name');
    nameTitle.textContent = restaurantName; // Displaying the siteId as restaurant name, change this if you have a specific field for it
    restaurantMenuDiv.appendChild(nameTitle);

    // Loop through meal options and display their names
    mealOptions.forEach(option => {
        option.rows.forEach(row => {
            const mealDiv = document.createElement('div');
            mealDiv.classList.add('meal-option');

            // Get names in both languages (assuming English and Finnish)
            const mealNames = row.names.map(nameObj => nameObj.name).join(' / ');

            // Create a title for the meal option
            const mealTitle = document.createElement('p');
            mealTitle.classList.add('meal-name');
            mealTitle.textContent = mealNames; // Set meal option names
            mealDiv.appendChild(mealTitle);

            // Append the meal option to the restaurant menu div
            restaurantMenuDiv.appendChild(mealDiv);
        });
    });

    // Append this restaurant's menu to the main container
    menuContainer.appendChild(restaurantMenuDiv);
}

// Function to display the menu for the current day
function displayMenuForToday(data) {
    const kitchenName = data[0].kitchenName;
    const menuData = data[0].menuTypes[0].menus;  // Assuming we want the first menu type

    // Create a container for this kitchen's menu
    const kitchenMenuDiv = document.createElement('div');
    kitchenMenuDiv.classList.add('kitchen-menu');

    const menuTitle = document.createElement('h2');
    menuTitle.classList.add('menu-title');
    menuTitle.textContent = kitchenName;
    kitchenMenuDiv.appendChild(menuTitle);

    // Find today's menu
    menuData.forEach(menu => {
        const menuDays = menu.days;
        menuDays.forEach(day => {
            if (day.date == formattedDate) {
                day.mealoptions.forEach(option => {
                    // Create a div for the meal option
                    const mealDiv = document.createElement('div');
                    mealDiv.classList.add('meal-option');

                    // Meal option name
                    const mealName = document.createElement('p');
                    mealName.classList.add('meal-name');
                    mealName.textContent = option.name;
                    mealDiv.appendChild(mealName);

                    // Add child menu items
                    option.menuItems.forEach(item => {
                        const menuItemDiv = document.createElement('div');
                        menuItemDiv.classList.add('menu-item');
                        menuItemDiv.style.marginLeft = '20px'; // Indent child items

                        // Menu item details: name, portion size, and diets
                        const itemDetails = document.createElement('p');
                        itemDetails.innerHTML = `
                            <strong>${item.name}</strong> 
                            (Portion: ${item.portionSize}g, Diets: ${item.diets})
                        `;
                        menuItemDiv.appendChild(itemDetails);

                        // Append the menu item to the meal option
                        mealDiv.appendChild(menuItemDiv);
                    });

                    // Append the meal option to the kitchen menu div
                    kitchenMenuDiv.appendChild(mealDiv);
                });
            }
        });
    });

    // Append this kitchen's menu to the main container
    menuContainer.appendChild(kitchenMenuDiv);
}

// Fetch and display menus when the page loads
window.onload = 
    fetchAndDisplayMenus