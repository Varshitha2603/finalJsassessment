"use strict";


// without storing the data into database

var ctx = document.querySelector("#bar_chart");
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Bags", "Toys", "Laptops", "Chargers", "Mouse", "Books"],
        datasets: [{
            label: "Inventory Status",
            backgroundColor: [
                "#7e01c6", "#a124e9", "#C37AED", "#D995FD", "#B60071", "#3e95cd"
            ],
            data: [
                30, 40, 24, 28, 15, 45
            ],
            borderWidth: 1,
            borderRadius: 5,
            hoverBorderWidth: 2,
            hoverBorderColor: "#c84e2a",
        }],
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 100,
                    stepSize: 10,
                },
                scaleLabel: {
                    display: true,
                    fontSize: 14,
                    labelString: "Count",
                },
            }],
            xAxes: [{
                ticks: {
                    fontSize: 14
                },
                scaleLabel: {
                    display: false,
                    fontSize: 14,
                    labelString: "Product"
                }
            }],
        },
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: "Product Name",
            fontSize: 20,
        },
    }
});


// -------------------------------------------


// with storing the data into the database

$(document).ready(function () {
    $.ajax({
        method: "GET",
        url: "/backend/data.php?timestamp=" + new Date().getTime(),
        dataType: 'application/json',
        cache: false, // Disable caching
        success: function (data) {
            console.log(data); // Log the response data
            try {
                // Extract data from response
                var product = [];
                var count = [];
                var colors = [];

                // Process the data
                $.each(data, function(index, item) {
                    product.push(item.product);
                    count.push(item.count);
                    colors.push(color()); // Generate a random color for each bar
                });

                // Prepare chart data
                var chartData = {
                    labels: product,
                    datasets: [{
                        label: "Inventory Status",
                        backgroundColor: colors,
                        data: count,
                        borderWidth: 1,
                        borderRadius: 5,
                        hoverBorderWidth: 2,
                        hoverBorderColor: "#c84e2a"
                    }]
                };

                // Create chart
                var ctx = $("#bar_chart");
                new Chart(ctx, {
                    type: 'bar',
                    data: chartData,
                    options: {
                        scales: {
                            yAxes: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 10
                                },
                                title: {
                                    display: true,
                                    text: "Count",
                                    font: {
                                        size: 20
                                    }
                                }
                            },
                            xAxes: {
                                title: {
                                    display: false,
                                    text: "Product",
                                    font: {
                                        size: 20
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: "Product Inventory"
                            }
                        }
                    }
                });
            } catch (e) {
                console.error("Error processing data:", e);
            }
        },
        error: function (xhr, status, error) {
            // console.error("AJAX Error:", status, error);
            console.log("Response Text:", xhr.responseText);// Log the raw response for debugging
            // console.log(status, error);
            
        }
    });

    function color() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return 'rgba(' + r + ',' + g + ',' + b + ',1.0)';
    }
});

// -------------------------------------------------------------------------

// add product btn

let addProducctbtn = document.querySelector("#addProducctbtn");
let addproduct = document.querySelector(".appProduct");
addProducctbtn.addEventListener("click", (e)=> {
    e.preventDefault();
    addproduct.classList.add("dis");
    // console.log("hi");
    var he = document.createElement("h4");
    he.innerText = "Product";
    addproduct.append(he);

    var cross = document.createElement("p");
    cross.setAttribute("class", "p_cross")
    cross.textContent = "X";
    addproduct.append(cross);


    var product_form = document.createElement("form");
    product_form.setAttribute("class", "product_form");
    addproduct.append(product_form);

    var prdLabel = document.createElement("label");
    prdLabel.setAttribute("for", "product");
    prdLabel.textContent = "Product"; 
    product_form.append(prdLabel);
    
    var prdInput = document.createElement("input");
    prdInput.setAttribute("type", "text");
    prdInput.setAttribute("id", "product");
    prdInput.setAttribute("name", "product");
    product_form.append(prdInput);

    var qunLabel = document.createElement("label");
    qunLabel.setAttribute("for", "quantity");
    qunLabel.textContent = "Quantity";  // Set label text
    product_form.append(qunLabel);

    var qunInput = document.createElement("input");
    qunInput.setAttribute("type", "text");
    qunInput.setAttribute("id", "quantity");
    qunInput.setAttribute("name", "quantity");
    product_form.append(qunInput);

    let productBtn = document.createElement("button");
        productBtn.textContent = "Add Product";
        product_form.append(productBtn);

        let product_close = document.createElement("button");
        product_close.setAttribute("class", "close");
        product_close.innerHTML = `&times;`;
        product_form.append(product_close);

        product_close.addEventListener("click", ()=> {
            updateinventory.classList.remove("dis");
        })


    productBtn.addEventListener("click", ()=>{
        addproduct.classList.remove("dis");

        console.log(prdInput.vlaue);
        console.log(qunInput.value);

    })


});

