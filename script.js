// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");

  // Check if the user is logged in
  function isLoggedIn() {
    return sessionStorage.getItem("user") !== null;
  }
});

//! LOGIN ---------------------------------------
document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    };

    // Make Ajax POST request
    fetch("https://ict4510.herokuapp.com/api/login", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        console.log("HTTP Response:", response);
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Login failed.");
        }
      })

      .then((data) => {
        console.log("Login successful");
        console.log("Username:", formData.username);
        console.log("Password:", formData.password);
        console.log("Session Token:", data.user.session_token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        console.log("API Key:", data.user.api_key);
        document.querySelector(".post-login-content").style.display = "block";

        // Hide the login form
        document.getElementById("login-form").style.display = "none";
        document.getElementById("welcome").style.display = "none";
      })
      .catch((error) => {
        console.error("Login error:", error);
      });

    //! Menu form
    document
      .getElementById("menu-form")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) {
          // User not logged in
          return;
        }

        const item = document.getElementById("item").value;
        const description = document.getElementById("description").value;
        const price = document.getElementById("price").value;

        const url = `https://ict4510.herokuapp.com/api/menus?api_key=${user.api_key}`;
        const headers = {
          "Content-Type": "application/json",
          "x-access-token": user.session_token,
        };
        const data = JSON.stringify({ item, description, price });

        axios
          .post(url, data, { headers })
          .then((response) => {
            if (response.status === 201) {
              // Successful request
              console.log("Menu item added successfully");
              // Clear form fields
              document.getElementById("item").value = "";
              document.getElementById("description").value = "";
              document.getElementById("price").value = "";

              fetchAndRenderMenuItems(user.api_key);
            }
          })
          .catch((error) => {
            console.error("Error adding menu item:", error);
          });
      });
    // Fetch and render menu items
    function fetchAndRenderMenuItems(apiKey) {
      const menuItemsContainer = document.getElementById("menu-items");

      const url = `https://ict4510.herokuapp.com/api/menus?api_key=${apiKey}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("API Response:", data); // Log the API response

          if (Array.isArray(data?.menu)) {
            const items = data?.menu;
            console.log("Menu items:", items); // Log the extracted menu items

            // Clear existing menu items
            // menuItemsContainer.innerHTML = "";

            // Render fetched menu items
            items.forEach((menuItem) => {
              console.log(menuItem)
              const itemElement = document.createElement("div");
              itemElement.classList.add("menu-item");
              itemElement.innerHTML = `
          <h3>${menuItem.item}</h3>
          <p>${menuItem.description}</p>
          <p>Price: $${menuItem.price}</p>
        `;
              menuItemsContainer.appendChild(itemElement);
            });
          } else {
            console.error("Invalid menu items response:", data);
          }
        })
        .catch((error) => console.error("Error fetching menu items:", error));
    }
  });
//! menu items ---------------------------------------

// menu page stuff
window.addEventListener('load', function(event) {
    console.log('load')
});

//! SLIDER ---------------------------------------
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.style.opacity = 1;
    } else {
      slide.style.opacity = 0;
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Initial slide show
showSlide(currentSlide);

// Auto play the slider
setInterval(nextSlide, 5000);

//! MAP ---------------------------------------

// Mapbox access token
var accessToken =
  "pk.eyJ1IjoiY2FpdGx5bmVubyIsImEiOiJjbGtweG5oZHMwam5kM2RuemR5c25pcTZ0In0.iFRqZOXeF0i83OT6b0b_dw";

// Initializes the map
var map = L.map("map").setView([39.678121, -104.961753], 15);

// tile layer with the access token
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" +
    accessToken,
  {
    maxZoom: 20,
    id: "mapbox/streets-v11",
  }
).addTo(map);

// Adds a marker to the map
var marker = L.marker([39.678121, -104.961753]).addTo(map);

//! Logout --------------------------
document.getElementById("logout-button").addEventListener("click", function () {
  // Clear session storage
  console.log("Logout button clicked");
  sessionStorage.removeItem("user");
  document.querySelector(".post-login-content").style.display = "none";
  document.getElementById("login-form").style.display = "block";
});
