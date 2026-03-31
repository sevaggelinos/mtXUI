const API_BASE_URL = "http://mtx.fteli.eu/api"; 
//const API_BASE_URL = "http://localhost:9090/api"; 
let paymentData = []; // global array to hold payment data for sorting
const resultBox = document.getElementById("result");
const resultBoxMan = document.getElementById("manresult");
const resultBoxMod = document.getElementById("modresult");
const resultBoxPay = document.getElementById("payresult");
const resultBoxPrc = document.getElementById("prcresult");
const loadManufacturersBtn = document.getElementById("loadManufacturersBtn");
const manufacturerForm = document.getElementById("ManufacturerForm");
const manCard =  document.getElementById("ManufacturerCard");
const modCard =  document.getElementById("ModelCard");
const payCard =  document.getElementById("PriceAnalysisCard");
const prcCard =  document.getElementById("PriceCard");
let currentSortOrder = true; // true = ascending, false = descending
function showResult(data) {
  resultBox.textContent = JSON.stringify(data, null, 2);
}

function showResultMan(data) {
  resultBoxMan.textContent = JSON.stringify(data, null, 2);
}

function showResultMod(data) {
  resultBoxMod.textContent = JSON.stringify(data, null, 2);
}

function showResultPrc(data) {
  resultBoxPrc.textContent = JSON.stringify(data, null, 2);
}


function showResultPay(data) {
  resultBoxPay.textContent = JSON.stringify(data, null, 2);
}

function showError(error) {
  resultBox.textContent = `Error: ${error.message}`;
}

