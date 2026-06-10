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
  doc,
  query,
  where
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const myOrdersContainer =
document.getElementById(
  "myOrdersContainer"
);

async function loadMyOrders() {

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
          "studentId",
          "==",
          user.uid
        )

      );

    const ordersSnapshot =
      await getDocs(
        ordersQuery
      );

    myOrdersContainer.innerHTML =
      "";

    for (

      const orderDoc
      of ordersSnapshot.docs

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

      myOrdersContainer.innerHTML += `

<div class="order-card">

  <h3>
    ${product.name}
  </h3>

  <p>
    Quantity: ${order.quantity}
  </p>

  <p class="order-status ${order.status}">
    ${order.status}
  </p>

</div>

`;

    }

  }

  catch (error) {

    console.error(error);

    alert(error.message);

  }

}

onAuthStateChanged(

  auth,

  (user) => {

    if (user) {

      loadMyOrders();

    }

  }

);