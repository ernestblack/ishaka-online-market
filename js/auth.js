import { auth, db }
from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where
}
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// ======================================
// REGISTER ELEMENTS
// ======================================

const fullName =
document.getElementById("fullName");

const email =
document.getElementById("email");

const password =
document.getElementById("password");

const role =
document.getElementById("role");

const registerBtn =
document.getElementById("registerBtn");

// ======================================
// REGISTER USER
// ======================================

if (registerBtn) {

registerBtn.addEventListener(

"click",

async () => {

  try {

    const fullNameValue =
      fullName.value.trim();

    const emailValue =
      email.value.trim();

    const passwordValue =
      password.value;

    const roleValue =
      role.value;


    if (
      !fullNameValue ||
      !emailValue ||
      !passwordValue ||
      !roleValue
    ) {

      alert(
        "Please fill in all fields"
      );

      return;
    }


    const userCredential =

      await createUserWithEmailAndPassword(

        auth,
        emailValue,
        passwordValue

      );


    const user =
      userCredential.user;
      await sendEmailVerification(user);


    await setDoc(

      doc(
        db,
        "Users",
        user.uid
      ),

      {

        fullName:
          fullNameValue,

        email:
          emailValue,

        role:
          roleValue,

        createdAt:
          new Date()

      }

    );


alert(
  "Registration successful. Check your email and verify your account before logging in."
);

    console.log(
      "User saved:",
      user.uid
    );

  }

  catch (error) {

    console.error(error);

    alert(error.message);

  }

}

);

}


// ======================================
// LOGIN ELEMENTS
// ======================================

const loginEmail =
document.getElementById("loginEmail");

const loginPassword =
document.getElementById("loginPassword");

const loginBtn =
document.getElementById("loginBtn");
// ======================================
// LOGOUT ELEMENT
// ======================================

const logoutBtn =
document.getElementById("logoutBtn");

const cartBtn =
document.getElementById("cartBtn");
// ======================================
// PRODUCT ELEMENTS
// ======================================

const productName =
document.getElementById("productName");

const productDescription =
document.getElementById("productDescription");

const productPrice =
document.getElementById("productPrice");
const productImage =
document.getElementById(
  "productImage"
);

const addProductBtn =
document.getElementById("addProductBtn");


const productsContainer =
document.getElementById("productsContainer");
function showSkeletons() {

  productsContainer.innerHTML = "";

  for (let i = 0; i < 6; i++) {

    productsContainer.innerHTML += `

      <div class="skeleton-card">

        <div class="skeleton-image">

          <img
            src="skeleton.png"
            alt="Loading"
          >

        </div>

        <div class="skeleton-line"></div>

        <div class="skeleton-line short"></div>

        <div class="skeleton-line price"></div>

        <div class="skeleton-btn"></div>

      </div>

    `;

  }

}

const searchInput =
document.getElementById("searchInput");
let allProducts = [];

// ======================================
// LOGIN USER
// ======================================

if (loginBtn) {

loginBtn.addEventListener(

"click",

async () => {

  try {

    const emailValue =
      loginEmail.value.trim();

    const passwordValue =
      loginPassword.value;

    if (
      !emailValue ||
      !passwordValue
    ) {

      alert(
        "Please fill in all fields"
      );

      return;

    }

    const userCredential =

      await signInWithEmailAndPassword(

        auth,
        emailValue,
        passwordValue

      );

    const user =
      userCredential.user;
      if (!user.emailVerified) {

  await signOut(auth);

  alert(
    "Please verify your email before logging in."
  );

  return;

}


    const userDoc =

      await getDoc(

        doc(
          db,
          "Users",
          user.uid
        )

      );


    if (!userDoc.exists()) {

      alert(
        "User profile not found"
      );

      return;

    }


    const userData =
      userDoc.data();


    if (
      userData.role ===
      "student"
    ) {

      window.location.href =
        "student.html";

    }

    else if (
      userData.role ===
      "vendor"
    ) {

      window.location.href =
        "vendor.html";

    }

    else {

      alert(
        "Invalid role"
      );

    }

  }

  catch (error) {

    console.error(error);

    alert(error.message);

  }

}

);

}
// ======================================
// LOGOUT USER
// ======================================

if (logoutBtn) {

  logoutBtn.addEventListener(

    "click",

    async () => {

      try {

        await signOut(auth);

        window.location.href =
          "login.html";

      }

      catch (error) {

        console.error(error);

        alert(error.message);

      }

    }

  );

}

if (cartBtn) {

  cartBtn.addEventListener(

    "click",

    () => {

      window.location.href =
        "cart.html";

    }

  );

}
const ordersBtn =
document.getElementById(
  "ordersBtn"
);

if (ordersBtn) {

  ordersBtn.addEventListener(

    "click",

    () => {

      window.location.href =
        "myorders.html";

    }

  );

}
// ======================================
// ADD PRODUCT
// ======================================