function renderManufacturers(data) {
  const tbody = document.querySelector("#manufacturersTable tbody");

  // clear existing rows
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.id}</td>
      <td>
        <span class="text">${item.manufacturerName}</span>
        <input class="edit" value="${item.manufacturerName}" style="display:none"/>
      </td>
      <td>
        <span class="text">${item.advancePaymentPercentage}</span>
        <input class="edit" value="${item.advancePaymentPercentage}" style="display:none"/>
      </td>
      <td>
        <span class="text">${item.pctOfInstallment}</span>
        <input class="edit" value="${item.pctOfInstallment}" style="display:none"/>
      </td>
      <td>
        <span class="text">${item.numberOfInstallments}</span>
        <input class="edit" value="${item.numberOfInstallments}" style="display:none"/>
      </td>
      <td>
        <button onclick="editRow(this)">Edit</button>
        <button onclick="saveRow(this, ${item.id}, null,'manufacturers')" style="display:none">Save</button>
        <button onclick="deleteRow(${item.id}, 'manufacturers')">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function renderPayments(data) {
  const tbody = document.querySelector("#paymentTable tbody");

  // clear existing rows
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <span class="text">${item.manufacturerName}</span>
      </td>
      <td>
        <a class="text" href="${item.modelURL}" target="_blank">${item.modelName}</a>
      </td>
      <td>
        <span class="text">${item.advancePaymentPercentage}</span>
      </td>
      <td>
        <span class="text">${item.pctOfInstallment}</span>
      </td>
      <td>
        <span class="text">${item.numberOfInstallments}</span>
      </td>
      <td>
        <span class="text">${item.price}</span>
      </td>
      <td>
        <span class="text">${item.extraCost}</span>
      </td>
      <td>
        <span class="text">${item.remainingPaymentAmount}</span>
      </td>
      <td>
        <span class="text">${item.advancePaymentAmount}</span>
      </td>
      <td>
        <span class="text">${item.monthlyPaymentAmount}</span>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function sortBy(key) {
  currentSortOrder = !currentSortOrder; // Toggle order

  paymentData.sort((a, b) => {
    let valA = a[key];
    let valB = b[key];

    // Handle string comparisons (names) vs numbers
    if (typeof valA === 'string') {
      return currentSortOrder 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    } else {
      return currentSortOrder ? valA - valB : valB - valA;
    }
  });

  renderPayments(paymentData);
}

function renderModels(data) {
  const tbody = document.querySelector("#modelsTable tbody");

  // clear existing rows
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.id}</td>
      <td>
        <span class="text">${item.modelName}</span>
        <input class="edit" value="${item.modelName}" style="display:none"/>
      </td>
      <td>
        <a class="text" href="${item.modelURL}" target="_blank">${item.modelName}</a>
        <input class="edit" value="${item.modelURL}" style="display:none"/>
      </td>
      <td>
        <span class="text">${item.manufacturer.manufacturerName}</span>
        <input class="edit" value="${item.manufacturer.id}" style="display:none"/>
      </td>
      <td>
        <button onclick="editRow(this)">Edit</button>
        <button onclick="saveRow(this, ${item.id}, ${item.manufacturer.id}, 'models')" style="display:none">Save</button>
        <button onclick="deleteRow(${item.id}, 'models')">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function renderPrices(data) {
  const tbody = document.querySelector("#priceTable tbody");

  // clear existing rows
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <span class="text">${item.id}</span>
        <input class="edit" value="${item.id}" style="display:none"/>
      </td>
      <td>
        <span class="text">${item.price}</span>
        <input class="edit" value="${item.price}" style="display:none"/>
      </td>
      <td>
        <span class="text">${item.activationDate}</span>
        <input class="edit" value="${item.activationDate}" style="display:none"/>
      </td>
      <td>
        <span class="text">${item.deactivationDate}</span>
        <input class="edit" value="${item.deactivationDate}" style="display:none"/>
      </td>
      <td>
        <span class="text">${item.model.modelName}</span>
        <input class="edit" value="${item.model.id}" style="display:none"/>
      </td>
      <td>
        <button onclick="editRow(this)">Edit</button>
        <button onclick="saveRow(this, ${item.id}, ${item.model.id}, 'prices')" style="display:none">Save</button>
        <button onclick="deleteRow(${item.id}, 'prices')">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// ===================== DELETE =====================
async function deleteRow(id, entity) {
  if (!confirm("Delete this item from "+ entity + " with id: "+id+" ?")) return;
  
  if (entity === "manufacturers") {
    const response = await fetch(`${API_BASE_URL}/manufacturers/delete/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      showResult('Deleted id '+id);
    } else {
      throw new Error(`HTTP ${response.status}`);
    }

    loadManufacturers();
  } else if (entity === "models") {
    const response = await fetch(`${API_BASE_URL}/models/delete/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      showResult('Deleted id '+id);
    } else {
      throw new Error(`HTTP ${response.status}`);
    }

    loadModels();

  } else if (entity === "prices") {
    const response = await fetch(`${API_BASE_URL}/prices/delete/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      showResult('Deleted id '+id);
    } else {
      throw new Error(`HTTP ${response.status}`);
    }

    loadPrices();
  }

}

// ===================== EDIT MODE =====================
function editRow(btn) {
  const row = btn.closest("tr");

  row.querySelectorAll(".text").forEach(el => el.style.display = "none");
  row.querySelectorAll(".edit").forEach(el => el.style.display = "inline");

  btn.style.display = "none";
  row.querySelector("button:nth-child(2)").style.display = "inline";
}

// ===================== SAVE =====================
async function saveRow(btn, id, idfk, entity) {
  const row = btn.closest("tr");

  if (entity === "manufacturers"){
    const inputs = row.querySelectorAll(".edit");
    const updatedData = {
      manufacturerName: inputs[0].value,
      advancePaymentPercentage: inputs[1].value,
      pctOfInstallment: inputs[2].value,
      numberOfInstallments: inputs[3].value
    };
    const response = await fetch(`${API_BASE_URL}/manufacturers/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        manufacturerName: updatedData.manufacturerName,
        advancePaymentPercentage: updatedData.advancePaymentPercentage,
        pctOfInstallment: updatedData.pctOfInstallment,
        numberOfInstallments: updatedData.numberOfInstallments
      })
    });
    if (response.ok) {
      loadManufacturers();
    }else{
      showError(response.status);
      throw new Error(`HTTP ${response.status}`);
    }
  }else if (entity === "models"){
    const inputs = row.querySelectorAll(".edit");
    const updatedData = {
      modelName: inputs[0].value,
      modelURL: inputs[1].value
    };
    const response = await fetch(`${API_BASE_URL}/models/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        modelName: updatedData.modelName,
        modelURL: updatedData.modelURL,
        manufacturer : {id:idfk, manufacturerName: ""}
      })
    });
    if (response.ok) {
      // 3. Update the UI text and swap back to "View" mode
      row.querySelectorAll(".text")[0].innerText = updatedData.modelName;
      row.querySelectorAll(".text")[1].innerText = updatedData.modelURL;
      
       inputs.forEach(el => el.style.display = "none");
       loadModels();
    }else{
      showError(response.status);
      throw new Error(`HTTP ${response.status}`);
    }

  }else if (entity === "prices"){
    const inputs = row.querySelectorAll(".edit");
    const updatedData = {
      id: inputs[0].value,
      price: inputs[1].value,
      activationDate: inputs[2].value,
      deactivationDate: inputs[3].value,
      modelID: inputs[4].value
    };
    const response = await fetch(`${API_BASE_URL}/prices/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        price: updatedData.price,
        activationDate: updatedData.activationDate,
        deactivationDate: updatedData.deactivationDate,
        model : {id:idfk, modelName: "", modelURL: "", manufacturer : {id:0, manufacturerName:""} }
      })
    });
    if (response.ok) {
      // 3. Update the UI text and swap back to "View" mode
      row.querySelectorAll(".text")[0].innerText = updatedData.id;
      row.querySelectorAll(".text")[1].innerText = updatedData.price;
      row.querySelectorAll(".text")[2].innerText = updatedData.activationDate;
      row.querySelectorAll(".text")[3].innerText = updatedData.deactivationDate;
      row.querySelectorAll(".text")[4].innerText = updatedData.modelName;
      
       inputs.forEach(el => el.style.display = "none");
       loadPrices();
    }else{
      showError(response.status);
      throw new Error(`HTTP ${response.status}`);
    }
   
  }
}

