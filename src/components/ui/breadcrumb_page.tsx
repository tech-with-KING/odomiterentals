'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { usePathname } from "next/navigation";
import { Fragment } from "react";

function BreadCrumbs() {
    const pathname = usePathname();
    const segments = pathname.split('/')
    return (  
    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
    
            {
                segments.map((breadcrumb, index) => {
                    if (!breadcrumb) return null;
                    const href = `/${segments.slice(0, index + 1).join('/')}`;
                    const isLast = index === segments.length - 1
                    return (
                        <Fragment key={href}>
                            <BreadcrumbSeparator></BreadcrumbSeparator>
                            <BreadcrumbItem >
                            {
                                isLast ? (
                                    <BreadcrumbPage >{segments}</BreadcrumbPage>
                                ) :(
                                    <BreadcrumbLink href={href}></BreadcrumbLink>
                                )
                            }
                            <BreadcrumbSeparator />
                            <BreadcrumbLink href={href}>{breadcrumb}</BreadcrumbLink>
                        </BreadcrumbItem>
                        </Fragment>
                    );
                })
            }
        </BreadcrumbList>
    </Breadcrumb>
    );
}

export default BreadCrumbs;