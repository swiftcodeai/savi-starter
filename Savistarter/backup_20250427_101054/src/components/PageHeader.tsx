
import React from "react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageHeader = ({ title, subtitle, className }: PageHeaderProps) => (
  <div className={cn("w-full flex flex-col items-center mb-3", className)}>
    <Logo size="small" />
    <h1 className="text-3xl md:text-4xl font-bold mt-2 text-gray-800">{title}</h1>
    {subtitle && <div className="mt-1 text-lg text-gray-500">{subtitle}</div>}
  </div>
);

export default PageHeader;
