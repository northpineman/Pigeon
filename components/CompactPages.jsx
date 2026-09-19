"use client";
import { Children, useState } from "react";

export function PageTabs({ items, active, onChange, label = "Page sections" }) {
  return <nav className="compact-page-tabs" aria-label={label}>{items.map(([key,title])=><button type="button" key={key} aria-pressed={active===key} className={active===key?"active":""} onClick={()=>onChange(key)}>{title}</button>)}</nav>;
}

export function PagedGrid({ children, className = "", pageSize = 4, label = "Collection" }) {
  const rows=Children.toArray(children).filter(Boolean);
  const [page,setPage]=useState(0);
  const total=Math.max(1,Math.ceil(rows.length/pageSize));
  const safe=Math.min(page,total-1);
  return <div className="compact-paged-block"><div className={className} data-paged="true">{rows.slice(safe*pageSize,(safe+1)*pageSize)}</div>{total>1&&<nav className="compact-pager" aria-label={`${label} pages`}><button type="button" className="btn btn-ghost" disabled={safe===0} onClick={()=>setPage(safe-1)}>← Previous</button><span>{label} · {safe+1} / {total}</span><button type="button" className="btn btn-ghost" disabled={safe===total-1} onClick={()=>setPage(safe+1)}>Next →</button></nav>}</div>;
}
