import { auth, db }
from "./firebase.js";

import {
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const ordersContainer =
document.getElementById(
  "ordersContainer"
);
const deliverySection =
document.getElementById(
  "deliverySection"
);
const phoneNumber =
document.getElementById(
  "phoneNumber"
);

const deliveryLocation =
document.getElementById(
  "deliveryLocation"
);

const paymentMethod =
document.getElementById(
  "paymentMethod"
);

const submitDeliveryBtn =
document.getElementById(
  "submitDeliveryBtn"
);

async function loadOrders() {

  try {

    const user =
      auth.currentUser;

    if (!user) return;

    const cartQuery =
  query(

    collection(
      db,
      "Cart"
    ),

    where(
      "studentId",
      "==",
      user.uid
    )

  );

const cartSnapshot =
  await getDocs(
    cartQuery
  );

ordersContainer.innerHTML =
  "";

let total = 0;

let receiptHTML = "";

for (const cartDoc of cartSnapshot.docs) {

  const cartItem =
    cartDoc.data();

  const productDoc =
    await getDoc(

      doc(
        db,
        "Products",
        cartItem.productId
      )

    );

  if (!productDoc.exists())
    continue;

  const product =
    productDoc.data();

  total +=
    product.price *
    cartItem.quantity;
    const subtotal =
  product.price *
  cartItem.quantity;

receiptHTML += `

  <div>

    <h3>
      ${product.name}
    </h3>

    <p>
      Price:
      UGX ${product.price}
    </p>

    <p>
      Quantity:
      ${cartItem.quantity}
    </p>

    <p>
      Subtotal:
      UGX ${subtotal}
    </p>

    <hr>

  </div>

`;

}
ordersContainer.innerHTML =
`
  <div class="receipt-card">

    <h2>
      Master Receipt
    </h2>

    ${receiptHTML}

  </div>

  <div class="receipt-summary">

    <h3 class="receipt-total">
      UGX ${total}
    </h3>

  </div>

  <button
    id="backToCartBtn"
    class="back-btn"
  >
    Back To Cart
  </button>

  <button
    id="confirmOrderBtn"
    class="confirm-btn"
  >
    Confirm Order
  </button>
`;
  document
  .getElementById(
    "backToCartBtn"
  )
  .addEventListener(

    "click",

    () => {

      window.location.href =
        "cart.html";

    }

  );
  
document
  .getElementById(
    "confirmOrderBtn"
  )
  .addEventListener(

    "click",

    () => {

      ordersContainer.style.display =
        "none";

      deliverySection.style.display =
        "block";

    }

  );
  }

  catch (error) {

    console.error(error);

    alert(error.message);

  }

}

async function validateDeliveryDetails() {

  const phone =
    phoneNumber.value.trim();

  const location =
    deliveryLocation.value.trim();

  const payment =
    paymentMethod.value;

  if (

    !phone ||
    !location ||
    !payment

  ) {

    alert(
      "Please complete all delivery details"
    );

    return;

  }

  await createOrders(
  phone,
  location,
  payment
);

}
async function createOrders(

  phone,
  location,
  payment

) {

  const user =
    auth.currentUser;

  if (!user) return;

  const cartQuery =
    query(

      collection(
        db,
        "Cart"
      ),

      where(
        "studentId",
        "==",
        user.uid
      )

    );

  const cartSnapshot =
    await getDocs(
      cartQuery
    );

  for (const cartDoc of cartSnapshot.docs) {

  const cartItem =
    cartDoc.data();

  const productDoc =
    await getDoc(

      doc(
        db,
        "Products",
        cartItem.productId
      )

    );

  if (!productDoc.exists()) {

    continue;

  }

  const product =
    productDoc.data();

  await addDoc(

    collection(
      db,
      "Orders"
    ),

    {

      studentId:
        user.uid,

      vendorId:
        product.vendorId,

      productId:
        cartItem.productId,

      quantity:
        cartItem.quantity,

      phoneNumber:
        phone,

      deliveryLocation:
        location,

      paymentMethod:
        payment,

      status:
        "pending",

      createdAt:
  serverTimestamp()

    }

  );

}
for (

  const cartDoc
  of cartSnapshot.docs

) {

  await deleteDoc(

    doc(
      db,
      "Cart",
      cartDoc.id
    )

  );

}
alert(
  "Order document created"
);
window.location.href =
  "myorders.html";

}

if (ordersContainer) {

  onAuthStateChanged(

    auth,

    (user) => {

      if (user) {

        loadOrders();

      }

    }

  );

}
if (submitDeliveryBtn) {

  submitDeliveryBtn.addEventListener(

    "click",

    async () => {

      await validateDeliveryDetails();

    }

  );

}