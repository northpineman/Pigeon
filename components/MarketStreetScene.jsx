"use client";
import { LAUNCH_ART } from "@/lib/launchArt";
const SHOPS = [
  {key:"shop",name:"Meadow Goods",keeper:"Rowan",note:"Supplies, decorations & training",art:LAUNCH_ART.market},
  {key:"wardrobe",name:"Velvet Ribbon",keeper:"Velvet",note:"Outfits & appearance studio",art:LAUNCH_ART.wardrobe},
  {key:"toys",name:"Pippin’s Toys",keeper:"Pippin",note:"Playthings & favorite memories",art:LAUNCH_ART.market},
];
export default function MarketStreetScene({active="shop",onChoose}) {
  return <section className="meadow-painted-shops" aria-label="Market Lane destinations">{SHOPS.map(shop=><button key={shop.key} type="button" aria-pressed={active===shop.key} className={`meadow-painted-shop${active===shop.key?" active":""}`} onClick={()=>onChoose?.(shop.key)}><img src={shop.art} alt="" loading="lazy" decoding="async"/><span className="meadow-shop-plaque"><small>{shop.keeper}’s little shop</small><strong>{shop.name}</strong><span>{shop.note}</span><em>{active===shop.key?"You are here":"Step inside →"}</em></span></button>)}</section>;
}
