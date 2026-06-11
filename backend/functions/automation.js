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

checkPendingOrders();
