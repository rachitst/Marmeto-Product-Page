const url = "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448";

// Selecting HTML elements
const vendorName = document.querySelector(".vendor_name");
const titleName = document.querySelector(".title_name");
const saleAmount = document.querySelector(".sale_amount");
const originalPrice = document.querySelector(".total_price");
const descriptionMatter = document.querySelector(".description");
const discountPercent  = document.querySelector(".discount_percent");
const colorOptions = document.querySelector(".color_options");
const decrementSign = document.querySelector(".decrement_sign");
const incrementSign = document.querySelector(".increment_sign");
const cartValue = document.querySelector(".value");
const mainImage = document.querySelector("#full_img");

// Fetching data from the provided URL
const getData = async () => {
    let response = await fetch(url);
    let data = await response.json();
    // Rendering UI with the fetched data
    renderUI(data);
};

// Function to render UI with product data
function renderUI(data) {
    const productData = data.product;
    
    // Setting text content for various elements
    vendorName.textContent = productData.vendor; 
    titleName.textContent = productData.title; 
    saleAmount.textContent = productData.price;
    originalPrice.textContent = productData.compare_at_price;
    descriptionMatter.innerHTML = productData.description;

    // Calculating and displaying discount percentage
    const price = parseInt(productData.price.replace(/[$]/g, ""));  
    const totalPrice = parseInt(productData.compare_at_price.replace(/[$]/g, ""));
    const discount = ((totalPrice - price) / totalPrice) * 100;
    discountPercent.textContent = `${discount.toFixed(0)}% off`;

    // Creating HTML for color options
    let colorHtml = " ";
    productData.options[0].values.forEach(color => {
        colorHtml = colorHtml + `<span class="product-colors" id="${Object.keys(color)[0]}" style="background-color:${Object.values(color)[0]}"></span>`;
    });
    colorOptions.innerHTML = colorHtml;
    document.querySelector(".product-colors").classList.add("selected");
    
    // Handling click events for color options
    const colorSpans = colorOptions.querySelectorAll('.product-colors');
    colorSpans.forEach(colorSpan => {
        colorSpan.addEventListener('click', function() {
            colorSpans.forEach(span => {
                span.classList.remove('selected');
            });
            colorSpan.classList.add('selected');
        });
    });

    // Creating HTML for size options
    let sizeHtml = " ";
    productData.options[1].values.forEach(size => {
        sizeHtml += `<div class="size_container">
        <input type="radio" class="sizes" name="product-sizes" name="${size.toLowerCase()}" value="${size}" id="${size.toLowerCase()}">
        <label for="${size.toLowerCase()}">${size}</label>
    </div>`
    });
    document.querySelector(".size_options").innerHTML = sizeHtml;

    // Handling change events for size options
    document.querySelectorAll('.sizes').forEach(sizeContainer => {
        sizeContainer.addEventListener('change', function() {
            document.querySelectorAll('.size_container').forEach(container => {
                container.classList.remove('clicked');
            });
            sizeContainer.closest('.size_container').classList.add('clicked');
        });
    });

    // Handling click event for the "Add to Cart" button
    document.querySelector(".cart_btn").addEventListener("click", function () {
        let size = document.querySelector('input[name="product-sizes"]:checked')?.value;
        let selectedColor = document.querySelector(".product-colors.selected")?.getAttribute("id");

        if (!size || !selectedColor) {
            alert("Please select color/size");
            return;
        }
        let html = ` ${productData.title} with Color ${selectedColor} and Size ${size} added to cart`;
        document.querySelector(".cart_message").innerText = html;
        document.querySelector(".cart_message").style.display = "block";

        // Hide the cart message after 10 seconds
        setTimeout(function () { 
            document.querySelector(".cart_message").style.display = "none";
        }, 10000);
    });
};

// Fetching and rendering data
getData();

// Handling click events for variant images
const variantImages = document.querySelectorAll('.variant');
variantImages.forEach(variantImage => {
    variantImage.addEventListener('click', function() {
        variantImages.forEach(image => {
            image.classList.remove('selected');
        });
        variantImage.classList.add('selected');
        mainImage.src = variantImage.src;
        mainImage.src = variantImage.src; // This line seems redundant; you can remove it if not necessary
    });
});

// Handling click events for decrement and increment buttons
const decrementHandler = () => {
    let currentValue = +cartValue.textContent;
    if (currentValue >= 1) {
        cartValue.textContent = currentValue - 1;
    }
};
const incrementHandler = () => {
    let currentValue = +cartValue.textContent;
    cartValue.textContent = currentValue + 1;
};

decrementSign.addEventListener('click', decrementHandler);
incrementSign.addEventListener('click', incrementHandler);
