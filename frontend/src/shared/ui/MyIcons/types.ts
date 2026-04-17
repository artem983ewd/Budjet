// shared/types/icon.ts
import { SVGProps, CSSProperties } from "react";

export interface MyIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  style?: CSSProperties;
}