// update inventory

document.addEventListener("DOMContentLoaded", () => {
    // Function to load table data from localStorage
    function loadTableData() {
        const storedData = localStorage.getItem("tableData");
        if (storedData) {
            const tableData = JSON.parse(storedData);
            tableData.forEach(rowData => {
                let tr = document.createElement('tr');

                let productTd = document.createElement('td');
                productTd.textContent = rowData.productName;
                tr.append(productTd);

                let quantityTd = document.createElement('td');
                quantityTd.textContent = rowData.quantity;
                tr.append(quantityTd);

                let recipientTd = document.createElement('td');
                recipientTd.textContent = rowData.recipient;
                tr.append(recipientTd);

                document.querySelector("#data").append(tr);
            });
        }
    }

    // Function to save table data to localStorage
    function saveTableData() {
        const rows = document.querySelectorAll("#data tr");
        const tableData = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            tableData.push({
                productName: cells[0].textContent,
                quantity: cells[1].textContent,
                recipient: cells[2].textContent,
            });
        });
        localStorage.setItem("tableData", JSON.stringify(tableData));
    }

    // Load the table data when the page loads
    loadTableData();

    let updatebtn = document.querySelector("#updatebtn");
    let updateinventory = document.querySelector(".update");

    updatebtn.addEventListener("click", (e) => {
        e.preventDefault();
        updateinventory.classList.add("dis");

        

        // Create and append the form
        let inventory_form = document.createElement("form");
        inventory_form.className = "inventory_form";
        

        // var he = document.createElement("h4");
        // he.innerText = "Update";
        // inventory_form.append(he);
        updateinventory.append(inventory_form);

        // Product Name
        let productnameLabel = document.createElement("label");
        productnameLabel.htmlFor = "productname";
        productnameLabel.textContent = "Product Name";
        inventory_form.append(productnameLabel);

        let productnameInput = document.createElement("input");
        productnameInput.type = "text";
        productnameInput.id = "productnameInput";
        productnameInput.name = "productnameInput";
        inventory_form.append(productnameInput);

        // Quantity
        let quantityLabel = document.createElement("label");
        quantityLabel.htmlFor = "quantity";
        quantityLabel.textContent = "Quantity";
        inventory_form.append(quantityLabel);

        let quantityInput = document.createElement("input");
        quantityInput.type = "text";
        quantityInput.id = "quantityInput";
        quantityInput.name = "quantityInput";
        inventory_form.append(quantityInput);

        // Recipient
        let recipientLabel = document.createElement("label");
        recipientLabel.htmlFor = "recipient";
        recipientLabel.textContent = "Recipient";
        inventory_form.append(recipientLabel);

        let recipientInput = document.createElement("input");
        recipientInput.type = "text";
        recipientInput.id = "recipientInput";
        recipientInput.name = "recipientInput";
        inventory_form.append(recipientInput);

        // Update Inventory Button
        let inventoryBtn = document.createElement("button");
        inventoryBtn.textContent = "Update Inventory";
        inventory_form.append(inventoryBtn);

        let inventory_close = document.createElement("button");
        inventory_close.setAttribute("class", "close");
        inventory_close.innerHTML = `&times;`;
        inventory_form.append(inventory_close);

        inventory_close.addEventListener("click", ()=> {
            updateinventory.classList.remove("dis");
        });

        inventoryBtn.addEventListener("click", () => {
            // e.preventDefault();
            // updateinventory.classList.remove("dis");
            // Create a new table row and cells
            let tr = document.createElement('tr');

            let productTd = document.createElement('td');
            productTd.textContent = productnameInput.value;
            tr.append(productTd);

            let recipientTd = document.createElement('td');
            recipientTd.textContent = recipientInput.value;
            tr.append(recipientTd);

            let quantityTd = document.createElement('td');
            quantityTd.textContent = quantityInput.value;
            tr.append(quantityTd);

            // Append the new row to the table body
            document.querySelector("#data").append(tr);

            // Save the updated table data to localStorage
            saveTableData();

            // Optionally, clear the form
            inventory_form.reset();
        });
    });
});








