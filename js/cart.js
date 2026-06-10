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
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const cartContainer =
document.getElementById(
  "cartContainer"
);

const cartTotal =
document.getElementById(
  "cartTotal"
);
const checkoutBtn =
document.getElementById(
  "checkoutBtn"
);

async function addToCart(

  productId,
  vendorId,
  productName,
  productPrice

) {

  try {

    const user =
      auth.currentUser;

    if (!user) {

      alert(
        "Please login first"
      );

      return;

    }
    const existingCartQuery =
  query(

    collection(
      db,
      "Cart"
    ),

    where(
      "studentId",
      "==",
      user.uid
    ),

    where(
      "productId",
      "==",
      productId
    )

  );

const existingCartSnapshot =
  await getDocs(
    existingCartQuery
  );

if (
  !existingCartSnapshot.empty
) {

  const existingCartDoc =
    existingCartSnapshot.docs[0];

  const existingData =
    existingCartDoc.data();

  await updateDoc(

    doc(
      db,
      "Cart",
      existingCartDoc.id
    ),

    {
      quantity:
        existingData.quantity + 1
    }

  );

}

else {

  await addDoc(

    collection(
      db,
      "Cart"
    ),

    {
      studentId:
        user.uid,

      productId:
        productId,

      quantity:
        1,

      addedAt:
        new Date()
    }

  );

}

    alert(
      "Added to cart"
    );

  }

  catch (error) {

    console.error(error);

    alert(error.message);

  }

}
async function loadCart() {

  try {

    const user =
      auth.currentUser;

    if (!user) return;

    const q = query(

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

    const snapshot =
      await getDocs(q);

    let total = 0;

    cartContainer.innerHTML =
      "";

for (const cartDoc of snapshot.docs) {

  const item =
    cartDoc.data();

  const productDoc =
    await getDoc(

      doc(
        db,
        "Products",
        item.productId
      )

    );

  if (!productDoc.exists())
    continue;

  const product =
    productDoc.data();

  total +=
    product.price *
    item.quantity;

  cartContainer.innerHTML += `

<div class="cart-item">

  <h3>
    ${product.name}
  </h3>

  <p class="cart-price">
    UGX ${product.price}
  </p>

  <div class="quantity-controls">

    <button
      class="decreaseBtn"
      data-cart-id="${cartDoc.id}"
    >
      −
    </button>

    <span>
      ${item.quantity}
    </span>

    <button
      class="increaseBtn"
      data-cart-id="${cartDoc.id}"
    >
      +
    </button>

  </div>

  <button
    class="removeBtn"
    data-cart-id="${cartDoc.id}"
  >
    🗑 Remove
  </button>

</div>

`;

}

    cartTotal.textContent =

      `Total: UGX ${total}`;

  }

  catch (error) {

    console.error(error);

    alert(error.message);

  }

}

async function increaseQuantity(
  cartId
) {

  try {

    const cartRef =
      doc(
        db,
        "Cart",
        cartId
      );

    const cartDoc =
      await getDoc(
        cartRef
      );

    if (!cartDoc.exists())
      return;

    const data =
      cartDoc.data();

    await updateDoc(

      cartRef,

      {
        quantity:
          data.quantity + 1
      }

    );

    loadCart();

  }

  catch (error) {

    console.error(error);

    alert(error.message);

  }

}

async function decreaseQuantity(
  cartId
) {

  try {

    const cartRef =
      doc(
        db,
        "Cart",
        cartId
      );

    const cartDoc =
      await getDoc(
        cartRef
      );

    if (!cartDoc.exists())
      return;

    const data =
      cartDoc.data();

    if (
      data.quantity > 1
    ) {

      await updateDoc(

        cartRef,

        {
          quantity:
            data.quantity - 1
        }

      );

    }

    else {

      await deleteDoc(
        cartRef
      );

    }

    loadCart();

  }

  catch (error) {

    console.error(error);

    alert(error.message);

  }

}
async function removeFromCart(
  cartId
) {

  try {

    await deleteDoc(

      doc(
        db,
        "Cart",
        cartId
      )

    );

    loadCart();

  }

  catch (error) {

    console.error(error);

    alert(error.message);

  }

}

document.addEventListener(

  "click",

  async (event) => {

    if (

      event.target.classList.contains(
        "increaseBtn"
      )

    ) {

      const cartId =
        event.target.dataset.cartId;

      await increaseQuantity(
        cartId
      );

      return;

    }
    if (

  event.target.classList.contains(
    "decreaseBtn"
  )

) {

  const cartId =
    event.target.dataset.cartId;

  await decreaseQuantity(
    cartId
  );

  return;

}

if (

  event.target.classList.contains(
    "removeBtn"
  )

) {

  const cartId =
    event.target.dataset.cartId;

  await removeFromCart(
    cartId
  );

  return;

}

if (

  !event.target.classList.contains(
    "addToCartBtn"
  )

) return;

    const productId =
      event.target.dataset.productId;

    const vendorId =
      event.target.dataset.vendorId;

    const productName =
      event.target.dataset.productName;

    const productPrice =
      Number(
        event.target.dataset.productPrice
      );

    await addToCart(

      productId,
      vendorId,
      productName,
      productPrice

    );

  }

);
if (cartContainer) {

  onAuthStateChanged(

    auth,

    (user) => {

      if (user) {

        loadCart();

      }

    }

  );

}
if (checkoutBtn) {

  checkoutBtn.addEventListener(

    "click",

    () => {

      window.location.href =
        "orders.html";

    }

  );

}
