const { db } = require("../firebase-admin");

async function checkPendingOrders() {

  console.log("Checking pending orders...");

  const snapshot =
    await db.collection("Orders").get();

  const now = Date.now();

const fourHours = 4 * 60 * 60 * 1000;

  for (const orderDoc of snapshot.docs) {

    const order =
      orderDoc.data();

    if (
      order.status === "pending" &&
      order.createdAt
    ) {

      const createdTime =
        order.createdAt.toDate().getTime();

      if (
        now - createdTime >
        fourHours
      ) {

        await orderDoc.ref.update({

          status: "expired",

          expiredAt:
            new Date()

        });

        console.log(
          `Expired order: ${orderDoc.id}`
        );

      }

    }

  }

}

async function checkAcceptedOrders() {

  console.log(
    "Checking accepted orders..."
  );

  const snapshot =
    await db.collection("Orders").get();

  const now = Date.now();

 const sixHours =
  6 * 60 * 60 * 1000;

  for (const orderDoc of snapshot.docs) {

    const order =
      orderDoc.data();

    if (
      order.status === "accepted" &&
      order.acceptedAt
    ) {

      const acceptedTime =
        order.acceptedAt.toDate().getTime();

      if (
        now - acceptedTime >
        sixHours
      ) {

        await orderDoc.ref.update({

          status:
            "vendor_unresponsive",

          vendorUnresponsiveAt:
            new Date()

        });

        console.log(
          `Vendor unresponsive: ${orderDoc.id}`
        );

      }

    }

  }

}

async function checkDeliveredOrders() {

  console.log(
    "Checking delivered orders..."
  );

  const snapshot =
    await db.collection("Orders").get();

  const now = Date.now();

  const twentyFourHours =
    5 * 60 * 1000;

  for (const orderDoc of snapshot.docs) {

    const order =
      orderDoc.data();

    if (
      order.status === "delivered" &&
      order.deliveredAt
    ) {

      const deliveredTime =
        order.deliveredAt.toDate().getTime();

      if (
        now - deliveredTime >
        twentyFourHours
      ) {

        await orderDoc.ref.update({

          status:
            "completed",

          autoCompletedAt:
            new Date()

        });

        console.log(
          `Auto completed: ${orderDoc.id}`
        );

      }

    }

  }

}
async function runAutomation() {

 await checkPendingOrders();

await checkAcceptedOrders();

await checkDeliveredOrders();

}

runAutomation();
