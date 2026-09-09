import { InlayCorners } from "./GoldInlay";
import "./components.css";

/**
 * A dressed stone slab with inlaid corner fittings.
 *
 * @param {boolean} sunken   Recess the slab into the wall instead of
 *                           standing it proud.
 * @param {boolean} corners  Show the gold corner brackets.
 * @param {string}  as       Element to render (section, article, div...).
 */
export default function StonePanel({
  children,
  sunken = false,
  corners = true,
  as: Tag = "div",
  className = "",
  ...rest
}) {
  return (
    <Tag
      className={`panel slab ${sunken ? "slab--sunken" : ""} ${className}`}
      {...rest}
    >
      {corners && <InlayCorners className="panel__corners" />}
      {children}
    </Tag>
  );
}
