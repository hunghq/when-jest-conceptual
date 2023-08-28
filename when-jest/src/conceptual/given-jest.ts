import { Section } from "./given";
import { within as withinReact } from "@testing-library/react";
export class ScopedSection extends Section {
  within() {
    return withinReact(this.retrieve(this.name!));
  }
}
