'use client';
import { useTransition, useState, FormEvent, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";
import {doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase"
import { useDocumentData } from "react-firebase-hooks/firestore";
function Documument({id}:{id: string}) {
    const [data, loading, error] = useDocumentData(doc(db, 'documents', id));

    useEffect(() => {
        if (data) {
            console.log("Document data:", data);
            setInput(data.title);
        }
    }, [data]);

    const [input, setInput] = useState("");
    const [isUpdating, startTransition] = useTransition();
    const updateTitle = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            startTransition(async() => {
                await updateDoc(doc(db, 'documents', id), {
                    title: input,
        })
     });
    } };
    return (
        <div>
        <div className="flex max-w-6xl mx-auto pb-5">
            <form onSubmit={updateTitle} className="flex flex-1 space-x-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} className="w-full" />
                <Button disabled={isUpdating} type="submit">
                {isUpdating ? "Updating..." : "Update Title"}
                </Button>
            </form>
        </div>
            <div>
                {/* ManageUsers */}
                {/* Avatar */}
            </div>

        </div>
      );
}

export default Documument;