import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Validate admin credentials
export async function validateAdmin(email, password) {
  const q = query(
    collection(db, "admin"),
    where("email", "==", email),
    where("password", "==", password)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const adminData = snapshot.docs[0].data();
  return { id: snapshot.docs[0].id, ...adminData };
}
