/* 'use server'

import { auth } from "@clerk/nextjs/server"
import { adminDb } from "../../src/firebase-admin";

export async function createNewDocument() {
    auth.protect();
    const {sessionClaims} = await auth();
    const docCollectionRef = adminDb.collection('documents');
    const docRef = await docCollectionRef.add(
        {
            title: "New Doc",

        }
    )
    await adminDb.collection('users').doc(sessionClaims?.email!)
        .collection('documents')
        .doc(docRef.id)
        .set({
            title: "New Doc",
            docId: docRef.id,
            createdAt: adminDb.FieldValue.serverTimestamp(),
        });
    return docRef.id;
}
 */