import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home Page", () => {
  it("renders heading", () => {
    render(<Home />);
    const heading = screen.getByText("DSHIT");
    expect(heading).toBeInTheDocument();
  });
});
