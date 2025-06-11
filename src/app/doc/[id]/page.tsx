'use client';
import Document from "@/components/ui/document";
function DocumentPage({params: {id}}:{
    params: { id: string };
}) {
    return (
        <div className="flex flxe-col flex-1 min-h-screen">
            <Document id={id} />
        </div>
      )
    ;
}

export default DocumentPage;