if (addProductBtn) {

  addProductBtn.addEventListener(

    "click",

    async () => {

      try {

        const user =
          auth.currentUser;

        if (!user) {

          alert(
            "Please login first"
          );

          return;

        }

        const name =
          productName.value.trim();

        const description =
          productDescription.value.trim();

        const price =
          productPrice.value;
const imageFile =
  productImage.files[0];
    if (
  !name ||
  !description ||
  !price ||
  !imageFile
) {

          alert(
            "Please fill in all fields"
          );

          return;

        }
const formData = new FormData();

formData.append(
  "file",
  imageFile
);

formData.append(
  "upload_preset",
  "ishaka_unsigned"
);

const response = await fetch(
  "https://api.cloudinary.com/v1_1/dhswud6g4/image/upload",
  {
    method: "POST",
    body: formData
  }
);

const cloudinaryData =
  await response.json();

const imageUrl =
  cloudinaryData.secure_url.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_800/"
  );
        await addDoc(

          collection(
            db,
            "Products"
          ),

          {

            name: name,

            description:
              description,

            price:
              Number(price),
              imageUrl:
  imageUrl,

            vendorId:
              user.uid,

            createdAt:
              new Date(),

            status:
              "active"

          }

        );

        alert(
          "Product added successfully"
        );

      }

      catch (error) {

        console.error(error);

        alert(error.message);

      }

    }

  );

}
// ======================================
// LOAD MY PRODUCTS
// ======================================

async function loadMyProducts() {

  try {

    const user = auth.currentUser;

    if (!user) {

      console.log("No user logged in");

      return;

    }

    const q = query(

      collection(db, "Products"),

      where(
        "vendorId",
        "==",
        user.uid
      )

    );

    const snapshot =
      await getDocs(q);
      console.log(
  "PRODUCT COUNT:",
  snapshot.size
);

    productsContainer.innerHTML = "";

    snapshot.forEach((productDoc) => {

      const product =
        productDoc.data();

      productsContainer.innerHTML += `

<div class="product-card">

  <img
  src="${product.imageUrl}"
  class="product-image"
  loading="lazy"
>

  <h3>${product.name}</h3>

  <p>${product.description}</p>

  <p>UGX ${product.price}</p>

  <hr>

</div>

`;

    });

  }

  catch (error) {

    console.error(error);

    alert(error.message);

  }

}

// ======================================
// LOAD MARKETPLACE PRODUCTS
// ======================================

async function loadMarketplaceProducts() {

  try {

    showSkeletons();

    const q = query(

      collection(db, "Products"),

      where(
        "status",
        "==",
        "active"
      )

    );

    const snapshot =
      await getDocs(q);
      allProducts = [];

    productsContainer.innerHTML = "";

    snapshot.forEach((productDoc) => {

      const product =
        productDoc.data();
        allProducts.push({
  id: productDoc.id,
  ...product
});

productsContainer.innerHTML += `

  <div class="product-card">

  <div class="image-wrapper">

    <img
      src="skeleton.png"
      class="image-placeholder"
    >

    <img
      src="${product.imageUrl}"
      class="product-image lazy-image"
      loading="lazy"
      onload="
        this.previousElementSibling.style.display='none';
      "
    >

  </div>

  <h3>${product.name}</h3>

    <p>${product.description}</p>

    <p class="product-price">
      UGX ${product.price}
    </p>

<button
  class="addToCartBtn"
  data-product-id="${productDoc.id}"
  data-vendor-id="${product.vendorId}"
  data-product-name="${product.name}"
  data-product-price="${product.price}"
>

  Add To Cart

</button>

    <hr>

  </div>
`;

    });

  }

  catch (error) {

    console.error(error);

    alert(error.message);

  }

}
// ======================================
// RUN ON PAGE LOAD
// ======================================

if (productsContainer) {

  onAuthStateChanged(

    auth,

    async (user) => {

      if (!user) return;

      const userDoc =
        await getDoc(
          doc(
            db,
            "Users",
            user.uid
          )
        );

      if (!userDoc.exists())
        return;

      const userData =
        userDoc.data();

      if (
        userData.role ===
        "vendor"
      ) {

        loadMyProducts();

      }

      else if (
        userData.role ===
        "student"
      ) {

        loadMarketplaceProducts();

      }

    }

  );

}
// ======================================
// SIDEBAR MENU
// ======================================

const menuBtn =
document.getElementById(
  "menuBtn"
);

const sidebar =
document.getElementById(
  "sidebar"
);

if (
  menuBtn &&
  sidebar
) {

menuBtn.addEventListener(

  "click",

  () => {

    sidebar.classList.add(
      "active"
    );

    menuBtn.style.display =
      "none";

  }

);
document.addEventListener(

  "click",

  (e) => {

    if (

      !sidebar.contains(e.target) &&
      e.target !== menuBtn

    ) {

      sidebar.classList.remove(
        "active"
      );

      menuBtn.style.display =
        "block";

    }

  }

);
}
if (searchInput) {

  searchInput.addEventListener(
    "input",
    () => {

      const searchTerm =
        searchInput.value
          .toLowerCase()
          .trim();

      const filteredProducts =
        allProducts.filter(
          (product) =>
            product.name
              .toLowerCase()
              .includes(searchTerm)
        );

      productsContainer.innerHTML = "";

      filteredProducts.forEach(
        (product) => {

          productsContainer.innerHTML += `

<div class="product-card">

  <img
  src="${product.imageUrl}"
  class="product-image"
  loading="lazy"
>

  <h3>${product.name}</h3>

  <p>${product.description}</p>

  <p class="product-price">
    UGX ${product.price}
  </p>

<button
  class="addToCartBtn"
  data-product-id="${product.id}"
  data-vendor-id="${product.vendorId}"
  data-product-name="${product.name}"
  data-product-price="${product.price}"
>

  Add To Cart

</button>

</div>

`;

        }
      );

    }
  );

}