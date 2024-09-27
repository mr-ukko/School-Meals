// URLs for JSON files from different kitchens
const jsonUrls = [
    "https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/93077/49?lang=fi",
    'https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/93077/69?lang=fi',
    'https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/93077/70?lang=fi'];


// Get the current date in YYYYMMDD format to match with the JSON
const today = new Date();
//const formattedDate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
formattedDate = 20240927
// Get the container to display the menus
const menuContainer = document.getElementById('menu-container');

// Fetch and display the menus for today
function fetchAndDisplayMenus() {
    jsonUrls.forEach(url => {
        const lang = langfinder();
        fetch(url.replace("?lang=fi","?lang="+lang))
            .then(response => response.json())
            .then(data => {
                displayMenuForToday(data);
            })
            .catch(error => console.error('Error fetching menu:', error));
    });
}
function langfinder (){
    return document.getElementById('language').value;
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
function switchLanguage() {
    const menuItems = document.querySelectorAll('.kitchen-menu');
    // Loop through each menu item and remove it from the DOM
    menuItems.forEach(item => {
        item.remove();
    });
    fetchAndDisplayMenus();
}

// Fetch and display menus when the page loads
window.onload = fetchAndDisplayMenus