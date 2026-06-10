import { auth, db }
from "./firebase.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import {
collection,
getDocs,
getDoc,
query,
where,
doc,
updateDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const vendorOrdersContainer =
document.getElementById(
"vendorOrdersContainer"
);

async function loadVendorOrders() {

try {

const user =
  auth.currentUser;

if (!user) return;

const ordersQuery =
  query(

    collection(
      db,
      "Orders"
    ),

    where(
      "vendorId",
      "==",
      user.uid

    )

  );

const snapshot =
  await getDocs(
    ordersQuery
  );

vendorOrdersContainer.innerHTML =
  "";

for (

  const orderDoc
  of snapshot.docs

) {

  const order =
    orderDoc.data();

  const productDoc =
    await getDoc(

      doc(
        db,
        "Products",
        order.productId
      )

    );

  if (!productDoc.exists())
    continue;

  const product =
    productDoc.data();

  vendorOrdersContainer.innerHTML += `

    <div class="order-card">
<img
  src="${product.imageUrl}"
  class="order-product-image"
  loading="lazy"
>
      <h3>
  ${product.name}
</h3>

<p>
  Quantity:
  ${order.quantity}
</p>

<p>
  Phone:
  ${order.phoneNumber}
</p>

<p>
  Delivery:
  ${order.deliveryLocation}
</p>

<p>
  Payment:
  ${order.paymentMethod}
</p>

<p>
  Status:
  ${order.status}
</p>

      ${
        order.status === "pending"
        ? `

          <button
            class="acceptBtn"
            data-id="${orderDoc.id}"
          >
            Accept
          </button>

          <button
            class="rejectBtn"
            data-id="${orderDoc.id}"
          >
            Reject
          </button>

        `
        : ""
      }

      ${
        order.status === "accepted"
        ? `

          <button
            class="deliverBtn"
            data-id="${orderDoc.id}"
          >
            Mark Delivered
          </button>

        `
        : ""
      }

    </div>

  `;

}

document
  .querySelectorAll(".acceptBtn")
  .forEach((button) => {

    button.addEventListener(

      "click",

      async () => {

        await updateDoc(

          doc(
            db,
            "Orders",
            button.dataset.id
          ),

          {

            status:
              "accepted",

            acceptedAt:
  serverTimestamp()

          }

        );

        loadVendorOrders();

      }

    );

  });

document
  .querySelectorAll(".rejectBtn")
  .forEach((button) => {

    button.addEventListener(

      "click",

      async () => {

        await updateDoc(

          doc(
            db,
            "Orders",
            button.dataset.id
          ),

          {

            status:
              "rejected",

            rejectedAt:
  serverTimestamp()

          }

        );

        loadVendorOrders();

      }

    );

  });
  document
  .querySelectorAll(".deliverBtn")
  .forEach((button) => {

    button.addEventListener(

      "click",

      async () => {

        await updateDoc(

          doc(
            db,
            "Orders",
            button.dataset.id
          ),

          {

            status:
              "delivered",

            deliveredAt:
  serverTimestamp()

          }

        );

        loadVendorOrders();

      }

    );

  });

}

catch (error) {

console.error(error);

alert(error.message);

}

}

onAuthStateChanged(

  auth,

  async (user) => {

    if (user) {

      loadVendorOrders();

    }

  }

);
const dashboardBtn =
document.getElementById(
  "dashboardBtn"
);

const productsBtn =
document.getElementById(
  "productsBtn"
);

const vendorOrdersBtn =
document.getElementById(
  "vendorOrdersBtn"
);

const dashboardSection =
document.getElementById(
  "dashboardSection"
);

const productsSection =
document.getElementById(
  "productsSection"
);

const ordersSection =
document.getElementById(
  "ordersSection"
);

const addProductSection =
document.getElementById(
  "addProductSection"
);


// Dashboard

dashboardBtn.addEventListener(
  "click",
  () => {

    dashboardSection.style.display =
      "block";

    addProductSection.style.display =
      "none";

    productsSection.style.display =
      "none";

    ordersSection.style.display =
      "none";

  }
);


// Products

productsBtn.addEventListener(
  "click",
  () => {

    dashboardSection.style.display =
      "none";

    addProductSection.style.display =
      "block";

    productsSection.style.display =
      "block";

    ordersSection.style.display =
      "none";

  }
);


// Orders

vendorOrdersBtn.addEventListener(
  "click",
  () => {

    dashboardSection.style.display =
      "none";

    addProductSection.style.display =
      "none";

    productsSection.style.display =
      "none";

    ordersSection.style.display =
      "block";

  }
);