// ===================== INIT =====================

async function loadManufacturers() {
  try {
    const response = await fetch(`${API_BASE_URL}/manufacturers/getAll`, {
      method: "GET",
      headers: {
        "Accept": "*/*"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    renderManufacturers(data);
    showResultMan(data);
  } catch (error) {
    showError(error);
  }
}

async function loadModels() {
  try {
    const response = await fetch(`${API_BASE_URL}/models/getAll`, {
      method: "GET",
      headers: {
        "Accept": "*/*"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    renderModels(data);
    showResultMod(data);
    
  } catch (error) {
    showError(error);
  }
}

async function loadPayments() {
  try {
    const response = await fetch(`${API_BASE_URL}/paymentAnalysis/getAllPayments`, {
      method: "GET",
      headers: {
        "Accept": "*/*"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    paymentData = data; // store in global variable for sorting
    renderPayments(data);
    showResultPay(data);
    
  } catch (error) {
    showError(error);
  }
}

async function loadPrices() {
  try {
    const response = await fetch(`${API_BASE_URL}/prices/getAllPrices`, {
      method: "GET",
      headers: {
        "Accept": "*/*"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    renderPrices(data);
    showResultPrc(data);
    
  } catch (error) {
    showError(error);
  }
}


async function createManufacturer(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/manufacturers/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    showResult(data);
    loadManufacturers();
  } catch (error) {
    showError(error);
  }
}

async function createModel(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/models/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    showResult(data);
    loadModels();
  } catch (error) {
    showError(error);
  }
}

async function createPrice(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/prices/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    showResult(data);
    loadPrices();
  } catch (error) {
    showError(error);
  }
}

function showManufacturers(){
  manCard.hidden = false;
  prcCard.hidden = true;
  payCard.hidden = true;
  modCard.hidden = true;
  loadManufacturers();
}

function showModels(){
  modCard.hidden = false;
  manCard.hidden = true;
  prcCard.hidden = true;
  payCard.hidden = true;
  loadModels();
  loadManufacturersDropdown();
}

function showPrices(){
  prcCard.hidden = false;
  manCard.hidden = true;
  modCard.hidden = true;
  payCard.hidden = true;
  loadPrices();
  loadModelsDropdown();
}

function showPayments(){
  payCard.hidden = false;
  manCard.hidden = true;
  modCard.hidden = true;
  prcCard.hidden = true;
  loadPayments();
}

async function loadManufacturersDropdown() {
  try {
    const response = await fetch(`${API_BASE_URL}/manufacturers/getAll`); 

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    const select = document.getElementById("manIDforModel");

    // reset options
    select.innerHTML = `<option value="">-- Select Manufacturer --</option>`;

    data.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id; // IMPORTANT → this is what you send to backend
      option.textContent = item.manufacturerName;

      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error loading manufacturers:", error);
  }
}

async function loadModelsDropdown() {
  try {
    const response = await fetch(`${API_BASE_URL}/models/getAll`); 

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    const select = document.getElementById("modIDforPrice");

    // reset options
    select.innerHTML = `<option value="">-- Select Model --</option>`;

    data.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id; // IMPORTANT → this is what you send to backend
      option.textContent = item.modelName+ " (" + item.manufacturer.manufacturerName + ")";

      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error loading models:", error);
  }
}

manufacturerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    manufacturerName: document.getElementById("manufacturerName").value,
    advancePaymentPercentage: document.getElementById("advancePaymentPercentage").value,
    pctOfInstallment: document.getElementById("pctOfInstallment").value,
    numberOfInstallments: document.getElementById("numberOfInstallments").value
  };

  await createManufacturer(payload);
  manufacturerForm.reset();

});

ModelForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    modelName: document.getElementById("ModelName").value,
    modelURL: document.getElementById("ModelURL").value,
    manufacturer : {id:document.getElementById("manIDforModel").value, manufacturerName:""}
  };

  await createModel(payload);
  ModelForm.reset();

});

PriceForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    price: document.getElementById("price").value,
    activationDate: document.getElementById("activationDate").value,
    deactivationDate: null,
    model : {id:document.getElementById("modIDforPrice").value, modelName: "null", modelURL: null, manufacturer: { id: 0, manufacturerName: null }}
  };
  await createPrice(payload);
  PriceForm.reset();
});

showManufacturers();
